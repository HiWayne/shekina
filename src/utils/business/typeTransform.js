const transform = (targetType, value) => {
  if (Array.isArray(targetType)) {
    return targetType.reduce((result, type) => {
      if (typeof type === "string") {
        switch (type) {
          case "array":
            result = result.split(/,|，/);
            break;
          case "number":
            result = Number(result);
            break;
          case "boolean":
            result = !!result;
            break;
          case "string":
            if (Array.isArray(result)) {
              result = result.join(",");
            } else if (typeof result === "number") {
              result = result + "";
            }
            break;
          default:
            break;
        }
        return result;
      } else if (type && typeof type === "object") {
        if (Array.isArray(result)) {
          return result.map((key) => type[key]);
        } else {
          return type[result];
        }
      }
    }, value);
  } else {
    return value;
  }
};

/**
 * @description 转变值的类型
 * @param {string[]} targetType 期望类型
 * @param {any} value 原始值
 * @returns {any} 转变后的值
 */
const typeTransform = (targetType, value) => {
  try {
    return transform(targetType, value);
  } catch {
    return value;
  }
};

export default typeTransform;
