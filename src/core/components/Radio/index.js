import { Radio } from "antd";
import FormItem from "../FormItem/index";

const RenderRadio = ({
  json,
  rootValue,
  rootState,
  changeRootValue,
  changeRootState,
  ...props
}) => (
  <FormItem json={json}>
    <Radio.Group options={json.options} {...props}></Radio.Group>
  </FormItem>
);

export default RenderRadio;
