$(document).ready(function(){
    $('.boutik__wrapper').slick({ //global boutik items carousel
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

    $('.boutik__img').slick({   //image carousel on each boutik item
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

$('.boutik__info').on('click', function() { //read an info fron boutik dataset, parse it to an overlay and show the overlay
    $('.overlay__carousel').text('');
    var photos =  $(this).parent().data('photo').split(', ');
    for (var i = 0; i < photos.length; i++)
        $('.overlay__carousel')[0].insertAdjacentHTML('beforeend', '<img src="' + photos[i] + '" alt="haircut_photo">');

    $('.overlay__name').text($(this).parent().data('name'));
    $('.overlay__type').text($(this).parent().data('subtitle'));
    $('.overlay__text').text('');
    $('.overlay__text')[0].insertAdjacentHTML('beforeend', $(this).parent().data('text'));
    setTimeout(function() {
        $('.header').toggleClass('header_hidden');
        $('.overlay').toggleClass('overlay_hidden');
        $('.overlay__carousel').slick({ //initialisation of an overlay carousel
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
        if ($(window).height() > $('body').height())
            $('.overlay').css('height', 'calc(100vh - ' + $('.header').height() + 'px)');
        if ($(document).width() > 470)
            $('main').attr('style', 'height: ' + $('.overlay').height() + 'px !important');
    }, 100);
});

$('.overlay__back').on('click', function() {    //"back" button click closes an overlay
    $('.overlay').toggleClass('overlay_hidden');
    $('.header').toggleClass('header_hidden');
    setTimeout(function() {
        $('.overlay__carousel').slick('unslick');
    }, 300);
    $('main').removeAttr('style');
});

var dropdownActiveFlag = 0; //a flag if some sort-by dropdown is opened

$(document).on('click', function(e) {   //close a dropdown opened when clickig outside of it and other dropdowns 
    if ($('.sort-by__dropdown:not(.sort-by__dropdown_inactive)').length == 1)
        if (!$(e.target).is($('.sort-by__title'))
         && !$(e.target).is($('.sort-by__dropdown')) 
         && !$('.sort-by__dropdown:not(.sort-by__dropdown_inactive)')[0].contains(e.target)
         && $('.sort-by__title_active').length == 1
        ) {
            $('.sort-by__title_active').removeClass('sort-by__title_active');
            var elem = $('.sort-by__dropdown');
            elem.addClass('sort-by__dropdown_inactive');
            setTimeout(function() {
                elem.attr('style', 'display: none !important');
            }, 300);
            dropdownActiveFlag = 0;
        }
});

$('.sort-by__wrapper:not(.sort-by__wrapper-mobile) .sort-by__title').on('click', function() {   //fires when desktop/tblet sort-by activation button clicked
    if ($(this).is($('.sort-by__title_active'))) {  //if this dropdown already opened -> close it
        $(this).removeClass('sort-by__title_active');
        $(this).siblings('.sort-by__dropdown').addClass('sort-by__dropdown_inactive');
        setTimeout(function() {
            $(this).siblings('.sort-by__dropdown').attr('style', 'display: none !important');
        }, 300);
        dropdownActiveFlag = 0;
    } else {    //this dropdown was closed -> open it
        $('.sort-by__title_active').removeClass('sort-by__title_active');
        var element = $('.sort-by__dropdown:not(.sort-by__dropdown_inactive)');
        element.addClass('sort-by__dropdown_inactive');
        element.attr('style', 'display: none !important');
        $(this).addClass('sort-by__title_active');
        $(this).siblings('.sort-by__dropdown').css('display', 'block');
        $(this).siblings('.sort-by__dropdown').removeClass('sort-by__dropdown_inactive');
        dropdownActiveFlag = 1;
    }
});

$('.sort-by__wrapper:not(.sort-by__wrapper-mobile) .sort-by__item label').on('click', function() {  //function that enables/disebles buttons when first/last checkbox of filter menu clicked on mobile version
    if ($(this).parent().parent().find('input:checked').length == 0) {  //fires when only one first checkbox turns checked
        $(this).parent().parent().siblings('.sort-by__controls').children('.btn:nth-child(2)').removeClass('btn_inactive');
        $(this).parent().parent().siblings('.sort-by__controls').children().removeAttr('disabled');
    }
    else if ($('.sort-by__item input:checked+label').is($(this)) && $(this).parent().parent().find('input:checked').length == 1) {  //fires when only one the last checkbox turns unchecked
        $(this).parent().parent().siblings('.sort-by__controls').children('.btn:nth-child(2)').addClass('btn_inactive');
        $(this).parent().parent().siblings('.sort-by__controls').children().attr('disabled', 'disabled');
    }
});

$('.sort-by__wrapper:not(.sort-by__wrapper-mobile) button#clear-checkboxes').on('click', function() {   //clear all the checkboxes checked
    $(this).parent().siblings('.sort-by__list').find('input:checked').prop('checked', false);
    $(this).attr('disabled', 'disabled');
    $(this).siblings('.btn').addClass('btn_inactive');
    $(this).siblings('.btn').attr('disabled', 'disabled');
});

$('.hamburger').on('click', function() {    //hamburger menu activation
    $('.hamburger__wrapper_inactive').removeClass('hamburger__wrapper_inactive');
    $('.header').toggleClass('header_hidden');
});

$('.hamburger__close').on('click', function() { //hamburger menu hiding when close button clicked
    $('.hamburger__wrapper').addClass('hamburger__wrapper_inactive');
    $('.header').toggleClass('header_hidden');
});

$('.hamburger__shadow').on('click', function() {    //hamburger menu hiding when shadow clicked
    $('.hamburger__wrapper').addClass('hamburger__wrapper_inactive');
    $('.header').toggleClass('header_hidden');
});

$('.hamburger__dropdown-title').on('click', function() {    //open/close a hamburger menu dropdown
    if ($('.hamburger__dropdown-list_closed').length == 0) {
        $(this).children('img').addClass('carette-up-anim');
        setTimeout(function() {
            $('.hamburger__dropdown-title img').removeClass('carette-up-anim');
        }, 300);
    } else {
        $(this).children('img').addClass('carette-down-anim');
        setTimeout(function() {
            $('.hamburger__dropdown-title img').removeClass('carette-down-anim');
        }, 300);
    }
    
    $('.hamburger__dropdown-list').toggleClass('hamburger__dropdown-list_closed');
});

$('.sort-by__wrapper-mobile .sort-by__title').on('click', function() {  //show filter menu on mobile version
    $('.sort-by__mobile_inactive').removeClass('sort-by__mobile_inactive');
    $('.header').toggleClass('header_hidden');
});

$('.sort-by__mobile-header img').on('click', function() {   //hide filter menu on mobile version
    $('.sort-by__mobile').addClass('sort-by__mobile_inactive');
    $('.header').toggleClass('header_hidden');
});

$('.sort-by__mobile .sort-by__item label').on('click', function() { //function that enables/disebles buttons when first/last checkbox of filter menu clicked on mobile version
    if ($(this).parent().parent().parent().find('input:checked').length == 0) { //fires when only one first checkbox turns checked
        $(this).parent().parent().parent().parent().siblings('.sort-by__mobile-footer').children('button').removeClass('btn_inactive');
        $(this).parent().parent().parent().parent().siblings('.sort-by__mobile-footer').children('button').removeAttr('disabled');
        $(this).parent().parent().parent().parent().siblings('.sort-by__mobile-header').children('button').removeAttr('disabled');
    }
    else if ($('.sort-by__mobile .sort-by__item input:checked+label').is($(this)) && $(this).parent().parent().parent().parent().find('input:checked').length == 1) {   //fires when only one the last checkbox turns unchecked
        $(this).parent().parent().parent().parent().siblings('.sort-by__mobile-footer').children('button').addClass('btn_inactive');
        $(this).parent().parent().parent().parent().siblings('.sort-by__mobile-footer').children('button').attr('disabled', 'disabled');
        $(this).parent().parent().parent().parent().siblings('.sort-by__mobile-header').children('button').attr('disabled', 'disabled');
    }
});

$('.sort-by__mobile button#clear-checkboxes-mobile').on('click', function() {   //clear all the checkboxes checked
    $(this).parent().siblings('.sort-by__mobile-main').find('input:checked').prop('checked', false);
    $(this).attr('disabled', 'disabled');
    $(this).parent().siblings('.sort-by__mobile-footer').children('button').addClass('btn_inactive');
    $(this).parent().siblings('.sort-by__mobile-footer').children('button').attr('disabled', 'disabled');
});