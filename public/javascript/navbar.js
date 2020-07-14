$(function () {
  $(document).scroll(function () {
    $(".navbar").toggleClass('scrolled', $(this).scrollTop() > $(".navbar").height());
    $(".navbar-brand").toggleClass('navbar-brand-white', $(this).scrollTop() > $(".navbar").height());
  });
});
