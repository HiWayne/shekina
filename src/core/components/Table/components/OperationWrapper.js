const OperationWrapper = ({ children, ...props }) => (
  <a
    style={{
      color: "#1890ff",
      textDecoration: "none",
      backgroundColor: "transparent",
      outline: "none",
      cursor: "pointer",
    }}
    {...props}
  >
    {children}
  </a>
);

export default OperationWrapper;
