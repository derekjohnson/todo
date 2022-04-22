// Wrap list item text in a label element and give it a checkbox sibling
// if it's not already done.
export default (item) => {
  const originalText = item.textContent;
  item.textContent = '';
  const label = document.createElement('label');
  const span = document.createElement('span');
  span.setAttribute('contenteditable', false);
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  span.appendChild(checkbox);
  const newText = document.createTextNode(originalText);
  label.appendChild(span);
  label.appendChild(newText);
  return label;
};

