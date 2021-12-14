// 创建倒排索引
const createInvertedIndexList = (list = [], prop) => {
  // todo: value重复时会有问题，后者覆盖前者
  const invertedIndexList = new Map();
  list.forEach((item) => {
    const tableState =
      prop === "effect" &&
      item.type === "table" &&
      Array.isArray(item.operations) &&
      item.operations.filter((operation) => operation.effect);
    if (item[prop] !== undefined && !tableState) {
      invertedIndexList.set(item[prop], item);
    } else if (tableState && tableState.length) {
      tableState.forEach((operation) => {
        if (operation.effect) {
          const stateName = operation.effect;
          invertedIndexList.set(stateName, item);
        }
      });
    }
  });
  return invertedIndexList;
};

export default createInvertedIndexList;
