
// Collapse navigation and move search section
// when it's running out of space in the header
function autoCollapseNavigation() {
  var $header = $('#content-header');
  var $navbar = $('.navbar-nav');
  var $searchSubmitButton = $('.search-submit');

  $header.removeClass('collapse-nav');
  if ($navbar.innerHeight() > 65) {
    $header.addClass('collapse-nav');
    // Move search and login to navbar container
    $('.top-actions').prependTo('.navbar-collapse');
  } else {
    $('.top-actions').prependTo('.right-actions-section');
  }

  // sticky menu
  $(function() {
    var div = $('.collapse-nav');
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll >= 100) {
        div.addClass('sticky-header');
      } else {
        div.removeClass('sticky-header');
      }
    });
  });
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
      $this.siblings('.image-caption').css('width', $this.width());
    }
  });
}

function collapsibleContent() {
  var $readMoreBtn = $('.read-more-btn');
  if ($readMoreBtn.length > 0) {
    $readMoreBtn.each(function() {
      var $this = $(this);
      $this.closest('table').addClass('collapse-wrapper');
      $this.parent().siblings().wrapAll('<div class="collapse-content"/>');
      var collapsibleContent = $this.parent().siblings('.collapse-content');

      $('<div class="collapse-layer fadein"/>')
      .prependTo(collapsibleContent);

      $this.click(function() {
        var $btn = $(this);
        collapsibleContent.toggleClass('in')
        .find('.collapse-layer').toggleClass('fadein');

        $btn.toggleClass('arrow-up')
          .text(function(a,b) {
            return (b == "Read more" ? "Read less" : "Read more");
          });
      });
    });
  }
}

// function openSubmenuOnClick() {
//   var $submenuItem = $('#portal-globalnav a');
//   $submenuItem.each(function() {
//     var $this = $(this);
//     // if ($this.siblings().hasClass('expand-dropdown')) {
//     //   $this.find('.sm-caret').removeClass('sm-caret-up').addClass('sm-caret-down');
//     // }
//
//     $this.click(function() {
//       var $a = $(this);
//       // if (!$a.siblings().hasClass('expand-dropdown')) {
//       //   $a.find('.sm-caret').toggleClass('sm-caret-up sm-caret-down');
//       // }
//       $a.siblings('.dropdown-menu').toggle();
//     });
//   });
// }

// HOMEPAGE key messages section
function keyMessagesTabFunctionality() {
  var $tabNavItem = $('.fp-tabs li');

  $tabNavItem.click(function() {
    var $this = $(this);
    var tab_id = $this.attr('data-tab');

    $tabNavItem.removeClass('current');
    $('.fp-tab-content').removeClass('current');

    $this.addClass('current');
    $("#" + tab_id).addClass('current');
  })
}

function setKeyMessagesCardsHeight() {
  // Get the heighest div and make equal height on every cards
  var $tab = $('.fp-tab-content');
  var maxHeight = 0;

  $tab.each(function() {
    var $card = $(this).find('.tab-card-content');
    $card.each(function() {
      var $this = $(this);
      maxHeight = ($this.outerHeight() > maxHeight) ? $this.outerHeight() : maxHeight;
    });
    $card.closest('.fp-tab-card').css('height', maxHeight);
  });
}

function initKeyMessageSlider() {
  var $tabSlider = $('.fp-tab-slider');
  $tabSlider.each(function(index, element) {
    var $slider = $(this);

    $slider
      .on('init', function () {
        $('.spinner-wrapper').hide();
      })
      .slick({
        dots: true,
        speed: 300,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        lazyLoad: 'progressive',
        responsive: [
        {
          breakpoint: 1060,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 650,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        ]
      });
  });

}


$(document).ready(function() {
  var $window = $(window);
  // are dropdown, nu are default page: not clickable
  // are dropdown, are default page: clickable

  // Main navigation menu:
  // if item (folder) has not set a default page
  // prevent default link behavior on click
  $('.is-not-dp > a, #portal-globalnav>li>ul .hasDropDown').click(function(e) {
    if ($(this).siblings().hasClass('expand-dropdown')) {
      return true;
    }
    e.preventDefault();
  });

  $('#main-container').css('visibility', 'visible');

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

  if ($('.bottom-links').length > 0) {
    $('#viewlet-below-content').addClass('bottom-links-wrapper');
  }

  // setTwoRowNavigation();
  autoCollapseNavigation();
  alignNavSubmenu();
  collapsibleContent();
  // openSubmenuOnClick();

  $window.on('load', function() {
    displayImageCaption();
    initKeyMessageSlider();
    keyMessagesTabFunctionality();
    setKeyMessagesCardsHeight();
  });

  var resizeTimer;
  $window.on('resize',function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doneResizing, 100);
  });

  function doneResizing() {
    autoCollapseNavigation();
    setKeyMessagesCardsHeight();
  }
});


$(document).click(function() {
  $('.search-modal').hide();
  $('.user-actions').find('#personal-bar-container').hide();
});
