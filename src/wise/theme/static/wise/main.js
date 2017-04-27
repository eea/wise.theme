requirejs.config({
  paths: {
    'slick': ['https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min'],
    'jquery': ['https://code.jquery.com/jquery-2.2.4.min']
  }
});

require(['jquery', 'slick'], function($, slick) {

  $(document).ready(function() {

    if (window.matchMedia("(min-width: 800px)").matches) {
      $('.header-bg').slick({
        arrows: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: false
      });
    }

    $hover_trigger = $("[data-toggle=center-square]");

    $hover_trigger.on('mouseenter', function() {

      $data_target = $(this).attr('data-target');
      $target_div = $('.categories.center').find($data_target);
      $other_divs = $('.center-square');
      $other_targets = $('.square');

      if (!$(this).hasClass("gray")) {
        $other_divs.animate({
          'opacity': 'hide'
        }, 30);
        $target_div.animate({
          'opacity': 'show'
        }, 600);
      }

      $other_targets.removeClass("gray");
      $(this).addClass("gray");
    });

    $('.login i').on('click',function(){
      $(this).toggleClass('action-selected');
      $('.search i').removeClass('action-selected')
      $('.login-container ').animate({
          'height': 'toggle'
        });
       $('.search-container ').animate({
          'height': 'hide'
        });
    });

    $('.search i').on('click',function(){
      $(this).toggleClass('action-selected');
      $('.login i').removeClass('action-selected')
      $('.search-container ').animate({
          'height': 'toggle'
        });
      $('.login-container ').animate({
          'height': 'hide'
        });
    });

    $('.mobile-menu-trigger i').on('click',function(){
      $(this).toggleClass('action-selected');
      $('.navmenu-items').animate({
          'height': 'toggle'
        });
    })

  });
  return {};
});
