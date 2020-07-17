var quantity = 1;
$(function() {
  $(document).scroll(function() {
    $(".navbar").toggleClass('scrolled', $(this).scrollTop() > $(".navbar").height());
    $(".navbar-brand").toggleClass('navbar-brand-white', $(this).scrollTop() > $(".navbar").height());
    $(".cart").toggleClass('cart-title-white', $(this).scrollTop() > $(".navbar").height());
    $(".cart-title").toggleClass('cart-text-green', $(this).scrollTop() > $(".navbar").height());
  });
});
/*HANDLING PRODUCT Quantity*/

$(".userSoupBtnMin").on("click", function() {
  switch ($("strong")){
    case $("strong").hasClass("0"):
      updateQuantityNumberSubsctract(parseInt($(".0").text()), "0")

      break;
    case $("strong").hasClass("1"):
      updateQuantityNumberSubsctract(parseInt($(".1").text()), "1")

      break;
    case $("strong").hasClass("2"):
      updateQuantityNumberSubsctract(parseInt($(".2").text()), "2")

      break;
    case $("strong").hasClass("3"):
      updateQuantityNumberSubsctract(parseInt($(".3").text()), "3")

      break;
    case $("strong").hasClass("4"):
      updateQuantityNumberSubsctract(parseInt($(".4").text()), "4")

      break;
    default:
  }
});

function updateQuantityNumberSubsctract(currentQuantity, soupPosition) {
  if (currentQuantity > 1) {
    currentQuantity--;
    $(("." + soupPosition)).text(currentQuantity);
  } else {}
}
function updateQuantityNumberAdd(currentQuantity,soupPosition){
  currentQuantity++;
  $(("." + soupPosition)).text(currentQuantity);
}

$(".userSoupBtnMax").on("click", function() {
  switch ($("strong")) {
    case $("strong").hasClass("0"):
      console.log("HOLA MUNDO")
      updateQuantityNumberAdd(parseInt($(".1").text()), "0")

      break;
    case $("strong").hasClass("1"):
    console.log("HOLA MUNDO2")
      updateQuantityNumberAdd(parseInt($(".1").text()), "1")

      break;
    case $("strong").hasClass("2"):
    console.log("HOLA MUNDO3")
      updateQuantityNumberAdd(parseInt($(".2").text()), "2")

      break;
    case $("strong").hasClass("3"):
    console.log("HOLA MUNDO4")
      updateQuantityNumberAdd(parseInt($(".3").text()), "3")

      break;
    case $("strong").hasClass("4"):
    console.log("HOLA MUNDO5")
      updateQuantityNumberAdd(parseInt($(".4").text()), "4")

      break;
    default:
  }

});
