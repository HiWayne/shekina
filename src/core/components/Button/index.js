import { useState, useCallback, useMemo } from "react";
import { Button, Row, Col } from "antd";
import { fetchMap } from "../../../api/request";
import { isNil } from "ramda";

const createClickHandle = (action, params, setLoading) => {
  const strategy = {
    pagination: async (
      api,
      method,
      rootState,
      effectPaths,
      changeRootState,
      limit = 24
    ) => {
      const fetch = fetchMap[method];
      if (fetch) {
        setLoading(true);
        const data = await fetch(api)({ ...params, start: 0, limit }).catch(
          () => {
            setLoading(false);
          }
        );
        setLoading(false);
        if (data) {
          const newRootState = rootState.setIn(effectPaths, {
            list: data.object_list,
            limit,
            api,
            params,
          });
          changeRootState(newRootState);
        }
      } else {
        throw new Error(`method is illegal: ${method}`);
      }
    },
    fetch: async (api, method, rootState, effectPaths, changeRootState) => {
      const fetch = fetchMap[method];
      if (fetch) {
        setLoading(true);
        const data = await fetch(api)(params).catch(() => {
          setLoading(false);
        });
        setLoading(false);
        if (data && effectPaths) {
          const newRootState = rootState.setIn(effectPaths, data);
          changeRootState(newRootState);
        }
      } else {
        throw new Error(`method is illegal: ${method}`);
      }
    },
  };
  return strategy[action] || new Error(`action is illegal: ${action}`);
};

const RenderButton = ({ json, rootValue, rootState, changeRootState }) => {
  const [isLoading, setLoading] = useState(false);
  const {
    action,
    api,
    method,
    style,
    size,
    shape,
    name,
    wrapperOffset,
    valueType,
    __effectPaths,
    pageSize,
  } = json;
  const fetchValue = isNil(valueType)
    ? undefined
    : rootValue.getIn([valueType]).toJS();
  const clickHandle = useMemo(
    () => createClickHandle(action, fetchValue, setLoading),
    [action, fetchValue, setLoading]
  );
  if (clickHandle instanceof Error) {
    throw clickHandle;
  }
  const handleClick = useCallback(
    () =>
      clickHandle(
        api,
        method,
        rootState,
        __effectPaths,
        changeRootState,
        pageSize ? Number(pageSize) : pageSize
      ),
    [
      clickHandle,
      api,
      method,
      rootState,
      __effectPaths,
      changeRootState,
      pageSize,
    ]
  );
  return wrapperOffset ? (
    <Row>
      <Col offset={wrapperOffset}>
        <Button
          type={style}
          size={size}
          shape={shape}
          loading={isLoading}
          onClick={handleClick}
        >
          {name}
        </Button>
      </Col>
    </Row>
  ) : (
    <Button
      type={style}
      size={size}
      shape={shape}
      loading={isLoading}
      onClick={handleClick}
    >
      {name}
    </Button>
  );
};

export default RenderButton;
