import { useState } from "react";
import { Modal, Button } from "antd";
import { fetchMap } from "../../../api/request";
import shouldShow from "../../../utils/business/shouldShow";
import { VALUEEXPRESSION } from "../../../utils/business/config";

const RenderModal = ({
  json,
  rootValue,
  rootState,
  children,
  changeRootValue,
  changeRootState,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const { __statePaths, equality, api, method } = json;
  const visible = shouldShow(rootState, __statePaths, equality);
  const close = () => {
    const newRootState = rootState.setIn(__statePaths, false);
    changeRootState(newRootState);
  };
  const handleCancel = () => {
    close();
  };
  const handleOk = async () => {
    let params = rootValue.getIn([VALUEEXPRESSION.EDIT]);
    // 防止获得的是immutable结构
    if (typeof params.toJS === "function") {
      params = params.toJS();
    }
    setLoading(true);
    const data = await fetchMap[method](api)(params).catch(() => {
      setLoading(false);
    });
    setLoading(false);
    if (data) {
      close();
    }
  };
  return (
    <Modal
      visible={visible}
      title="Title"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          Submit
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};

export default RenderModal;
