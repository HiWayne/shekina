import { Checkbox } from "antd";
import FormItem from "../FormItem/index";

const { Group } = Checkbox;

const RenderCheckbox = ({
  json,
  rootValue,
  rootState,
  changeRootValue,
  changeRootState,
  ...props
}) => {
  return (
    <FormItem json={json}>
      <Group options={json.options} {...props}></Group>
    </FormItem>
  );
};

export default RenderCheckbox;
