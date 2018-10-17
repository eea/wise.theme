/* global window, document, jQuery, setInterval, clearInterval */
(function(window, document, $){
  /* eslint-env amd, browser */

  function close_menu(container) {
    $(container).removeClass('open');

    if (window.matchMedia("(min-width: 800px)").matches) {
      $('.navmenu-items').animate({
        'opacity': 'hide'
      }, {
        duration: 80,
        complete: function() {
          $('.header-wave .menu-brand').animate({
            'opacity': 'show'
          }, 1);
          $('.menu .menu-brand').animate({
            'opacity': 'hide'
          }, 30);
          $('.menu').animate({
            'height': 'hide'
          }, 200);
        }
      });
    } else {
      $('.menu').animate({
        'height': 'hide'
      }, 200);
    }
  }

  function open_menu(container) {
    $(container).addClass('open');
    $('.menu').animate({
      'height': 'show'
    }, {
      duration: 200,
      complete: function() {
        if (window.matchMedia("(min-width: 800px)").matches) {
          $('.navmenu-items').animate({
            'opacity': 'show'
          }, 30);
          var $bgheight = $('body').height() - $('.menu > img').height();
          $('.menu-bg').height($bgheight + 3);
          $('.navmenu-items').css('display', 'flex');
          $('.header-wave .menu-brand').animate({
            'opacity': 'hide'
          }, 30);
          $('.menu .menu-brand').animate({
            'opacity': 'show'
          }, 30);
        }
      }
    });
  }

  $(document).ready(function() {
    $("#wise-search-form").append('<div id="curtain" style="position: absolute; ' +
      'width: 100%;height: 100%;background: rgba(255,255,255,0.6);top:0; left: 0; z-index: 1000"></div>');

    $("#ajax-spinner").show();

    var $menu_items = $('.menu .navmenu-item > a');

    $menu_items.each(function(_index, value) {
      var $submenu_items = $(value).parent().find('.submenu-item');

      if ($submenu_items.length === 0) {
        $(this).addClass('no-carret');
      }

    });

    var $portlet_p = $('.side-section .portlet-static-relevant-msfd-descriptors .portletItem p');
    $('#portaltab-map-viewer > a').attr('target', '_blank');

    if($portlet_p){
      $('.side-section .portlet-static-relevant-msfd-descriptors .portletItem p').each(function(item) {
        var $strong = $(item).find('strong');

        if ($strong.length > 0) {
          $(this).style.fontWeight = 'bold'
        }
      })
    }

    $('.login i').on('click', function() {
      $(this).toggleClass('action-selected');
      $('.search i').removeClass('action-selected');
      $('.login-container ').animate({
        'height': 'toggle'
      }, 200);
      $('#portal-searchbox ').animate({
        'height': 'hide'
      }, 200);
    });

    $('.search i').on('click', function() {
      $(this).toggleClass('action-selected');
      $('.login i').removeClass('action-selected');
      $('#portal-searchbox ').animate({
        'height': 'toggle'
      }, 200);
      $('.login-container ').animate({
        'height': 'hide'
      }, 200);
    });

    if (window.matchMedia("(max-width: 800px)").matches) {
      var $mobile_submenu_trigger = $('<span/>', {
        'class': 'mobile_submenu_trigger fa fa-caret-right pull-right'
      });
      if ($('.navmenu-item .submenu .submenu-item').length > 0) {
        $('.navmenu-item .submenu .submenu-item').parent().parent().prepend($mobile_submenu_trigger)
      }
      $('body').on('click', '.mobile_submenu_trigger', function() {
        $(this).toggleClass('rotate');
        $(this).parent().find('.submenu').animate({
          'height': 'toggle'
        }, 200);
      });
    }

    $('.menu-label').click(function() {
      $('.mobile-menu-trigger i').click();
    });

    $('.mobile-menu-trigger i').on('click', function() {
      if (!$(this).hasClass('open')) {
        open_menu(this);
      } else {
        close_menu(this);
      }
    });

    $(".center-section").prepend('<button class="btn btn-primary pull-right toggle-sidebar">Search filters</button>');
    $('.side-section').prepend('<button class="btn btn-danger close-sidebar">Close</button>');

    $('.toggle-sidebar').on('click', function() {
      $('.side-section').addClass('show-sidebar');
    });
    $('.close-sidebar').on('click', function() {
      $('.side-section').removeClass('show-sidebar');
    });

    setTimeout(function () {
      $("#ajax-spinner").hide("slow");
      $(".wise-search-form-container,#wise-search-form").fadeIn("slow");
      $("#wise-search-form #curtain").remove();
      $("#ajax-spinner").hide();
    } ,1000);

  });

}(window, document, jQuery));
