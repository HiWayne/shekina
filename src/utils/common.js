import { notification } from "antd";

export const keepDecimals = (number, decimal = 2) => {
  const _number = Number(number);
  const _decimal = Number(decimal);
  if (isNaN(_number) || isNaN(_decimal)) {
    console.error(
      `keepDecimals needs a number as first argument, but get "${number}"`
    );
    return number;
  } else {
    const multiple = Math.pow(10, _decimal);
    const result = Math.round(_number * multiple) / multiple;
    if (!isNaN(Number(result))) {
      return result;
    } else {
      console.error(
        `keepDecimals occured a error, related information: { number: ${_number}, decimal: ${_decimal}, multiple: ${multiple}, result: ${result} }`
      );
      return number;
    }
  }
};

export const Types = {
  Object: "object",
  Array: "array",
  String: "string",
  Number: "number",
  Function: "function",
  Undefined: "undefined",
  Null: "null",
  Symbol: "symbol",
  BigInt: "bigInt",
  Map: "map",
  Set: "set",
  ReadableStream: "readableStream",
  FileReader: "fileReader",
  Blob: "blob",
  HTMLDocument: "HTMLDocument",
  Window: "window",
  Request: "request",
  Response: "response",
  Unknown: "unknown",
};

export const getType = (any) => {
  const typeString = Object.prototype.toString.call(any);
  switch (typeString) {
    case "[object Object]":
      return Types.Object;
    case "[object Array]":
      return Types.Array;
    case "[object String]":
      return Types.String;
    case "[object Function]":
      return Types.Function;
    case "[object Number]":
      return Types.Number;
    case "[object Undefined]":
      return Types.Undefined;
    case "[object Null]":
      return Types.Null;
    case "[object Symbol]":
      return Types.Symbol;
    case "[object BigInt]":
      return Types.BigInt;
    case "[object Map]":
      return Types.Map;
    case "[object Set]":
      return Types.Set;
    case "[object ReadableStream]":
      return Types.ReadableStream;
    case "[object FileReader]":
      return Types.FileReader;
    case "[object Blob]":
      return Types.Blob;
    case "[object HTMLDocument]":
      return Types.HTMLDocument;
    case "[object Window]":
      return Types.Window;
    case "[object Request]":
      return Types.Request;
    case "[object Response]":
      return Types.Response;
    default:
      return Types.Unknown;
  }
};

export const NotificationError = (...arg) => notification["error"](...arg);
export const NotificationSuccess = (...arg) => notification["success"](...arg);
