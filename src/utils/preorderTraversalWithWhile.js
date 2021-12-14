/**
 * 以循环的形式对二叉树前序遍历
 * 可在第一次、第二次进入节点时自定义行为
 */

import { isNil } from "ramda";

let node = null;

const completeWork = (currentNode, comeBack) => {
  let lastNode = null;
  if (typeof comeBack === "function") {
    comeBack(currentNode);
  }
  if (!isNil(currentNode.sibling)) {
    node = currentNode.sibling;
    return;
  } else {
    lastNode = currentNode.parent;
    while (!isNil(lastNode)) {
      if (typeof comeBack === "function") {
        comeBack(lastNode);
      }
      if (!isNil(lastNode.sibling)) {
        node = lastNode.sibling;
        return;
      } else {
        lastNode = lastNode.parent;
      }
    }
    node = null;
    return;
  }
};

const beginWork = (currentNode, firstEnter, comeBack) => {
  if (typeof firstEnter === "function") {
    firstEnter(currentNode);
  }
  if (!isNil(currentNode.child)) {
    node = currentNode.child;
  } else {
    completeWork(currentNode, comeBack);
  }
};

const preorderTraversalWithWhile = (rootNodeOfTree, firstEnter, comeBack) => {
  node = rootNodeOfTree;
  while (!isNil(node)) {
    beginWork(node, firstEnter, comeBack);
  }
};

const createPreorderTraversalWithWhile = () => {
  let hasComplete = false;
  return (...args) => {
    if (hasComplete) {
      return;
    }
    hasComplete = true;
    return preorderTraversalWithWhile(...args);
  };
};

export default createPreorderTraversalWithWhile;
