import {
  ContainerConfigure,
  InputConfigure,
  LikeSelectConfigure,
  ButtonConfigure,
  TableConfigure,
  ModalConfigure,
} from "./OptionalConfigureRow";

const OptionalConfigure = ({ type }) => {
  switch (type) {
    case "div":
    case "form":
    case "row":
      return <ContainerConfigure />;
    case "input":
      return <InputConfigure />;
    case "select":
    case "checkbox":
    case "radio":
      return <LikeSelectConfigure />;
    case "button":
      return <ButtonConfigure />;
    case "table":
      return <TableConfigure />;
    case "modal":
      return <ModalConfigure />;
    default:
      return null;
  }
};

export default OptionalConfigure;
