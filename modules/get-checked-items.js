// Get a list of checked items
export default (list) => {
  // const checkedItems = document.querySelectorAll('li:has(input:checked)');
  // would have been a lot easier than the next few lines
  const items = list.querySelectorAll('li');
  const itemsArray = Array.from(items);
  const checkedItems = itemsArray.filter(item => {
    if(item.querySelector('input:checked')) {
      return item;
    }
  });
  return checkedItems;
}

