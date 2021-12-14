import { isNil, clone } from "ramda";
import stepOfCreateValueTree from "./stepOfCreateValueTree";
import stepOfCreateStateTree from "./stepOfCreateStateTree";
import compileVdom from "../../utils/business/compileVdom";
import createInvertedIndexList from "../../utils/createInvertedIndexList";

/**
 * 需要建立vdom树（vdomTree）、表单数据树（valueTree）、视图状态树（stateTree）
 * 三棵树节点并非一一对应的关系，为了能获取数据，vdom节点会保存相关数据在另外两棵树中的路径
 * 最终交给渲染层（render.js）时是以vdom树根节点为入口
 */

/**
 * json是彼此平级的，但它们对应的后端接口数据可能是嵌套的，所以需要有namespaceOfValue字段表示当前字段的上级是哪个字段以此表示value的嵌套关系
 * 最初的总状态数据为空或者空对象，在遍历每个json的时候需要根据它的namespaceOfValue以及namespaceOfValue的namespaceOfValue，逐级往上，直到根，得到完整的对象路径，并在状态数据中创建一系列相应的值
 * 比如有 [{ value: "c", namespaceOfValue: "b", defaultValue: null }, { value: "b", namespaceOfValue: "a" }, { value: "a" }] 这三个json对象
 * 则需要建立 { a: { b: { c: null } } }的关系
 * 可以近似理解为，将链表由数组乱序储存，每个链表节点只保存了父节点的指针，要求复原出正常的链表。
 * 额外的难点在于：
 * 1. 链表节点天然就是一个对象，里面可以存放子节点的引用，而 a.b.c 这种情况，a、b本只是namespaceOfValue字符串，必须使它们有一个对应的对象，同时namespaceOfValue作为父级对象的属性
 * 2. 每遍历一个json对象，就会做一次上述操作，要保证之前建立的 a.b.c 关系不会因为新建对象而被清除
 */

// 生成dom关系
const createVdom = (jsons, root, jsonsInvertedIndexListById) => {
  const result = compileVdom(jsons, root, jsonsInvertedIndexListById);

  return { root: result };
};

const hasPath = (paths) =>
  paths && paths.length >= 1 && !paths.some((path) => path === undefined);

const compile = (jsons) => {
  jsons = clone(jsons);
  const jsonsInvertedIndexListByValue = createInvertedIndexList(jsons, "value");
  const jsonsInvertedIndexListByEffect = createInvertedIndexList(
    jsons,
    "effect"
  );
  const jsonsInvertedIndexListById = createInvertedIndexList(jsons, "id");

  // 根据每个json的信息关系来建立树，它是将来构建的依据
  const createTree = (createNamespacePathStrategy) => (
    jsonsInvertedIndexListByValue
  ) => {
    let root = null;
    return [
      () => root,
      // 遍历jsons时调用，将每个json相应的value关系添加到树上
      (namespaceOfValue, value, defaultValue = null, valueType, isVdom) => {
        if (
          createNamespacePathStrategy === "effect" &&
          isNil(namespaceOfValue)
        ) {
          return;
        }
        if (
          createNamespacePathStrategy !== "effect" &&
          isNil(value) &&
          !isVdom
        ) {
          return;
        }
        const strategy = {
          value: () =>
            stepOfCreateValueTree(
              namespaceOfValue,
              value,
              defaultValue,
              jsonsInvertedIndexListByValue,
              root
            ),
          effect: () =>
            stepOfCreateStateTree(
              namespaceOfValue,
              jsonsInvertedIndexListByValue,
              root
            ),
          vdom: () => createVdom(jsons, root, jsonsInvertedIndexListByValue),
        };
        if (typeof strategy[createNamespacePathStrategy] === "function") {
          const { root: _root, paths } = strategy[
            createNamespacePathStrategy
          ]();
          root = _root;
          return paths;
        } else {
          throw new Error(
            `strategy is illegal: ${createNamespacePathStrategy}`
          );
        }
      },
    ];
  };

  const createValueTree = createTree("value");
  const createStateTree = createTree("effect");
  const createVdomTree = createTree("vdom");

  const valueTreeOperators = createValueTree(jsonsInvertedIndexListByValue);
  const stateTreeOperators = createStateTree(jsonsInvertedIndexListByEffect);
  const vdomTreeOperators = createVdomTree(jsonsInvertedIndexListById);
  const [getValueTree, addValue] = valueTreeOperators;
  const [getStateTree, addState] = stateTreeOperators;
  const [getVdomTree, _createVdom] = vdomTreeOperators;

  jsons.forEach((json) => {
    const { namespaceOfValue, value, defaultValue, state, valueType } = json;
    const valuePaths = addValue(
      namespaceOfValue,
      value,
      defaultValue,
      valueType
    );
    const statePaths = addState(state);
    if (hasPath(valuePaths)) {
      Object.defineProperty(json, "__valuePaths", {
        value: valuePaths,
        writable: true,
      });
    }
    if (hasPath(statePaths)) {
      Object.defineProperty(json, "__statePaths", {
        value: statePaths,
        writable: true,
      });
      const canModifyStateJson = jsonsInvertedIndexListByEffect.get(state);
      if (canModifyStateJson.type !== "table") {
        Object.defineProperty(canModifyStateJson, "__effectPaths", {
          value: statePaths,
          writable: true,
        });
      } else {
        canModifyStateJson.operations.forEach((operation) => {
          if (operation.effect) {
            Object.defineProperty(operation, "__effectPaths", {
              value: statePaths,
              writable: true,
            });
          }
        });
      }
    }
  });
  _createVdom(undefined, undefined, undefined, undefined, true);
  return { getValueTree, getStateTree, getVdomTree };
};

export default compile;
