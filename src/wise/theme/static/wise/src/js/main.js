(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return $('<button type="button" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                focusOnChange: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: false,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                swiping: false,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);

        }

        return Slick;

    }());

    Slick.prototype.activateADA = function() {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.getNavTarget = function() {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if ( asNavFor && asNavFor !== null ) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;

    };

    Slick.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if(!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        _.autoPlayClear();

        if ( _.slideCount > _.options.slidesToShow ) {
            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if ( !_.paused && !_.interrupted && !_.focussed ) {

            if ( _.options.infinite === false ) {

                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
                    _.direction = 0;
                }

                else if ( _.direction === 0 ) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if ( _.currentSlide - 1 === 0 ) {
                        _.direction = 1;
                    }

                }

            }

            _.slideHandler( slideTo );

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true ) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if( _.slideCount > _.options.slidesToShow ) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function() {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if(_.options.rows > 0) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for(a = 0; a < numOfSlides; a++){
                var slide = document.createElement('div');
                for(b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for(c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width':(100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if ( _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots)
                .off('click.slick', _.changeSlide)
                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

            if (_.options.accessibility === true) {
                _.$dots.off('keydown.slick', _.keyHandler);
            }
        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
                _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
            }
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.cleanUpSlideEvents = function() {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

    };

    Slick.prototype.cleanUpRows = function() {

        var _ = this, originalSlides;

        if(_.options.rows > 0) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }
        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function(){
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.focusHandler = function() {

        var _ = this;

        _.$slider
            .off('focus.slick blur.slick')
            .on('focus.slick blur.slick', '*', function(event) {

                event.stopImmediatePropagation();
                var $sf = $(this);

                setTimeout(function() {

                    if( _.options.pauseOnFocus ) {
                        _.focussed = $sf.is(':focus');
                        _.autoPlay();
                    }

                }, 0);

            });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            if (_.slideCount <= _.options.slidesToShow) {
                ++pagerQty;
            } else {
                while (breakPoint < _.slideCount) {
                    ++pagerQty;
                    breakPoint = counter + _.options.slidesToScroll;
                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
                }
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if(!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        }else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide,
            coef;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                coef = -1

                if (_.options.vertical === true && _.options.centerMode === true) {
                    if (_.options.slidesToShow === 2) {
                        coef = -1.5;
                    } else if (_.options.slidesToShow === 1) {
                        coef = -2
                    }
                }
                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
        } else if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft =  0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft =  0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function() {

        return this;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if ( _.options.autoplay ) {

            _.paused = false;
            _.autoPlay();

        }

    };

    Slick.prototype.initADA = function() {
        var _ = this,
            numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
            tabControlIndexes = _.getNavigableIndexes().filter(function(val) {
                return (val >= 0) && (val < _.slideCount);
            });

        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        if (_.$dots !== null) {
            _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
                var slideControlIndex = tabControlIndexes.indexOf(i);

                $(this).attr({
                    'role': 'tabpanel',
                    'id': 'slick-slide' + _.instanceUid + i,
                    'tabindex': -1
                });

                if (slideControlIndex !== -1) {
                    var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex
                    if ($('#' + ariaButtonControl).length) {
                        $(this).attr({
                            'aria-describedby': ariaButtonControl
                        });
                    }
                }
            });

            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
                var mappedSlideIndex = tabControlIndexes[i];

                $(this).attr({
                    'role': 'presentation'
                });

                $(this).find('button').first().attr({
                    'role': 'tab',
                    'id': 'slick-slide-control' + _.instanceUid + i,
                    'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
                    'aria-label': (i + 1) + ' of ' + numDotGroups,
                    'aria-selected': null,
                    'tabindex': '-1'
                });

            }).eq(_.currentSlide).find('button').attr({
                'aria-selected': 'true',
                'tabindex': '0'
            }).end();
        }

        for (var i=_.currentSlide, max=i+_.options.slidesToShow; i < max; i++) {
            if (_.options.focusOnChange) {
                _.$slides.eq(i).attr({'tabindex': '0'});
            } else {
                _.$slides.eq(i).removeAttr('tabindex');
            }
        }

        _.activateADA();

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
                .off('click.slick')
                .on('click.slick', {
                    message: 'previous'
                }, _.changeSlide);
            _.$nextArrow
                .off('click.slick')
                .on('click.slick', {
                    message: 'next'
                }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow.on('keydown.slick', _.keyHandler);
                _.$nextArrow.on('keydown.slick', _.keyHandler);
            }
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$dots.on('keydown.slick', _.keyHandler);
            }
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {

            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initSlideEvents = function() {

        var _ = this;

        if ( _.options.pauseOnHover ) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(_.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;
        //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' :  'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageSrcSet = $(this).attr('data-srcset'),
                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {

                    image
                        .animate({ opacity: 0 }, 100, function() {

                            if (imageSrcSet) {
                                image
                                    .attr('srcset', imageSrcSet );

                                if (imageSizes) {
                                    image
                                        .attr('sizes', imageSizes );
                                }
                            }

                            image
                                .attr('src', imageSource)
                                .animate({ opacity: 1 }, 200, function() {
                                    image
                                        .removeAttr('data-lazy data-srcset data-sizes')
                                        .removeClass('slick-loading');
                                });
                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                        });

                };

                imageToLoad.onerror = function() {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                };

                imageToLoad.src = imageSource;

            });

        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

        if (_.options.lazyLoad === 'anticipated') {
            var prevSlide = rangeStart - 1,
                nextSlide = rangeEnd,
                $slides = _.$slider.find('.slick-slide');

            for (var i = 0; i < _.options.slidesToScroll; i++) {
                if (prevSlide < 0) prevSlide = _.slideCount - 1;
                loadRange = loadRange.add($slides.eq(prevSlide));
                loadRange = loadRange.add($slides.eq(nextSlide));
                prevSlide--;
                nextSlide++;
            }
        }

        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function() {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        if( !_.unslicked ) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            if (_.slideCount > _.options.slidesToShow) {
                _.setPosition();
            }

            _.swipeLeft = null;

            if ( _.options.autoplay ) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();

                if (_.options.focusOnChange) {
                    var $currentSlide = $(_.$slides.get(_.currentSlide));
                    $currentSlide.attr('tabindex', 0).focus();
                }
            }

        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function(event) {

        event.preventDefault();

    };

    Slick.prototype.progressiveLazyLoad = function( tryCount ) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
            image,
            imageSource,
            imageSrcSet,
            imageSizes,
            imageToLoad;

        if ( $imgsToLoad.length ) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageSrcSet = image.attr('data-srcset');
            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function() {

                if (imageSrcSet) {
                    image
                        .attr('srcset', imageSrcSet );

                    if (imageSizes) {
                        image
                            .attr('sizes', imageSizes );
                    }
                }

                image
                    .attr( 'src', imageSource )
                    .removeAttr('data-lazy data-srcset data-sizes')
                    .removeClass('slick-loading');

                if ( _.options.adaptiveHeight === true ) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
                _.progressiveLazyLoad();

            };

            imageToLoad.onerror = function() {

                if ( tryCount < 3 ) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout( function() {
                        _.progressiveLazyLoad( tryCount + 1 );
                    }, 500 );

                } else {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                    _.progressiveLazyLoad();

                }

            };

            imageToLoad.src = imageSource;

        } else {

            _.$slider.trigger('allImagesLoaded', [ _ ]);

        }

    };

    Slick.prototype.refresh = function( initializing ) {

        var _ = this, currentSlide, lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if ( _.slideCount <= _.options.slidesToShow ) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function() {

        var _ = this, breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

            _.respondTo = _.options.respondTo || 'window';

            for ( breakpoint in responsiveSettings ) {

                l = _.breakpoints.length-1;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {
                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while( l >= 0 ) {
                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                            _.breakpoints.splice(l,1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return ( _.options.mobileFirst ) ? a-b : b-a;
            });

        }

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);

    };

    Slick.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if( !_.unslicked ) { _.setPosition(); }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption =
        Slick.prototype.slickSetOption = function() {

            /**
             * accepts arguments in format of:
             *
             *  - for changing a single option's value:
             *     .slick("setOption", option, value, refresh )
             *
             *  - for changing a set of responsive options:
             *     .slick("setOption", 'responsive', [{}, ...], refresh )
             *
             *  - for updating multiple values at once (not responsive)
             *     .slick("setOption", { 'option': value, ... }, refresh )
             */

            var _ = this, l, item, option, value, refresh = false, type;

            if( $.type( arguments[0] ) === 'object' ) {

                option =  arguments[0];
                refresh = arguments[1];
                type = 'multiple';

            } else if ( $.type( arguments[0] ) === 'string' ) {

                option =  arguments[0];
                value = arguments[1];
                refresh = arguments[2];

                if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

                    type = 'responsive';

                } else if ( typeof arguments[1] !== 'undefined' ) {

                    type = 'single';

                }

            }

            if ( type === 'single' ) {

                _.options[option] = value;


            } else if ( type === 'multiple' ) {

                $.each( option , function( opt, val ) {

                    _.options[opt] = val;

                });


            } else if ( type === 'responsive' ) {

                for ( item in value ) {

                    if( $.type( _.options.responsive ) !== 'array' ) {

                        _.options.responsive = [ value[item] ];

                    } else {

                        l = _.options.responsive.length-1;

                        // loop through the responsive object and splice out duplicates.
                        while( l >= 0 ) {

                            if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

                                _.options.responsive.splice(l,1);

                            }

                            l--;

                        }

                        _.options.responsive.push( value[item] );

                    }

                }

            }

            if ( refresh ) {

                _.unload();
                _.reinit();

            }

        };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if ( _.options.fade ) {
            if ( typeof _.options.zIndex === 'number' ) {
                if( _.options.zIndex < 3 ) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
                    _.$slides
                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                    infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount  + _.slideCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.interrupt = function( toggle ) {

        var _ = this;

        if( !toggle ) {
            _.autoPlay();
        }
        _.interrupted = toggle;

    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.slideHandler(index, false, true);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this, navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if ( _.options.autoplay ) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if ( _.options.asNavFor ) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
                navTarget.setSlideClasses(_.currentSlide);
            }

        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.swiping = false;

        if (_.scrolling) {
            _.scrolling = false;
            return false;
        }

        _.interrupted = false;
        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

        if ( _.touchObject.curX === undefined ) {
            return false;
        }

        if ( _.touchObject.edgeHit === true ) {
            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
        }

        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

            direction = _.swipeDirection();

            switch ( direction ) {

                case 'left':
                case 'down':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
                            _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
                            _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:


            }

            if( direction != 'vertical' ) {

                _.slideHandler( slideCount );
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction ]);

            }

        } else {

            if ( _.touchObject.startX !== _.touchObject.curX ) {

                _.slideHandler( _.currentSlide );
                _.touchObject = {};

            }

        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        verticalSwipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
            _.scrolling = true;
            return false;
        }

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = verticalSwipeLength;
        }

        swipeDirection = _.swipeDirection();

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            _.swiping = true;
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    Slick.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if ( _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite ) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                .removeClass('slick-active')
                .end();

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active');

        }

    };

    Slick.prototype.visibility = function() {

        var _ = this;

        if ( _.options.autoplay ) {

            if ( document[_.hidden] ) {

                _.interrupted = true;

            } else {

                _.interrupted = false;

            }

        }

    };

    $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}(jQuery));






/* global window, document, jQuery, setInterval, clearInterval */
(function(window, document, $){
    /* eslint-env amd, browser */

        // jQuery(document).ready(function($) {
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

                }())
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

            $(".center-section").prepend('<button class="btn btn-primary pull-right toggle-sidebar">Open sidebar</button>');
            $('.side-section').prepend('<button class="btn btn-danger close-sidebar">Close</button>');

            $('.toggle-sidebar').on('click', function() {
                $('.side-section').addClass('show-sidebar');
            });
            $('.close-sidebar').on('click', function() {
                $('.side-section').removeClass('show-sidebar');
            });

            // };

            setTimeout(function () {
                $("#ajax-spinner").hide("slow");
                $(".wise-search-form-container,#wise-search-form").fadeIn("slow");
                $("#wise-search-form #curtain").remove();
                $("#ajax-spinner").hide();
            } ,1000);


        });

        /*
           * ****************************************************
           * Page elements init
           * ****************************************************
           * */

        var exceptVal = ["all", "none", "invert", "apply"];

        /*
        * Vars and $ plugins
        *
        * */
        $.randomString = function() {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 8;
            var randomstring = '';
            for (var i=0; i<string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            return randomstring;
        };

        $.getMultipartData = function(frmName){
            //Start multipart formatting
            var initBoundary= $.randomString();
            var strBoundary = "--" + initBoundary;
            var strMultipartBody = "";
            var strCRLF = "\r\n";

            var iname = $(frmName).attr('id');

            var formData = $(frmName).serializeArray();
            //Create multipart for each element of the form

            if(formData.length === 0){
                return false;
            }

            $.each( formData ,function(indx, val){
                strMultipartBody +=
                    strBoundary
                    + strCRLF
                    + "Content-Disposition: form-data; name=\"" + val.name + "\""
                    + strCRLF
                    + strCRLF
                    + val.value
                    +strCRLF;
            });

            //End the body by delimiting it

            strMultipartBody += strBoundary + "--" + strCRLF;

            //Return boundary without -- and the multipart content
            return [initBoundary,strMultipartBody];

        };

        var loading = false;

        $("body").append( $("#ajax-spinner").clone(true).attr("id", "ajax-spinner2") );
        $("#ajax-spinner").remove();

        function initPageElems(){
            /*
            * Styling and hiding
            *
             */
            function initStyling(){
                $(".button-field").addClass("btn");
                $(".wise-search-form-container #s2id_form-widgets-marine_unit_id").parentsUntil(".field").parent().hide();

                $("#form-buttons-continue").hide("fast");

                var dBtn = $("#form-buttons-download").prop('outerHTML').replace("input","button")
                    + ' <span style="margin-left:0.4rem;">Download as XLS</span>';
                var btnForm = $("#form-buttons-download").parent();

                $("#form-buttons-download").remove();

                btnForm.append( $(dBtn) );
                $("#form-buttons-download").val("&#xf019; Download as XLS");
                $("#form-buttons-download").addClass("fa").addClass("fa-download");
            }

            // move marine unit id below form title and pagination as seen on the
            // other article tabs
            var pagination = $('.prev-next-row').eq(0);
            if (pagination.length) {
                $("#marine-widget-top").detach().insertBefore(pagination);
            }

            function generateCheckboxes($fields){
                var count = $fields.length;
                $fields.each(function(indx, field){
                    var $field = $(field);
                    var cheks = $field.find(".option");
                    var hasChecks = cheks.find("input[type='checkbox']").length > 0;

                    // has checkboxes
                    if(hasChecks){
                        var fieldId = $field.attr("id");
                        var spAll = '<span class="controls" style="display: inline-block;background-color: #ddd;padding-top: 2px;padding-bottom: 2px;' +
                            'padding-left: 0;position: relative;  ">' +
                            '<span style="font-size: 0.8em; margin-left: 5px;">Select :</span><a class="" data-value="all"><label>' +
                            '<span class="label">All</span></label></a>';
                        var spClear = '<a class="" data-value="none" ><label><span class="label">Clear all</span></label></a>';
                        var invertSel = '<a class="" data-value="invert"><label><span class="label">Invert selection</span></label></a>' +
                            '<div class="btn btn-default apply-filters" data-value="apply"><span class="" >Apply filters</span></div>'+
                            '<span class="ui-autocomplete">' +
                            '<span class=" search-icon" ></span>' +
                            '<span style="position: relative;padding-top:1px;padding-bottom:1px;background: white;" class="search-span">' +
                            '<input class="ui-autocomplete-input" type="text" style="width: 80%;" />' +
                            '<span class="clear-btn"><a class="fa fa-times"></a></span>' +
                            '</span>' +
                            '</span>';


                        // each checkbox does auto submit
                        $("#" + fieldId).on("click", ".option", function () {
                            $("#ajax-spinner2").hide();
                            if( window.WISE.blocks.indexOf( $(this).parentsUntil(".field").parent().attr("id") ) !== -1  ){
                                //return false;
                            } else {
                                //TODO : check if apply-filters shown
                                setTimeout( function() {
                                    $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click")
                                }, 300);
                            }

                        });

                        // add "controls"
                        var all = spAll + spClear + invertSel;
                        $field.find("> label.horizontal").after(all);

                        //tooltips
                        cheks.each(function (idx) {
                            var text = $(cheks[idx]).text();
                            $(cheks[idx]).attr("title", text.trim());
                        });

                        if(cheks.length < 4) {
                            $field.find(".controls a").hide();
                            $field.find(".controls").html("").css("height" ,"1px").css("padding", 0);

                        } else {
                            $field.addClass("panel-group");

                            var chekspan = $field.find("> span:not(.controls)");
                            chekspan.css("border-radius", 0);
                            chekspan.addClass( fieldId + "-collapse");
                            chekspan.addClass("collapse");
                            var checked = filterInvalidCheckboxes($field.find(".option input[type='checkbox']:checked"));

                            chekspan.addClass("panel");
                            chekspan.addClass("panel-default");

                            var label = $field.find(".horizontal");

                            var alabel = "<a data-toggle='collapse' class='accordion-toggle' >" + label.text() + "</a>";
                            label.html(alabel);

                            label.addClass("panel-heading").addClass("panel-title");

                            label.attr("data-toggle", "collapse");
                            label.attr("data-target", "." + fieldId + "-collapse" );

                            // if already checked than collapse
                            //if(checked.length === 0) {
                            chekspan.collapse({
                                toggle: true
                            });
                            chekspan.collapse({
                                toggle: true
                            });
                            $field.find(".accordion-toggle").addClass("accordion-after");
                            //} else {
                            /*$(field).find(".controls").slideUp("fast");
                            chekspan.collapse({
                                toggle: false
                            });*/
                            //}

                            chekspan.on("hidden.bs.collapse", function () {
                                chekspan.fadeOut("fast");
                                $field.find(".controls").slideUp("fast");
                                $field.css({"border-bottom" : "1px solid #ccc;"});

                            });

                            chekspan.on("show.bs.collapse", function () {
                                // collapsed
                                chekspan.fadeIn("fast");
                                $field.find(".controls").slideDown("fast");
                                $field.find("> span").css({"display" : "block"});

                                $field.find(".accordion-toggle").addClass("accordion-after");

                            });

                            chekspan.on("hide.bs.collapse", function () {
                                // not collapsed
                                setTimeout( function (){
                                    $field.find(".accordion-toggle").removeClass("accordion-after");
                                },600);
                            });

                            // initialize autocomplete for more than 6 checkboxes
                            if(cheks.length < 6) {
                                $field.find(".controls .ui-autocomplete").hide();
                            } else {

                                // 96264 save checked items when having search input in case the user
                                // goes back on the search
                                chekspan.append("<span class='noresults hidden'>No results found</span>");
                                chekspan.data('checked_items', []);
                                var data = chekspan.data('checked_items');
                                $.each($field.find('input:checked'), function(idx, el){
                                    data.push(el.id);
                                });
                                $field.find(".ui-autocomplete-input").autocomplete({
                                    minLength: 0,
                                    source: [],
                                    search: function( event ) {
                                        var cheks2 = $field.find(".option .label:not(.horizontal) ");
                                        var labels = cheks2.parentsUntil(".option").parent();
                                        var inputs = labels.find('input');
                                        var options = labels.parent();
                                        var no_results = options.find(".noresults");
                                        if( $(event.target).val() === "" ){
                                            no_results.addClass('hidden');
                                            labels.removeClass('hidden');
                                            var data = $field.find('.panel').data('checked_items');
                                            if (data) {
                                                $.each(inputs, function (idx, el) {
                                                    // 96264 in case we have an empty searchfield checked items
                                                    // saved in previous query
                                                    el.checked = data.indexOf(el.id) !== -1;
                                                });
                                            }
                                            return true;
                                        }
                                        labels.removeClass('hidden');

                                        var toSearch = $(event.target).val().toLowerCase()
                                        /*.replace(/^\s+|\s+$/g, '_')*/
                                        /*.replace(/_/g, "")*/
                                            .replace(/\s/g, "_");

                                        var matcher = new RegExp( "^" +  $.ui.autocomplete.escapeRegex( toSearch ), "i" );
                                        var matcher2 = new RegExp( $.ui.autocomplete.escapeRegex( toSearch ), "i" );

                                        var temp = {};
                                        var checksLabels = $field.find(".option .label:not(.horizontal) ").map(function (ind, item) {
                                            temp[$(item).text().toLowerCase()] = $(item).text().toLowerCase()
                                                .replace(/\s/g, "_");
                                            //return temp;
                                            return $(item).text().toLowerCase()
                                            /*.replace(/^\s+|\s+$/g, '')*/
                                            /*.replace(/_/g, "")*/
                                                .replace(/\s/g, "_");
                                        });

                                        var found = [];
                                        $.each(temp, function (indx, item) {
                                            if(!matcher2.test( item )){
                                                found.push(indx);
                                            }
                                        });

                                        var tohide = cheks2.filter(function (idx, elem) {
                                            return found.indexOf( $(elem).text().toLowerCase()) !== -1;
                                        });

                                        var toshow =  cheks2.filter(function (idx, elem) {
                                            return found.indexOf( $(elem).text().toLowerCase()) === -1;
                                        });
                                        $.each(toshow, function (ind, item) {
                                            $(item).parentsUntil(".option").parent().find("[type='checkbox']").prop("checked", true);
                                        });

                                        $.each(tohide, function (inx, item) {
                                            $(item).parentsUntil(".option").parent().find("[type='checkbox']").prop("checked", false);
                                            $(item).parentsUntil(".option").parent().find("input[type='checkbox']").prop("checked", false);
                                            $(item).parentsUntil(".option").parent().find("input[type='checkbox']").removeAttr('checked');
                                            $(item).parentsUntil(".option").parent().addClass('hidden');
                                        });

                                        if(tohide.length === cheks2.length) {
                                            no_results.removeClass('hidden');
                                        }
                                        else {
                                            no_results.addClass('hidden');
                                        }

                                    },
                                    create: function (){
                                        var that = this;

                                        var removeBtn = $(this).parentsUntil(".ui-autocomplete").find(".clear-btn ");

                                        removeBtn.on("click", null ,  that, function (ev) {
                                            $(this).parentsUntil(".controls").find("input").val("");
                                            $(this).parentsUntil(".controls").find("input").trigger("change");
                                            $(ev.data).autocomplete("search","undefined");

                                            //console.log();
                                        });
                                    }
                                });
                            }

                            /*$(field).find(".ui-autocomplete-input").on("focusin" , function (ev) {
                                //$(ev.target).parent().find(".glyphicon").css("background", "#ffffe0");
                            });

                            $(field).find(".ui-autocomplete-input").on("focusout" , function (ev) {
                                //$(ev.target).parent().find(".glyphicon").css("background", "white");
                            });*/
                            $field.find(".search-icon").on("click" , function (ev) {
                                $(ev.target).parent().find("input").trigger("focus");
                            });
                        }
                    }
                    if (!--count) $(".wise-search-form-container, #wise-search-form").animate({"opacity" : 1}, 1000);

                });
            }

            function addCheckboxHandlers(){
                function checkboxHandlerAll(ev){
                    ev.preventDefault();

                    var par = $(this).parent().parent();

                    window.WISE.blocks.push( $(this).parentsUntil(".field").parent().attr("id") );

                    par.find(".apply-filters").show();
                    var rest = filterInvalidCheckboxes($(par).find("[type='checkbox']"));

                    $.each(rest, function (idx) {
                        if($(rest[idx]).val() !== "all" && $(rest[idx]).val() !== "none") $(rest[idx]).prop("checked", true);
                    });



                    //$(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
                }

                function checkboxHandlerNone(ev){
                    ev.preventDefault();

                    $(this).prop("checked", false);
                    var par = $(this).parent().parent();
                    par.find(".apply-filters").show();
                    var rest = filterInvalidCheckboxes($(par).find("[type='checkbox']"));

                    window.WISE.blocks.push( $(this).parentsUntil(".field").parent().attr("id") );

                    $.each(rest, function (idx) {
                        $(rest[idx]).prop("checked", false);
                        //if( $(rest[idx]).val() !== "none")
                    });

                    //$(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
                }

                function checkboxHandlerInvert(ev){
                    ev.preventDefault();
                    $(this).prop("checked", false);

                    var par = $(this).parent().parent();
                    par.find(".apply-filters").show();

                    window.WISE.blocks.push( $(this).parentsUntil(".field").parent().attr("id") );

                    var rest = filterInvalidCheckboxes($(par).find("[type='checkbox']"));

                    var checked = rest.filter(function (ind, item) {
                        return $(item).is(":checked");
                    });

                    var unchecked = rest.filter(function (ind, item) {
                        return !$(item).is(":checked");
                    });

                    $.each(checked, function (idx) {
                        $(checked[idx]).prop("checked", false);
                    });

                    $.each(unchecked, function (idx) {
                        $(unchecked[idx]).prop("checked", true);
                    });
                    //$(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
                }

                $(".controls").on("click","a[data-value='all']", checkboxHandlerAll);
                $(".controls").on("click", "a[data-value='none']", checkboxHandlerNone);
                $(".controls").on("click", "a[data-value='invert']", checkboxHandlerInvert);
                //$(".controls .apply-filters").on("click", $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click") );

                $(".controls").one("click",".apply-filters", function () {
                    $(".wise-search-form-container [name='form.widgets.page']").val(0);
                    $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
                });
            }

            function filterInvalidCheckboxes(cbxs){
                return cbxs.filter(function (idx, item) {
                    return exceptVal.indexOf($(item).val()) === -1;
                });
            }

            function addCheckboxLabelHandlers(){
                var allch = $(".wise-search-form-container, #wise-search-form").find("[data-fieldname]");
                // listener for click on the whole span
                allch.on("click", ".option", function(ev){
                    $("#ajax-spinner2").hide();
                    var checkboxV = $(this).find("input[type='checkbox']").val();
                    if( window.WISE.blocks.indexOf( $(this).parentsUntil(".field").parent().attr("id") ) !== -1  ){
                        //return false;
                    } else {
                        $(".wise-search-form-container [name='form.widgets.page']").val(0);
                        if( exceptVal.indexOf(checkboxV) === -1) $(ev.target).find("input[type='checkbox']").trigger('click');
                    }

                });
            }

            function attachSelect2(){
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

                    if($(selectElement).attr("id") === "form-widgets-marine_unit_id"){
                        //console.log( $(selectElement) );
                    }

                    //$(".wise-search-form-container #marineunitidsform [data-fieldname] .select2-container").hide();

                    $(".wise-search-form-container #s2id_form-widgets-marine_unit_id").hide();

                    /*$(selectElement).on("select2-loaded", function (ev) {
                        console.log($(selectElement).attr("id") + " loaded");
                    });*/

                    $(selectElement).on("select2-selecting", function() {
                        // what you would like to happen
                        //if($(this).val() !== ev.choice.id && ) $(ev.target).parentsUntil(".subform"); /*.remove()*/;
                        //var par = $(ev.target).parentsUntil(".subform").next();

                        if( $(this).attr("id") === "form-widgets-article" ) {
                            /*$(ev.target).parentsUntil(".form-right-side").parent().nextUntil(".form-right-side").remove(":not('.formControls')");*/
                        } else {
                            //$(this).parentsUntil("form").nextUntil(".form-right-side").remove();
                        }
                        //$(this).parentsUntil(".form-right-side").nextUntil(".form-right-side").remove(":not('.formControls')");

                        //par.remove(":not('.formControls')");

                        $(".wise-search-form-container").find("[name='form.buttons.prev']").remove();
                        $(".wise-search-form-container").find("[name='form.buttons.next']").remove();
                        $(".wise-search-form-container").find("[name='form.widgets.page']").remove();


                        setTimeout( function (){

                            $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
                        }, 300);

                    });
                });

                $("#wise-search-form select:not(.notselect)").addClass("js-example-basic-single");

                $("#wise-search-form select:not(.notselect)").each(function (ind, selectElement) {
                    var options = {
                        placeholder: 'Select an option',
                        closeOnSelect: true,
                        dropdownAutoWidth : false,
                        width: 'auto',
                        theme: "flat",
                        minimumResultsForSearch: 20,
                        allowClear: true,
                        dropdownParent: "#marine-unit-trigger",
                        dropdownAdapter: "AttachContainer",

                        containerCssClass : "select2-top-override",
                        dropdownCssClass: "select2-top-override-dropdown",
                        debug: true
                    };

                    $(selectElement).select2(options);
                    // david
                    $(selectElement).parentsUntil(".field").parent().prepend("<h4>Marine Unit ID: </h4>");

                    $(selectElement).on("select2-open", function() {
                        var trh = $("#marine-unit-trigger").offset().top;
                        //$(".select2-top-override-dropdown").css("margin-top", $("#marine-unit-trigger").height()/2 + "px" );

                        $("#marine-unit-trigger .arrow").hide();

                        $(".select2-top-override-dropdown").css({
                            "top": trh + $("#marine-unit-trigger").height() - $("#marine-unit-trigger .arrow").height() + "px",
                            "margin-top": "12" + "px !important"
                        });
                    });

                    $(selectElement).on("select2-selecting", function(ev) {

                        $("#wise-search-form #marine-unit-trigger a").text(ev.object.text);

                        $(".wise-search-form-container [name='form.widgets.page']").val(0);
                        $(".wise-search-form-container #form-widgets-marine_unit_id").select2().val(ev.val).trigger("change");

                        $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");


                    });

                    $(selectElement).on("select2-close", function () {
                        $("#marine-unit-trigger").css("background", "transparent");
                        $("#marine-unit-trigger a").css("background", "transparent");
                        $("#marine-unit-trigger .arrow").show();
                    });


                    /// Marine Unit id selector
                    if ($('#wise-search-form select').hasClass("js-example-basic-single")) {

                        // Select2 has been initialized
                        var text = $('#wise-search-form  select [value="' + jQuery('#wise-search-form .select-article select').val() + '"]').text();
                        $('#wise-search-form select:not(.notselect)').parentsUntil(".field").before('<div id="marine-unit-trigger">' +

                            '<div class="text-trigger">'+ text +
                                '<span class="fa fa-caret-down text-trigger-icon"></span>' +
                            '</div>' +

                            '</div>');


                        $("#marine-unit-trigger").on("click", function () {
                            if(loading) return false;
                            $("#marine-unit-trigger").css("background", "rgb(238, 238, 238)");
                            $("#marine-unit-trigger a").css("background", "rgb(238, 238, 238)");

                            $('#wise-search-form select:not(.notselect)').select2("open");


                            //var top = $("#marine-unit-trigger a").offset().top;
                            var trH = $("#marine-unit-trigger a").height();

                            $(".select2-top-override-dropdown").css("margin-top", trH/2 + "px" );

                        });

                    }

                });
                var w = "auto";
                var daw = true;
                if (window.matchMedia("(max-width: 967px)").matches) {
                    w = false;
                    daw = false;

                }

                var options = {
                    placeholder: 'Select an option',
                    closeOnSelect: true,
                    dropdownAutoWidth : daw,
                    width: w,
                    theme: "flat",
                    minimumResultsForSearch: 20,
                    containerCssClass : "extra-details-select"
                };

                $.each( $("#wise-search-form .extra-details-select") , function (idx, elem) {
                    if($(elem).find("option").length > 1){
                        $(elem).select2(options);
                    } else {
                        $(elem).hide();
                        //$(elem).after("<span>"+ $($(elem).find("option")[0]).attr("title") +"</span>");
                    }
                });

                if (window.matchMedia("(max-width: 967px)").matches){
                    function formatArticle (article) {
                        var el = $(article.element[0]);

                        return '<span style="font-size: 1.5rem; font-weight: bold;color: #337ab7">' + el.attr("data-maintitle")+ '</span> '+
                            '<span style="color: #337ab7;font-size: 1.3rem;">('+el.attr("data-subtitle") +')</span>';
                    }

                    var moptions = {
                        placeholder: 'Select an option',
                        closeOnSelect: true,
                        dropdownAutoWidth : daw,
                        width: w,
                        theme: "flat",
                        minimumResultsForSearch: 20,
                        formatSelection: formatArticle,
                        formatResult: formatArticle
                    };

                    if($.fn.select2 !== undefined){
                        $("#mobile-select-article").select2(moptions);

                        $("#mobile-select-article").one("select2-selecting", function (ev) {
                            document.location.href =  ev.choice.id;

                        });

                    }
                }

                $("#wise-search-form .extra-details .tab-panel").fadeOut('slow', function () {
                    $.each( $("#wise-search-form .extra-details .extra-details-section"), function (indx, item){
                        $($(item).find(".tab-panel")[0]).show();
                    });
                });

                $("#wise-search-form .extra-details-select").on("select2-selecting", function(ev) {
                    var sect = $(ev.target).parentsUntil(".extra-details-section").parent();
                    $.each( $(sect).find(".tab-panel") , function (idx, elem) {
                        if ($(elem).attr("id") !== ev.choice.id) {
                            $(elem).hide();
                        } else {
                            $(elem).fadeIn();
                        }
                        //$("#" + ev.choice.id).fadeIn();
                    });

                });

                //$("#wise-search-form .extra-details-select").trigger("click");

            }

            function setupTabs() {
                var t = $("ul.nav:not(.topnav) > li");

                // top tabs width calculation
                if(t.length > 1) {
                    var nrtabs = t.length;

                    var tabLength = t.length === 2 ? 35 : Math.floor((100 - t.length) / t.length );

                    t.css("width", tabLength + "%");
                    var rest = 100 - tabLength*t.length;

                    var totalL = $("ul.nav").width();
                    var mrR = Math.floor( totalL /100 ) ;

                    $(t).css({
                        "margin-left": 0,
                        "margin-right" : mrR/2 + "px"
                    });

                } else {
                    $(t).css({"margin-left": 0});
                }

                if ($("#tabs-wrapper ul").find("li").length === 0){
                    if( $("#tabs-wrapper").find("ul").length ===  0 ){ //return true;
                    }
                    //if($("#tabs-wrapper").find("ul li").length === 0) $("#tabs-wrapper").hide();
                }

                $.each( $(".tabs-wrapper") , function (indx, item) {
                    if($(item).find("ul").length ===  0){ return true;}
                    //if($(item).find("ul li").length === 0) $(".tabs-wrapper").hide();
                });

                if( $("#tabs-wrapper ul li").length === 1 ){
                    $("#tabContents").removeClass("tab-content");
                    $("#tabs-wrapper ul").attr("class", "");
                    $("#tabs-wrapper ul li").css({
                        "background-color": "transparent",
                        "float" : "none"
                    });
                    var lt = $("#tabs-wrapper ul li a").text();
                    $("#tabs-wrapper ul li").append("<h4>" + lt + "</h4>");
                    $("#tabs-wrapper ul li a").remove();
                    $("#tabs-wrapper .tab-pane").removeClass("fade");
                }

                var nrTabs = $("#wise-search-form ul.topnav li").length;

                var wdth = (100/nrTabs) - 1;

                $("#wise-search-form .topnav li").css({"width": wdth + "%", "margin-right": "1%" });
                /*$.each( $("#wise-search-form .topnav li"), function (indx, itm) {
                    $(itm).css({
                        "max-width" : wdth + "%"
                    });
                });*/

            }

            function clickFirstTab(){
                $("#tabs-wrapper ul li:first-child a").trigger('click');
                $(".tabs-wrapper ul li:first-child a").trigger('click');
            }

            function marineBtnHandler(ev){
                var direction = ev.data.direction;
                var marinUidSelect = $(".wise-search-form-container #s2id_form-widgets-marine_unit_id");
                var selectedV =  marinUidSelect.select2('data');

                var nextEl  = $(selectedV.element[0]).next();
                var prevEl = $(selectedV.element[0]).prev();

                if(direction === "next"){
                    var dir = nextEl.val();

                } else if(direction === "prev"){
                    var dir = prevEl.val();
                }

                // reset paging
                $(".wise-search-form-container [name='form.widgets.page']").remove();

                $(".wise-search-form-container #form-widgets-marine_unit_id").select2().val(dir).trigger("change");
                $(".wise-search-form-container #s2id_form-widgets-marine_unit_id").hide();

                //$(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");

                $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");

            }

            function setPaginationButtons(){
                var prevButton = $(".center-section [name='form.buttons.prev']");

                var nextButton = $(".center-section [name='form.buttons.next']");

                prevButton.one("click", function (){
                    if(loading) return false;

                    $(".wise-search-form-container").find("form").append("<input type='hidden' name='form.buttons.prev' value='Prev'>");
                    $(".wise-search-form-container").find(".formControls #form-buttons-continue").trigger("click");
                });

                nextButton.one("click", function(){
                    if(loading) return false;

                    $(".wise-search-form-container").find("form").append("<input type='hidden' name='form.buttons.next' value='Next'>");
                    $(".wise-search-form-container").find(".formControls #form-buttons-continue").trigger("click");
                });

                var selected = $("#wise-search-form select:not(.notselect)").val();


                var opts = $("#wise-search-form select:not(.notselect) option");

                $("#marine-unit-nav").hide();
                // ignore 1st option for "prev" button
                if( $("#wise-search-form select:not(.notselect)").val() !== $(opts[1]).val() ){

                    var topPrevBtn = '<button type="submit" id="form-buttons-prev-top" name="marine.buttons.prev"' +
                        ' class="submit-widget button-field btn btn-default pagination-prev fa fa-angle-left" value="" button="">' +
                        '          </button>';
                    $("#form-buttons-prev-top").append(topPrevBtn);

                    $("#form-buttons-prev-top").on("click", null, { direction : "prev"} , marineBtnHandler);
                    $("#form-buttons-prev-top").hide();
                    $("#marine-unit-trigger .arrow-left-container").one("click", function(){
                        $("#form-buttons-prev-top").trigger("click");
                    });
                } else {
                    $("#marine-unit-trigger .arrow-left-container").hide();
                    $(".text-trigger").css("margin-left", 0);
                }

                // ignore last option for "next" button
                if( $("#wise-search-form select:not(.notselect)").val() !== $(opts[opts.length-1]).val() ){
                    var topNextBtn = '<button type="submit" ' +
                        'id="form-buttons-next-top" name="marine.buttons.next" class="submit-widget button-field btn btn-default fa fa-angle-right" value="">' +
                        '            </button>';
                    $("#form-buttons-next-top").append(topNextBtn);

                    $("#form-buttons-next-top").on("click", null, { direction : "next"} , marineBtnHandler);
                    $("#form-buttons-next-top").hide();
                    $("#marine-unit-trigger .arrow-right-container").one("click",function(){
                        $("#form-buttons-next-top").trigger("click")
                    });
                } else {

                    $("#marine-unit-trigger .arrow-right-container").hide();
                }
            }

            initStyling();

            generateCheckboxes( $(".wise-search-form-container, #wise-search-form").find("[data-fieldname]") );

            addCheckboxHandlers( $(".wise-search-form-container") );

            addCheckboxLabelHandlers();

            attachSelect2();

            setupTabs();

            clickFirstTab();

            setPaginationButtons();
        }

        initPageElems();

        /*$(window).on("resize", function () {
            if (window.matchMedia("(max-width: 1024px)").matches) {
                /!*var el = $("#form-buttons-next-top");
                el.css("float","right");
                $("#form-buttons-prev-top").after(el);*!/

                /!*$("#marine-widget-top > div").css("display", "block");
                $("#marine-widget-top .field").css("display", "block");*!/
            }
        });*/

        var AJAX_MODE = true;

        window.WISE = {};
        window.WISE.formData = $(".wise-search-form-container").clone(true);
        window.WISE.blocks = [];

        // ajax form submission
        $(".wise-search-form-container")
            .unbind("click")
            .on("click",".formControls #form-buttons-continue", function (ev){
                if(!AJAX_MODE){
                    return true;
                }
                ev.preventDefault();


                var form =  $(".wise-search-form-container").find("form");
                var url = form.attr("action");

                var strContent = $.getMultipartData("#" + form.attr("id"));

                $.ajax({
                    type: "POST",
                    contentType: 'multipart/form-data; boundary='+strContent[0],
                    cache:false,
                    data: strContent[1],
                    dataType: "html",
                    url: url,
                    //processData:false,
                    beforeSend: function(jqXHR, settings){
                        window.WISE.blocks = [];
                        //$("#ajax-spinner2").hide();

                        $("#wise-search-form .no-results").remove();

                        var t = "<div id='wise-search-form-container-preloader' " +
                            "></div>";
                        var sp = $("#ajax-spinner2").clone().attr("id", "ajax-spinner-form").css({
                            "position": "absolute",
                            "top" : "50%",
                            "left" : "50%",
                            "transform": "translate3d(-50%, -50%,0)"
                        }).show();

                        $(".wise-search-form-container").append(t);
                        $("#wise-search-form-container-preloader").append(sp);


                        $("#form-widgets-marine_unit_id").prop("disabled", true);
                        //$("s2id_form-widgets-marine_unit_id").select2("enable",false);
                        $("[name='form.buttons.prev']").prop("disabled" , true);
                        $("[name='form.buttons.next']").prop("disabled" , true);

                        $("[name='marine.buttons.prev']").prop("disabled" , true);
                        $("[name='marine.buttons.next']").prop("disabled" , true);

                        if($("#marine-widget-top").length > 0){
                            var cont = $("#marine-widget-top").next();
                            cont.css("position", "relative");
                        } else {
                            cont = $(".left-side-form");
                        }

                        cont.prepend("<div id='wise-search-form-preloader' ></div>");


                        $("#wise-search-form-preloader")
                            .append("<span style='position: absolute;" +
                                "    display: block;" +
                                "    left: 50%;" +
                                " top: 10%;'></span>");
                        $("#wise-search-form-preloader > span").append( $("#ajax-spinner2").clone().attr("id","ajax-spinner-center" ).show());

                        $("#ajax-spinner-center").css({
                            "position" : "fixed"
                            //"top" : "50%",
                            //"left" : "30%",
                            // "transform" : "translateX(-50%)"
                        });

                        //window.WISE.marineUnit = $("#wise-search-form select").val(  );

                        loading = true;

                    },
                    success:function (data, status, req) {
                        $("#wise-search-form #wise-search-form-top").siblings().html("");
                        $("#wise-search-form #wise-search-form-top").siblings().fadeOut("fast");

                        $("#wise-search-form .topnav").next().remove();

                        var $data = $(data);

                        window.WISE.formData = $(data).find(".wise-search-form-container").clone(true);

                        var chtml = $data.find(".wise-search-form-container");

                        var fhtml = chtml.html();

                        var centerContentD = $data.find("#wise-search-form #wise-search-form-top").siblings();

                        $(".wise-search-form-container").html(fhtml);

                        if( $data.find("#wise-search-form .topnav").next().length > 0){
                            $("#wise-search-form .topnav").after($data.find("#wise-search-form .topnav").next());
                        }


                        $("#wise-search-form #wise-search-form-top").siblings().remove();
                        $("#wise-search-form #wise-search-form-top").after(centerContentD);

                        /*var res = $data.find("#wise-search-form");

                        if(res.children().length === 1){
                            if($(res[0]).attr("id") === "wise-search-form-top" ){
                                $("#wise-search-form #wise-search-form-top").after("<span class='no-results'>No results found.</span>");
                            }

                        }*/

                        initPageElems();

                        $("[name='form.buttons.prev']").prop("disabled" , false);
                        $("[name='form.buttons.next']").prop("disabled" , false);

                        $("[name='marine.buttons.prev']").prop("disabled" , false);
                        $("[name='marine.buttons.next']").prop("disabled" , false);
                    },
                    complete:function(jqXHR, textStatus){
                        if(textStatus === "success"){
                            $(".wise-search-form-container").fadeIn("fast", function () {
                                $("#wise-search-form #wise-search-form-top").siblings().fadeIn("fast");
                            });
                        }
                        $(".wise-search-form-container").find("[name='form.buttons.prev']").remove();
                        $(".wise-search-form-container").find("[name='form.buttons.next']").remove();


                        //$("s2id_form-widgets-marine_unit_id").select2().enable(true);

                        $("#wise-search-form #loader-placeholder").remove();

                        $("#form-widgets-marine_unit_id").prop("disabled", false);

                        //if($("#wise-search-form select").val() === "--NOVALUE--" ) $("#wise-search-form select").val(window.WISE.marineUnit).trigger("change.select2");
                        if ($('#wise-search-form select').hasClass("js-example-basic-single")) {
                            // Select2 has been initialized

                            if( ( $("#wise-search-form .select2-choice").width()/2 ) <= $("#wise-search-form #select2-chosen-3").width() ){
                                $("#wise-search-form .select2-choice").css("width", "50%");
                            } else if ( 2*( $("#wise-search-form .select2-choice").width()/3 ) <= $("#wise-search-form #select2-chosen-3").width() ) {
                                $("#wise-search-form .select2-choice").css("width", "70%");
                            }

                        }

                        if($("#wise-search-form-top").next().length === 0){
                            $("#wise-search-form #wise-search-form-top").after("<span class='no-results'>No results found.</span>");
                        }

                        loading = false;
                    },
                    error:function (req, status, error) {
                        if(window.WISE.formData.length > 0){
                            var data = $($(window.WISE.formData)[0]).find(".field");
                            $.each( data , function (indx, $field) {
                                var chk = $($field).find(".option input[type='checkbox']:checked");
                                if(chk.length > 0){
                                    // TODO
                                }

                            });
                        }

                        $("#wise-search-form-top").find(".alert").remove();
                        $("#wise-search-form-top").append('<div class="alert alert-danger alert-dismissible show" style="margin-top: 2rem;" role="alert">' +
                            '  <strong>There was a error from the server.</strong> You should check in on some of those fields from the form.' +
                            '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                            '    <span aria-hidden="true">&times;</span>' +
                            '  </button>' +
                            '</div>');

                        $(".wise-search-form-container").find("[name='form.buttons.prev']").remove();
                        $(".wise-search-form-container").find("[name='form.buttons.next']").remove();
                        $("#form-widgets-marine_unit_id").prop("disabled", false);

                        $("#wise-search-form-container-preloader").remove();
                        $("#wise-search-form-preloader").remove();

                        $("#ajax-spinner-form").hide();

                        $("[name='form.buttons.prev']").prop("disabled" , true);
                        $("[name='form.buttons.next']").prop("disabled" , true);

                        $("[name='marine.buttons.prev']").prop("disabled" , true);
                        $("[name='marine.buttons.next']").prop("disabled" , true);


                        loading = false;
                    }
                });

            });

//$.noConflict();
}(window, document, jQuery));

