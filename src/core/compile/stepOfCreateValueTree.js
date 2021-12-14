import { isNil } from "ramda";

/**
 * @description 遍历节点时调用，找到该节点value的整条链路生成path，并在valueTree中填充相应的值
 * @param {*} namespace 节点的namespaceOfValue属性，代表该节点value字段在tree中的父级属性
 * @param {*} value 节点的value属性
 * @param {*} defaultValue 节点的defaultValue属性
 * @param {*} jsonsInvertedIndexListByValue 整个节点数组根据value属性生成的倒排索引
 * @param {*} root 整个valueTree（会被逐渐填充）
 */
const stepOfCreateValueTree = (
  namespace,
  value,
  defaultValue = null,
  jsonsInvertedIndexListByValue,
  root
) => {
  const paths = namespace ? [namespace, value] : [value];
  let entity =
    jsonsInvertedIndexListByValue.get(namespace) ||
    jsonsInvertedIndexListByValue.get(value);
  let namespaceOfValue = entity.namespaceOfValue;
  while (!isNil(namespaceOfValue)) {
    entity = jsonsInvertedIndexListByValue.get(namespaceOfValue);
    paths.unshift(namespaceOfValue);
    namespaceOfValue = entity.namespaceOfValue;
  }
  paths.unshift(entity.valueType);
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

export default stepOfCreateValueTree;
