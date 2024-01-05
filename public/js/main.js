const hamburger = document.querySelector('.hamburger');
const hamburger_icon = hamburger.querySelector('span');
const mobile_menu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
  hamburger_icon.innerText = hamburger_icon.innerText === 'menu'
		? 'close'
		: 'menu';

	mobile_menu.classList.toggle('is-open');
})
// document.querySelector(".about-img").addEventListener("click", keyAnimation);
// function keyAnimation1(){
//   var activeButton1 = document.querySelector(".about-img1");
//   activeButton1.classList.add(".hover1")
//   var activeButton2 = document.querySelector(".about-img2");
//   activeButton2.classList.add(".hover2")
//   var activeButton3 = document.querySelector(".about-img3");
//   activeButton3.classList.add(".hover3")
//   setTimeout(function(){
//     activeButton.classList.remove(".hover1");
//   }, 100);
//   setTimeout(function(){
//     activeButton.classList.remove(".hover2");
//   }, 100);
//   setTimeout(function(){
//     activeButton.classList.remove(".hover3");
//   }, 100);
// }
