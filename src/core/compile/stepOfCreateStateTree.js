import { isNil } from "ramda";

/**
 * @description 遍历节点时调用，找到该节点state的整条链路生成path，并在stateTree中填充相应的值
 * @param {*} state 节点的state属性，代表节点状态所依赖的字段
 * @param {*} jsonsInvertedIndexListByEffect 整个节点数组根据effect属性生成的倒排索引
 * @param {*} root 整个stateTree（会被逐渐填充）
 */
const stepOfCreateStateTree = (
  state,
  jsonsInvertedIndexListByEffect,
  root
) => {
  const paths = [state];
  const entity = jsonsInvertedIndexListByEffect.get(state);
  const defaultValue = entity.defaultValue || null;
  let namespaceOfValue = entity.namespaceOfValue;
  while (!isNil(namespaceOfValue)) {
    const entity = jsonsInvertedIndexListByEffect.get(namespaceOfValue);
    paths.unshift(namespaceOfValue);
    namespaceOfValue = entity.namespaceOfValue;
  }
  if (isNil(root)) {
    root = {};
  }
  const pathslength = paths.length;
  paths.reduce((res, path, index) => {
    if (isNil(res[path])) {
      if (pathslength - 1 === index) {
        res[path] = defaultValue;
      } else {
        res[path] = {};
      }
    }
    return res[path];
  }, root);

  return { paths, root };
};

export default stepOfCreateStateTree;
