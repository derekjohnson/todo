import makeCheckable from './makeCheckable.js';
import storage from './storage.js';

const list = document.querySelector('ul');
list.classList.add('checkable');

if(localStorage.todos) {
  list.innerHTML = localStorage.todos;
}

const callback = (mutations) => {
  mutations.forEach(mutation => {
    let items = list.querySelectorAll('li');
    items.forEach(item => {
      if(!item.querySelector('input') && item.textContent) {
        item.appendChild(makeCheckable(item));
      }
    });
    storage(list, 'todo');
  });
};

const observer = new MutationObserver(callback);
observer.observe(list, {childList: true});

