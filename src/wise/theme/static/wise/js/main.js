requirejs.config({paths:{slick:["https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min"],jquery:["https://code.jquery.com/jquery-2.2.4.min"]}}),require(["jquery","slick"],function(a,b){function c(b){a(b).removeClass("open"),window.matchMedia("(min-width: 800px)").matches?a(".navmenu-items").animate({opacity:"hide"},{duration:80,complete:function(){a(".header-wave .menu-brand").animate({opacity:"show"},1),a(".menu .menu-brand").animate({opacity:"hide"},30),a(".menu").animate({height:"hide"},200)}}):a(".menu").animate({height:"hide"},200)}function d(b){a(b).addClass("open"),a(".menu").animate({height:"show"},{duration:200,complete:function(){window.matchMedia("(min-width: 800px)").matches&&(a(".navmenu-items").animate({opacity:"show"},30),$bgheight=a("body").height()-a(".menu > img").height(),a(".menu-bg").height($bgheight+3),a(".navmenu-items").css("display","flex"),a(".header-wave .menu-brand").animate({opacity:"hide"},30),a(".menu .menu-brand").animate({opacity:"show"},30))}})}function e(a){a.children().css({display:"block"}),a.slick({autoplay:!0,autoplaySpeed:6e3,speed:1e3,easing:"easeOutQuint",adaptiveHeight:!1,nextArrow:"",prevArrow:"",useCSS:!1})}return jQuery.extend(jQuery.easing,{easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c}}),a(document).ready(function(){if($menu_items=a(".menu .navmenu-item > a"),$menu_items.each(function(b,c){$submenu_items=a(this).parent().find(".submenu-item"),0==$submenu_items.length&&a(this).addClass("no-carret")}),a(".side-section .portlet-static-relevant-msfd-descriptors .portletItem p").each(function(b){$strong=a(this).find("strong"),$strong.length>0&&(a(this).style.fontWeight="bold")}),window.matchMedia("(min-width: 800px)").matches){$slider_text=a(".highlight"),$slider_text.each(function(b,c){$slider_section=a("<div/>",{"class":"slider_section"}),a(".highlights").append($slider_section),$slider_section.append(c)}),a(".header-bg .highlight").remove();var b=a("#hlslider-slides"),f=a("#hlslider-counter"),g=a("#hlslider-prev"),h=a("#hlslider-next"),i=a(".highlight-photos").children(),j=a(i[0]);console.log(i),console.log(j),j.css({visibility:"visible"}).addClass("current"),e(b);var k;b.on("beforeChange",function(a,b,c,d){k=(d?d:0)+1,f.text(k+"/"+b.slideCount),l(c,d,b.slideCount)}),h.click(function(){b.slick("slickNext")}),g.click(function(){b.slick("slickPrev")});var l=function(b,c,d){var e=c-b;0==c&&b==d-1&&(e=1),c==d-1&&0==b&&(e=-1),$currentImg=a(i[b]),$nextImg=a(i[c]),$nextImg.show();var f=100*e+"%";$nextImg.css({display:"block",transform:"translate3d("+f+", 0, 0)"}),a({percent:100*e}).animate({percent:0},{duration:1e3,easing:"easeOutQuint",step:function(a){$nextImg.css({transform:"translate3d("+a+"%, 0, 0)"})},done:function(){$currentImg.removeClass("current").hide(),$nextImg.addClass("current")}})}}$hover_trigger=a("[data-toggle=center-square]"),$hover_trigger.on("mouseover",function(){$data_target=a(this).attr("data-target"),$target_div=a(".categories.center").find($data_target),$other_divs=a(".center-square"),$other_targets=a(".square"),a(this).hasClass("gray")||($other_divs.css("display","none"),$target_div.animate({opacity:"show"},200)),$other_targets.removeClass("gray"),a(this).addClass("gray")}),a(".login i").on("click",function(){a(this).toggleClass("action-selected"),a(".search i").removeClass("action-selected"),a(".login-container ").animate({height:"toggle"},200),a("#portal-searchbox ").animate({height:"hide"},200)}),a(".search i").on("click",function(){a(this).toggleClass("action-selected"),a(".login i").removeClass("action-selected"),a("#portal-searchbox ").animate({height:"toggle"},200),a(".login-container ").animate({height:"hide"},200)}),window.matchMedia("(max-width: 800px)").matches&&($mobile_submenu_trigger=a("<span/>",{"class":"mobile_submenu_trigger fa fa-caret-right pull-right"}),a(".navmenu-item .submenu .submenu-item").length>0&&a(".navmenu-item .submenu .submenu-item").parent().parent().prepend($mobile_submenu_trigger),a("body").on("click",".mobile_submenu_trigger",function(){a(this).toggleClass("rotate"),a(this).parent().find(".submenu").animate({height:"toggle"},200)})),a(".menu-label").click(function(){a(".mobile-menu-trigger i").click()}),a(".mobile-menu-trigger i").on("click",function(){a(this).hasClass("open")?c(this):d(this)}),a(".toggle-sidebar").on("click",function(){a(".side-section").addClass("show-sidebar")}),a(".close-sidebar").on("click",function(){a(".side-section").removeClass("show-sidebar")})}),{}});