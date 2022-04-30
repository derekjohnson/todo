// Put the caret at the end of the item passed in
// No idea how this API works and this is approx the 18 millionth thing I copied from the internet
// https://stackoverflow.com/questions/4063144/setting-the-caret-position-to-an-empty-node-inside-a-contenteditable-element
export default (el) => {
  //if(el.textContent == false) {
    //el.innerHTML += '&#65279'; [> Chrome doesn't work without this <]
  //}
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

