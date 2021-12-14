import {
  useRef,
  useEffect,
  useMemo,
  createContext,
  useState,
  useCallback,
  forwardRef,
} from "react";
import styled from "@emotion/styled";
import { Form, Select, Row, Col, Button, Card } from "antd";
import components from "../core/components/index";
import OptionalConfigure from "./components/OptionalConfigure";
import ComponentRelation from "./components/ComponentRelation";
import { isNil, findIndex } from "ramda";
import normalizeJson from "../utils/business/normalizeJson";

import { jsons as _jsons } from "../../src/core/testPageJsons";

const { Item } = Form;
const { Option } = Select;
// import CodeMirror from "codemirror";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/lib/codemirror.css";
// import "codemirror/theme/dracula.css";

export const Jsons = createContext([]);
export const ChangeJsons = createContext(null);
export const Json = createContext({});
export const ChangeJson = createContext(null);
// 维护唯一id
export const idRef = { current: 0 };

const Wrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-start;
`;

const CommonWrapper = styled(({ className, ...props }) => (
  <Card className={className} {...props} />
))`
  flex: 0 0 ${(props) => (props.width ? props.width : "200px")};
`;

const ContentWrapper = styled(({ className, iframeRef }) => {
  return (
    <CommonWrapper className={className}>
      <iframe
        style={{ width: "100%", height: "90vh", border: "none" }}
        ref={iframeRef}
        title="page"
        src="/page"
      ></iframe>
    </CommonWrapper>
  );
})`
  flex: 1;
  height: 90vh;
`;

const ForwradRefContentWrapper = forwardRef((_props, iframeRef) => (
  <ContentWrapper iframeRef={iframeRef}></ContentWrapper>
));

const ListWrapper = styled.div`
  flex: 0 0 200px;
`;

const Tip = styled.div`
  padding: 10px;
  text-align: center;
  color: rgba(100, 100, 100, 0.8);
`;

// 可选的组件列表
const optionalComponents = Object.entries(components).map(([key, value]) => ({
  label: value.name,
  value: key,
}));

const ComponentConfig = ({
  json,
  handleTypeChange,
  handleAddJson,
  isFirstEnter,
  cancleAddJson,
  modifyType,
}) => (
  <>
    <Form>
      <Item label="组件类型">
        <Select value={json.type} onChange={handleTypeChange}>
          {optionalComponents.map(({ label, value }) => (
            <Option label={value} key={value}>
              {label}
            </Option>
          ))}
        </Select>
      </Item>

      <OptionalConfigure type={json.type} />
    </Form>
    <Button type="primary" onClick={handleAddJson} disabled={!json.type}>
      {modifyType === "update" ? "更新" : "添加"}
    </Button>
    {isFirstEnter ? null : (
      <Button
        style={{ marginLeft: "16px" }}
        type="default"
        onClick={cancleAddJson}
      >
        取消
      </Button>
    )}
  </>
);

const Configure = () => {
  // const eleRef = useRef(null);
  // useEffect(() => {
  //   CodeMirror(eleRef.current, {
  //     lineNumbers: true,
  //     mode: { name: "javascript", json: true },
  //     theme: "dracula",
  //     viewportMargin: Infinity,
  //   });
  // }, []);
  // return (
  //   <div>
  //     <div>编辑器</div>
  //     <div id="editor" style={{ width: "500px" }} ref={eleRef}></div>
  //   </div>
  // );
  const iframeRef = useRef(null);
  const jsonsMapRef = useRef({});
  const [modifyType, setModifyType] = useState("");
  const [jsons, changeJsons] = useState([]);
  const [json, _changeJson] = useState({});
  console.log("json", json);
  console.log("jsons", jsons);
  // 判断是否第一次进
  const [isFirstEnter, setIsFirstEnter] = useState(true);
  const EDIT_DEFAULT_TIP = "请先在组件关系面板中添加组件";
  const [editText, setEditText] = useState(EDIT_DEFAULT_TIP);
  const canEdit = Object.keys(json).length > 0;

  const changeJson = useCallback(
    (state) => {
      const newJson = { ...json, ...state };
      const innerProps = normalizeJson(newJson);
      const __type = innerProps.__type;
      if (!__type || __type === "create") {
        setModifyType("create");
      } else if (__type === "update") {
        setModifyType("update");
      }
      _changeJson(newJson);
    },
    [json]
  );
  const handleAddJson = useCallback(() => {
    if (!json.type) {
      return;
    }
    let newJsons;
    const finalJson = { ...json };
    if (modifyType !== "update") {
      if (isNil(finalJson.id)) {
        const id = idRef.current;
        finalJson.id = id;
        idRef.current++;
      }
      newJsons = [...jsons, finalJson];
      jsonsMapRef.current[finalJson.id] = finalJson;

      if (isFirstEnter) {
        setIsFirstEnter(false);
      }
      setEditText("添加成功，在右侧组件关系面板中对组件单击可继续添加");
    } else {
      const id = finalJson.id;
      const index = findIndex((json) => json.id === id, jsons);
      if (index < 0) {
        throw new Error("the updated json is not exist in jsonsList");
      }
      newJsons = jsons.slice();
      newJsons.splice(index, 1, finalJson);
    }
    changeJsons(newJsons);
    _changeJson({});

    // jsons改变派发通知
    const iframeDom = iframeRef.current;
    iframeDom.contentWindow.postMessage(newJsons, "*");
  }, [json, _changeJson, jsons, isFirstEnter]);
  const cancleAddJson = useCallback(() => {
    const { id, parent } = json;
    if (!isNil(parent)) {
      const parentIndex = findIndex((json) => json.id === parent, jsons);
      if (parentIndex === -1) {
        throw new Error(`找不到id为${parentIndex}的父组件`);
      }
      const parentJson = jsons[parentIndex];
      const newJsons = jsons.slice();
      const children = parentJson.children || [];
      const newChildren = children.slice();
      const childIndex = findIndex((childId) => childId === id, children);
      if (children === -1) {
        throw new Error(`id为${parent}的父组件没有id为${id}的子组件`);
      }
      newChildren.slice(childIndex, 1);
      newJsons[parentIndex] = { ...parentJson, children: newChildren };
      changeJsons(newJsons);
    }
    _changeJson({});
    if (!isFirstEnter) {
      setEditText("EDIT_DEFAULT_TIP");
    }
  }, [jsons, json, changeJsons, _changeJson, setEditText, isFirstEnter]);
  const handleTypeChange = useCallback(
    (value) => {
      changeJson({ type: value });
    },
    [changeJson]
  );

  return (
    <Jsons.Provider value={jsons}>
      <ChangeJsons.Provider value={changeJsons}>
        <Json.Provider value={json}>
          <ChangeJson.Provider value={changeJson}>
            <Wrapper>
              <CommonWrapper title="页面列表"></CommonWrapper>
              <ForwradRefContentWrapper
                ref={iframeRef}
              ></ForwradRefContentWrapper>
              <CommonWrapper title="组件配置面板" width="300px">
                {isFirstEnter ? (
                  <ComponentConfig
                    json={json}
                    handleTypeChange={handleTypeChange}
                    handleAddJson={handleAddJson}
                    isFirstEnter={isFirstEnter}
                    cancleAddJson={cancleAddJson}
                    modifyType={modifyType}
                  />
                ) : canEdit ? (
                  <ComponentConfig
                    json={json}
                    handleTypeChange={handleTypeChange}
                    handleAddJson={handleAddJson}
                    isFirstEnter={isFirstEnter}
                    cancleAddJson={cancleAddJson}
                    modifyType={modifyType}
                  />
                ) : (
                  <Tip>{editText}</Tip>
                )}
              </CommonWrapper>
              <CommonWrapper title="组件关系面板">
                <ComponentRelation />
              </CommonWrapper>
            </Wrapper>
          </ChangeJson.Provider>
        </Json.Provider>
      </ChangeJsons.Provider>
    </Jsons.Provider>
  );
};

export default Configure;
