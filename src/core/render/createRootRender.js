import { useMemo } from "react";
import { Col } from "antd";
import { isNil } from "ramda";
import hasSelfVisibleProp from "../../utils/business/hasSelfVisibleProp";
import typeTransform from "../../utils/business/typeTransform";
import shouldShow from "../../utils/business/shouldShow";
import shouldHasColWrapped from "../../utils/business/shouldHasColWrapped";

// 该组件可以修改state，改变自身或其他组件的状态
const canModifyState = (json) => !isNil(json.__effectPaths);
// 该组件被state影响
const hasState = (json) => !isNil(json.__statePaths);
// 该组件会修改数据
const canModifyValue = (json) => !isNil(json.__valuePaths);
// 组件库
let componentMap = {};
// 当前遍历节点对应的Component
let componentOfcurrentNode = null;

/**
 * @description 标准化组件，对组件包装一些通用的逻辑
 * @param {import("react").FunctionComponent} Component 组件
 * @returns {import("react").FunctionComponent} React Component
 */
const NormalizeComponent = ({
  json,
  rootValue,
  rootState,
  changeRootValue,
  changeRootState,
  children,
  ...props
}) => {
  const Component = componentOfcurrentNode;
  const {
    __statePaths: statePaths,
    equality,
    __valuePaths: valuePaths,
    __effectPaths: effectPaths,
    wrapperSpan = 0,
    wrapperOffset = 0,
    labelSpan = 0,
    labelOffset = 0,
    transform,
  } = json;
  const _changeRootState = changeRootState;
  let onChange = () => {};
  if (canModifyValue(json)) {
    onChange = (e) => {
      // 有些andt自带的事件入参直接是value
      const value = e.target ? e.target.value : e;
      const transformedValue = typeTransform(transform, value);
      const newRootValue = rootValue.setIn(valuePaths, transformedValue);
      changeRootValue(newRootValue);
      if (canModifyState(json)) {
        changeRootState = (value) => {
          const newRootState = rootState.setIn(effectPaths, value);
          _changeRootState(newRootState);
        };
        changeRootState(value);
      }
    };
  }

  let value = valuePaths ? rootValue.getIn(valuePaths) : undefined;
  // 防止value是immutable结构
  if (value && typeof value.toJS === "function") {
    value = value.toJS();
  }
  const componentContent = useMemo(
    () => (
      <Component
        json={json}
        rootValue={rootValue}
        rootState={rootState}
        onChange={onChange}
        changeRootValue={changeRootValue}
        changeRootState={changeRootState}
        value={value}
        {...props}
      >
        {Component.__hasContext
          ? children
          : children
          ? children.map(({ json, Child }) => (
              <Child
                json={json}
                rootValue={rootValue}
                rootState={rootState}
                changeRootValue={changeRootValue}
                changeRootState={changeRootState}
                {...props}
                key={json.id}
              />
            ))
          : null}
      </Component>
    ),
    [rootValue, rootState]
  );
  return shouldShow(rootState, statePaths, equality) ||
    hasSelfVisibleProp(json) ? (
    shouldHasColWrapped(json) ? (
      <Col
        style={{ display: "inline-block" }}
        span={Number(wrapperSpan) + Number(labelSpan)}
      >
        {componentContent}
      </Col>
    ) : (
      componentContent
    )
  ) : null;
};

const NormalizeComponents = (props) => {
  const { json } = props;
  if (!json) {
    return null;
  }
  componentOfcurrentNode = componentMap[json.type].component;
  return (
    <NormalizeComponent {...props}>
      {/* 之所以children中只传组件而不传reactNode是因为：
       * 先把子节点实例化再交给父节点，父节点对子节点是没有控制权的（有点像控制反转），而如果所有子节点可以在父节点内部实例化，父节点的数据可以传递给子节点
       * 但带来的问题是，组件在实现时必须要关心children
       */}
      {Array.isArray(json.children)
        ? json.children.map((node) => {
            const ChildComponent = createRootRender(componentMap);
            return { json: node, Child: ChildComponent };
          })
        : null}
    </NormalizeComponent>
  );
};

/**
 * @description 生成总的渲染组件，内部是层序遍历，第一个json是根
 * @param {object} _componentMap 组件Map
 * @returns {import("react").FunctionComponent} React Component
 */
const createRootRender = (_componentMap) => {
  componentMap = _componentMap;
  return NormalizeComponents;
};

export default createRootRender;
