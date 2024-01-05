// alert("ddjbksd");
$(".anime2").hide();
$(".admin-text").click(function(){
  $(".anime1").hide();
  $(".anime2").slideDown(3000);
})
function myFunction() {
  var x = document.getElementById("myInput");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
// function myFunction() {
//   var x = document.getElementById("myInput2");
//   if (x.type === "password") {
//     x.type = "text";
//   } else {
//     x.type = "password";
//   }
// }
