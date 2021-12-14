import { isNil } from "ramda";

const compileVdom = (jsons = [], root, jsonsInvertedIndexListById) => {
  jsons.forEach((json) => {
    if (isNil(json.parent)) {
      root = json;
    } else {
      if (typeof json.parent === "number") {
        json.parent = jsonsInvertedIndexListById.get(json.parent);
      }
    }
    if (Array.isArray(json.children)) {
      json.children = json.children.map((id) => {
        if (typeof id === "number") {
          return jsonsInvertedIndexListById.get(id);
        } else {
          const json = id;
          return json;
        }
      });
    }
  });

  return root;
};

export const findRoot = (jsons = []) => {
  let root = null;
  const length = jsons.length;
  for (let i = 0; i < length; i++) {
    const json = jsons[i];
    if (isNil(json.parent)) {
      root = json;
      break;
    }
  }
  return root;
};

export default compileVdom;
