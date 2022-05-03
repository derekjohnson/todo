// Remove checked items and append them to the bottom of the list
export default (list) => {
  const items = list.querySelectorAll('li');
  const itemsArray = Array.from(items);

  const ordered = itemsArray.sort((a, b) => {
    if(a.querySelector('input') && b.querySelector('input')) {
      return a.querySelector('input').checked > b.querySelector('input').checked ? 1 : -1;
    }
  });

  const fragment = new DocumentFragment();
  ordered.forEach(item => {
    fragment.appendChild(item);
  });

  return fragment;
}
