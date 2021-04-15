$(document).ready(function(){
    $('.boutik__wrapper').slick({
        speed: 300,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: false,
        adaptiveHeight: true,
        swipeToSlide: true,
        prevArrow: '<button type="button" class="slick-prev slick-custarr slick-custarr-general"><img src="icons/arrow_left.svg" alt="prev"></button>',
        nextArrow: '<button type="button" class="slick-next slick-custarr slick-custarr-general"><img src="icons/arrow_right.svg" alt="next"></button>',
        arrows: true,
        swipe: false
    });

    $('.boutik__img').slick({
        speed: 300,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: true,
        adaptiveHeight: true,
        swipeToSlide: true,
        prevArrow: '<button type="button" class="slick-prev slick-custarr slick-custarr-mini"><img src="icons/arrow_left.svg" alt="prev"></button>',
        nextArrow: '<button type="button" class="slick-next slick-custarr slick-custarr-mini"><img src="icons/arrow_right.svg" alt="next"></button>',
        arrows: true,
        responsive: [{
            breakpoint: 471,
            settings: {
                slidesToShow: 2,
                arrows: false
            }
        }]
    });
});

$('.boutik__info').on('click', function() {
    $('.overlay__carousel').text('');
    var photos =  $(this).parent().data('photo').split(', ');
    for (var i = 0; i < photos.length; i++)
        $('.overlay__carousel')[0].insertAdjacentHTML('beforeend', '<img src="' + photos[i] + '" alt="haircut_photo">');

    $('.overlay__name').text($(this).parent().data('name'));
    $('.overlay__type').text($(this).parent().data('subtitle'));
    $('.overlay__text').text('');
    $('.overlay__text')[0].insertAdjacentHTML('beforeend', $(this).parent().data('text'));
    setTimeout(function() {
        $('.overlay').toggleClass('overlay_hidden');
        $('.overlay__carousel').slick({
            speed: 300,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: false,
            variableWidth: true,
            adaptiveHeight: true,
            swipeToSlide: true,
            prevArrow: '<button type="button" class="slick-prev slick-custarr"><img src="icons/arrow_left.svg" alt="prev"></button>',
            nextArrow: '<button type="button" class="slick-next slick-custarr"><img src="icons/arrow_right.svg" alt="next"></button>',
            arrows: true,
            dots: true,
            responsive: [{
                breakpoint: 471,
                settings: {
                    arrows: false
                }
            }]
        });
    }, 100);
    
});

$('.overlay__back').on('click', function() {
    $('.overlay').toggleClass('overlay_hidden');
    setTimeout(function() {
        $('.overlay__carousel').slick('unslick');
    }, 300);
});

$('.sort-by__title:not(.sort-by__title_active)').on('click', function() {
    /*if ($('.sort-by__title_active').lenght != 0) {
        $('.sort-by__title_active').toggleClass('sort-by__title_active');
        $('.sort-by__title_active').siblings('.sort-by__dropdown').toggleClass('sort-by__dropdown_inactive');
        setTimeout(function() {
            $('.sort-by__title_active').siblings('.sort-by__dropdown').css('display', 'none');
        }, 300)
    }*/
    $(this).toggleClass('sort-by__title_active');
    $(this).siblings('.sort-by__dropdown').css('display', 'block');
    $(this).siblings('.sort-by__dropdown').toggleClass('sort-by__dropdown_inactive');
});

$('.sort-by__title.sort-by__title_active').on('click', function() {
    $(this).toggleClass('sort-by__title_active');
    $(this).siblings('.sort-by__dropdown').toggleClass('sort-by__dropdown_inactive');
    setTimeout(function() {
        $(this).siblings('.sort-by__dropdown').css('display', 'none');
    }, 300);
});