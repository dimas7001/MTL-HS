var positions = [];
var onePagePositions = [];

$(document).ready(function(){
    var hairstylistsLen = hairstylists.length;
    var pagesAmount = Math.trunc(hairstylistsLen / itemsPerPage) + 1;
    
    for (var i = 0; i < hairstylistsLen; i++) {

        if (i == 0) {
            var wrapper = document.createElement("div");
            wrapper.dataset.page = 1;
        }

        onePagePositions.push({ lat: hairstylists[i].adress.latitude, lng: hairstylists[i].adress.longitude});

        var datasetPhoto = "";
        var datasetPhotoLen = hairstylists[i].imagesOverlay.length;
        for (var j = 0; j < datasetPhotoLen; j++)
            if (j + 1 != datasetPhotoLen)
                datasetPhoto += hairstylists[i].imagesOverlay[j] + ", ";
            else
                datasetPhoto += hairstylists[i].imagesOverlay[j];
        
        var boutikImg = "";
        var boutikImgLen = hairstylists[i].imagesGeneral.length;
        for (var j = 0; j < boutikImgLen; j++)
            boutikImg += `<img src="${hairstylists[i].imagesGeneral[j]}" alt="haircut${j + 1}">`
        
        var boutikTags = "";
        var boutikTagsLen = hairstylists[i].categories.length;
        for (var j = 0; j < boutikTagsLen; j++)
            boutikTags += `<div class="tag">${hairstylists[i].categories[j]}</div>`

        wrapper.insertAdjacentHTML("beforeend", `
            <div class="boutik"
                data-name="${hairstylists[i].businessName}"
                data-subtitle="${hairstylists[i].subtitleOverlay}"
                data-text="${hairstylists[i].textOverlay}"
                data-photo="${datasetPhoto}"
                data-avatar="${hairstylists[i].avatar}"
                data-id="${hairstylists[i].id}"
            >
                <div class="boutik__img">${boutikImg}</div>
                <div class="boutik__info">
                    <div class="boutik__top-wrapper">
                        <div>
                            <h3 class="boutik__name">${hairstylists[i].businessName}</h3>
                            <div class="boutik__location">
                                <img src="icons/location.svg" alt="location">
                                <a href="#" class="text-m">Address</a>
                            </div>
                        </div>
                        <div class="boutik__website">
                            <img src="icons/send.svg" alt="send-button">
                            <a href="${hairstylists[i].website}" class="text-s">Website</a>
                        </div>
                    </div>
                    <div class="boutik__desc text-m">${hairstylists[i].description}</div>
                    <div class="tag__wrapper text-m-b">${boutikTags}</div>
                </div>
            </div>
        `);

        if (i != 0 && ((i + 1) % itemsPerPage == 0 || i + 1 == hairstylistsLen)) {
            $('.boutik__wrapper')[0].insertAdjacentElement('beforeend', wrapper);
            var wrapper = document.createElement("div");
            positions.push(onePagePositions);
            onePagePositions = [];
        }
    }

    var paginationContent = "";
    for (var i = 0; i < pagesAmount; i++)
        paginationContent += `<div class="pagination__page">${i+1}</div>`;
    $('.pagination')[0].insertAdjacentHTML('beforeend', paginationContent);

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
        swipe: false,
        mobileFirst: false
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
        prevArrow: '<button type="button" class="slick-prev slick-custarr slick-custarr-mini"></button>',
        nextArrow: '<button type="button" class="slick-next slick-custarr slick-custarr-mini"></button>',
        arrows: true,
        responsive: [{
            breakpoint: 471,
            settings: {
                slidesToShow: 2,
                arrows: false
            }
        },{
            breakpoint: 375,
            settings: {
                slidesToShow: 1,
                arrows: false
            }
        }]
    });

    $('.pagination').slick({ //pagination
        speed: 300,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: false,
        adaptiveHeight: false,
        swipeToSlide: false,
        arrows: false,
        swipe: false
    });

    $('.boutik__info, .boutik__img img').on('click', function() { //read an info fron boutik dataset, parse it to an overlay and show the overlay
        $('.overlay__carousel').text('');
        var photos =  $(this).parents('.boutik').data('photo').split(', ');
        for (var i = 0; i < photos.length; i++)
            $('.overlay__carousel')[0].insertAdjacentHTML('beforeend', `<img src="${photos[i]}" alt="haircut_photo${i + 1}">`);
    
        $('.overlay__top-wrapper img').attr("src", $(this).parents('.boutik').data('avatar'));
        $('.overlay__name').text($(this).parents('.boutik').data('name'));
        $('.overlay__type').text($(this).parents('.boutik').data('subtitle'));
        $('.overlay__text').text('');
        $('.overlay__text')[0].insertAdjacentHTML('beforeend', $(this).parents('.boutik').data('text'));
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

    $('.boutik__wrapper').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $('.pagination').slick('slickGoTo', nextSlide);
        for (var i = currentSlide * itemsPerPage; i < ((markers.length - currentSlide * itemsPerPage >= itemsPerPage) ? ((currentSlide + 1) * itemsPerPage) : markers.length); i++)
            markers[i].setMap(null);
        for (var i = nextSlide * itemsPerPage; i < ((markers.length - nextSlide * itemsPerPage >= itemsPerPage) ? ((nextSlide + 1) * itemsPerPage) : markers.length); i++)
            markers[i].setMap(map);
    });

});

var map;
var markers = [];
var markerOpened;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 45.535208, lng: -73.663268},
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });  
    
    var counter = 0;
    for (var i = 0; i < positions.length; i++)
        for (var j = 0; j < positions[i].length; j++) {
            markers[counter] = new google.maps.Marker({
                position: { lat: positions[i][j].lat, lng: positions[i][j].lng},
                icon: 'icons/marker.png',
                zIndex: 1,
                noClear: true,
            });
            counter++;
        }

    for (var i = 0; i < itemsPerPage; i++)
        markers[i].setMap(map);

    for (var i = 0; i < markers.length; i++) {
        google.maps.event.addListener(markers[i], 'click', function() {
            if (markerOpened) {
                markerOpened.setIcon('icons/marker.png');
                markerOpened.setZIndex(1);
            }
            this.setIcon('icons/marker-a.png');
            this.setZIndex(10);
            markerOpened = this;

        });
    }

    google.maps.event.addListener(map, 'click', function() {
        if (markerOpened) {
            markerOpened.setIcon('icons/marker.png');
            markerOpened.setZIndex(1);
            markerOpened = 0;
        }
   });

    $('.boutik').on('hover', function() {
        if (markerOpened) {
            markerOpened.setIcon('icons/marker.png');
            markerOpened.setZIndex(1);
        }
        markerOpened = markers[$(this).data('id') - 1];
        markerOpened.setIcon('icons/marker-a.png');
        markerOpened.setZIndex(10);
    });

    $('.boutik').on('mouseleave', function() {
        if (markerOpened) {
            markerOpened.setIcon('icons/marker.png');
            markerOpened.setZIndex(1);
            markerOpened = 0;
        }
    });
};






var itemsPerPage = 20;

var hairstylists = [
    {
        id: 1,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.5397923889708,
            longitude: -73.61056752145646
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 2,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.506008,
            longitude: -73.623882
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Foil Partial"
    },{
        id: 3,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.460540,
            longitude: -73.702835
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 4,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.605319,
            longitude: -73.549714
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 5,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.572644,
            longitude: -73.519501
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 6,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.646617,
            longitude: -73.501648
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 7,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.585140,
            longitude: -73.642411
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 8,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.432600,
            longitude: -73.603272
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 9,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.509162,
            longitude: -73.682923
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 10,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.530812,
            longitude: -73.548340
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 11,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.484616,
            longitude: -73.552460
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 12,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.531293,
            longitude: -73.630738
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 13,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.572644,
            longitude: -73.631424
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 14,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.550049,
            longitude: -73.590912
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 15,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.507237,
            longitude: -73.839478
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 16,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.524558,
            longitude: -73.717255
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 17,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.493280,
            longitude: -73.748154
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 18,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.461503,
            longitude: -73.886170
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 19,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.507060,
            longitude: -73.866515
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 20,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.483957,
            longitude: -73.699660
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 21,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.464216,
            longitude: -73.552031
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 22,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.608986,
            longitude: -73.552031
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 23,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.546987,
            longitude: -73.539672
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 24,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.475291,
            longitude: -73.585677
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    },{
        id: 25,
        avatar: "img/avatar/boutik-loremp-loremio.png",
        businessName: "Boutik Loremp Loremio",
        adress: {
            street: "6990 rue st Hubert",
            zip: "H2S 2M9",
            city: "montreal",
            state: "quebec",
            country: "canada",
            latitude: 45.517646,
            longitude: -73.645415
        },
        website: "#",
        categories: [
            "Balayage",
            "Air touch",
            "Haircut"
        ],
        imagesGeneral: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut3.png"
        ],
        imagesOverlay: [
            "img/haircuts/haircut1.png",
            "img/haircuts/haircut2.png",
            "img/haircuts/haircut4.png"
        ],
        description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        textOverlay: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.<br><br>All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text.",
        subtitleOverlay: "Partial Foil"
    }
];