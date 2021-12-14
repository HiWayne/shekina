/**
 *
 * @param {object} json
 * @description 判断是否需要Col组件包裹，当被设置为inline组件时为true
 */
const shouldHasColWrapped = (json) => json.inline;

export default shouldHasColWrapped;
