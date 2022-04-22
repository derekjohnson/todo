import makeCheckable from './make-checkable.js';
import storage from './storage.js';
import { checklistToObject, objectToChecklist } from './checklist-object-converter.js';

// Name for the localStorage store
const store = 'todos';

// Add class to hide bullet points
const list = document.querySelector('ul');
list.classList.add('checkable');

// Add a saved list to the UI if it exists
// with an empty one on the end to make it easier to type a new item
if(localStorage[store]) {
  const listFromStorage = objectToChecklist(JSON.parse(localStorage[store]));
  list.innerHTML = '';
  list.appendChild(listFromStorage);
  list.appendChild(document.createElement('li'));
}

// What to do when the observed element mutates
const callback = (mutations) => {
  mutations.forEach(mutation => {
    const items = list.querySelectorAll('li');
    items.forEach(item => {
      if(!item.querySelector('input') && item.textContent != false) {
        item.appendChild(makeCheckable(item));
      }
    });
    let listObject = checklistToObject(list);
    storage(JSON.stringify(listObject), store);
  });
};

// Set up the mutation observer
const observer = new MutationObserver(callback);
observer.observe(list, {childList: true});

// Add a listener to store for the checkboxes getting checked and unchecked
// so that's saved in localStorage without the need for a new item
const checkboxes = list.querySelectorAll('input');

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('click', () => {
    let listObject = checklistToObject(list);
    storage(JSON.stringify(listObject), store);
  });
});
