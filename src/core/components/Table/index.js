import { useMemo, useCallback, useState, useRef } from "react";
import { Table, Space } from "antd";
import OperationWrapper from "./components/OperationWrapper";
import { VALUEEXPRESSION } from "../../../utils/business/config";
import typeTransform from "../../../utils/business/typeTransform";
import { fetchMap } from "../../../api/request";

const tableStyle = { margin: "20px 0" };

const RenderTable = ({
  json,
  rootValue,
  rootState,
  changeRootValue,
  changeRootState,
  ...props
}) => {
  const { __statePaths, __valuePaths, columns, transform, rowSelection } = json;
  const {
    list: responseData = [],
    limit = 24,
    api = "",
    params = {},
  } = useMemo(() => rootState.getIn(__statePaths) || {}, [
    rootState,
    __statePaths,
  ]);
  const limitRef = useRef(limit);
  limitRef.current = limit;
  const _columns = columns.slice();
  // 编辑
  const handleIndirectClick = useCallback(
    (data, config) => {
      const { __effectPaths } = config;
      const newRootValue = rootValue.setIn([VALUEEXPRESSION.EDIT], data);
      const newRootState = rootState.setIn(__effectPaths, true);
      changeRootValue(newRootValue);
      changeRootState(newRootState);
    },
    [rootValue, rootState, changeRootValue, changeRootState]
  );
  // 删除
  const handleDirectClick = useCallback(
    async (data, config, index) => {
      const { api, method } = config;
      const _responseData = await fetchMap[method](api)({ id: data.id });
      if (_responseData && method === "delete") {
        const newList = responseData.slice();
        newList.splice(index, 1);
        const newRootState = rootState.setIn(__statePaths, {
          list: newList,
          limit,
        });
        changeRootState(newRootState);
      }
    },
    [rootState, responseData, __statePaths, changeRootState, limit]
  );
  const additionalOperations = useMemo(() => {
    const result = new Map();
    result.set(undefined, ({ data, children, ...props }) => {
      return (
        <OperationWrapper
          onClick={() => handleIndirectClick(data, props.config)}
          {...props}
        >
          {children}
        </OperationWrapper>
      );
    });
    result.set("fetch", ({ data, children, config, index, ...props }) => (
      <OperationWrapper
        onClick={() => handleDirectClick(data, config, index)}
        {...props}
      >
        {children}
      </OperationWrapper>
    ));
    return result;
  }, [handleDirectClick, handleIndirectClick]);
  if (json.operations && json.operations.length > 0) {
    _columns.push({
      title: "操作",
      key: "action",
      render: (text, record, index) => (
        <Space size="middle">
          {json.operations.map((operation) => {
            const { action, name } = operation;
            const Operation = additionalOperations.get(action);
            return (
              <Operation
                key={action}
                config={operation}
                data={responseData[index]}
                index={index}
              >
                {name}
              </Operation>
            );
          })}
        </Space>
      ),
    });
  }
  const rowSelectionActions = {
    onChange: (selectedRowKeys) => {
      // 用选中的值修改rootValue
      const selectedList = selectedRowKeys.map(
        (index) => responseData[index - 1]
      );
      const newRootValue = rootValue.setIn(__valuePaths, selectedList);
      changeRootValue(newRootValue);
    },
  };
  const _rowSelection = rowSelection
    ? { type: rowSelection, ...rowSelectionActions }
    : undefined;
  const [response, setResponse] = useState({});
  const more = response.more;
  let page = response.page || 1;
  // responseData可能会被重置，页数也需要跟着重置
  if (responseData.length < limit + 1) {
    page = 1;
  }
  const total =
    more === 0
      ? limit * page
      : responseData && responseData.length > 0
      ? limit * page + 1
      : 0;
  const dataSource = responseData
    .slice((page - 1) * limit, page * limit)
    .map((data) => {
      if (data.key === undefined) {
        data = { ...data, key: data.id };
      }
      return transform
        ? {
            ...data,
            ...transform.reduce((result, types, index) => {
              if (!types) {
                return result;
              }
              const key = columns[index].dataIndex;
              const value = data[key];
              const targetValue = typeTransform(types, value);
              result[key] = targetValue;
              return result;
            }, {}),
          }
        : data;
    });

  return (
    <Table
      style={tableStyle}
      dataSource={dataSource}
      columns={_columns}
      rowSelection={_rowSelection}
      pagination={{
        current: page,
        pageSize: limit,
        hideOnSinglePage: true,
        onChange: async (page) => {
          const data = await fetchMap["post"](api)({
            ...params,
            start: (page - 1) * limit,
            limit,
          });

          const newRootState = rootState.setIn(__statePaths, {
            list: [...responseData, ...data.object_list],
            limit: limitRef.current,
          });
          changeRootState(newRootState);
          setResponse({ ...data, page: page });
        },
        onShowSizeChange(curent, limit) {
          limitRef.current = limit;
          const newRootState = rootState.setIn(__statePaths, {
            list: responseData,
            limit,
          });
          changeRootState(newRootState);
        },
        total,
      }}
    ></Table>
  );
};

export default RenderTable;
