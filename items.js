const list = document.querySelector('ul');

const makeCheckable = (item) => {
  const originalText = item.textContent;
  item.textContent = '';
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  const newText = document.createTextNode(originalText);
  label.appendChild(checkbox);
  label.appendChild(newText);
  item.appendChild(label);
};

const callback = (mutations) => {
  mutations.forEach(mutation => {
    let items = list.querySelectorAll('li');
    items.forEach(item => {
      if(!item.querySelector('input') && item.textContent) {
        makeCheckable(item);
      }
    });
  });
};

const observer = new MutationObserver(callback);
observer.observe(list, {childList: true});


