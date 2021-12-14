const json0 = {
  id: 0,
  type: "div",
  children: [9, 10, 12],
};

const json1 = {
  id: 1,
  type: "div",
  inline: true,
  wrapperOffset: 0,
  wrapperSpan: 8,
  value: "name",
  valueType: "1",
  parent: 11,
  children: [5],
  state: "sex",
  equality: ["male", "all"],
};

const json2 = {
  id: 2,
  type: "select",
  labelSpan: 2,
  labelOffset: 0,
  wrapperSpan: 4,
  wrapperOffset: 0,
  inline: false,
  label: "性别",
  value: "sex",
  defaultValue: "all",
  valueType: "1",
  effect: "sex",
  options: [
    {
      label: "所有",
      value: "all",
    },
    {
      label: "男",
      value: "male",
    },
    {
      label: "女",
      value: "female",
    },
  ],
  required: true,
  message: "性别不能为空",
  parent: 9,
};

const json3 = {
  id: 3,
  type: "button",
  name: "提交",
  action: "pagination",
  method: "post",
  api: "/submit/",
  wrapperOffset: 2,
  effect: "response",
  pageSize: 24,
  parent: 9,
  style: "primary",
  valueType: "1",
};

const json4 = {
  id: 4,
  type: "div",
  wrapperOffset: 0,
  wrapperSpan: 8,
  inline: true,
  value: "xin",
  namespaceOfValue: "name",
  parent: 11,
  children: [6],
  state: "sex",
  equality: ["female", "all"],
};

const json5 = {
  id: 5,
  type: "input",
  labelSpan: 6,
  labelOffset: 0,
  wrapperSpan: 12,
  wrapperOffset: 0,
  inline: false,
  label: "男",
  value: "nan",
  namespaceOfValue: "name",
  parent: 1,
};

const json6 = {
  id: 6,
  type: "input",
  labelSpan: 6,
  labelOffset: 0,
  wrapperSpan: 15,
  wrapperOffset: 0,
  inline: false,
  label: "女",
  value: "nv",
  namespaceOfValue: "xin",
  parent: 4,
};

const json7 = {
  id: 7,
  type: "checkbox",
  labelSpan: 2,
  labelOffset: 0,
  wrapperSpan: 8,
  wrapperOffset: 0,
  inline: false,
  label: "爱好",
  value: "hobity",
  valueType: "1",
  options: [
    {
      label: "钓鱼",
      value: "fish",
    },
    {
      label: "购物",
      value: "shopping",
    },
    {
      label: "电影",
      value: "movie",
    },
  ],
  parent: 9,
};

const json8 = {
  id: 8,
  type: "table",
  operations: [
    { action: undefined, effect: "edit", name: "编辑" },
    {
      action: "fetch",
      api: "/delete/",
      name: "删除",
      method: "delete",
    },
  ],
  columns: [
    {
      title: "性别",
      dataIndex: "sex2",
      key: "sex2",
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "爱好",
      dataIndex: "hobity",
      key: "hobity",
    },
  ],
  transform: [
    [{ male: "男", female: "女" }],
    null,
    [{ fish: "钓鱼", shopping: "购物", movie: "看电影" }, "string"],
  ],
  parent: 10,
  state: "response",
  rowSelection: "checkbox",
  value: "selected",
  valueType: "3",
};

const json9 = {
  id: 9,
  type: "form",
  parent: 0,
  children: [2, 11, 7, 3],
};

const json10 = {
  id: 10,
  type: "div",
  parent: 0,
  children: [8, 17],
};

const json11 = {
  id: 11,
  type: "row",
  parent: 9,
  children: [1, 4]
};

const json12 = {
  id: 12,
  type: "modal",
  parent: 0,
  children: [13, 14, 16],
  state: "edit",
  equality: [true],
  api: "/edit/",
  method: "post",
};

const json13 = {
  id: 13,
  type: "select",
  labelSpan: 2,
  labelOffset: 0,
  wrapperSpan: 4,
  wrapperOffset: 0,
  inline: false,
  label: "性别",
  options: [
    {
      label: "男",
      value: "male",
    },
    {
      label: "女",
      value: "female",
    },
  ],
  required: true,
  message: "性别不能为空",
  parent: 12,
  value: "sex2",
  valueType: "2",
};

const json14 = {
  id: 14,
  type: "row",
  parent: 12,
  children: [15]
};

const json15 = {
  id: 15,
  type: "input",
  labelSpan: 2,
  labelOffset: 0,
  wrapperSpan: 4,
  wrapperOffset: 0,
  inline: true,
  label: "男",
  value: "age",
  valueType: "2",
  parent: 14,
};

const json16 = {
  id: 16,
  type: "input",
  labelSpan: 2,
  labelOffset: 0,
  wrapperSpan: 4,
  wrapperOffset: 0,
  inline: true,
  label: "女",
  value: "age",
  valueType: "2",
  parent: 14,
};

const json17 = {
  id: 17,
  type: "button",
  name: "批量操作",
  action: "fetch",
  method: "post",
  api: "/submit/",
  wrapperOffset: 1,
  style: "primary",
  parent: 10,
  valueType: "3",
};

export const jsons = [
  json0,
  json1,
  json2,
  json9,
  json4,
  json5,
  json6,
  json7,
  json3,
  json10,
  json8,
  json11,
  json12,
  json13,
  json14,
  json15,
  json16,
  json17,
];
