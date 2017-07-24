requirejs.config({
    paths: {
        'slick': ['https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min'],
        'jquery': ['https://code.jquery.com/jquery-2.2.4.min']
    }
});
require(['jquery', 'slick'], function($, slick) {
    function close_menu(container) {
        $(container).removeClass('open');
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
    };

    function open_menu(container) {
        $(container).addClass('open');
        $('.menu').animate({
            'height': 'show'
        }, {
            duration: 200,
            complete: function() {
                $('.navmenu-items').animate({
                    'opacity': 'show'
                }, 30);
                $bgheight = $('body').height() - $('.menu > img').height()
                $('.menu-bg').height($bgheight + 3);
                $('.navmenu-items').css('display', 'flex');
                $('.header-wave .menu-brand').animate({
                    'opacity': 'hide'
                }, 30);
                $('.menu .menu-brand').animate({
                    'opacity': 'show'
                }, 30);
            }
        });
    }
    $(document).ready(function() {
        if (window.matchMedia("(min-width: 800px)").matches) {
            $('.homepage .header-bg').slick({
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
        $('.login i').on('click', function() {
            $(this).toggleClass('action-selected');
            $('.search i').removeClass('action-selected')
            $('.login-container ').animate({
                'height': 'toggle'
            });
            $('.search-container ').animate({
                'height': 'hide'
            });
        });
        $('.search i').on('click', function() {
            $(this).toggleClass('action-selected');
            $('.login i').removeClass('action-selected')
            $('.search-container ').animate({
                'height': 'toggle'
            });
            $('.login-container ').animate({
                'height': 'hide'
            });
        });
        if (window.matchMedia("(max-width: 800px)").matches) {
            $('.mobile-menu-trigger i').on('click', function() {
                $(this).toggleClass('action-selected');
                $('.navmenu-items').animate({
                    'height': 'toggle'
                });
            })
        }
        if (window.matchMedia("(min-width: 800px)").matches) {
            $('.menu-label').click(function() {
                $('.mobile-menu-trigger i').click();
            })
            $('.mobile-menu-trigger i').on('click', function() {
                if (!$(this).hasClass('open')) {
                    open_menu(this);
                } else {
                    close_menu(this);
                }
            })
        }
        $('.toggle-sidebar').on('click', function() {
            $('.side-section').addClass('show-sidebar');
        })
        $('.close-sidebar').on('click', function() {
            $('.side-section').removeClass('show-sidebar');
        })
    });
    return {};
});
