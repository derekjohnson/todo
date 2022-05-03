// Delete nodes passed as a nodeList
export default (list) => {
  list.forEach(node => {
    node.remove();
  });
}

