!function(a,b,c){function d(){function d(){if(c(".button-field").addClass("btn"),c(".wise-search-form-container #s2id_form-widgets-marine_unit_id").parentsUntil(".field").parent().hide(),c("#form-buttons-continue").hide("fast"),c("#form-buttons-download").length>0){var a=c("#form-buttons-download").prop("outerHTML").replace("input","button")+' <span style="margin-left:0.4rem;">Download as XLS</span>',b=c("#form-buttons-download").parent();c("#form-buttons-download").remove(),b.append(c(a)),c("#form-buttons-download").val("&#xf019; Download as XLS"),c("#form-buttons-download").addClass("fa").addClass("fa-download")}}function g(b){var d=b.length;b.each(function(b,e){var f=c(e),g=f.find(".option"),h=g.find("input[type='checkbox']").length>0;if(h){var j=f.attr("id"),k='<span class="controls" style="display: inline-block;background-color: #ddd;padding-top: 2px;padding-bottom: 2px;padding-left: 0;position: relative;  "><span style="font-size: 0.8em; margin-left: 5px;">Select :</span><a class="" data-value="all"><label><span class="label">All</span></label></a>',l='<a class="" data-value="none" ><label><span class="label">Clear all</span></label></a>',m='<a class="" data-value="invert"><label><span class="label">Invert selection</span></label></a><div class="btn btn-default apply-filters" data-value="apply"><span class="" >Apply filters</span></div><span class="ui-autocomplete"><span class=" search-icon" ></span><span style="position: relative;padding-top:1px;padding-bottom:1px;background: white;" class="search-span"><input class="ui-autocomplete-input" type="text" style="width: 80%;" /><span class="clear-btn"><a class="fa fa-times"></a></span></span></span>';c("#"+j).on("click",".option",function(){var b=this;c("#ajax-spinner2").hide(),a.WISE.blocks.indexOf(c(this).parentsUntil(".field").parent().attr("id"))!==-1||a.setTimeout(function(){c(".wise-search-form-container .formControls #form-buttons-continue").trigger("click",{button:b})},300)});var n=k+l+m;if(f.find("> label.horizontal").after(n),g.each(function(a){var b=c(g[a]).text();c(g[a]).attr("title",b.trim())}),g.length<4)f.find(".controls a").hide(),f.find(".controls").html("").css("height","1px").css("padding",0);else{f.addClass("panel-group");var o=f.find("> span:not(.controls)");o.css("border-radius",0),o.addClass(j+"-collapse"),o.addClass("collapse");i(f.find(".option input[type='checkbox']:checked"));o.addClass("panel"),o.addClass("panel-default");var p=f.find(".horizontal"),q="<a data-toggle='collapse' class='accordion-toggle' >"+p.text()+"</a>";if(p.html(q),p.addClass("panel-heading").addClass("panel-title"),p.attr("data-toggle","collapse"),p.attr("data-target","."+j+"-collapse"),o.collapse({toggle:!0}),o.collapse({toggle:!0}),f.find(".accordion-toggle").addClass("accordion-after"),o.on("hidden.bs.collapse",function(){o.fadeOut("fast"),f.find(".controls").slideUp("fast"),f.css({"border-bottom":"1px solid #ccc;"})}),o.on("show.bs.collapse",function(){o.fadeIn("fast"),f.find(".controls").slideDown("fast"),f.find("> span").css({display:"block"}),f.find(".accordion-toggle").addClass("accordion-after")}),o.on("hide.bs.collapse",function(){a.setTimeout(function(){f.find(".accordion-toggle").removeClass("accordion-after")},600)}),g.length<6)f.find(".controls .ui-autocomplete").hide();else{o.append("<span class='noresults hidden'>No results found</span>"),o.data("checked_items",[]);var r=o.data("checked_items");c.each(f.find("input:checked"),function(a,b){r.push(b.id)}),f.find(".ui-autocomplete-input").autocomplete({minLength:0,source:[],search:function(a){var b=f.find(".option .label:not(.horizontal) "),d=b.parentsUntil(".option").parent(),e=d.find("input"),g=d.parent(),h=g.find(".noresults");if(""===c(a.target).val()){h.addClass("hidden"),d.removeClass("hidden");var i=f.find(".panel").data("checked_items");return i&&c.each(e,function(a,b){b.checked=i.indexOf(b.id)!==-1}),!0}d.removeClass("hidden");var j=c(a.target).val().toLowerCase().replace(/\s/g,"_"),k=(new RegExp("^"+c.ui.autocomplete.escapeRegex(j),"i"),new RegExp(c.ui.autocomplete.escapeRegex(j),"i")),l={},m=(f.find(".option .label:not(.horizontal) ").map(function(a,b){return l[c(b).text().toLowerCase()]=c(b).text().toLowerCase().replace(/\s/g,"_"),c(b).text().toLowerCase().replace(/\s/g,"_")}),[]);c.each(l,function(a,b){k.test(b)||m.push(a)});var n=b.filter(function(a,b){return m.indexOf(c(b).text().toLowerCase())!==-1}),o=b.filter(function(a,b){return m.indexOf(c(b).text().toLowerCase())===-1});c.each(o,function(a,b){c(b).parentsUntil(".option").parent().find("[type='checkbox']").prop("checked",!0)}),c.each(n,function(a,b){c(b).parentsUntil(".option").parent().find("[type='checkbox']").prop("checked",!1),c(b).parentsUntil(".option").parent().find("input[type='checkbox']").prop("checked",!1),c(b).parentsUntil(".option").parent().find("input[type='checkbox']").removeAttr("checked"),c(b).parentsUntil(".option").parent().addClass("hidden")}),n.length===b.length?h.removeClass("hidden"):h.addClass("hidden")},create:function(){var a=this,b=c(this).parentsUntil(".ui-autocomplete").find(".clear-btn ");b.on("click",null,a,function(a){c(this).parentsUntil(".controls").find("input").val(""),c(this).parentsUntil(".controls").find("input").trigger("change"),c(a.data).autocomplete("search","undefined")})}})}f.find(".search-icon").on("click",function(a){c(a.target).parent().find("input").trigger("focus")})}}--d||c(".wise-search-form-container, #wise-search-form").animate({opacity:1},1e3)})}function h(){function b(b){b.preventDefault();var d=c(this).parent().parent();a.WISE.blocks.push(c(this).parentsUntil(".field").parent().attr("id")),d.find(".apply-filters").show();var e=i(c(d).find("[type='checkbox']"));c.each(e,function(a){"all"!==c(e[a]).val()&&"none"!==c(e[a]).val()&&c(e[a]).prop("checked",!0)})}function d(b){b.preventDefault(),c(this).prop("checked",!1);var d=c(this).parent().parent();d.find(".apply-filters").show();var e=i(c(d).find("[type='checkbox']"));a.WISE.blocks.push(c(this).parentsUntil(".field").parent().attr("id")),c.each(e,function(a){c(e[a]).prop("checked",!1)})}function e(b){b.preventDefault(),c(this).prop("checked",!1);var d=c(this).parent().parent();d.find(".apply-filters").show(),a.WISE.blocks.push(c(this).parentsUntil(".field").parent().attr("id"));var e=i(c(d).find("[type='checkbox']")),f=e.filter(function(a,b){return c(b).is(":checked")}),g=e.filter(function(a,b){return!c(b).is(":checked")});c.each(f,function(a){c(f[a]).prop("checked",!1)}),c.each(g,function(a){c(g[a]).prop("checked",!0)})}var f=c(".controls");f.on("click","a[data-value='all']",b),f.on("click","a[data-value='none']",d),f.on("click","a[data-value='invert']",e),f.one("click",".apply-filters",function(){c(".wise-search-form-container [name='form.widgets.page']").val(0),c(".wise-search-form-container .formControls #form-buttons-continue").trigger("click",{button:this})})}function i(a){return a.filter(function(a,b){return e.indexOf(c(b).val())===-1})}function j(){var b=c(".wise-search-form-container, #wise-search-form").find("[data-fieldname]");b.on("click",".option",function(b){c("#ajax-spinner2").hide();var d=c(this).find("input[type='checkbox']").val();a.WISE.blocks.indexOf(c(this).parentsUntil(".field").parent().attr("id"))!==-1||(c(".wise-search-form-container [name='form.widgets.page']").val(0),e.indexOf(d)===-1&&c(b.target).find("input[type='checkbox']").trigger("click"))})}function k(){function d(a){var b=c(a.element[0]);return'<span style="font-size: 1.5rem; font-weight: bold;color: #337ab7">'+b.attr("data-maintitle")+'</span> <span style="color: #337ab7;font-size: 1.3rem;">('+b.attr("data-subtitle")+")</span>"}c(".wise-search-form-container select").each(function(b,d){c(d).addClass("js-example-basic-single");var e=c(d).find("option").length<10,f={placeholder:"Select an option",closeOnSelect:!0,dropdownAutoWidth:!0,width:"100%",theme:"flat"};e&&(f.minimumResultsForSearch=1/0),c(d).select2(f),"form-widgets-marine_unit_id"===c(d).attr("id"),c(".wise-search-form-container #s2id_form-widgets-marine_unit_id").hide(),c(d).on("select2-selecting",function(b){"form-widgets-article"===c(this).attr("id")&&c(b.target).closest(".form-right-side").next().remove();var d=c(".wise-search-form-container");d.find("[name='form.buttons.prev']").remove(),d.find("[name='form.buttons.next']").remove(),d.find("[name='form.widgets.page']").remove();var e=this;a.setTimeout(function(){c(".wise-search-form-container .formControls #form-buttons-continue").trigger("click",{select:e})},300)})}),c("#wise-search-form select:not(.notselect)").addClass("js-example-basic-single").each(function(a,b){var d={placeholder:"Select an option",closeOnSelect:!0,dropdownAutoWidth:!1,width:"auto",theme:"flat",minimumResultsForSearch:20,allowClear:!0,dropdownParent:"#marine-unit-trigger",dropdownAdapter:"AttachContainer",containerCssClass:"select2-top-override",dropdownCssClass:"select2-top-override-dropdown",debug:!0};if(c(b).select2(d),c(b).parentsUntil(".field").parent().prepend("<h4>Marine Unit ID: </h4>"),c(b).on("select2-open",function(){var a=c("#marine-unit-trigger").offset().top;c("#marine-unit-trigger .arrow").hide(),c(".select2-top-override-dropdown").css({top:a+c("#marine-unit-trigger").height()-c("#marine-unit-trigger .arrow").height()+"px","margin-top":"12px !important"})}),c(b).on("select2-selecting",function(a){c("#wise-search-form #marine-unit-trigger a").text(a.object.text),c(".wise-search-form-container [name='form.widgets.page']").val(0),c(".wise-search-form-container #form-widgets-marine_unit_id").select2().val(a.val).trigger("change"),c(".wise-search-form-container .formControls #form-buttons-continue").trigger("click",{select:a.target})}),c(b).on("select2-close",function(){c("#marine-unit-trigger").css("background","transparent"),c("#marine-unit-trigger a").css("background","transparent"),c("#marine-unit-trigger .arrow").show()}),c("#wise-search-form select").hasClass("js-example-basic-single")){var e=c('#wise-search-form  select [value="'+jQuery("#wise-search-form .select-article select").val()+'"]').text();c("#wise-search-form select:not(.notselect)").parentsUntil(".field").before('<div id="marine-unit-trigger"><div class="text-trigger">'+e+'<span class="fa fa-caret-down text-trigger-icon"></span></div></div>'),c("#marine-unit-trigger").on("click",function(){if(f)return!1;c("#marine-unit-trigger").css("background","rgb(238, 238, 238)"),c("#marine-unit-trigger a").css("background","rgb(238, 238, 238)"),c("#wise-search-form select:not(.notselect)").select2("open");var a=c("#marine-unit-trigger a").height();c(".select2-top-override-dropdown").css("margin-top",a/2+"px")})}});var e="auto",g=!0;a.matchMedia("(max-width: 967px)").matches&&(e=!1,g=!1);var h={placeholder:"Select an option",closeOnSelect:!0,dropdownAutoWidth:g,width:e,theme:"flat",minimumResultsForSearch:20,containerCssClass:"extra-details-select"};if(c.each(c("#wise-search-form .extra-details-select"),function(a,b){c(b).find("option").length>1?c(b).select2(h):c(b).hide()}),a.matchMedia("(max-width: 967px)").matches){var i={placeholder:"Select an option",closeOnSelect:!0,dropdownAutoWidth:g,width:e,theme:"flat",minimumResultsForSearch:20,formatSelection:d,formatResult:d};void 0!==c.fn.select2&&(c("#mobile-select-article").select2(i),c("#mobile-select-article").one("select2-selecting",function(a){b.location.href=a.choice.id}))}c("#wise-search-form .extra-details .tab-panel").fadeOut("slow",function(){c.each(c("#wise-search-form .extra-details .extra-details-section"),function(a,b){c(c(b).find(".tab-panel")[0]).show()})}),c("#wise-search-form .extra-details-select").on("select2-selecting",function(a){var b=c(a.target).parentsUntil(".extra-details-section").parent();c.each(c(b).find(".tab-panel"),function(b,d){c(d).attr("id")!==a.choice.id?c(d).hide():c(d).fadeIn()})})}function l(){var a=c("ul.nav:not(.topnav) > li"),b=a.length;if(b>1){var d=2===b?35:Math.floor((100-b)/b);a.css("width",d+"%");var e=c("ul.nav").width(),f=Math.floor(e/100);c(a).css({"margin-left":0,"margin-right":f/2+"px"})}else c(a).css({"margin-left":0});if(c.each(c(".tabs-wrapper"),function(a,b){if(0===c(b).find("ul").length)return!0}),1===c("#tabs-wrapper ul li").length){c("#tabContents").removeClass("tab-content"),c("#tabs-wrapper ul").attr("class",""),c("#tabs-wrapper ul li").css({"background-color":"transparent","float":"none"});var g=c("#tabs-wrapper ul li a").text();c("#tabs-wrapper ul li").append("<h4>"+g+"</h4>"),c("#tabs-wrapper ul li a").remove(),c("#tabs-wrapper .tab-pane").removeClass("fade")}var h=c("#wise-search-form ul.topnav li").length,i=100/h-1;c("#wise-search-form .topnav li").css({width:i+"%","margin-right":"1%"})}function m(){c("#tabs-wrapper ul li:first-child a").trigger("click"),c(".tabs-wrapper ul li:first-child a").trigger("click")}function n(a){var b=a.data.direction,d=c(".wise-search-form-container #s2id_form-widgets-marine_unit_id"),e=d.select2("data"),f=c(e.element[0]).next(),g=c(e.element[0]).prev();if("next"===b)var h=f.val();else if("prev"===b)var h=g.val();c(".wise-search-form-container [name='form.widgets.page']").remove(),c(".wise-search-form-container #form-widgets-marine_unit_id").select2().val(h).trigger("change"),c(".wise-search-form-container #s2id_form-widgets-marine_unit_id").hide(),c(".wise-search-form-container .formControls #form-buttons-continue").trigger("click")}function o(){var a=c(".center-section [name='form.buttons.prev']"),b=c(".center-section [name='form.buttons.next']");a.one("click",function(){return!f&&(c(".wise-search-form-container").find("form").append("<input type='hidden' name='form.buttons.prev' value='Prev'>"),void c(".wise-search-form-container").find(".formControls #form-buttons-continue").trigger("click"))}),b.one("click",function(){return!f&&(c(".wise-search-form-container").find("form").append("<input type='hidden' name='form.buttons.next' value='Next'>"),void c(".wise-search-form-container").find(".formControls #form-buttons-continue").trigger("click"))});var d=(c("#wise-search-form select:not(.notselect)").val(),c("#wise-search-form select:not(.notselect) option"));if(c("#marine-unit-nav").hide(),c("#wise-search-form select:not(.notselect)").val()!==c(d[1]).val()){var e='<button type="submit" id="form-buttons-prev-top" name="marine.buttons.prev" class="submit-widget button-field btn btn-default pagination-prev fa fa-angle-left" value="" button="">          </button>';c("#form-buttons-prev-top").append(e),c("#form-buttons-prev-top").on("click",null,{direction:"prev"},n),c("#form-buttons-prev-top").hide(),c("#marine-unit-trigger .arrow-left-container").one("click",function(){c("#form-buttons-prev-top").trigger("click")})}else c("#marine-unit-trigger .arrow-left-container").hide(),c(".text-trigger").css("margin-left",0);if(c("#wise-search-form select:not(.notselect)").val()!==c(d[d.length-1]).val()){var g='<button type="submit" id="form-buttons-next-top" name="marine.buttons.next" class="submit-widget button-field btn btn-default fa fa-angle-right" value="">            </button>';c("#form-buttons-next-top").append(g),c("#form-buttons-next-top").on("click",null,{direction:"next"},n),c("#form-buttons-next-top").hide(),c("#marine-unit-trigger .arrow-right-container").one("click",function(){c("#form-buttons-next-top").trigger("click")})}else c("#marine-unit-trigger .arrow-right-container").hide()}var p=c(".prev-next-row").eq(0);p.length&&c("#marine-widget-top").detach().insertBefore(p),d(),g(c(".wise-search-form-container, #wise-search-form").find("[data-fieldname]")),h(c(".wise-search-form-container")),j(),k(),l(),m(),o()}var e=["all","none","invert","apply"];c.randomString=function(){for(var a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz",b=8,c="",d=0;d<b;d++){var e=Math.floor(Math.random()*a.length);c+=a.substring(e,e+1)}return c},c.getMultipartData=function(a){var b=c.randomString(),d="--"+b,e="",f="\r\n",g=(c(a).attr("id"),c(a).serializeArray());return 0!==g.length&&(c.each(g,function(a,b){e+=d+f+'Content-Disposition: form-data; name="'+b.name+'"'+f+f+b.value+f}),e+=d+"--"+f,[b,e])};var f=!1;c("body").append(c("#ajax-spinner").clone(!0).attr("id","ajax-spinner2")),c("#ajax-spinner").remove(),jQuery(b).ready(function(b){d();var c=!0;a.WISE={},a.WISE.formData=b(".wise-search-form-container").clone(!0),a.WISE.blocks=[],b(".wise-search-form-container").unbind("click").on("click",".formControls #form-buttons-continue",function(e){if(!c)return!0;e.preventDefault();var g,h=b(".wise-search-form-container").find("form"),i=h.attr("action"),j=arguments[1],k=j&&j.button;j&&!k||(g=function(a){var c,d,e;c=b(a).closest(".panel-group"),d=c.closest(".subform"),e=d.find(".subform"),c.nextAll(".panel-group").find(".panel").empty(),e.length&&e.find(".panel").empty()},k?g(k):b(".ui-autocomplete-input").each(function(a,b){if(b.value)return g(b),!1}));var l=b.getMultipartData("#"+h.attr("id"));b.ajax({type:"POST",contentType:"multipart/form-data; boundary="+l[0],cache:!1,data:l[1],dataType:"html",url:i,beforeSend:function(c,d){a.WISE.blocks=[],b("#wise-search-form .no-results").remove();var e="<div id='wise-search-form-container-preloader' ></div>",g=b("#ajax-spinner2").clone().attr("id","ajax-spinner-form").css({position:"absolute",top:"50%",left:"50%",transform:"translate3d(-50%, -50%,0)"}).show();if(b(".wise-search-form-container").append(e),b("#wise-search-form-container-preloader").append(g),b("#form-widgets-marine_unit_id").prop("disabled",!0),b("[name='form.buttons.prev']").prop("disabled",!0),b("[name='form.buttons.next']").prop("disabled",!0),b("[name='marine.buttons.prev']").prop("disabled",!0),b("[name='marine.buttons.next']").prop("disabled",!0),b("#marine-widget-top").length>0){var h=b("#marine-widget-top").next();h.css("position","relative")}else h=b(".left-side-form");h.prepend("<div id='wise-search-form-preloader' ></div>"),b("#wise-search-form-preloader").append("<span style='position: absolute;    display: block;    left: 50%; top: 10%;'></span>"),b("#wise-search-form-preloader > span").append(b("#ajax-spinner2").clone().attr("id","ajax-spinner-center").show()),b("#ajax-spinner-center").css({position:"fixed"}),f=!0},success:function(c,e,f){b("#wise-search-form #wise-search-form-top").siblings().html(""),b("#wise-search-form #wise-search-form-top").siblings().fadeOut("fast"),b("#wise-search-form .topnav").next().remove();var g=b(c);a.WISE.formData=b(c).find(".wise-search-form-container").clone(!0);var h=g.find(".wise-search-form-container"),i=h.html(),j=g.find("#wise-search-form #wise-search-form-top").siblings();b(".wise-search-form-container").html(i),g.find("#wise-search-form .topnav").next().length>0&&b("#wise-search-form .topnav").after(g.find("#wise-search-form .topnav").next()),b("#wise-search-form #wise-search-form-top").siblings().remove(),b("#wise-search-form #wise-search-form-top").after(j),d(),b("[name='form.buttons.prev']").prop("disabled",!1),b("[name='form.buttons.next']").prop("disabled",!1),b("[name='marine.buttons.prev']").prop("disabled",!1),b("[name='marine.buttons.next']").prop("disabled",!1)},complete:function(a,c){"success"===c&&b(".wise-search-form-container").fadeIn("fast",function(){b("#wise-search-form #wise-search-form-top").siblings().fadeIn("fast")}),b(".wise-search-form-container").find("[name='form.buttons.prev']").remove(),b(".wise-search-form-container").find("[name='form.buttons.next']").remove(),b("#wise-search-form #loader-placeholder").remove(),b("#form-widgets-marine_unit_id").prop("disabled",!1),b("#wise-search-form select").hasClass("js-example-basic-single")&&(b("#wise-search-form .select2-choice").width()/2<=b("#wise-search-form #select2-chosen-3").width()?b("#wise-search-form .select2-choice").css("width","50%"):2*(b("#wise-search-form .select2-choice").width()/3)<=b("#wise-search-form #select2-chosen-3").width()&&b("#wise-search-form .select2-choice").css("width","70%")),0===b("#wise-search-form-top").next().length&&b("#wise-search-form #wise-search-form-top").after("<span class='no-results'>No results found.</span>"),f=!1},error:function(c,d,e){if(a.WISE.formData.length>0){var g=b(b(a.WISE.formData)[0]).find(".field");b.each(g,function(a,c){var d=b(c).find(".option input[type='checkbox']:checked");d.length>0})}b("#wise-search-form-top").find(".alert").remove(),b("#wise-search-form-top").append('<div class="alert alert-danger alert-dismissible show" style="margin-top: 2rem;" role="alert">  <strong>There was a error from the server.</strong> You should check in on some of those fields from the form.  <button type="button" class="close" data-dismiss="alert" aria-label="Close">    <span aria-hidden="true">&times;</span>  </button></div>'),b(".wise-search-form-container").find("[name='form.buttons.prev']").remove(),b(".wise-search-form-container").find("[name='form.buttons.next']").remove(),b("#form-widgets-marine_unit_id").prop("disabled",!1),b("#wise-search-form-container-preloader").remove(),b("#wise-search-form-preloader").remove(),b("#ajax-spinner-form").hide(),b("[name='form.buttons.prev']").prop("disabled",!0),b("[name='form.buttons.next']").prop("disabled",!0),b("[name='marine.buttons.prev']").prop("disabled",!0),b("[name='marine.buttons.next']").prop("disabled",!0),f=!1}})})})}(window,document,jQuery);
//# sourceMappingURL=msfd_search.js.map