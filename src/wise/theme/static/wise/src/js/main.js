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

    var $fields = $(".wise-search-form-container").find("[data-fieldname]");
    var exceptVal = ["all", "none", "invert"];

    $fields.each(function(indx, elem){
        var cheks = $(elem).find(".option");
        var hasChecks = cheks.find("input[type='checkbox']").length > 0;
        if(hasChecks){
            var spAll = '<span class="option controls" style="display: inline-block;background-color: #ddd;padding: 2px ">' +
                '<a class="" data-value="all"><label>' +
                '<span class="label">All</span></label></a>';
            var spClear = '<a class="" data-value="none" ><label><span class="label">Clear all</span></label></a>';
            var invertSel = '<a class="" data-value="invert"><label><span class="label">Inverse selection</span></label></span>';

            var firstCheck = $(cheks[0]);

            // add "all" checkbox
            if(cheks.length > 4){
                var all = spAll+spClear+invertSel;
                firstCheck.parent().before(all);
                /*firstCheck.before(spAll);
                firstCheck.before(invertSel);
                firstCheck.before(spClear);*/
            }

            //tooltips
            cheks.each(function (idx, check) {
               var text = $(cheks[idx]).text();
               $(cheks[idx]).attr("title", text.trim());
            });

        }
    });

    var allch = $(".wise-search-form-container").find("[data-fieldname]");

    function filterInvalidCheckboxes(cbxs){
        return cbxs.filter(function (idx, item) {
            return exceptVal.indexOf($(item).val()) === -1;
        });
    }

    function checkboxHandlerAll(ev){
        ev.preventDefault();
        var par = $(this).parent().parent();
        var rest = filterInvalidCheckboxes($(par).find("[type='checkbox']"));

        $.each(rest, function (idx, elemt) {
            if($(rest[idx]).val() !== "all" && $(rest[idx]).val() !== "none") $(rest[idx]).prop("checked", true);
        });
    }

    function checkboxHandlerNone(ev){
        ev.preventDefault();
        $(this).prop("checked", false);
        var par = $(this).parent().parent();
        var rest = filterInvalidCheckboxes($(par).find("[type='checkbox']"));

        $.each(rest, function (idx, elemt) {
            $(rest[idx]).prop("checked", false);
            //if( $(rest[idx]).val() !== "none")
        });
    }

    function checkboxHandlerInvert(ev){
        ev.preventDefault();
        $(this).prop("checked", false);
        var par = $(this).parent().parent();
        var rest = filterInvalidCheckboxes($(par).find("[type='checkbox']"));

        var checked = rest.filter(function (ind, item) {
           return $(item).is(":checked");
        });

        var unchecked = rest.filter(function (ind, item) {
            return !$(item).is(":checked");
        });

        $.each(checked, function (idx, elemt) {
            $(checked[idx]).prop("checked", false);
        });

        $.each(unchecked, function (idx, elemt) {
            $(unchecked[idx]).prop("checked", true);
        });
    }

    $(".option.controls").on("click","a[data-value='all']", checkboxHandlerAll);
    $(".option.controls").on("click", "a[data-value='none']", checkboxHandlerNone);
    $(".option.controls").on("click", "a[data-value='invert']", checkboxHandlerInvert);

    // listener for click on the whole span
    allch.on("click", ".option", function (ev){
        var checkboxV = $(this).find("input[type='checkbox']").val();
        if( exceptVal.indexOf(checkboxV) === -1) $(ev.target).find("input[type='checkbox']").trigger('click');
    });

    $(".wise-search-form-container select").each(function (ind, selectElement) {
        $(selectElement).addClass("js-example-basic-single");
        var lessOptions = $(selectElement).find("option").length < 10;
        var options = {
            placeholder: 'Select an option',
            closeOnSelect: true,
            dropdownAutoWidth : true,
            width: '100%',
            theme: "flat"
        };
        if(lessOptions) options.minimumResultsForSearch = Infinity;

        $(selectElement).select2(options);
    });

    $(".button-field").addClass("btn");

    $("#tabs-wrapper ul li:first-child a").trigger('click');

    var prevButton = $(".center-section [name='form.buttons.prev']");

    var nextButton = $(".center-section [name='form.buttons.next']");


    $(".wise-search-form-container [name='form.buttons.prev']").hide();
    $(".wise-search-form-container [name='form.buttons.next']").hide();
    prevButton.one("click", function (){
        $(".wise-search-form-container [name='form.buttons.prev']").trigger("click");
    });
    nextButton.one("click", function(){
        $(".wise-search-form-container [name='form.buttons.next']").trigger("click");
    });


    return jQuery.noConflict();
});




