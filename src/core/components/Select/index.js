import { Select } from "antd";
import FormItem from "../FormItem/index";
const { Option } = Select;

const RenderSelect = ({
  json,
  rootValue,
  rootState,
  changeRootValue,
  changeRootState,
  ...props
}) => (
  <FormItem json={json}>
    <Select {...props}>
      {json.options.map((option) => (
        <Option value={option.value} key={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  </FormItem>
);

export default RenderSelect;
