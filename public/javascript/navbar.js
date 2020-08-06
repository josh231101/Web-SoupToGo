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

$(".userSoupBtnMax").click((event)=>{
  const position = Number(event.target.value)
  $(`.${position}`).text(Number(Number($(`.${position}`).text()) + 1))
  var currentPrice = (Number($(`.${position}`).text()) * Number($(`.soupPrice${position}`).attr("name")))
  $(`.soupPrice${position}`).text(currentPrice)


  const arrayLength = Number($(".finalPrice").attr("name"))
  var finalPrice = 0
  for(var i = 0 ; i < arrayLength ; i++){
    finalPrice += (Number($(`.${i}`).text()) * Number($(`.soupPrice${i}`).attr("name")))
  }
  $(".finalPrice").text(finalPrice)
})
$(".userSoupBtnMin").click((event)=>{
  const position = Number(event.target.value)
  $(`.${position}`).text(Number(Number($(`.${position}`).text()) - 1))
  var currentPrice = (Number($(`.${position}`).text()) * Number($(`.soupPrice${position}`).attr("name")))
  $(`.soupPrice${position}`).text(currentPrice)
  const arrayLength = Number($(".finalPrice").attr("name"))
  var finalPrice = 0
  for(var i = 0 ; i < arrayLength ; i++){
    finalPrice += (Number($(`.${i}`).text()) * Number($(`.soupPrice${i}`).attr("name")))
  }
  $(".finalPrice").text(finalPrice)
})
