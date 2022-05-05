import makeCheckable from './make-checkable.js';

// Convert the list items to an object where the keys are the item text
// and the value is the checked/unchecked state of its checkbox
const checklistToObject = (list) => {
  const items = list.querySelectorAll('li');
  const itemsArray = Array.from(items);
  const checklistAsObject = itemsArray.reduce((object, item) => {
    object[item.textContent] = item.querySelector('input:checked') ? 'checked' : 'unchecked';
    return object;
  }, {});
  return checklistAsObject;
};

// Convert an object to a document fragment with the
// checked checkboxes preserved
const objectToChecklist = (object) => {
  const keys = Object.keys(object);
  const fragment = new DocumentFragment();
  keys.forEach(key => {
    const item = document.createElement('li');
    item.setAttribute('draggable', 'draggable');
    const text = document.createTextNode(key);
    item.appendChild(text);
    if(!item.querySelector('input')) {
      item.appendChild(makeCheckable(item));
    }
    if(object[key] === 'checked') {
      item.querySelector('input').checked = true;
    }
    fragment.append(item);
  });
  return fragment;
}

export { checklistToObject, objectToChecklist };
