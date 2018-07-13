/* global window, document, jQuery */
if (window.matchMedia("(min-width: 800px)").matches) {
    (function($) {
        jQuery.extend(jQuery.easing, {
            'easeOutQuint': function(x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            }
        });
        $(document).ready(function() {

            var $hlSlider = $('#hlslider-slides'),
                $hlSliderCounter = $('#hlslider-counter'),
                $hlSliderPrev = $('#hlslider-prev'),
                $hlSliderNext = $('#hlslider-next'),
                $hlSliderPhotos = $('.highlight-photos').children();


            var $hlSliderPlaceholder = $('.highlight-placeholder');
            // $('#highlights-slider').prepend($hlSliderPlaceholder);

            var $hlFirstSlide = $($hlSliderPhotos[0]);

            $hlFirstSlide.css({
                'visibility': 'visible'
            }).addClass('current');
            initSlider();
            $hlSliderPlaceholder.css('opacity', '0');

            function initSlider() {
                $hlSlider.children().css({ 'display': 'block' });
                if (!$hlSlider.slick) {
                    return;
                }
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
                    if (next === 0 && current === count - 1) {
                        dir = 1;
                    }
                    if (next === count - 1 && current === 0) {
                        dir = -1;
                    }

                    var $currentImg = $($hlSliderPhotos[current]);
                    var $nextImg = $($hlSliderPhotos[next]);
                    $nextImg.show();

                    var percent = dir * 100 + '%';

                    $nextImg.css({
                        'display': 'block',
                        'transform': 'translate3d(' + percent + ', 0, 0)'
                    });

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

            }

        });

    }(jQuery))
}
