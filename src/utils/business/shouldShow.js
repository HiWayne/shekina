/**
 * @description 判断组件是否显示
 * @param {react state} rootState 整个应用的状态
 * @param {array | undefined} statePaths 当前组件依赖的状态在rootState中的路径
 * @param {array | undefined} equality 状态与equality中的某个相等时才会显示
 */
const shouldShow = (rootState, statePaths, equality) => {
  if (statePaths) {
    if (equality !== undefined) {
      let state = rootState.getIn(statePaths);
      if (state && typeof state.toJS === "function") {
        state = state.toJS();
      }
      return equality.some((equal) => state === equal);
    }
  }
  return true;
};

export default shouldShow;
