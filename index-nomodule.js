var list = document.querySelector('ul');

if('localStorage' in window) {
  if(localStorage.todo) {
    list.innerHTML = localStorage.todo;
  }

  setInterval(function() {
    localStorage.todo = list.innerHTML;
  }, 5000);
}
