requirejs.config({
  paths: {
    'slick': ['//cdn.jsdelivr.net/jquery.slick/1.6.0/slick.min']
  }
});

require(['jquery', 'slick'], function($, slick) {
    $(document).ready(function(){
        $('.header-bg').slick({
            arrows: true,
          infinite: true,
          speed: 300,
          slidesToShow: 1,
          adaptiveHeight: false
        });
    });
    return {};
});
