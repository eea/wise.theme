
// Collapse navigation and move search section
// when it's running out of space in the header
function autoCollapseNavigation() {
  var $header = $('#content-header');
  var $navbar = $('.navbar-nav');
  var $searchSubmitButton = $('.search-submit');

  $header.removeClass('collapse-nav');
  // $searchSubmitButton.text('Search');

  if ($navbar.innerHeight() > 55) {
    $header.addClass('collapse-nav');
    // $searchSubmitButton.text('');
  }
}

// Align submenu to the right
// if overflows the main navigation menu
function alignNavSubmenu() {
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
}


$(document).ready(function() {

  // Homepage slider
  if ($('.slider').slick) {
    $('.slider').slick({
      infinite: true,
      speed: 700,
      autoplay:true,
      autoplaySpeed: 4000,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });

    $('.slick-arrow').appendTo('.slider-arrows');
  };

  // Top search modal
  $('.search-icon').click(function(e) {
    $('.search-modal').fadeToggle('fast');
     e.stopPropagation();
  });

  $('.search-modal').click(function(e) {
    e.stopPropagation();
  });

  // Move search and login to navbar container
  $('.top-actions').prependTo('.navbar-collapse');


  autoCollapseNavigation();
  alignNavSubmenu();

  var resizeTimer;
  $(window).on('resize',function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doneResizing, 100);
  });

  function doneResizing() {
    autoCollapseNavigation();
  }

  // set background image for page lead image 
  var imageSRC = $('.newsImageContainer a').attr('href');
  $('.lead-image').css('background-image', 'url(' + imageSRC + ')');

});


$(document).click(function() {
  $('.search-modal').hide();
});
