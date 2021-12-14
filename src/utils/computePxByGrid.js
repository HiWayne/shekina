import { keepDecimals } from "./common";

/**
 * @description 根据antd grid中的span计算px
 */

const computePxByGrid = (span) => {
  span = span || 0;
  const totalCount = 24;
  const width = window.innerWidth;
  return keepDecimals(width * (span / totalCount));
};

export default computePxByGrid;
