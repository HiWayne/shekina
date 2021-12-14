import Div from "./Div/index";
import Row from "./Row/index";
import Form from "./Form/index";
import Input from "./Input/index";
import Radio from "./Radio/index";
import Button from "./Button/index";
import Select from "./Select/index";
import Checkbox from "./Checkbox/index";
import Table from "./Table/index";
import Modal from "./Modal/index";

const formComponents = {
  div: { component: Div, name: "行间容器" },
  row: { component: Row, name: "行内容器" },
  form: { component: Form, name: "表单容器" },
  input: { component: Input, name: "输入框" },
  radio: { component: Radio, name: "单选框" },
  button: { component: Button, name: "按钮" },
  select: { component: Select, name: "下拉框" },
  checkbox: { component: Checkbox, name: "多选框" },
  table: { component: Table, name: "表格" },
  modal: { component: Modal, name: "弹框" },
};

export default formComponents;
