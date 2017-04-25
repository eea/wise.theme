requirejs.config({
    paths: {
        'slick': ['https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min'],
        'jquery': ['https://code.jquery.com/jquery-2.2.4.min']
    }
});

require(['jquery', 'slick'], function($, slick) {
	
    $(document).ready(function() {
        $('.header-bg').slick({
            arrows: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: false
        });

        $hover_trigger = $("[data-toggle=center-square]");

        $hover_trigger.on('mouseenter', function() {

            $data_target = $(this).attr('data-target');
            $target_div = $('.categories.center').find($data_target);
            $other_divs = $('.center-square');
            $other_targets = $('.square');

            if (!$(this).hasClass("gray")) {
                $other_divs.animate({
                    'opacity': 'hide'
                }, 30);
                $target_div.animate({
                    'opacity': 'show'
                }, 600);
            }

            $other_targets.removeClass("gray");
            $(this).addClass("gray");
        })
    });
    return {};
});