import { useState, useMemo, useCallback, useEffect, useContext } from "react";
import styled from "@emotion/styled";
import { Tag, Tree } from "antd";
import compileVdom, { findRoot } from "../../utils/business/compileVdom";
import createInvertedIndexList from "../../utils/createInvertedIndexList";
import { Jsons, ChangeJsons, Json, ChangeJson, idRef } from "../Configure";
import { find, findIndex, isNil } from "ramda";

const findAllIndexOfSelfAndDescendants = (json, jsons) => {
  let result = [];
  const find = (json) => {
    const id = typeof json === "number" ? json : json.id;
    return findIndex((_json) => _json.id === id, jsons);
  };
  if (isNil(json.children) || json.children.length === 0) {
    const selfIndex = find(json);
    result = [selfIndex];
  } else {
    const list = [];
    const findIndexOfChild = (json, list) => {
      console.log(json);
      const jsonIndex = find(json);
      if (typeof json === "number") {
        json = jsons[jsonIndex];
        list.push(jsonIndex);
      } else {
        list.push(jsonIndex);
      }
      if (Array.isArray(json.children)) {
        json.children.forEach((childId) => {
          findIndexOfChild(childId, list);
        });
      }
    };
    findIndexOfChild(json, list);
    result = list;
  }
  return result.filter((id) => id !== -1);
};

const Operator = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(100%, 100%);
  width: 100px;
  background-color: #eee;
  color: #000;
  cursor: pointer;
  z-index: 999;
  & > span {
    display: block;
    padding: 5px;
    text-align: center;
  }
  & > span:hover {
    background-color: #1a90ff;
    color: #fff;
  }
`;

let _setShow = [];
const hiddenOperator = () => {
  if (Array.isArray(_setShow)) {
    _setShow.forEach((fn) => {
      if (typeof fn === "function") {
        fn(false);
      }
    });
    _setShow = [];
  }
};

const TitleRender = ({ nodeData }) => {
  const jsons = useContext(Jsons);
  const json = useContext(Json);
  const changeJsons = useContext(ChangeJsons);
  const changeJson = useContext(ChangeJson);
  const [show, setShow] = useState(false);
  const addJson = useCallback(() => {
    setShow(false);
    const parentJson = nodeData.json;
    let currentEditedJson, id;
    if (!isNil(json.id) && !isNil(json.parent)) {
      const parentId = json.parent;
      const abandonedParentJsonIndex = findIndex(
        (json) => json.id === parentId,
        jsons
      );
      const abandonedParentJson = jsons[abandonedParentJsonIndex];
      const abandonedChildIdIndex = findIndex(
        (id) => id === json.id,
        abandonedParentJson.children
      );
      abandonedParentJson.children.splice(abandonedChildIdIndex, 1);
      currentEditedJson = {
        id: json.id,
        parent: parentJson.id,
      };
      id = json.id;
    } else {
      id = idRef.current;
      currentEditedJson = {
        id,
        parent: parentJson.id,
      };
      idRef.current++;
    }
    if (Array.isArray(parentJson.children)) {
      parentJson.children.push(id);
    } else {
      parentJson.children = [id];
    }
    currentEditedJson.__type = "create";
    changeJson(currentEditedJson);
  }, [changeJson, nodeData, jsons, json]);
  const editJson = useCallback(() => {
    setShow(false);
    const json = nodeData.json;
    json.__type = "update";
    changeJson(json);
  }, []);
  const removeJson = useCallback(() => {
    setShow(false);
    const json = nodeData.json;
    const id = json.id;
    const parentId = json.parent;
    if (isNil(parentId)) {
      // 删除根节点
      changeJsons([]);
    } else {
      // 需要删除父组件中的child，需要在jsons中删除本身以及所有子孙组件
      const jsonIndex = findIndex((json) => json.id === id, jsons);
      const parentIndex = findIndex((json) => json.id === parentId, jsons);
      if (parentIndex === -1) {
        throw new Error(`找不到id为${parentIndex}的父组件`);
      }
      const parentJson = jsons[parentIndex];
      const children = parentJson.children || [];
      const childIndex = findIndex((childId) => childId === id, children);
      if (childIndex === -1) {
        throw new Error(`id为${parentId}的父组件没有id为${id}的子组件`);
      }
      const newJsons = jsons.slice();
      const newChildren = children.slice();
      newChildren.splice(childIndex, 1);
      newJsons[parentIndex] = { ...parentJson, children: newChildren };
      // 在jsons中删除本身以及所有子孙组件
      const indexList = findAllIndexOfSelfAndDescendants(json, jsons).sort(
        (a, b) => b - a
      );
      indexList.forEach((index) => {
        newJsons.splice(index, 1);
      });
      changeJsons(newJsons);
    }
  }, [jsons, changeJsons, nodeData, setShow]);
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#1a90ff",
        padding: "3px 10px",
        borderRadius: "5px",
        color: "#fff",
        cursor: "pointer",
      }}
      onClick={(e) => {
        e.stopPropagation();
        hiddenOperator();
        _setShow.push(setShow);
        setShow(!show);
      }}
    >
      {nodeData.title}: {nodeData.key}
      {show ? (
        <Operator>
          <span onClick={addJson}>新增子节点</span>
          <span onClick={editJson}>编辑节点</span>
          <span onClick={removeJson}>删除节点</span>
        </Operator>
      ) : null}
    </div>
  );
};

const titleRender = (nodeData) => <TitleRender nodeData={nodeData} />;

const ComponentRelation = ({ jsonsMap }) => {
  const jsons = useContext(Jsons);
  useEffect(() => {
    document.addEventListener("click", hiddenOperator);
    return () => {
      document.removeEventListener("click", hiddenOperator);
    };
  }, []);

  const jsonsInvertedIndexListById = useMemo(
    () => createInvertedIndexList(jsons, "id"),
    [jsons]
  );
  const root = useMemo(() => findRoot(jsons), [jsons]);
  const createNode = useCallback(
    (json) => {
      if (typeof json === "number") {
        const id = json;
        json = jsonsInvertedIndexListById.get(id);
      }
      return json
        ? {
            key: json.id,
            title: json.type,
            children: json.children
              ? json.children.map((json) => createNode(json))
              : [],
            json,
          }
        : null;
    },
    [jsonsInvertedIndexListById]
  );
  const treeData = useMemo(() => {
    const data = createNode(root);
    return data ? [data] : data;
  }, [createNode, root]);

  return treeData ? (
    <Tree
      defaultExpandAll={true}
      treeData={treeData}
      titleRender={titleRender}
    />
  ) : null;
};

export default ComponentRelation;
