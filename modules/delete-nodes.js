// Delete nodes passed as a nodeList
export default (nodeList) => {
  nodeList.forEach(node => {
    node.remove();
  });
}
