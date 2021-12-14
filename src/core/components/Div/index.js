import { Row, Col } from "antd";
import computePxByGrid from "../../../utils/computePxByGrid";

const RenderDiv = ({ json, children }) => {
  const { wrapperSpan, wrapperOffset } = json;
  const width = computePxByGrid(wrapperSpan);
  const marginLeft = computePxByGrid(wrapperOffset);
  return (
    <div
      style={{
        width: width ? `${width}px` : "100%",
        marginLeft: `${marginLeft}px`,
      }}
      offset={wrapperOffset}
    >
      {children}
    </div>
  );
  // return (
  //   <Row>
  //     <Col span={wrapperSpan} offset={wrapperOffset}>{children}</Col>
  //   </Row>
  // );
};

export default RenderDiv;
