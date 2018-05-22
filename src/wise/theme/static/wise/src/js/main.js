requirejs.config({
    paths: {
        'slick': ['https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min'],
        'jquery': ['https://code.jquery.com/jquery-2.2.4.min']
    }

});

require(['jquery', 'slick'], function($, slick) {

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


    };

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
            }
        });
    }


    $(document).ready(function() {

        var $menu_items = $('.menu .navmenu-item > a');

        $menu_items.each(function(index, value) {
            var $submenu_items = $(this).parent().find('.submenu-item');

            if ($submenu_items.length === 0)
                $(this).addClass('no-carret');

        });

        var $portlet_p = $('.side-section .portlet-static-relevant-msfd-descriptors .portletItem p');
        if($portlet_p){
            $('.side-section .portlet-static-relevant-msfd-descriptors .portletItem p').each(function(item) {
                var $strong = $(this).find('strong');

                if ($strong.length > 0) {
                    $(this).style.fontWeight = 'bold'
                }

            })
        }

        if (window.matchMedia("(min-width: 800px)").matches) {
            (function() {
                jQuery.extend(jQuery.easing, {
                    'easeOutQuint': function(x, t, b, c, d) {
                        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                    }
                });

                var $hlSlider = $('#hlslider-slides'),
                    $hlSliderCounter = $('#hlslider-counter'),
                    $hlSliderPrev = $('#hlslider-prev'),
                    $hlSliderNext = $('#hlslider-next'),
                    $hlSliderPhotos = $('.highlight-photos').children();


                $(document).ready(function() {
                    var $hlSliderPlaceholder = $('.highlight-placeholder');
                    // $('#highlights-slider').prepend($hlSliderPlaceholder);

                    var $hlFirstSlide = $($hlSliderPhotos[0]);

                    $hlFirstSlide.css({
                        'visibility': 'visible'
                    }).addClass('current');
                    initSlider();
                    $hlSliderPlaceholder.css('opacity', '0');
                });

                function initSlider() {
                    $hlSlider.children().css({ 'display': 'block' });
                    $hlSlider.slick({
                        autoplay: true,
                        autoplaySpeed: 6000,
                        speed: 1000,
                        easing: 'easeOutQuint',
                        adaptiveHeight: false,
                        nextArrow: '',
                        prevArrow: '',
                        useCSS: false
                    });

                    var updateBackgroundPhoto = function(current, next, count) {

                        var dir = next - current;
                        if (next == 0 && current == count - 1) {
                            dir = 1;
                        }
                        if (next == count - 1 && current == 0) {
                            dir = -1;
                        }

                        $currentImg = $($hlSliderPhotos[current]);
                        $nextImg = $($hlSliderPhotos[next]);
                        $nextImg.show();

                        var percent = dir * 100 + '%';

                        $nextImg.css({
                            'display': 'block',
                            'transform': 'translate3d(' + percent + ', 0, 0)'
                        })

                        $({ 'percent': dir * 100 }).animate({
                            'percent': 0
                        }, {
                            duration: 1000,
                            easing: 'easeOutQuint',
                            step: function(now) {
                                $nextImg.css({
                                    'transform': 'translate3d(' + now + '%, 0, 0)'
                                });
                            },
                            done: function() {
                                $currentImg.removeClass('current').hide();
                                $nextImg.addClass('current');
                            }
                        });
                    };

                    var i;

                    $hlSlider.on('beforeChange', function(e, slick, currentSlide, nextSlide) {
                        i = (nextSlide ? nextSlide : 0) + 1;
                        $hlSliderCounter.text(i + '/' + slick.slideCount);

                        updateBackgroundPhoto(currentSlide, nextSlide, slick.slideCount);
                    });

                    $hlSliderNext.click(function() { $hlSlider.slick('slickNext'); });
                    $hlSliderPrev.click(function() { $hlSlider.slick('slickPrev'); });

                };

            }())
        };

        $('.login i').on('click', function() {
            debugger;
            $(this).toggleClass('action-selected');
            $('.search i').removeClass('action-selected')
            $('.login-container ').animate({
                'height': 'toggle'
            }, 200);
            $('#portal-searchbox ').animate({
                'height': 'hide'
            }, 200);
        });

        $('.search i').on('click', function() {
            $(this).toggleClass('action-selected');
            $('.login i').removeClass('action-selected')
            $('#portal-searchbox ').animate({
                'height': 'toggle'
            }, 200);
            $('.login-container ').animate({
                'height': 'hide'
            }, 200);
        });

        if (window.matchMedia("(max-width: 800px)").matches) {
            var $mobile_submenu_trigger = $('<span/>', {
                'class': 'mobile_submenu_trigger fa fa-caret-right pull-right',
            })
            if ($('.navmenu-item .submenu .submenu-item').length > 0) {
                $('.navmenu-item .submenu .submenu-item').parent().parent().prepend($mobile_submenu_trigger)
            }
            $('body').on('click', '.mobile_submenu_trigger', function() {
                $(this).toggleClass('rotate');
                $(this).parent().find('.submenu').animate({
                    'height': 'toggle'
                }, 200);
            })

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

        $(".center-section").prepend('<button class="btn btn-primary pull-right toggle-sidebar">Open sidebar</button>');
        $('.side-section').prepend('<button class="btn btn-danger close-sidebar">Close</button>');

        $('.toggle-sidebar').on('click', function() {
            $('.side-section').addClass('show-sidebar');
        });
        $('.close-sidebar').on('click', function() {
            $('.side-section').removeClass('show-sidebar');
        });

        // };
    });

    var $fields = $("#wise-search-form").find("[data-fieldname]");

    $fields.each(function(indx, elem){
        var cheks = $(elem).find("[type='checkbox']");
        var hasChecks = cheks.length > 0;
        if(hasChecks){
            var sp = '<span class="option"><input class="checkbox-widget required list-field" value="all" type="checkbox"><label for="form-widgets-member_states-0"><span class="label">All</span></label></span>';
            var par = $(cheks[0]).parent().parent();
            par.prepend(sp);

            var notchecked = cheks.filter(function(item){
                return !$(cheks[item]).is(":checked");
            });
            if(notchecked.length === 0){
                $(elem).find("input[value='all']").prop("checked", true);
            }
        }
    });

    var allch = $("#wise-search-form").find("[data-fieldname]");
    function checkboxHandler(){
        var par = $(this).parent().parent();
        var rest = $(par).find("[type='checkbox']");
        rest = rest.filter(function (item) {
            return $(this) !== $(item);
        });
        if($(this).is(":checked")){
            $(this).prop("checked", false);
        } else {
            $(this).prop("checked", true);
        }
        $.each(rest, function (idx, elemt) {
            $(rest[idx]).prop("checked", !$(this).is(":checked"));
        });

    }
    allch.on("change","input[value='all']", checkboxHandler);

    $("#wise-search-form select").each(function (ind, selectElement) {
        $(selectElement).addClass("js-example-basic-single");
        var lessOptions = $(selectElement).find("option").length < 10;
        var options = {
            placeholder: 'Select an option',
            closeOnSelect: true,
            theme: "flat"
        };
        if(lessOptions) options.minimumResultsForSearch = Infinity;

        $(selectElement).select2(options);
    });

    $("#wise-search-form .button-field").addClass("btn");

    return $.noConflict();
});


