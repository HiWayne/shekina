// 有些组件有自己的visible参数，所以不需要外部做shouldShow判断
const hasSlefVisibleProp = (json) => {
  const typeOfHasSlefVisiblePropComponentMap = {
    modal: true,
  };
  return typeOfHasSlefVisiblePropComponentMap[json.type];
};

export default hasSlefVisibleProp;
