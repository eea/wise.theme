function autoCollapseNavigation(){var a=$("#content-header"),b=$(".navbar-nav");$(".search-submit");a.removeClass("collapse-nav"),b.innerHeight()>90&&a.addClass("collapse-nav")}function alignNavSubmenu(){var a=$("#portal-top"),b=$("#portal-globalnav"),c=b.children("li"),d=a.width();c.mouseenter(function(){var a=$(this),b=a.children(".submenu"),c=b.width();if(b.length>0)var e=b.offset().left;d-(c+e)<0&&b.addClass("aligned-submenu")})}function setTwoRowNavigation(){var a=$("#portal-globalnav>li>a");a.each(function(a,b){var c=$(this).text(),d=c.split(" ").length;if($(b).contents().eq(0).wrap('<span class="nav-text"/>'),d>2){var e=$(this).find(".nav-text"),f=e.html().split(" ");f=f.slice(0,2).join(" ")+"<br> "+f.slice(2).join(" "),e.html(f)}})}function displayImageCaption(){var a=$("#content-core p").find("img");a.each(function(){var a=$(this),b=!a.attr("title").match(/png|jpg/g),c=a.attr("class");b&&(a.wrap('<div class="image-wrapper" />'),a.after('<p class="image-caption">'+$(this).attr("title")+"</p>"),a.parent(".image-wrapper").addClass(c))})}$(document).ready(function(){function a(){autoCollapseNavigation()}$(".search-icon").click(function(a){$(".search-modal").fadeToggle("fast"),a.stopPropagation()}),$(".search-modal").click(function(a){a.stopPropagation()}),$(".top-actions").prependTo(".navbar-collapse"),setTwoRowNavigation(),autoCollapseNavigation(),alignNavSubmenu(),displayImageCaption();var b;$(window).on("resize",function(){clearTimeout(b),b=setTimeout(a,100)})}),$(document).click(function(){$(".search-modal").hide()});