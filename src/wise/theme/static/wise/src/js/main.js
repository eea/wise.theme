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

    var $fields = $(".wise-search-form-container, #wise-search-form").find("[data-fieldname]");
    var exceptVal = ["all", "none", "invert"];

    function generateCheckboxes(){
        var count = $fields.length;
        $fields.each(function(indx, field){

            var cheks = $(field).find(".option");
            var hasChecks = cheks.find("input[type='checkbox']").length > 0;
            if(hasChecks){
                var fieldId = $(field).attr("id");
                var spAll = '<span class="controls" style="display: inline-block;background-color: #ddd;padding-top: 2px;padding-bottom: 2px;' +
                    'padding-left: 0;position: relative;  ">' +
                    '<span style="font-size: 0.8em; margin-left: 5px;">Select :</span><a class="" data-value="all"><label>' +
                    '<span class="label">All</span></label></a>';
                var spClear = '<a class="" data-value="none" ><label><span class="label">Clear all</span></label></a>';
                var invertSel = '<a class="" data-value="invert"><label><span class="label">Invert selection</span></label></a>' +
                    '<span class="ui-autocomplete">' +
                        '<span class=" search-icon" ></span>' +
                        '<input class="ui-autocomplete-input" type="text" style="width: 90%;" /></span>';


                // add "all" checkbox
                var all = spAll + spClear + invertSel;
                $(field).find("> label.horizontal").after(all);

                //tooltips
                cheks.each(function (idx, check) {
                    var text = $(cheks[idx]).text();
                    $(cheks[idx]).attr("title", text.trim());
                });

                if(cheks.length < 4) {
                    $(field).find(".controls a").hide();
                    $(field).find(".controls").html("").css("height" ,"1px").css("padding", 0);

                } else {
                    $(field).addClass("panel-group");

                    var chekspan = $(field).find("> span:not(.controls)");
                    chekspan.css("border-radius", 0);
                    chekspan.addClass( fieldId + "-collapse");
                    chekspan.addClass("collapse");
                    var checked = filterInvalidCheckboxes($(field).find(".option input[type='checkbox']:checked"));

                    chekspan.addClass("panel");
                    chekspan.addClass("panel-default");

                    var label = $(field).find(".horizontal");

                    var alabel = "<a data-toggle='collapse' class='accordion-toggle' >" + label.text() + "</a>";
                    label.html(alabel);

                    label.addClass("panel-heading").addClass("panel-title");

                    label.attr("data-toggle", "collapse");
                    label.attr("data-target", "." + fieldId + "-collapse" );

                    // if already checked than collapse
                    if(checked.length === 0) {
                        chekspan.collapse({
                            toggle: true
                        });
                        chekspan.collapse({
                            toggle: true
                        });
                        $(field).find(".accordion-toggle").addClass("accordion-after");
                    } else {
                        $(field).find(".controls").slideUp("fast");
                        chekspan.collapse({
                            toggle: false
                        });
                    }

                    chekspan.on("hidden.bs.collapse", function (ev) {
                        chekspan.fadeOut("fast");
                        $(field).find(".controls").slideUp("fast");
                        $(field).css({"border-bottom" : "1px solid #ccc;"});
                    });

                    chekspan.on("show.bs.collapse", function (ev) {
                        // collapsed
                        chekspan.fadeIn("fast");
                        $(field).find(".controls").slideDown("fast");
                        $(field).find("> span").css({"display" : "block"});

                        $(field).find(".accordion-toggle").addClass("accordion-after");
                    });

                    chekspan.on("hide.bs.collapse", function (ev) {
                        // not collapsed
                        setTimeout( function (){
                            $(field).find(".accordion-toggle").removeClass("accordion-after");
                        },600);
                    });


                    // initialize autocomplete for more than 6 checkboxes
                    if(cheks.length < 6) {
                        $(field).find(".controls .ui-autocomplete").hide();
                    } else {

                        $(field).find(".ui-autocomplete-input").autocomplete({
                            minLength: 0,
                            source: [],
                            search: function( event, ui ) {
                                var cheks = $(field).find(".option .label:not(.horizontal) ");

                                if( $(event.target).val() === "" ){
                                    cheks.parentsUntil(".option").parent().parent().find(".noresults").remove();
                                    cheks.parentsUntil(".option").parent().show();
                                    return true;
                                }
                                cheks.parentsUntil(".option").parent().show();

                                var toSearch = $(event.target).val().toLowerCase()
                                    /*.replace(/^\s+|\s+$/g, '_')*/
                                    /*.replace(/_/g, "")*/
                                    .replace(/\s/g, "_");

                                var matcher = new RegExp( "^" +  $.ui.autocomplete.escapeRegex( toSearch ), "i" );
                                var matcher2 = new RegExp( $.ui.autocomplete.escapeRegex( toSearch ), "i" );

                                var temp = {};
                                var checksLabels = $(field).find(".option .label:not(.horizontal) ").map(function (ind, item) {
                                    temp[$(item).text().toLowerCase()] = $(item).text().toLowerCase()
                                        .replace(/\s/g, "_")
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

                                var tohide = cheks.filter(function (idx, elem) {
                                    return found.indexOf( $(elem).text().toLowerCase()) !== -1;
                                });

                                $.each(tohide, function (inx, item) {
                                    $(item).parentsUntil(".option").parent().hide();
                                });

                                if(tohide.length === cheks.length){
                                    console.log("no result");
                                    cheks.parentsUntil(".option").parent().parent().append("<span class='noresults'>No results found</span>")
                                }

                            }
                        });
                    }
                    /*$(field).find(".ui-autocomplete-input").on("focusin" , function (ev) {
                        //$(ev.target).parent().find(".glyphicon").css("background", "#ffffe0");
                    });

                    $(field).find(".ui-autocomplete-input").on("focusout" , function (ev) {
                        //$(ev.target).parent().find(".glyphicon").css("background", "white");
                    });*/
                    $(field).find(".search-icon").on("click" , function (ev) {
                        $(ev.target).parent().find("input").trigger("focus");
                    });
                }
            }
            if (!--count) $(".wise-search-form-container, #wise-search-form").animate({"opacity" : 1}, 1000);
        });

    }

    generateCheckboxes();


    var allch = $(".wise-search-form-container, #wise-search-form").find("[data-fieldname]");

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

        //$(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
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

        //$(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
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

        //$(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
    }

    $(".controls").on("click","a[data-value='all']", checkboxHandlerAll);
    $(".controls").on("click", "a[data-value='none']", checkboxHandlerNone);
    $(".controls").on("click", "a[data-value='invert']", checkboxHandlerInvert);

    // listener for click on the whole span
    allch.on("click", ".option", function (ev){
        var checkboxV = $(this).find("input[type='checkbox']").val();
        if( exceptVal.indexOf(checkboxV) === -1) $(ev.target).find("input[type='checkbox']").trigger('click');

        //$(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
         //$(this).parentsUntil(".form-right-side") );

    });

    $(".wise-search-form-container select").each(function (ind, selectElement) {
        $(selectElement).addClass("js-example-basic-single");
        var lessOptions = $(selectElement).find("option").length < 10;
        var options = {
            placeholder: 'Select an option',
            closeOnSelect: true,
            dropdownAutoWidth : true,
            width: '100%',
            theme: "flat",
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

        $(selectElement).on("select2-selecting", function(ev) {
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

            setTimeout( function (){
                $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");
            }, 300);

        });
    });

    $("#wise-search-form select").each(function (ind, selectElement) {
        $(selectElement).addClass("js-example-basic-single");
        var options = {
            placeholder: 'Select an option',
            closeOnSelect: true,
            dropdownAutoWidth : true,
            width: '100%',
            theme: "flat",
            minimumResultsForSearch: Infinity,
            containerCssClass : "select2-top-override",
            dropdownCssClass: "select2-top-override-dropdown"
        };

        $(selectElement).select2(options);

        $(selectElement).parentsUntil(".field").parent().css("display","inline-block").css("margin", "0 auto");
        $(selectElement).parentsUntil(".field").parent().prepend("<h4 style='display: inline-block;'> Marine Unit ID: </h4>");
        console.log(selectElement);

        $(selectElement).on("select2-selecting", function(ev) {
            $(".wise-search-form-container #form-widgets-marine_unit_id").select2().val(ev.val).trigger("change");
            $(".wise-search-form-container #s2id_form-widgets-marine_unit_id").hide();
            $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click");

        });
    });

    $(".button-field").addClass("btn");

    $("#tabs-wrapper ul li:first-child a").trigger('click');
    $(".tabs-wrapper ul li:first-child a").trigger('click');

    var prevButton = $(".center-section [name='form.buttons.prev']");

    var nextButton = $(".center-section [name='form.buttons.next']");

    prevButton.one("click", function (){
        var appBtn = prevButton.clone();
        $(appBtn).attr("class","").hide();

        $(".wise-search-form-container").find(".formControls").append(appBtn);
        $(".wise-search-form-container").find("[name='form.buttons.prev']").trigger("click");
    });

    nextButton.one("click", function(){
        var appBtn = nextButton.clone();
        $(appBtn).attr("class","").hide();

        $(".wise-search-form-container").find(".formControls").append(appBtn);
        $(".wise-search-form-container").find("[name='form.buttons.next']").trigger("click");
    });

    var topPrevBtn = $("#form-buttons-prev").clone(true);
    var tpBid = topPrevBtn.attr("id");
    topPrevBtn.attr("id", tpBid + "-top");
    $("#form-buttons-prev-top").append(topPrevBtn);
    $("#form-buttons-prev-top .btn")
        .css("position", "relative")
        .css({"margin-right": "20px"})

    var topNextBtn = $("#form-buttons-next").clone(true);
    var tpNbid = topNextBtn.attr("id");
    topNextBtn.attr("id", tpNbid + "-top");
    $("#form-buttons-next-top").append(topNextBtn);

    if (window.matchMedia("(max-width: 1024px)").matches) {
        var el = $("#form-buttons-next-top");
        el.css("float","right");
        $("#form-buttons-prev-top").after(el);

    }


    return jQuery.noConflict();
});

// AJAX request interception
/*(function(open) {

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

        this.addEventListener("readystatechange", function(ev) {
            /!*console.log("########### intercepted request #####################");
            console.log(method);
            console.log(url);*!/

            console.log(ev.target);
        }, false);

        open.call(this, method, url, async, user, pass);
    };

})(XMLHttpRequest.prototype.open);*/


