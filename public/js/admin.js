const hamburger = document.querySelector('.hamburger');
const hamburger_icon = hamburger.querySelector('span');
const mobile_menu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger_icon.innerText = hamburger_icon.innerText === 'menu'
		? 'close'
		: 'menu';

	mobile_menu.classList.toggle('is-open');
})
function myFunction() {
  var x = document.getElementById("myInput");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
