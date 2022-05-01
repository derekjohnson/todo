import makeCheckable from './modules/make-checkable.js';
import storage from './modules/storage.js';
import { checklistToObject, objectToChecklist } from './modules/checklist-object-converter.js';
import registerServiceWorker from './modules/register-service-worker.js';
import placeCaret from './modules/place-caret.js';
import deleteNodes from './modules/delete-nodes.js';

//registerServiceWorker();

// Name for the localStorage store
const store = 'todos';

// Proxy for not Safari until I figure out how
// to get selection and range working there
const supportsVibrate = 'vibrate' in navigator;
console.log(supportsVibrate);

// Add class to hide bullet points
const list = document.querySelector('ul');
list.classList.add('checkable');

// Add a saved list to the UI if it exists
// and pop the caret on the end of the last one
if(localStorage[store]) {
  const listFromStorage = objectToChecklist(JSON.parse(localStorage[store]));
  list.innerHTML = '';
  list.appendChild(listFromStorage);
  if(supportsVibrate) {
    const labels = list.querySelectorAll('label');
    const lastLabel = labels[labels.length - 1];
    list.focus();
    placeCaret(lastLabel);
  } else {
    list.appendChild(document.createElement('li'));
  }
}

// What to do when the observed element mutates
const callback = (mutations) => {
  mutations.forEach(mutation => {
    const items = list.querySelectorAll('li');
    const lastItem = items[items.length - 1];
    items.forEach(item => {
      if(supportsVibrate) {
        if(!item.querySelector('input')) {
          item.appendChild(makeCheckable(item));
          if(item === lastItem) {
            list.focus();
            placeCaret(item.querySelector('label'));
          }
        }
      } else {
        // Safari
        if(!item.querySelector('input') && item.textContent != false) {
          item.appendChild(makeCheckable(item));
        }
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
// also iOS Safari ignores the contenteditable=false in wrapping the checkbox
// and opens the keyboard when the checkbox is tapped, so momentarily remove it
const checkboxes = list.querySelectorAll('input');

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('click', () => {
    let listObject = checklistToObject(list);
    storage(JSON.stringify(listObject), store);
  });
  checkbox.addEventListener('pointerover', () => {
    list.contentEditable = false;
    setTimeout(() => {
      list.contentEditable = true;
    }, 300);
  });
});

// Delete checked nodes
const deleteButton = document.getElementById('delete-checked');

deleteButton.addEventListener('click', () => {
  // const checkedItems = document.querySelectorAll('li:has(input:checked)');
  // would have been a lot easier than the next few lines
  const items = document.querySelectorAll('li');
  const itemsArray = Array.from(items);
  const checkedItems = itemsArray.filter(item => {
    if(item.querySelector('input:checked')) {
      return item;
    }
  });
  deleteNodes(checkedItems);
});

