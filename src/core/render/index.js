import { useMemo, useState } from "react";
import Immutable from "immutable";
import createRootRender from "./createRootRender";
import compile from "../compile/index";

const createRender =
  (components) =>
  ({ jsons }) => {
    const { getValueTree, getStateTree, getVdomTree } = useMemo(
      () => compile(jsons),
      [jsons]
    );
    const vdomTree = useMemo(getVdomTree, [getVdomTree]);
    const valueTree = useMemo(getValueTree, [getValueTree]);
    const stateTree = useMemo(getStateTree, [getStateTree]);
    const RootRender = useMemo(() => createRootRender(components), []);
    const immutableValueTree = useMemo(
      () => Immutable.fromJS(valueTree),
      [valueTree]
    );
    const immutableStateTree = useMemo(
      () => Immutable.fromJS(stateTree),
      [stateTree]
    );
    const [rootValue, changeRootValue] = useState({});
    const [rootState, changeRootState] = useState({});
    useMemo(() => {
      changeRootValue(immutableValueTree);
      changeRootState(immutableStateTree);
    }, [
      changeRootValue,
      changeRootState,
      immutableValueTree,
      immutableStateTree,
    ]);
    return (
      <RootRender
        json={vdomTree}
        rootValue={rootValue}
        rootState={rootState}
        changeRootValue={changeRootValue}
        changeRootState={changeRootState}
      />
    );
  };

export default createRender;
