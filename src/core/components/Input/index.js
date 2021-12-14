import { useMemo } from "react";
import { Input } from "antd";
import FormItem from "../FormItem/index";

const RenderInput = ({
  json,
  rootValue,
  rootState,
  changeRootValue,
  changeRootState,
  ...props
}) => {
  return (
    <FormItem json={json}>
      <Input {...props} />
    </FormItem>
  );
};

export default RenderInput;
