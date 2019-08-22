$(document).ready(function() {

  // top search modal

  $('.search-icon').click(function(e){
    $('.search-modal').fadeToggle('fast');
     e.stopPropagation();
  });

  $('.search-modal').click(function(e){
      e.stopPropagation();
  });

  // Align submenu to the right if overflows the main navigation menu
  var $header = $('#portal-top');
  var $nav = $('#portal-globalnav');
  var $navItems = $nav.children('li');
  var mainMenuWidth = $header.width();
  $navItems.mouseenter(function() {
    var $this = $(this);
    var $submenu = $this.children('.submenu');
    var subMenuWidth = $submenu.width();

    if ($submenu.length > 0) {
      var subMenuLeftPos = $submenu.offset().left;
    }

    if (mainMenuWidth - (subMenuWidth + subMenuLeftPos) < 0) {
      $submenu.addClass('aligned-submenu');
    }
  });

  // Homepage slider
  if ($('.slider').slick) {
    $('.slider').slick({
      infinite: true,
      speed: 700,
      // autoplay:true,
      // autoplaySpeed: 2000,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });

    $('.slick-arrow').appendTo('.slider-arrows');
  };

});


$(document).click(function(){
  $('.search-modal').hide();
});
