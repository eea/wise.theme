requirejs.config({paths:{slick:["https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min"],jquery:["https://code.jquery.com/jquery-2.2.4.min"]}}),require(["jquery","slick"],function(a){function b(b){a(b).removeClass("open"),window.matchMedia("(min-width: 800px)").matches?a(".navmenu-items").animate({opacity:"hide"},{duration:80,complete:function(){a(".header-wave .menu-brand").animate({opacity:"show"},1),a(".menu .menu-brand").animate({opacity:"hide"},30),a(".menu").animate({height:"hide"},200)}}):a(".menu").animate({height:"hide"},200)}function c(b){a(b).addClass("open"),a(".menu").animate({height:"show"},{duration:200,complete:function(){if(window.matchMedia("(min-width: 800px)").matches){a(".navmenu-items").animate({opacity:"show"},30);var b=a("body").height()-a(".menu > img").height();a(".menu-bg").height(b+3),a(".navmenu-items").css("display","flex"),a(".header-wave .menu-brand").animate({opacity:"hide"},30),a(".menu .menu-brand").animate({opacity:"show"},30)}}})}function d(){function b(){a(".button-field").addClass("btn"),a(".wise-search-form-container #s2id_form-widgets-marine_unit_id").parentsUntil(".field").parent().hide(),a("#form-buttons-continue").hide("fast")}function c(b){var c=b.length;b.each(function(b,d){var e=a(d).find(".option"),f=e.find("input[type='checkbox']").length>0;if(f){var h=a(d).attr("id"),i='<span class="controls" style="display: inline-block;background-color: #ddd;padding-top: 2px;padding-bottom: 2px;padding-left: 0;position: relative;  "><span style="font-size: 0.8em; margin-left: 5px;">Select :</span><a class="" data-value="all"><label><span class="label">All</span></label></a>',j='<a class="" data-value="none" ><label><span class="label">Clear all</span></label></a>',k='<a class="" data-value="invert"><label><span class="label">Invert selection</span></label></a><div class="btn btn-default apply-filters" data-value="apply"><span class="" >Apply filters</span></div><span class="ui-autocomplete"><span class=" search-icon" ></span><span style="position: relative;padding-top:1px;padding-bottom:1px;background: white;" class="search-span"><input class="ui-autocomplete-input" type="text" style="width: 80%;" /><span class="clear-btn"><a class="fa fa-times"></a></span></span></span>';a("#"+h).on("click",".option",function(){a("#ajax-spinner2").hide(),window.WISE.blocks.indexOf(a(this).parentsUntil(".field").parent().attr("id"))!==-1||setTimeout(a(".wise-search-form-container .formControls #form-buttons-continue").trigger("click"),300)});var l=i+j+k;if(a(d).find("> label.horizontal").after(l),e.each(function(b){var c=a(e[b]).text();a(e[b]).attr("title",c.trim())}),e.length<4)a(d).find(".controls a").hide(),a(d).find(".controls").html("").css("height","1px").css("padding",0);else{a(d).addClass("panel-group");var m=a(d).find("> span:not(.controls)");m.css("border-radius",0),m.addClass(h+"-collapse"),m.addClass("collapse");g(a(d).find(".option input[type='checkbox']:checked"));m.addClass("panel"),m.addClass("panel-default");var n=a(d).find(".horizontal"),o="<a data-toggle='collapse' class='accordion-toggle' >"+n.text()+"</a>";n.html(o),n.addClass("panel-heading").addClass("panel-title"),n.attr("data-toggle","collapse"),n.attr("data-target","."+h+"-collapse"),m.collapse({toggle:!0}),m.collapse({toggle:!0}),a(d).find(".accordion-toggle").addClass("accordion-after"),m.on("hidden.bs.collapse",function(){m.fadeOut("fast"),a(d).find(".controls").slideUp("fast"),a(d).css({"border-bottom":"1px solid #ccc;"})}),m.on("show.bs.collapse",function(){m.fadeIn("fast"),a(d).find(".controls").slideDown("fast"),a(d).find("> span").css({display:"block"}),a(d).find(".accordion-toggle").addClass("accordion-after")}),m.on("hide.bs.collapse",function(){setTimeout(function(){a(d).find(".accordion-toggle").removeClass("accordion-after")},600)}),e.length<6?a(d).find(".controls .ui-autocomplete").hide():a(d).find(".ui-autocomplete-input").autocomplete({minLength:0,source:[],search:function(b){var c=a(d).find(".option .label:not(.horizontal) ");if(""===a(b.target).val())return c.parentsUntil(".option").parent().parent().find(".noresults").remove(),c.parentsUntil(".option").parent().show(),!0;c.parentsUntil(".option").parent().show();var e=a(b.target).val().toLowerCase().replace(/\s/g,"_"),f=(new RegExp("^"+a.ui.autocomplete.escapeRegex(e),"i"),new RegExp(a.ui.autocomplete.escapeRegex(e),"i")),g={},h=(a(d).find(".option .label:not(.horizontal) ").map(function(b,c){return g[a(c).text().toLowerCase()]=a(c).text().toLowerCase().replace(/\s/g,"_"),a(c).text().toLowerCase().replace(/\s/g,"_")}),[]);a.each(g,function(a,b){f.test(b)||h.push(a)});var i=c.filter(function(b,c){return h.indexOf(a(c).text().toLowerCase())!==-1}),j=c.filter(function(b,c){return h.indexOf(a(c).text().toLowerCase())===-1});a.each(j,function(b,c){a(c).parentsUntil(".option").parent().find("[type='checkbox']").prop("checked",!0)}),a.each(i,function(b,c){a(c).parentsUntil(".option").parent().find("[type='checkbox']").prop("checked",!1),a(c).parentsUntil(".option").parent().find("input[type='checkbox']").prop("checked",!1),a(c).parentsUntil(".option").parent().find("input[type='checkbox']").removeAttr("checked"),a(c).parentsUntil(".option").parent().hide()}),i.length===c.length&&c.parentsUntil(".option").parent().parent().append("<span class='noresults'>No results found</span>")},create:function(){var b=this,c=a(this).parentsUntil(".ui-autocomplete").find(".clear-btn ");c.on("click",null,b,function(b){a(this).parentsUntil(".controls").find("input").val(""),a(this).parentsUntil(".controls").find("input").trigger("change"),a(b.data).autocomplete("search","undefined")})}}),a(d).find(".search-icon").on("click",function(b){a(b.target).parent().find("input").trigger("focus")})}}--c||a(".wise-search-form-container, #wise-search-form").animate({opacity:1},1e3)})}function d(){function b(b){b.preventDefault();var c=a(this).parent().parent();window.WISE.blocks.push(a(this).parentsUntil(".field").parent().attr("id")),c.find(".apply-filters").show();var d=g(a(c).find("[type='checkbox']"));a.each(d,function(b){"all"!==a(d[b]).val()&&"none"!==a(d[b]).val()&&a(d[b]).prop("checked",!0)})}function c(b){b.preventDefault(),a(this).prop("checked",!1);var c=a(this).parent().parent();c.find(".apply-filters").show();var d=g(a(c).find("[type='checkbox']"));window.WISE.blocks.push(a(this).parentsUntil(".field").parent().attr("id")),a.each(d,function(b){a(d[b]).prop("checked",!1)})}function d(b){b.preventDefault(),a(this).prop("checked",!1);var c=a(this).parent().parent();c.find(".apply-filters").show(),window.WISE.blocks.push(a(this).parentsUntil(".field").parent().attr("id"));var d=g(a(c).find("[type='checkbox']")),e=d.filter(function(b,c){return a(c).is(":checked")}),f=d.filter(function(b,c){return!a(c).is(":checked")});a.each(e,function(b){a(e[b]).prop("checked",!1)}),a.each(f,function(b){a(f[b]).prop("checked",!0)})}a(".controls").on("click","a[data-value='all']",b),a(".controls").on("click","a[data-value='none']",c),a(".controls").on("click","a[data-value='invert']",d),a(".controls").one("click",".apply-filters",function(){a(".wise-search-form-container .formControls #form-buttons-continue").trigger("click")})}function g(b){return b.filter(function(b,c){return e.indexOf(a(c).val())===-1})}function h(){var b=a(".wise-search-form-container, #wise-search-form").find("[data-fieldname]");b.on("click",".option",function(b){a("#ajax-spinner2").hide();var c=a(this).find("input[type='checkbox']").val();window.WISE.blocks.indexOf(a(this).parentsUntil(".field").parent().attr("id"))!==-1||e.indexOf(c)===-1&&a(b.target).find("input[type='checkbox']").trigger("click")})}function i(){function b(){window.matchMedia("(max-width: 956px)").matches,a("#marine-unit-trigger .text-trigger").css({"margin-left":"20px"});var b=a("#marine-unit-trigger .text-trigger").width()+a("#marine-unit-trigger .arrow-left-container").width();b>a("#marine-widget-top .select-article").width()&&(b=a("#marine-widget-top .select-article").width()-20);var c=(a("#marine-unit-trigger .text-trigger").height()<80,2),d=Math.floor(a("#marine-unit-trigger .text-trigger").height()/c);window.matchMedia("(max-width: 967px)").matches?(a("#marine-unit-trigger .arrow-right").css({left:b+"px",top:d+"px",transform:"translate3d(0,-15px,0) scale(1.5)"}),a("#marine-unit-trigger .arrow-left").css({top:d+"px",transform:"translate3d(0,-15px,0)  scale(1.5)"})):(a("#marine-unit-trigger .arrow-right").css({left:b+"px",top:d+"px",transform:"translate3d(0,-10px,0)"}),a("#marine-unit-trigger .arrow-left").css({top:d+"px",transform:"translate3d(0,-10px,0)"})),a(".text-trigger").height()>40&&window.matchMedia("(max-width: 991px)").matches&&a(".text-trigger").css("max-width","90%")}function c(b){var c=a(b.element[0]);return'<span style="font-size: 1.5rem; font-weight: bold;color: #337ab7">'+c.attr("data-maintitle")+'</span> <span style="color: #337ab7;font-size: 1.3rem;">('+c.attr("data-subtitle")+")</span>"}a(".wise-search-form-container select").each(function(b,c){a(c).addClass("js-example-basic-single");var d=a(c).find("option").length<10,e={placeholder:"Select an option",closeOnSelect:!0,dropdownAutoWidth:!0,width:"100%",theme:"flat"};d&&(e.minimumResultsForSearch=1/0),a(c).select2(e),"form-widgets-marine_unit_id"===a(c).attr("id"),a(".wise-search-form-container #s2id_form-widgets-marine_unit_id").hide(),a(c).on("select2-selecting",function(){"form-widgets-article"===a(this).attr("id"),a(".wise-search-form-container").find("[name='form.buttons.prev']").remove(),a(".wise-search-form-container").find("[name='form.buttons.next']").remove(),a(".wise-search-form-container").find("[name='form.widgets.page']").remove(),setTimeout(function(){a(".wise-search-form-container .formControls #form-buttons-continue").trigger("click")},300)})}),a("#wise-search-form select:not(.notselect)").addClass("js-example-basic-single"),a("#wise-search-form select:not(.notselect)").each(function(c,d){var e={placeholder:"Select an option",closeOnSelect:!0,dropdownAutoWidth:!1,width:"auto",theme:"flat",minimumResultsForSearch:20,allowClear:!0,dropdownParent:"#marine-unit-trigger",dropdownAdapter:"AttachContainer",containerCssClass:"select2-top-override",dropdownCssClass:"select2-top-override-dropdown",debug:!0};if(a(d).select2(e),a(d).parentsUntil(".field").parent().prepend("<h4 style='display: block;color: #337ab7;font-weight: 700;font-size: 90%;'> Marine Unit ID: </h4>"),a(d).on("select2-open",function(){var b=a("#marine-unit-trigger").offset().top;a("#marine-unit-trigger .arrow").hide(),a(".select2-top-override-dropdown").css({top:b+a("#marine-unit-trigger").height()-a("#marine-unit-trigger .arrow").height()+"px","margin-top":"12px !important"})}),a(d).on("select2-selecting",function(c){a("#wise-search-form #marine-unit-trigger a").text(c.object.text),b(),a(".wise-search-form-container #form-widgets-marine_unit_id").select2().val(c.val).trigger("change"),a(".wise-search-form-container .formControls #form-buttons-continue").trigger("click")}),a(d).on("select2-close",function(){a("#marine-unit-trigger").css("background","transparent"),a("#marine-unit-trigger a").css("background","transparent"),a("#marine-unit-trigger .arrow").show()}),a("#wise-search-form select").hasClass("js-example-basic-single")){var g=a('#wise-search-form  select [value="'+jQuery("#wise-search-form .select-article select").val()+'"]').text();a("#wise-search-form select:not(.notselect)").parentsUntil(".field").before('<div id="marine-unit-trigger"><div style="display: table-cell; width: auto;max-width: 80%;position:relative; "><div class="text-trigger">'+g+'</div><div class="arrow-left-container"><div class="arrow-left"><div class="arrow-top"></div><div class="arrow-bottom"></div></div></div><div class="arrow-right-container" ><div class="arrow-right"><div class="arrow-top"></div><div class="arrow-bottom"></div></div></div></div></div></div>'),b(),a("#marine-unit-trigger").on("click",function(){if(f)return!1;a("#marine-unit-trigger").css("background","rgb(238, 238, 238)"),a("#marine-unit-trigger a").css("background","rgb(238, 238, 238)"),a("#wise-search-form select:not(.notselect)").select2("open");var b=a("#marine-unit-trigger a").height();a(".select2-top-override-dropdown").css("margin-top",b/2+"px")})}});var d="auto",e=!0;window.matchMedia("(max-width: 967px)").matches&&(d=!1,e=!1);var g={placeholder:"Select an option",closeOnSelect:!0,dropdownAutoWidth:e,width:d,theme:"flat",minimumResultsForSearch:20,containerCssClass:"extra-details-select"};if(a.each(a("#wise-search-form .extra-details-select"),function(b,c){a(c).find("option").length>1?a(c).select2(g):a(c).hide()}),window.matchMedia("(max-width: 967px)").matches){var h={placeholder:"Select an option",closeOnSelect:!0,dropdownAutoWidth:e,width:d,theme:"flat",minimumResultsForSearch:20,formatSelection:c,formatResult:c};a("#mobile-select-article").select2(h),a("#mobile-select-article").one("select2-selecting",function(a){document.location.href=a.choice.id})}a("#wise-search-form .extra-details .tab-panel").fadeOut("slow",function(){a.each(a("#wise-search-form .extra-details .extra-details-section"),function(b,c){a(a(c).find(".tab-panel")[0]).show()})}),a("#wise-search-form .extra-details-select").on("select2-selecting",function(b){var c=a(b.target).parentsUntil(".extra-details-section").parent();a.each(a(c).find(".tab-panel"),function(c,d){a(d).attr("id")!==b.choice.id?a(d).hide():a(d).fadeIn()})})}function j(){var b=a("ul.nav:not(.topnav) > li");if(b.length>1){var c=(b.length,2===b.length?35:Math.floor((100-b.length)/b.length));b.css("width",c+"%");var d=(100-c*b.length,a("ul.nav").width()),e=Math.floor(d/100);a(b).css({"margin-left":0,"margin-right":e/2+"px"})}else a(b).css({"margin-left":0});if(0===a("#tabs-wrapper ul").find("li").length&&0===a("#tabs-wrapper").find("ul").length,a.each(a(".tabs-wrapper"),function(b,c){if(0===a(c).find("ul").length)return!0}),1===a("#tabs-wrapper ul li").length){a("#tabContents").removeClass("tab-content"),a("#tabs-wrapper ul").attr("class",""),a("#tabs-wrapper ul li").css({"background-color":"transparent","float":"none"});var f=a("#tabs-wrapper ul li a").text();a("#tabs-wrapper ul li").append("<h4>"+f+"</h4>"),a("#tabs-wrapper ul li a").remove(),a("#tabs-wrapper .tab-pane").removeClass("fade")}var g=a("#wise-search-form ul.topnav li").length,h=100/g-1;a("#wise-search-form .topnav li").css({width:h+"%","margin-right":"1%"})}function k(){a("#tabs-wrapper ul li:first-child a").trigger("click"),a(".tabs-wrapper ul li:first-child a").trigger("click")}function l(b){var c=b.data.direction,d=a(".wise-search-form-container #s2id_form-widgets-marine_unit_id"),e=d.select2("data"),f=a(e.element[0]).next(),g=a(e.element[0]).prev();if("next"===c)var h=f.val();else if("prev"===c)var h=g.val();a(".wise-search-form-container [name='form.widgets.page']").val(""),a(".wise-search-form-container #form-widgets-marine_unit_id").select2().val(h).trigger("change"),a(".wise-search-form-container #s2id_form-widgets-marine_unit_id").hide(),a(".wise-search-form-container .formControls #form-buttons-continue").trigger("click")}function m(){var b=a(".center-section [name='form.buttons.prev']"),c=a(".center-section [name='form.buttons.next']");b.one("click",function(){return!f&&(a(".wise-search-form-container").find("form").append("<input type='hidden' name='form.buttons.prev' value='Prev'>"),void a(".wise-search-form-container").find(".formControls #form-buttons-continue").trigger("click"))}),c.one("click",function(){return!f&&(a(".wise-search-form-container").find("form").append("<input type='hidden' name='form.buttons.next' value='Next'>"),void a(".wise-search-form-container").find(".formControls #form-buttons-continue").trigger("click"))});var d=(a("#wise-search-form select:not(.notselect)").val(),a("#wise-search-form select:not(.notselect) option"));if(a("#marine-unit-nav").hide(),a("#wise-search-form select:not(.notselect)").val()!==a(d[1]).val()){var e='<button type="submit" id="form-buttons-prev-top" name="marine.buttons.prev" class="submit-widget button-field btn btn-default pagination-prev fa fa-angle-left" value="" button="">          </button>';a("#form-buttons-prev-top").append(e),a("#form-buttons-prev-top").on("click",null,{direction:"prev"},l),a("#form-buttons-prev-top").hide(),a("#marine-unit-trigger .arrow-left-container").one("click",function(){a("#form-buttons-prev-top").trigger("click")})}else a("#marine-unit-trigger .arrow-left-container").hide(),a(".text-trigger").css("margin-left",0);if(a("#wise-search-form select:not(.notselect)").val()!==a(d[d.length-1]).val()){var g='<button type="submit" id="form-buttons-next-top" name="marine.buttons.next" class="submit-widget button-field btn btn-default fa fa-angle-right" value="">            </button>';a("#form-buttons-next-top").append(g),a("#form-buttons-next-top").on("click",null,{direction:"next"},l),a("#form-buttons-next-top").hide(),a("#marine-unit-trigger .arrow-right-container").one("click",function(){a("#form-buttons-next-top").trigger("click")})}else a("#marine-unit-trigger .arrow-right-container").hide()}b(),c(a(".wise-search-form-container, #wise-search-form").find("[data-fieldname]")),d(a(".wise-search-form-container")),h(),i(),j(),k(),m()}a(document).ready(function(){a("#wise-search-form").append('<div id="curtain" style="position: absolute; width: 100%;height: 100%;background: rgba(255,255,255,0.6);top:0; left: 0; z-index: 1000"></div>'),a("#ajax-spinner").show();var d=a(".menu .navmenu-item > a");d.each(function(b,c){var d=a(c).parent().find(".submenu-item");0===d.length&&a(this).addClass("no-carret")});var e=a(".side-section .portlet-static-relevant-msfd-descriptors .portletItem p");if(a("#portaltab-map-viewer > a").attr("target","_blank"),e&&a(".side-section .portlet-static-relevant-msfd-descriptors .portletItem p").each(function(b){var c=a(b).find("strong");c.length>0&&(a(this).style.fontWeight="bold")}),window.matchMedia("(min-width: 800px)").matches&&!function(){function b(){c.children().css({display:"block"}),c.slick({autoplay:!0,autoplaySpeed:6e3,speed:1e3,easing:"easeOutQuint",adaptiveHeight:!1,nextArrow:"",prevArrow:"",useCSS:!1});var b,h=function(b,c,d){var e=c-b;0==c&&b==d-1&&(e=1),c==d-1&&0==b&&(e=-1);var f=a(g[b]),h=a(g[c]);h.show();var i=100*e+"%";h.css({display:"block",transform:"translate3d("+i+", 0, 0)"}),a({percent:100*e}).animate({percent:0},{duration:1e3,easing:"easeOutQuint",step:function(a){h.css({transform:"translate3d("+a+"%, 0, 0)"})},done:function(){f.removeClass("current").hide(),h.addClass("current")}})};c.on("beforeChange",function(a,c,e,f){b=(f?f:0)+1,d.text(b+"/"+c.slideCount),h(e,f,c.slideCount)}),f.click(function(){c.slick("slickNext")}),e.click(function(){c.slick("slickPrev")})}jQuery.extend(jQuery.easing,{easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c}});var c=a("#hlslider-slides"),d=a("#hlslider-counter"),e=a("#hlslider-prev"),f=a("#hlslider-next"),g=a(".highlight-photos").children();a(document).ready(function(){var c=a(".highlight-placeholder"),d=a(g[0]);d.css({visibility:"visible"}).addClass("current"),b(),c.css("opacity","0")})}(),a(".login i").on("click",function(){a(this).toggleClass("action-selected"),a(".search i").removeClass("action-selected"),a(".login-container ").animate({height:"toggle"},200),a("#portal-searchbox ").animate({height:"hide"},200)}),a(".search i").on("click",function(){a(this).toggleClass("action-selected"),a(".login i").removeClass("action-selected"),a("#portal-searchbox ").animate({height:"toggle"},200),a(".login-container ").animate({height:"hide"},200)}),window.matchMedia("(max-width: 800px)").matches){var f=a("<span/>",{"class":"mobile_submenu_trigger fa fa-caret-right pull-right"});a(".navmenu-item .submenu .submenu-item").length>0&&a(".navmenu-item .submenu .submenu-item").parent().parent().prepend(f),a("body").on("click",".mobile_submenu_trigger",function(){a(this).toggleClass("rotate"),a(this).parent().find(".submenu").animate({height:"toggle"},200)})}a(".menu-label").click(function(){a(".mobile-menu-trigger i").click()}),a(".mobile-menu-trigger i").on("click",function(){a(this).hasClass("open")?b(this):c(this)}),a(".center-section").prepend('<button class="btn btn-primary pull-right toggle-sidebar">Open sidebar</button>'),a(".side-section").prepend('<button class="btn btn-danger close-sidebar">Close</button>'),a(".toggle-sidebar").on("click",function(){a(".side-section").addClass("show-sidebar")}),a(".close-sidebar").on("click",function(){a(".side-section").removeClass("show-sidebar")}),setTimeout(function(){a("#ajax-spinner").hide("slow"),a(".wise-search-form-container,#wise-search-form").fadeIn("slow"),a("#wise-search-form #curtain").remove(),a("#ajax-spinner").hide()},1e3)});var e=["all","none","invert","apply"];a.randomString=function(){for(var a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",b=8,c="",d=0;d<b;d++){var e=Math.floor(Math.random()*a.length);c+=a.substring(e,e+1)}return c},a.getMultipartData=function(b){var c=a.randomString(),d="--"+c,e="",f="\r\n",g=(a(b).attr("id"),a(b).serializeArray());return 0!==g.length&&(a.each(g,function(a,b){e+=d+f+'Content-Disposition: form-data; name="'+b.name+'"'+f+f+b.value+f}),e+=d+"--"+f,[c,e])};var f=!1;a("body").append(a("#ajax-spinner").clone(!0).attr("id","ajax-spinner2")),a("#ajax-spinner").remove(),d();var g=!0;return window.WISE={},window.WISE.formData=a(".wise-search-form-container").clone(!0),window.WISE.blocks=[],a(".wise-search-form-container").unbind("click").on("click",".formControls #form-buttons-continue",function(b){if(!g)return!0;b.preventDefault();var c=a(".wise-search-form-container").find("form"),e=c.attr("action"),h=a.getMultipartData("#"+c.attr("id"));a.ajax({type:"POST",contentType:"multipart/form-data; boundary="+h[0],cache:!1,data:h[1],dataType:"html",url:e,beforeSend:function(b,c){window.WISE.blocks=[],a("#wise-search-form .no-results").remove();var d="<div id='wise-search-form-container-preloader' ></div>",e=a("#ajax-spinner2").clone().attr("id","ajax-spinner-form").css({position:"absolute",top:"50%",left:"50%",transform:"translate3d(-50%, -50%,0)"}).show();if(a(".wise-search-form-container").append(d),a("#wise-search-form-container-preloader").append(e),a("#form-widgets-marine_unit_id").prop("disabled",!0),a("[name='form.buttons.prev']").prop("disabled",!0),a("[name='form.buttons.next']").prop("disabled",!0),a("[name='marine.buttons.prev']").prop("disabled",!0),a("[name='marine.buttons.next']").prop("disabled",!0),a("#marine-widget-top").length>0){var g=a("#marine-widget-top").next();g.css("position","relative")}else g=a(".left-side-form");g.prepend("<div id='wise-search-form-preloader' ></div>"),a("#wise-search-form-preloader").append("<span style='position: absolute;    display: block;    left: 50%; top: 10%;'></span>"),a("#wise-search-form-preloader > span").append(a("#ajax-spinner2").clone().attr("id","ajax-spinner-center").show()),a("#ajax-spinner-center").css({position:"fixed"}),f=!0},success:function(b,c,e){a("#wise-search-form #wise-search-form-top").siblings().html(""),a("#wise-search-form #wise-search-form-top").siblings().fadeOut("fast"),a("#wise-search-form .topnav").next().remove();var f=a(b);window.WISE.formData=a(b).find(".wise-search-form-container").clone(!0);var g=f.find(".wise-search-form-container"),h=g.html(),i=f.find("#wise-search-form #wise-search-form-top").siblings();a(".wise-search-form-container").html(h),f.find("#wise-search-form .topnav").next().length>0&&a("#wise-search-form .topnav").after(f.find("#wise-search-form .topnav").next()),a("#wise-search-form #wise-search-form-top").siblings().remove(),a("#wise-search-form #wise-search-form-top").after(i),d(),a("[name='form.buttons.prev']").prop("disabled",!1),a("[name='form.buttons.next']").prop("disabled",!1),a("[name='marine.buttons.prev']").prop("disabled",!1),a("[name='marine.buttons.next']").prop("disabled",!1)},complete:function(b,c){"success"===c&&a(".wise-search-form-container").fadeIn("fast",function(){a("#wise-search-form #wise-search-form-top").siblings().fadeIn("fast")}),a(".wise-search-form-container").find("[name='form.buttons.prev']").remove(),a(".wise-search-form-container").find("[name='form.buttons.next']").remove(),a("#wise-search-form #loader-placeholder").remove(),a("#form-widgets-marine_unit_id").prop("disabled",!1),a("#wise-search-form select").hasClass("js-example-basic-single")&&(a("#wise-search-form .select2-choice").width()/2<=a("#wise-search-form #select2-chosen-3").width()?a("#wise-search-form .select2-choice").css("width","50%"):2*(a("#wise-search-form .select2-choice").width()/3)<=a("#wise-search-form #select2-chosen-3").width()&&a("#wise-search-form .select2-choice").css("width","70%")),0===a("#wise-search-form-top").next().length&&a("#wise-search-form #wise-search-form-top").after("<span class='no-results'>No results found.</span>"),f=!1},error:function(b,c,d){if(window.WISE.formData.length>0){var e=a(a(window.WISE.formData)[0]).find(".field");a.each(e,function(b,c){var d=a(c).find(".option input[type='checkbox']:checked");d.length>0})}a("#wise-search-form-top").find(".alert").remove(),a("#wise-search-form-top").append('<div class="alert alert-danger alert-dismissible show" style="margin-top: 2rem;" role="alert">  <strong>There was a error from the server.</strong> You should check in on some of those fields from the form.  <button type="button" class="close" data-dismiss="alert" aria-label="Close">    <span aria-hidden="true">&times;</span>  </button></div>'),a(".wise-search-form-container").find("[name='form.buttons.prev']").remove(),a(".wise-search-form-container").find("[name='form.buttons.next']").remove(),a("#form-widgets-marine_unit_id").prop("disabled",!1),a("#wise-search-form-container-preloader").remove(),a("#wise-search-form-preloader").remove(),a("#ajax-spinner-form").hide(),a("[name='form.buttons.prev']").prop("disabled",!0),a("[name='form.buttons.next']").prop("disabled",!0),a("[name='marine.buttons.prev']").prop("disabled",!0),a("[name='marine.buttons.next']").prop("disabled",!0),f=!1}})}),a(window).load(function(){}),jQuery.noConflict()});