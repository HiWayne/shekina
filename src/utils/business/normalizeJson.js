import { Types, getType } from "../common";

const normalizeJson = (json) => {
  const innerProps = {
    __type: true,
  };

  if (getType(json) === Types.Object) {
    Object.entries(json).forEach(([key, value]) => {
      if (innerProps.hasOwnProperty(key)) {
        innerProps[key] = value;
        delete json[key];
      }
    });
    return innerProps;
  } else {
    throw new Error("json should be object, but got:", json);
  }
};

export default normalizeJson;
