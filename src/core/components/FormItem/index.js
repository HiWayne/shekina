import { Form } from "antd";

const RenderFormItem = ({ json, children }) => {
  const {
    label,
    value,
    required,
    message,
    labelSpan = 3,
    labelOffset = 0,
    wrapperSpan = 5,
    wrapperOffset = 0,
    defaultValue,
  } = json;
  return (
    <Form.Item
      label={label}
      name={value}
      rules={[{ required, message }]}
      labelCol={{
        span: labelSpan,
        offset: labelOffset,
      }}
      wrapperCol={{
        span: wrapperSpan,
        offset: wrapperOffset,
      }}
      initialValue={defaultValue}
    >
      <>{children}</>
    </Form.Item>
  );
};

export default RenderFormItem;
