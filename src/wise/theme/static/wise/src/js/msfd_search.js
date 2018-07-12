/* global window, document, jQuery */
(function(window, document, $){

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

            if($("#form-buttons-download").length > 0){
                var dBtn = $("#form-buttons-download").prop('outerHTML').replace("input","button")
                    + ' <span style="margin-left:0.4rem;">Download as XLS</span>';
                var btnForm = $("#form-buttons-download").parent();

                $("#form-buttons-download").remove();

                btnForm.append( $(dBtn) );
                $("#form-buttons-download").val("&#xf019; Download as XLS");
                $("#form-buttons-download").addClass("fa").addClass("fa-download");
            }

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
                        var self = this;
                        $("#ajax-spinner2").hide();
                        if( window.WISE.blocks.indexOf( $(this).parentsUntil(".field").parent().attr("id") ) !== -1  ){
                            //return false;
                        } else {
                            //TODO : check if apply-filters shown
                            window.setTimeout( function() {
                                $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click", {'button': self})
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
                            window.setTimeout( function (){
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

            var $controls = $(".controls");
            $controls.on("click","a[data-value='all']", checkboxHandlerAll);
            $controls.on("click", "a[data-value='none']", checkboxHandlerNone);
            $controls.on("click", "a[data-value='invert']", checkboxHandlerInvert);
            //$(".controls .apply-filters").on("click", $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click") );

            $controls.one("click",".apply-filters", function () {
                $(".wise-search-form-container [name='form.widgets.page']").val(0);
                $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click", {'button': this});
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

                $(selectElement).on("select2-selecting", function(ev) {

                    // remove results following form-widgets-article select element
                    // as we want to reset each facet to it's initial value if we change form
                    if( $(this).attr("id") === "form-widgets-article" ) {
                        $(ev.target).closest(".form-right-side").next().remove();
                    }

                    var $wise_search_form = $(".wise-search-form-container");
                    $wise_search_form.find("[name='form.buttons.prev']").remove();
                    $wise_search_form.find("[name='form.buttons.next']").remove();
                    $wise_search_form.find("[name='form.widgets.page']").remove();

                    var self = this;
                    window.setTimeout( function (){
                        $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click", {'select': self});
                    }, 300);

                });
            });


            $("#wise-search-form select:not(.notselect)").addClass("js-example-basic-single").each(function (ind, selectElement) {
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
                    $(".wise-search-form-container .formControls #form-buttons-continue").trigger("click", {'select': ev.target});


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
            var nrtabs = t.length;
            if(nrtabs > 1) {

                var tabLength = nrtabs === 2 ? 35 : Math.floor((100 - nrtabs) / nrtabs );

                t.css("width", tabLength + "%");
                var rest = 100 - tabLength * nrtabs;

                var totalL = $("ul.nav").width();
                var mrR = Math.floor( totalL /100 ) ;

                $(t).css({
                    "margin-left": 0,
                    "margin-right" : mrR/2 + "px"
                });

            } else {
                $(t).css({"margin-left": 0});
            }
            /* david commented
            if ($("#tabs-wrapper ul").find("li").length === 0){
                if( $("#tabs-wrapper").find("ul").length ===  0 ){ //return true;
                }
                //if($("#tabs-wrapper").find("ul li").length === 0) $("#tabs-wrapper").hide();
            } */

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

    jQuery(document).ready(function($){
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

                // empty facets below given facet where we had an interaction
                // this way we reset the configurations below the given facet
                // with which we interacted with
                var called_from = arguments[1];
                var called_from_button = called_from && called_from['button'];
                var empty_next_inputs;
                if (!called_from || called_from_button) {
                    empty_next_inputs = function(el) {
                        var panel_group, subform_parent, subform_children;
                        panel_group = $(el).closest('.panel-group');
                        subform_parent = panel_group.closest('.subform');
                        subform_children = subform_parent.find('.subform');
                        panel_group.nextAll('.panel-group').find('.panel').empty();
                        if (subform_children.length) {
                            subform_children.find('.panel').empty();
                        }
                    };
                    if (called_from_button) {
                        empty_next_inputs(called_from_button);
                    }
                    else {
                        $(".ui-autocomplete-input").each(function(idx, el) {
                            if (el.value) {
                                empty_next_inputs(el);
                                return false;
                            }
                        });
                    }
                }

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

    });
}(window, document, jQuery));
