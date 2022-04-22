export default (list) => {
  const height = list.offsetHeight;
  let spacing = height / 4 + 'px';
  const root = document.documentElement;
  root.style.setProperty('--edit-letter-spacing',spacing);
}
