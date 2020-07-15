var quantity = 1;
$(function () {
  $(document).scroll(function () {
    $(".navbar").toggleClass('scrolled', $(this).scrollTop() > $(".navbar").height());
    $(".navbar-brand").toggleClass('navbar-brand-white', $(this).scrollTop() > $(".navbar").height());
  });
});
$(".userSoupBtnMin").on("click",function(){
  if(quantity > 1){
      quantity--;
    $(".userSoupQuantity").text(quantity);
  }else{}
});
$(".userSoupBtnMax").on("click",function(){
  quantity++;
  $(".userSoupQuantity").text(quantity);
});
