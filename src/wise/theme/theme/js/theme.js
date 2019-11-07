
// Collapse navigation and move search section
// when it's running out of space in the header
function autoCollapseNavigation() {
  var $header = $('#content-header');
  var $navbar = $('.navbar-nav');
  var $searchSubmitButton = $('.search-submit');

  $header.removeClass('collapse-nav');
  if ($navbar.innerHeight() > 90) {
    $header.addClass('collapse-nav');
    // Move search and login to navbar container
    $('.top-actions').prependTo('.navbar-collapse');
  } else {
    $('.top-actions').appendTo('.right-actions-section');
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

function setTwoRowNavigation() {
  var $nav = $('#portal-globalnav>li>a');
  $nav.each(function(i, v) {
    var words = $(this).text();
    var wordsCount = words.split(' ').length;
    $(v).contents().eq(0).wrap('<span class="nav-text"/>');
    if (wordsCount > 2) {
      var txt = $(this).find('.nav-text');
      var html = txt.html().split(" ");
      html = html.slice(0,2).join(" ") + "<br>" + " " + html.slice(2).join(" ");
      txt.html(html);
    }
  });
}


function displayImageCaption() {
  var $img = $('#content-core p').find('img');
  $img.each(function() {
    var $this = $(this);
    var imgWithSource = !$this.attr('title').match( /png|jpg/g );
    var imgClass = $this.attr('class');

    if (imgWithSource) {
      $this.wrap('<div class="image-wrapper" />');
      $this.after('<p class="image-caption">' + $(this).attr('title') + '</p>');
      $this.parent('.image-wrapper').addClass(imgClass);
    }
  });
}


$(document).ready(function() {

  // Top search modal
  $('.search-icon').click(function(e) {
    $('.search-modal').fadeToggle('fast');
     e.stopPropagation();
  });

  $('.search-modal').click(function(e) {
    e.stopPropagation();
  });

  $('.user-icon').click(function(e) {
    $(this).siblings('#personal-bar-container').fadeToggle('fast');
     e.stopPropagation();
  });

  setTwoRowNavigation();
  autoCollapseNavigation();
  alignNavSubmenu();
  displayImageCaption();

  var resizeTimer;
  $(window).on('resize',function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doneResizing, 100);
  });

  function doneResizing() {
    autoCollapseNavigation();
  }

});


$(document).click(function() {
  $('.search-modal').hide();
  $('.user-actions').find('#personal-bar-container').hide();
});
