$(document).ready(function() {

  // HEADER

  // top search modal
  $('.search-icon').click(function() {
    $('.search-modal').fadeToggle('fast');
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


});
