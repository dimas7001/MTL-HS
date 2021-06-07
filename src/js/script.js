var positions = [];
var onePagePositions = [];
var mobileFlag = 0;
var mobile470Flag = 0;
var offsetDelta = 0;
var popupBottomDelta = 0;

var itemsPerPage = 10;

function cutString(str, maxLen) {   //cut the string to needed char amout without word tearing apart
    var forCut = str.indexOf(' ', maxLen);
    if (forCut == -1) return str + '..';
    return str.substring(0, forCut) + '...'
}

function parseTime(total) { //convert total duration to common format
    var hours = total / 60 | 0;
    var minutes = total % 60;
    if (hours && minutes)
        return `${hours}h ${minutes}min`;
    else if (!hours && minutes)
            return `${minutes}min`;
        else
            return `${hours}h`;
}

function getCategoryImg(category, n) {   //get 'n' first photos of service
    var categoryImg = "";
    var categoryImgLen = category.pictures.length;
    for (var z = 0; z < categoryImgLen; z++)  //get all the service images
        if (z < n)
            categoryImg += `<div style="background-image: url(${category.pictures[z]})"></div>`
    return categoryImg;
};

function getPrice(services, positions) {    //get price or price options blocks of the service
    var priceBlock = "";
    var price = "";

    for (let i = 0; i < positions.length; i++) {
        let priObj = services[positions[i]].price;
            if (priObj.priceType == "From") //fill in the service pricing info 
                price = `
                    <div>
                        <div class="overlay__price-from">From</div>
                        <div>${priObj.price}</div>
                    </div>
                `;
            else if (priObj.specialPrice)
                    price = `
                        <div>
                            <div>${priObj.specialPrice}</div>
                            <div class="overlay__price-old">${priObj.price}</div>
                        </div>
                    `;
                else 
                    price = `<div>${priObj.price}</div>`;

            priceBlock += `
                <div class="overlay__price-option text-m">
                    <div>
                        <div class="overlay__price-option-name">${services[positions[i]].name}</div>
                        <div class="overlay__time">${parseTime(priObj.duration)}</div>
                    </div>
                    ${price}
                </div>
            `;
        }

    /*if (service.pricingOptions) {
        let priOp = service.pricingOptions;
        for (let i = 0; i < priOp.length; i++) {

            if (priOp[i].priceType == "From") //fill in the service pricing info 
                price = `
                    <div>
                        <div class="overlay__price-from">From</div>
                        <div>${priOp[i].specialPrice}</div>
                    </div>
                `;
            else if (priOp[i].specialPrice)
                    price = `
                        <div>
                            <div>${priOp[i].specialPrice}</div>
                            <div class="overlay__price-old">${priOp[i].price}</div>
                        </div>
                    `;
                else 
                    price = `<div>${priOp[i].price}</div>`;            

            //calculate the time
            var hours = priOp[i].duration / 60 | 0;
            var minutes = priOp[i].duration % 60;
            if (hours && minutes)
                var duration = `${hours}h ${minutes}min`;
            else if (!hours && minutes)
                    var duration = `${minutes}min`;
                else
                    var duration = `${hours}h`;

            priceBlock += `
                <div class="overlay__price-option text-m">
                    <div>
                        <div class="overlay__price-option-name">${priOp[i].pricingName}</div>
                        <div class="overlay__time">${duration}</div>
                    </div>
                    ${price}
                </div>
            `;
        }
    } else {    //if service has no pricing options
        var hours = service.price.duration / 60 | 0;
        var minutes = service.price.duration % 60;
        if (hours && minutes)
            var duration = `${hours}h ${minutes}min`;
        else if (!hours && minutes)
                var duration = `${minutes}min`;
            else
                var duration = `${hours}h`;
        priceBlock = `
            <div class="overlay__price text-m">
                <div class="overlay__time">${duration}</div>
                <div>${service.price.specialPrice ? price = service.price.specialPrice : price = service.price.price}</div>
            </div>
        `;
    }*/

    return priceBlock;
}

$(document).ready(function(){
    
    if ($(document).width() <= 1024) {
        mobileFlag = 1;
        offsetDelta = 43;
        popupBottomDelta = 22;
    }
    if ($(document).width() <= 470)
        mobile470Flag = 1;
        

    var hairstylistsLen = hairstylists.length;
    var pagesAmount = Math.trunc(hairstylistsLen / itemsPerPage) + 1;

    $('.boutik__wrapper').text("");

    for (var i = 0; i < hairstylistsLen; i++) { //parsing the items info

        if (i == 0) {
            var wrapper = document.createElement("div");
            wrapper.dataset.page = 1;   //d
        }

        onePagePositions.push({ lat: hairstylists[i].address.latitude, lng: hairstylists[i].address.longitude});  //get position

        var categoryList = "";
        var categoryListLen = hairstylists[i].categories.length;
        for (var j = 0; j < categoryListLen; j++) {  //get the info of all categories

            /*var priceBlock = "";
            var severalPrices = "";
            if (hairstylists[i].services[j].price.priceType == "From") { //fill in the service pricing info 
                priceBlock = `
                    <div class="boutik__price-from">From</div>
                    <div>${hairstylists[i].services[j].price.specialPrice}</div>
                `;
                severalPrices = "boutik__info_several-prices";
            } else if (hairstylists[i].services[j].price.specialPrice)
                {
                    priceBlock = `
                        <div>${hairstylists[i].services[j].price.specialPrice}</div>
                        <div class="boutik__price-old">${hairstylists[i].services[j].price.price}</div>
                    `;
                    severalPrices = "boutik__info_several-prices";
                } else 
                    priceBlock = `<div class="boutik__price-old">${hairstylists[i].services[j].price.price}</div>`;
            
            var hours = hairstylists[i].services[j].price.duration / 60 | 0;
            var minutes = hairstylists[i].services[j].price.duration % 60;
            if (hours && minutes)
                var duration = `${hours}h ${minutes}min`;
            else if (!hours && minutes)
                    var duration = `${minutes}min`;
                else
                    var duration = `${hours}h`;                
            */

            let catName = hairstylists[i].categories[j].name.toLowerCase();
            let amountAvailable = 0;
            let firstServiceFlag = 1;
            let firstService;
            let servicesPositions = [];
            for (let k = 0; k < hairstylists[i].services.length; k++)
                if (catName == hairstylists[i].services[k].category.toLowerCase())
                    if (firstServiceFlag) {
                        firstService = hairstylists[i].services[k];
                        firstServiceFlag = 0;
                        amountAvailable++;
                        servicesPositions.push(k);
                    } else {
                        amountAvailable++;
                        servicesPositions.push(k);
                    }

            categoryList += `
                <div class="boutik__service"
                    data-category="${hairstylists[i].categories[j].name}"
                    data-category-num="${j}"
                    data-services="${servicesPositions.join()}"
                >
                    <div class="boutik__img">
                        ${getCategoryImg(hairstylists[i].categories[j], 4)}
                    </div>
                    <div class="boutik__info-label-wrapper text-m" style="margin-top: ${categoryListLen > 1 ? !mobile470Flag ? `54px` : `46px` : !mobile470Flag ? `22px` : `16px`}">
                        <div class="boutik__info-label">
                            <div class="boutik__info-label-name">${firstService.name}</div>
                            <div class="boutik__info-label-duration">${parseTime(firstService.price.duration)}</div>
                            <div class="boutik__info-label-price">${firstService.price.price}</div>
                        </div>
                        ${(amountAvailable > 1) ? `<div class="boutik__info-label">${amountAvailable} services available</div>` : ''}
                    </div>
                </div>
            `;
        }
        


        //inserting the item + filling it with prepared info and info get from array
        wrapper.insertAdjacentHTML("beforeend", `
            <div class="boutik"
                data-idl="${i}"
            >
                <div class="overlay__top-wrapper">
                    <img src="${hairstylists[i].avatar}" alt="avatar">
                    <div class="overlay__titles">
                        <h3 class="boutik__name">${hairstylists[i].businessName}</h3>
                        <div class="boutik__location">
                            <a href="#" class="text-s">${hairstylists[i].address.street}</a>
                        </div>
                    </div>
                </div>
                <div class="boutik__service-wrapper">
                    ${categoryList}
                </div>
            </div>
        `);

        if (i != 0 && ((i + 1) % itemsPerPage == 0 || i + 1 == hairstylistsLen)) {  //insert the page when the page items limit hit or items array is ended
            $('.boutik__wrapper')[0].insertAdjacentElement('beforeend', wrapper);
            var wrapper = document.createElement("div");
            positions.push(onePagePositions);   //filling up the position arr for later use with markers setting
            onePagePositions = [];
        }
    }


    $('.boutik__service-wrapper').slick({   //service carousel for each boutik item
        speed: 300,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: false,
        adaptiveHeight: true,
        swipeToSlide: false,
        swipe: false,
        prevArrow: '<button type="button" class="slick-prev slick-custarr slick-custarr-mini"></button>',
        nextArrow: '<button type="button" class="slick-next slick-custarr slick-custarr-mini"></button>',
        arrows: true,
        dots: true,
        responsive: [{
            breakpoint: 768,
            settings: {
                swipe: true
            }
        }]
    });

    if (pagesAmount > 1) {
        var paginationContent = "";
        for (var i = 0; i < pagesAmount; i++)   //filling the pagination with proper pages amount
            paginationContent += `<div class="pagination__page">${i+1}</div>`;
        $('.pagination')[0].insertAdjacentHTML('beforeend', paginationContent);

        $('.pagination').slick({ //pagination
            speed: 300,
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            centerMode: true,
            variableWidth: false,
            adaptiveHeight: true,
            swipeToSlide: false,
            arrows: false,
            swipe: false
        });
    }

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

    $('.boutik__service').on('click', function() { //read an info from boutik dataset, parse it to an overlay and show the overlay
        var boutik = hairstylists[$(this).parents('.boutik').data('idl')];
        var servicesPositions = $(this).data('services').toString();
        if (servicesPositions.indexOf(',') != -1)
            servicesPositions = servicesPositions.split(',');
        //var service = boutik.services[$(this).data('order')];
        $('.overlay .overlay__top-wrapper>img').attr("src", boutik.avatar);
        $('.overlay .boutik__name').text(boutik.businessName);
        $('.overlay .boutik__location a').text(hairstylists[i].address.street);
        $('.overlay__price-option').remove();
        $('.overlay__price').remove();
        $('.overlay__img').text("");
        $('.overlay__img')[0].insertAdjacentHTML('afterbegin', getCategoryImg(boutik.categories[$(this).data('category-num')], !mobile470Flag ? 4 : 2));
        $('.overlay__img')[0].insertAdjacentHTML('afterend', getPrice(boutik.services, servicesPositions));
        $('.overlay__text').text(boutik.bio);
        $('.overlay__to-website a').attr("href", boutik.website);
        setTimeout(function() {
            $('.overlay').toggleClass('overlay_hidden');
            $('.overlay__to-website').toggleClass('overlay__to-website_hidden');
            if ($(window).height() > $('body').height() || $(window).height() > $('.overlay').height())
                $('.overlay').css('height', 'calc(100vh - ' + $('.header').height() + 'px)');
            //if ($(document).width() > 470)
                $('main').attr('style', 'height: ' + $('.overlay').height() + 'px !important');
        }, 100);
    });

    $('.overlay__back').on('click', function() {    //"back" button click closes an overlay
        $('.overlay').toggleClass('overlay_hidden');
        $('.overlay__to-website').toggleClass('overlay__to-website_hidden');
        $('main').removeAttr('style');
        $('.overlay').removeAttr('style');
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

    $('.sort-by__wrapper:not(.sort-by__wrapper-mobile) .sort-by__title').on('click', function() {   //fires when desktop/tablet sort-by activation button clicked
        if (!$(this).is($('.sort-by__title_active')))  //if this dropdown already opened -> close it
            /*$(this).removeClass('sort-by__title_active');
            $(this).siblings('.sort-by__dropdown').addClass('sort-by__dropdown_inactive');
            setTimeout(function() {
                $(this).siblings('.sort-by__dropdown').attr('style', 'display: none !important');
            }, 300);
            dropdownActiveFlag = 0;
        } else {   */ //this dropdown was closed -> open it
            if (!mobile470Flag) {
                $('.sort-by__title_active').removeClass('sort-by__title_active');
                var element = $('.sort-by__dropdown:not(.sort-by__dropdown_inactive)');
                element.addClass('sort-by__dropdown_inactive');
                element.attr('style', 'display: none !important');
                $(this).addClass('sort-by__title_active');
                $(this).siblings('.sort-by__dropdown').css('display', 'block');
                $(this).siblings('.sort-by__dropdown').removeClass('sort-by__dropdown_inactive');
                dropdownActiveFlag = 1;
                if (!$(this).val().length) {
                    let list = $('#search-services');
                    list.text("");
                    fillTheSearchCathegory(list, '<li>', '</li>');
                }
            } else {
                $('.sort-by__mobile_inactive').removeClass('sort-by__mobile_inactive');
                if (mobileFlag) //set mobile filter menu height on width <= 1024
                    $('.sort-by__mobile').css('height', window.innerHeight);
                $('main').attr('style', 'height: ' + (window.innerHeight - $('.header').height() - 12) + 'px !important');
                $('#my-search-m').focus();
            }
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

    /*$('.sort-by__title').on('click', function() {  //show filter menu on mobile version
        $('.sort-by__mobile_inactive').removeClass('sort-by__mobile_inactive');
        $('main').attr('style', 'height: ' + $('.overlay').height() + 'px !important');
        //$('.header').toggleClass('header_hidden');
        if (mobileFlag) //set mobile filter menu height on width <= 1024
            $('.sort-by__mobile').css('height', window.innerHeight);
    });*/

    $('.sort-by__mobile-header img').on('click', function() {   //hide filter menu on mobile version
        $('.sort-by__mobile').addClass('sort-by__mobile_inactive');
        $('main').removeAttr('style');
    });

    $('.boutik__wrapper').on('beforeChange', function(e, slick, currentSlide, nextSlide) {  //change the pagination slide + markers on the map (desktop) + scroll to top when clicking the boutic__wrapper carousel controls
        if ($(e.target).is($('.boutik__wrapper'))) {
            $('.pagination').slick('slickGoTo', nextSlide);
            $('html, body').animate({scrollTop: $('.boutik__wrapper').offset().top - 32}, 350);
            if (!mobileFlag) {
                for (var i = currentSlide * itemsPerPage; i < ((markers.length - currentSlide * itemsPerPage >= itemsPerPage) ? ((currentSlide + 1) * itemsPerPage) : markers.length); i++)
                    markers[i].setMap(null);
                for (var i = nextSlide * itemsPerPage; i < ((markers.length - nextSlide * itemsPerPage >= itemsPerPage) ? ((nextSlide + 1) * itemsPerPage) : markers.length); i++)
                    markers[i].setMap(map);
            }
        }
    });
    
    $('.general__fixed-close, .toggle__map').on('click', function(e) {   //show/hide the map
        $('body').attr('style', function(index, attr) {
            return attr == 'overflow: hidden;' ? 'overflow: visible;' : 'overflow: hidden;';
        });
        $('.general__fixed').toggleClass('general__fixed_inactive');
        $('.general__fixed-popup').addClass('general__fixed-popup_hidden'); //close the popup
        setTimeout(function() {
            $('.general__fixed-popup').css('display', 'none');
        }, 300);
        if (markerOpened) { //close marker opened
            markerOpened.setIcon('icons/marker.png');
            markerOpened.setZIndex(markerOpenedZ);
            markerOpened = 0;
            markerOpenedZ = 0;
        }
        if ($(e.target).is($('.toggle__map'))) {
            $('html, body').animate({scrollTop: 0}, 150); 
            if (mobileFlag && !mobile470Flag)   //set map height on 470 < width <= 1024
                $('.general__fixed #map').css('height', window.innerHeight - 90);
            if (mobileFlag && mobile470Flag)    //set map height on width <= 470
                $('.general__fixed #map').css('height', window.innerHeight - 61);
        }
    });

    if (mobileFlag && !mobile470Flag)   //dynamic map height resize on 470 < width <= 1024
        $(window).on('resize', function() {
            $('.general__fixed #map').animate({height: window.innerHeight - 90}, 100);
        });
    if (mobileFlag && mobile470Flag)    //dynamic map height resize on width <= 470
        $(window).on('resize', function() {
            $('.general__fixed #map').animate({height: window.innerHeight - 61}, 100);
        });
    if (mobileFlag) //dynamic mobile filter menu height resize on width <= 1024
        $(window).on('resize', function() {
            $('.sort-by__mobile').css('height', window.innerHeight);
        });

    $('.general__fixed-popup-close').on('click', function() {   //hide the map popup
        $('.general__fixed-popup').addClass('general__fixed-popup_hidden');
        setTimeout(function() {
            $('.general__fixed-popup').css('display', 'none');
        }, 300);
    });

    $('.general__fixed-filters').on('click', () => {    //show the filter mobile overlay when clicking on the map "filters" button 
        $('.sort-by__mobile_inactive').removeClass('sort-by__mobile_inactive');
        if (mobileFlag) //set mobile filter menu height on width <= 1024
            $('.sort-by__mobile').css('height', window.innerHeight);
    });

});

var map;
var markers = [];
var markerOpened;
var markerOpenedZ;
function initMap() {
    setTimeout(function() {
    
        map = new google.maps.Map(document.getElementById("map"), { //map initialization
            center: { lat: 45.535208, lng: -73.663268},
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: "greedy",
        });  
        
        var counter = 0;
        for (var i = 0; i < positions.length; i++)  //setting markers
            for (var j = 0; j < positions[i].length; j++) {
                var image = {   //marker image setting
                    url: "icons/marker.png",
                    size: new google.maps.Size(22, 22)
                };
                markers[counter] = new google.maps.Marker({ //markers init
                    position: { lat: positions[i][j].lat, lng: positions[i][j].lng},    //getting marker position info from prepared earlier array 
                    icon: image,
                    zIndex: counter,
                    noClear: true,
                });
                counter++;
            }

        var to = itemsPerPage;  //show only markers of boutiks on the first page
        if (mobileFlag) //show all markers when page width <= 1024
            to = markers.length;
            
        for (var i = 0; i < to; i++)    //show markers
            markers[i].setMap(map);

        for (var i = 0; i < markers.length; i++) {
            google.maps.event.addListener(markers[i], 'click', function() { //click the marker
                if (markerOpened) { //close previous marker
                    markerOpened.setIcon('icons/marker.png');
                    markerOpened.setZIndex(markerOpenedZ);
                }
                this.setIcon('icons/marker-a.png');
                markerOpenedZ = this.getZIndex();
                this.setZIndex(1000);
                markerOpened = this;

                /*
                //filling the popup with info start
                var base = hairstylists[markerOpenedZ];
                $('.general__fixed-popup img').attr('src', base.imagesGeneral[0]);
                $('.general__fixed-popup-name').text(base.businessName);
                $('.general__fixed-popup-desc').text(base.description.substr(0, 79) + '...');
                $('.general__fixed-popup .tag__wrapper').text("");
                for (var j = 0; j < base.categories.length; j++)
                    $('.general__fixed-popup .tag__wrapper')[0].insertAdjacentHTML('afterbegin', `<div class="tag">${base.categories[j]}</div>`);
                //filling the popup with info end
                $('.general__fixed-popup').css('display', 'flex');
                setTimeout(function() {
                    $('.general__fixed-popup').removeClass('general__fixed-popup_hidden');
                }, 10);
                if (!mobile470Flag) {   //if page width > 470
                    var positionPX = fromLatLngToPoint(markerOpened.position, map);
                    var top = positionPX.y + 6;
                    var left = positionPX.x;
                    $('.general__fixed-popup').css({'top': top, 'left': left, 'transform': 'translateX(-50%)', 'bottom': 'auto'});
                    if ($('.general__fixed-popup').width() / 2 > positionPX.x - 15) //if left popup side falls out of map -> set the popup stick to left side of the map
                        $('.general__fixed-popup').css({'left': 15 + offsetDelta, 'transform': 'none'});
                    if ($('.general__fixed-popup').width() / 2 > $('#map').width() - positionPX.x - 15) //if popup side falls out of map -> set the popup stick to right side of the map
                        $('.general__fixed-popup').css({'left': 'auto', 'right': 15 + offsetDelta, 'transform': 'none'});
                    if ($('.general__fixed-popup').height() + 6 > $('#map').height() - positionPX.y - 4)    //if bottom popup side falls out of map -> set the popup under the marker
                        $('.general__fixed-popup').css({'top': 'auto', 'bottom': $('#map').height() - positionPX.y + 28 + popupBottomDelta});
                }   
                */
            });
        }

        google.maps.event.addListener(map, 'click', function() {    //show the popup when clickin the marker
            if (markerOpened) { //close previous popup and marker if needed
                markerOpened.setIcon('icons/marker.png');
                markerOpened.setZIndex(markerOpenedZ);
                markerOpened = 0;
                markerOpenedZ = 0;
            }
            $('.general__fixed-popup').addClass('general__fixed-popup_hidden');
            setTimeout(function() {
                $('.general__fixed-popup').css('display', 'none');
            }, 300);
        });

        map.addListener("center_changed", () => {   //close the popup when map's scrolling
            if ($('.general__fixed-popup_hidden').length == 0) {
                $('.general__fixed-popup').addClass('general__fixed-popup_hidden');
                setTimeout(function() {
                    $('.general__fixed-popup').css('display', 'none');
                }, 300);
            }
        });

        $('.boutik').on('hover', function() {   //highlight the proper marker on the map when boutik hovering
            if (markerOpened) { //close previous marker
                markerOpened.setIcon('icons/marker.png');
                markerOpened.setZIndex(markerOpenedZ);
            }
            markerOpened = markers[$(this).data('idl')];
            markerOpenedZ = markerOpened.getZIndex();
            markerOpened.setIcon('icons/marker-a.png');
            markerOpened.setZIndex(1000);
        });

        $('.boutik').on('mouseleave', function() {  //clear the proper marker on the map when boutik mouseleaving
            if (markerOpened) {
                markerOpened.setIcon('icons/marker.png');
                markerOpened.setZIndex(markerOpenedZ);
                markerOpened = 0;
                markerOpenedZ = 0;
            }
        });

    }, 150);
};

function fromLatLngToPoint(latLng, map) {   //get the marker position in pixels relatively to map window 
    var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
    var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
    var scale = Math.pow(2, map.getZoom());
    var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
    return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
}

function insert(str, index, value) {    //insert 'index' between 'value' and 'value+1' to str
    return str.substr(0, index) + value + str.substr(index);
}

function getServicesMatching(val, serv) {   //get all the services that have 'val' as a substring
    var res = [];
    for (let i = 0; i < serv.length; i++)
        if (serv[i].toLowerCase().indexOf(val) != -1 && res.length <= 7)
            res.push(serv[i]);
    return res;
}

function fillTheSearchCathegory(list, openingTag, closingTag) { //fill in the search prompt with 7 first items
    list.textContent = '';
    for (let i = 0; i < services.length; i++)
        if (i < 7)
            list[0].insertAdjacentHTML('afterbegin', `${openingTag}${services[i]}${closingTag}`);
}

function getResultsProcessed(val, searchItems, openingTag, closingTag) {    //output the list items that matched to inputed to search fiels value wrapped to some tag
    let res = "";
    for (let i = 0; i < searchItems.length; i++) {
        let searchItemContent = searchItems[i],
            searchItemContentLC = searchItemContent.toLowerCase();
        let from = [];
        let flag = 0;
        let pos = 0;
        while (flag != -1) {
            pos = searchItemContentLC.indexOf(val, pos);
            from.push(pos);
            flag = pos;
            if (pos != -1)
                pos += val.length;
        }
        let delta = 7;
        let deltaFT = 3;
        for (let j = 0; j < from.length; j++)
            if (from[j] != -1) {
                searchItemContent = insert(`${searchItemContent}`, from[j] + delta*j, `<b>`);
                searchItemContent = insert(`${searchItemContent}`, from[j] + val.length + delta*j + deltaFT, `</b>`);
            }
        from = [];
        res += `${openingTag}${searchItemContent}${closingTag}`;
    }
    return res;
}

$('input#my-search').on('input', function() {   //on desktop/tablet search input
    openingTag = '<li>';
    closingTag = '</li>';
    let val = $(this).val().toLowerCase();
    let searchItems = getServicesMatching(val, services);
    let list = $('#search-services');
    list.text("");
    if (searchItems.length) //if there any services matching to value inputed
        if (val.length >= 3)
            list[0].insertAdjacentHTML('afterbegin', getResultsProcessed(val, searchItems, openingTag, closingTag));    //insert matching services
        else
            fillTheSearchCathegory(list, openingTag, closingTag);   //insert first 7 items
    else    //if there're no items matching to search value |--| if 3 < search value length => show nothing-found text, if not => insert first 7 items
        val.length >= 3 ? list[0].insertAdjacentHTML('afterbegin', `${openingTag}Sorry, nothing was found :(${closingTag}`) : fillTheSearchCathegory(list, openingTag, closingTag);
});

$('input#my-search-m').on('input', function() { //on mobile search input
    openingTag = '<div class="sort-by__item">';
    closingTag = '</div>';
    let val = $(this).val().toLowerCase();
    $('#my-search').val(val);
    let searchItems = getServicesMatching(val, services);
    let list = $('#m-search-services .sort-by__item-wrapper-mobile');
    list.text("");
    if (val.length) {   //if value inputed = void => hide popular search, show services & stylists
        $('#m-search-popular-searches').css('display', 'none');
        $('#m-search-services').css('display', 'block');
        $('#m-search-stylists').css('display', 'block');
        if (searchItems.length) //if there any services matching to value inputed
            if (val.length >= 3) 
                list[0].insertAdjacentHTML('afterbegin', getResultsProcessed(val, searchItems, openingTag, closingTag));    //insert matching services
            else
                fillTheSearchCathegory(list, openingTag, closingTag);   //insert first 7 items
        else    //if there're no items matching to search value |--| if 3 < search value length => show nothing-found text, if not => insert first 7 items
            val.length >= 3 ? list[0].insertAdjacentHTML('afterbegin', `${openingTag}Sorry, nothing was found :(${closingTag}`) : fillTheSearchCathegory(list, openingTag, closingTag);
    } else {    //if value inputed != void => show popular search, hide services & stylists
        $('#m-search-popular-searches').css('display', 'block');
        $('#m-search-services').css('display', 'none');
        $('#m-search-stylists').css('display', 'none');
    }     
});




var services = [
    'Lorem ipsum dolor sit amet',
    'consectetur, adipisicing elit. Reiciendis',
    'ducimus aliquam et minima unde',
    'eos odio ex nisi vero amet',
    'facere natus temporibus eius illo',
    'a sapiente laborum, quos quidem!',
    'Fugiat expedita blanditiis, voluptatumlor',
    'esse aliquid, labore nostrum',
    'obcaecati asperiores accusamus deleniti',
    'minima reiciendis earumlor',
]

var hairstylists = [
    {
        "email": "",
        "bio": "Health/Beauty 📍.Montreal Québec",
        "avatar": "img/haircuts/chimhair/0_n.jpg",
        "businessName": "Chimhair",
        "activated": true,
        "address": {
            "street": "3940 Rue Bélanger",
            "zip": "H1X 1B7",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.56376178482215,
            "longitude": -73.58799617506061
        },
        "website": "https://www.instagram.com/chimhair/",
        "categories": [
            {
                "name": "Braids",
                "description": "",
                "pictures": [
                    "img/haircuts/chimhair/5_n.jpg", "img/haircuts/chimhair/6_n.jpg", "img/haircuts/chimhair/13_n.jpg", "img/haircuts/chimhair/37_n.jpg"
                ],
                "audience": ["Male", "Female"]
            }
        ],
        "services": [
            {
                "name": "Braids",
                "category": "Braids",
                "description": "Health/Beauty 📍.Montreal Québec",
                "price": {
                    "duration": 120,
                    "priceType": "From",
                    "price": "$40"
                },
                "pricingOptions": []
            }
        ]
    },
    {
        "email": "",
        "bio": "Barber- haircut- beard • Gentleman Full Service. \r\n  Bonjour à tous, si vous cherchez pour un barbier, vous êtes les bienvenu. Je suis situé sur Grande-Allée. J’ai plus de 3 ans d’expérience comme coiffeur pour homme et barbier. J’offre des services des soins de peau et de massage faciale pour homme. Services offerts en français ou anglais, avec ou sans rendez-vous. 438-833-7479",
        "avatar": "img/haircuts/khalifa/s-l200.jpg",
        "businessName": "Khalifa",
        "activated": true,
        "address": {
            "street": "4785 Grande Allée",
            "zip": "J4Z 3W5",
            "city": "Brossard",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.481664480642124,
            "longitude": -73.45471793075684
        },
        "website": "#",
        "categories": [
            {
                "name": "Men's haircut",
                "pictures": [
                    "img/haircuts/khalifa/9.jpg", "img/haircuts/khalifa/059.jpg", "img/haircuts/khalifa/59.jpg", "img/haircuts/khalifa/52.jpg"
                ],
                "audience": ["Male"]
            }
        ],
        "services": [
            {
                "name": "Men's haircut",
                "category": "Men's haircut",
                "description": "",
                "price": {
                    "duration": 35,
                    "priceType": "Fixed",
                    "price": "$25"
                }
            }, {
                "name": "Beard trim, shave, line-up",
                "category": "Men's haircut",
                "description": "",
                "price": {
                    "duration": 20,
                    "priceType": "Fixed",
                    "price": "$15"
                }

            }, {
                "name": "Fade and styling the length of the hair",
                "category": "Men's haircut",
                "description": "",
                "price": {
                    "duration": 50,
                    "priceType": "Fixed",
                    "price": "$40",
                    "pricingName": "Fade and styling the length of the hair"
                }
            }, {
                "name": "Hair wash, haircut, beard, facial, scalp massage",
                "category": "Men's haircut",
                "description": "",
                "price": {
                    "duration": 60,
                    "priceType": "Fixed",
                    "price": "$50"
                }
            }
        ]
    },
    {
        "email": "",
        "bio": "𝓣𝓸𝓻𝓻𝓮𝓼🌹 📍\r\n  LA SECTION 💈- Old Montreal • Tues/Thurs/Fri/Sat/Sun",
        "avatar": "img/haircuts/torres.tresses/3_n.jpg",
        "businessName": "Torres.tresses",
        "activated": true,
        "address": {
            "street": "777 boulevard Robert-Bourassa",
            "zip": "H3C 3Z7",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.49979666773361,
            "longitude": -73.56226785857132
        },
        "website": "https://www.instagram.com/jaimlylin/",
        "categories": [
            {
                "name": "Braids",
                "pictures": [
                    "img/haircuts/torres.tresses/39_n.jpg", "img/haircuts/torres.tresses/87_n.jpg", "img/haircuts/torres.tresses/13_n.jpg", "img/haircuts/torres.tresses/02_n.jpg"
                ],
                "audience": ["Female", "Male"]
            }, {
                "name": "Men's haircut",
                "pictures": [
                    "img/haircuts/torres.tresses/95_n.jpg", "img/haircuts/torres.tresses/99_n.jpg", "img/haircuts/torres.tresses/532_n.jpg", "img/haircuts/torres.tresses/55_n.jpg"
                ],
                "audience": ["Male", "Children"]
            }
        ],
        "services": [
            {
                "name": "Braids",
                "category": "Braids",
                "description": "",
                "price": {
                    "duration": 100,
                    "priceType": "From",
                    "price": "$90"
                }
            }, {
                "name": "Men's cut",
                "category": "Men's haircut",
                "description": "",
                "price": {
                    "duration": 45,
                    "priceType": "From",
                    "price": "$30"
                }
            }
        ]
    },
    {
        "email": "",
        "bio": "Beauty, Cosmetic & Personal Care. MTL, Near Jarry / Pie-IX 📍\r\n  Men’s Fade • Blonde Specialist • Balayage \r\n 𝔄𝔰𝔦𝔞𝔫 𝔈𝔵𝔠𝔢𝔭𝔱𝔦𝔬𝔫",
        "avatar": "img/avatar/jaimlyin.jpg",
        "businessName": "Jaimlyin",
        "activated": true,
        "address": {
            "street": "Jarry / Pie-IX",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.57232842516312,
            "longitude": -73.6024766693129
        },
        "website": "https://www.instagram.com/jaimlylin/",
        "categories": [
            {
                "name": "Men's haircut",
                "pictures": [
                    "img/haircuts/jaimlylin/89_n.jpg", "img/haircuts/jaimlylin/38_n.jpg", "img/haircuts/jaimlylin/96_n.jpg", "img/haircuts/jaimlylin/99_n.jpg"
                ],
                "audience": ["Male", "Children"]
            }, {
                "name": "Highlights",
                "pictures": [
                    "img/haircuts/jaimlylin/34_n.jpg", "img/haircuts/jaimlylin/71_n.jpg", "img/haircuts/jaimlylin/78_n.jpg", "img/haircuts/jaimlylin/14_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Balayage",
                "category": "Highlights",
                "description": "",
                "price": {
                    "duration": 120,
                    "priceType": "Fixed",
                    "price": "$200"
                }
            }, {
                "name": "Haircut",
                "category": "Men's haircut",
                "description": "",
                "price": {
                    "duration": 45,
                    "priceType": "Fixed",
                    "price": "$25"
                }
            }, {
                "name": "Haircut and beard trim and shave",
                "category": "Men's haircut",
                "description": "",
                "price": {
                    "duration": 60,
                    "priceType": "Fixed",
                    "price": "$30"
                }
            }
        ]
    }, 
    {
        "email": "",
        "bio": "Nous nous occupons de vous dans les moindres détails. Hair and Makeup et plus encore. Il vous suffit de prendre rendez-vous avec nous, Et nous répondons à tout vos besoins.",
        "avatar": "img/avatar/vmbeauty_n.jpg",
        "businessName": "VMBeautys",
        "activated": true,
        "address": {
            "street": "44 rue Bélanger",
            "zip": " H1T 1B2",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.533912433793475,
            "longitude": -73.6142309597181
        },
        "website": "https://www.instagram.com/_vm_beauty_/",
        "categories": [
            {
                "name": "Braids",
                "pictures": [
                    "img/haircuts/makeup/861_n.jpg", "img/haircuts/makeup/08_n.jpg", "img/haircuts/makeup/62_n.jpg", "img/haircuts/makeup/9_n.jpg"
                ],
                "audience": ["Female"]
            }, {
                "name": "Makeup",
                "pictures": [
                    "img/haircuts/makeup/2_n.jpg", "img/haircuts/makeup/90_n.jpg", "img/haircuts/makeup/03_n.jpg", "img/haircuts/makeup/022_n.jpg"
                ],
                "audience": ["Female"]
            }, {
                "name": "Wigs",
                "pictures": [
                    "img/haircuts/makeup/72_n.jpg", "img/haircuts/makeup/41_n.jpg", "img/haircuts/makeup/14_n.jpg", "img/haircuts/makeup/19_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Full Face Make-Up",
                "category": "Makeup",
                "description": "",
                "price": {
                    "duration": 90,
                    "priceType": "From",
                    "price": "$50"
                }
            },
            {
                "name": "Wig installation",
                "category": "Wigs",
                "description": "",
                "price": {
                    "duration": 90,
                    "priceType": "From",
                    "price": "$50"
                }
            },
            {
                "name": "Custom wig",
                "category": "Wigs",
                "description": "",
                "price": {
                    "duration": 120,
                    "priceType": "From",
                    "price": "$250"
                }
            },
            {
                "name": "Wig coloration",
                "category": "Wigs",
                "price": {
                    "duration": 120,
                    "priceType": "Fixed",
                    "price": "$250"
                }
            }, {
                "name": "Braids",
                "category": "Braids",
                "description": "",
                "price": {
                    "duration": 105,
                    "priceType": "From",
                    "price": "$80"
                }
            }
        ]
    }, 
    {
        "email": "Ig:hairlounge_loveyourhair - balayage - IG:hair_by_teofil -Blondes- Balayage, Highlights, Color, Haircuts",
        "bio": "Not all hairdressers are equal when it comes to hair color, and this is even truer when it comes to blond hair, this color is so tricky to adopt! Don't hesitate to schedule an appointment, I will advise you on how to care for your hair prior to the treatment.",
        "avatar": "img/avatar/2_n.jpg",
        "businessName": "Nigella Milner Hair",
        "activated": true,
        "address": {
            "street": "8252 rue de sallaberry, Montreal",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.5337,
            "longitude": -73.72059
        },
        "website": "#",
        "categories": [
            {
                "name": "Highlights",
                "pictures": [
                    "img/haircuts/highlights/b1_n.jpg", "img/haircuts/highlights/b8_n.jpg", "img/haircuts/highlights/b08_n.jpg", "img/haircuts/highlights/b3_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Balayage",
                "category": "Highlights",
                "treatment": "",
                "description": "Not all hairdressers are equal when it comes to hair color, and this is even truer when it comes to blond hair, this color is so tricky to adopt! Don't hesitate to schedule an appointment, I will advise you on how to care for your hair prior to the treatment.",
                "price": {
                    "duration": 120,
                    "priceType": "From",
                    "price": "$220.99",
                    "pricingName": "Short hair"
                },
                "pricingOptions": [
                    {
                        "duration": 160,
                        "priceType": "From",
                        "price": "$75.48",
                        "specialPrice": "$240.99",
                        "pricingName": "Medium hair"
                    }, {
                        "duration": 180,
                        "priceType": "From",
                        "price": "$337.85",
                        "specialPrice": "$260.99",
                        "pricingName": "Long hair"
                    }
                ]
            }
        ]
    }, 
    {
        "email": "carolinamejia@isologix.com",
        "bio": "Beauty, Cosmetic & Personal Care\r\n Wigs, Bundle, frontals, closures. \r\n Make-up, skin. \r\n Worldwide shipping",
        "avatar": "img/avatar/8_n.jpg",
        "businessName": "Sapphira Beauty",
        "activated": true,
        "address": {
            "street": "4650 avenue Madison, Montreal",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.50659,
            "longitude": -73.70459
        },
        "website": "https://www.instagram.com/sapphira_beauty/",
        "categories": [
            {
                "name": "Wigs",
                "pictures": [
                    "img/haircuts/wigs/0_n.jpg", "img/haircuts/wigs/5_n.jpg", "img/haircuts/wigs/8_n.jpg", "img/haircuts/wigs/78_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Frontal sew-in install",
                "category": "Wigs",
                "description": "",
                "price": {
                    "duration": 240,
                    "priceType": "From",
                    "price": "$290"
                }
            }, {
                "name": "Weave maintenance",
                "category": "Wigs",
                "description": "",
                "price": {
                    "duration": 240,
                    "priceType": "From",
                    "price": "$290"
                }
            }, {
                "name": "360 Lace Glue with installation",
                "category": "Wigs",
                "description": "",
                "price": {
                    "duration": 240,
                    "priceType": "From",
                    "price": "$350"
                }
            }
        ]
    }, 
    {
        "email": "IG:leboncoin_afro, zurihairstudio:goddessbraids",
        "bio": "Specialize in Braids But I also Do Sew ins , wigs and Ponytails . I am Currently trying to build my clientele. I work hard to make sure my clients leave happy and satisfied come Get Styled!",
        "avatar": "img/avatar/45.png",
        "businessName": "Lebon Afro",
        "activated": true,
        "address": {
            "street": "1790 Blvd le Corbusier, Laval",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.567,
            "longitude": -73.73464
        },
        "website": "https://zorastreet.com",
        "categories": [
            {
                "name": "Braids",
                "pictures": [
                    "img/haircuts/crochet/01_n.jpg",
                    "img/haircuts/crochet/003_n.jpg",
                    "img/haircuts/crochet/66_n.jpg",
                    "img/haircuts/crochet/63_n.jpg",
                    "img/haircuts/goddessbraids/1_n.jpg",
                    "img/haircuts/goddessbraids/3_n.jpg",
                    "img/haircuts/goddessbraids/6_n.jpg",
                    "img/haircuts/goddessbraids/91_n.jpg"
                ],
                "audience": ["All"]
            }
        ],
        "services": [
            {
                "name": "Crochet braids",
                "category": "Braids",
                "description": "",
                "price": {
                    "duration": 135,
                    "priceType": "From",
                    "price": "$135"
                }
            }, {
                "name": "Goddess braids",
                "category": "Braids",
                "description": "",
                "price": {
                    "duration": 120,
                    "priceType": "From",
                    "price": "$160"
                }
            }
        ]
    }, 
    {
        "email": "IG:nerlaay",
        "bio": "I am professional and I love what I do. I am very attentive to my clients needs and wants but I will also suggest what I think will work best for my clients. I am upbeat and friendly! Looking forward to making you look more beautiful than you already are! I always keep up with the latest trends and styles.",
        "avatar": "img/avatar/18_n.jpg",
        "businessName": "Nerlaay The Hairstylist",
        "activated": true,
        "address": {
            "street": "404 rue de Langlois, Terrebonne",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.65786,
            "longitude": -73.67848
        },
        "website": "#",
        "categories": [
            {
                "name": "Twists",
                "pictures": [
                    "img/haircuts/twists/2_n.jpg", "img/haircuts/twists/26_n.jpg", "img/haircuts/twists/134_n.jpg", "img/haircuts/twists/74_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Passion twists",
                "category": "Twists",
                "description": "",
                "price": {
                    "duration": 140,
                    "priceType": "Fixed",
                    "price": "$150.00",
                    "specialPrice": "$140.00"
                }
            }, {
                "name": "Senegalese twists",
                "category": "Twists",
                "description": "",
                "price": {
                    "duration": 300,
                    "priceType": "Fixed",
                    "price": "$200.00",
                    "pricingName": "Senegalese twists"
                }
            }
        ]
    }, 
    {
        "email": "IG:elio74 - ombre",
        "bio": "Professional hairstylist, colorist, and haircare specialist providing you great customer service in salon as well as in the comfort of your own home.",
        "avatar": "img/avatar/ho.jpg",
        "businessName": "Eliosso Hair",
        "activated": true,
        "address": {
            "street": "6010 boulevard Léger, Montreal-Nord",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.59905,
            "longitude": -73.63286
        },
        "website": "#",
        "categories": [
            {
                "name": "Highlights",
                "pictures": [
                    "img/haircuts/highlights/o25_n.jpg", "img/haircuts/highlights/o12_n.jpg", "img/haircuts/highlights/o08_n.jpg", "img/haircuts/highlights/o53_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Ombre",
                "category": "Highlights",
                "description": "",
                "price": {
                    "duration": 135,
                    "priceType": "From",
                    "price": "$240"
                }
            }, {
                "name": "Ombre and style",
                "category": "Highlights",
                "description": "",
                "price": {
                    "duration": 160,
                    "priceType": "From",
                    "price": "$265"
                }
            }
        ]
    }, 
    {
        "email": "G:hairbyoj - crochet braids",
        "bio": "I LOVE what I do. I take pride in enhancing the beauty of others. My clients are more then just people..they really MATTER to me. I do what ever I can to maintain the integrity and over all health of hair.",
        "avatar": "img/avatar/81.jpg",
        "businessName": "Makingway Beauty","activated": true,
        "address": {
            "street": "435 rue de Chambly, Longueuil",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.55311,
            "longitude": -73.49505
        },
        "website": "#",
        "categories": [
            {
                "name": "Braids",
                "pictures": [
                    "img/haircuts/crochet/998_n.jpg", "img/haircuts/crochet/94_n.jpg", "img/haircuts/crochet/162_n.jpg", "img/haircuts/crochet/95_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Crochet Braids",
                "category": "Braids",
                "description": "",
                "price": {
                    "duration": 135,
                    "priceType": "Fixed",
                    "price": "$115.00",
                    "specialPrice": "$100.00"
                }
            }
        ]
    }, 
    {
        "email": "Ig:- balayage",
        "bio": "I am Belinda, a licensed hairstylist that specializes in hair weaves ,Ive been doing hair for over 20  years and I just love ,love, love my job and I love meeting new people , and helping to enhance their beauty , I hope you like what you see.",
        "avatar": "img/avatar/4.jpg",
        "businessName": "Belinda Rose",
        "activated": true,
        "address": {
            "street": "5236 rue Roverside, Saint-Lambert",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.4797,
            "longitude": -73.50928
        },
        "website": "#",
        "categories": [
            {
                "name": "Highlights",
                "pictures": [
                    "img/haircuts/highlights/o75_n.jpg", "img/haircuts/highlights/o7_n.jpg", "img/haircuts/highlights/o470_n.jpg", "img/haircuts/highlights/o81_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Ombre",
                "category": "Highlights",
                "description": "",
                "price": {
                    "duration": 130,
                    "priceType": "From",
                    "price": "$130"
                }
            }
        ]
    }, 
    {
        "email": "IG: exquisite_hair_beauty: hair extension",
        "bio": "Are you tired of spending your day in crowed and noisy salon? Well I have a private place for you! One-on-one stylist. Are you sick of stylist not caring about your health and your hair? I specialize in Hair Extension, Natural Hair, Hair Color and more.",
        "avatar": "img/avatar/712.jpg",
        "businessName": "Leah Lang",
        "activated": true,
        "address": {
            "street": "Boulevard de la Rousselière, Pointes-aux-Trembles",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.69276,
            "longitude": -73.47588
        },
        "website": "#",
        "categories": [
            {
                "name": "Hair extensions",
                "pictures": [
                    "img/haircuts/extensions/1_n.jpg", "img/haircuts/extensions/2_n.jpg", "img/haircuts/extensions/05_n.jpg", "img/haircuts/extensions/9_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Hair Extension",
                "category": "Hair extensions",
                "description": "",
                "price": {
                    "duration": 140,
                    "priceType": "From",
                    "price": "$175"
                }
            }
        ]
    }, 
    {
        "email": "IG:peaches.and.cream.hair - color",
        "bio": "I am a Master with over 10 years experience, specializing in Textured Hair Silk Outs, Custom Coloring and Precision Haircuts. I also offer protective Styles and Extensions designed to preserve the hairs natural integrity, creating balance, and allowing the hair to reach its full potential.",
        "avatar": "img/avatar/54.jpg",
        "businessName": "Savvy Beauty",
        "activated": true,
        "address": {
            "street": "4005 rue Jean-Talon O, Montreal",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.66276,
            "longitude": -73.67677
        },
        "website": "#",
        "categories": [
            {
                "name": "Highlights",
                "pictures": [
                    "img/haircuts/highlights/b2_n.jpg", "img/haircuts/treatment/t7_n.jpg", "img/haircuts/highlights/b4_n.jpg", "img/haircuts/highlights/58_n.jpg"
                ],
                "audience": ["Female"]
            }, {
                "name": "Women's haircut",
                "pictures": [
                    "img/haircuts/haircut/68_n.jpg", "img/haircuts/treatment/t7_n.jpg", "img/haircuts/treatment/5_n.jpg", "img/haircuts/highlights/b0_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Balayage",
                "category": "Highlights",
                "description": "",
                "price": {
                    "duration": 190,
                    "priceType": "From",
                    "price": "$195.99"
                }
            }, {
                "name": "Haircut for women",
                "category": "Women's haircut",
                "description": "",
                "price": {
                    "duration": 100,
                    "priceType": "From",
                    "specialPrice": "$95.99"
                }
            }
        ]
    }, 
    {
        "email": "IG:crochetBraids- trancistata",
        "bio": "A Master barber that continues to progress in the field for over 20 years which explains the creativity and attention to detail given to each and every client!",
        "avatar": "img/avatar/51.jpg",
        "businessName": "K Moore",
        "activated": true,
        "address": {
            "street": "1690 rue Bourassa, Longueuil",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.51025,
            "longitude": -73.46546
        },
        "website": "#",
        "categories": [
            {
                "name": "Men's haircut",
                "pictures": [
                    "img/haircuts/haircut/04_n.jpg", "img/haircuts/haircut/69_n.jpg", "img/haircuts/haircut/2_n.jpg", "img/haircuts/haircut/75_n.jpg"
                ],
                "audience": ["Male", "Children"]
            }
        ],
        "services": [
            {
                "name": "Haircut",
                "category": "Men's Haircut",
                "description": "",
                "price": {
                    "duration": 45,
                    "priceType": "Fixed",
                    "price": "$40"
                }
            }, {
                "name": "Beard shave, line-up",
                "category": "Men's Haircut",
                "description": "",
                "price": {
                    "duration": 15,
                    "priceType": "Fixed",
                    "price": "$15.00"
                }
            }
        ]
    }, 
    {
        "email": "IG:tracy.bosc - knotless braids",
        "bio": "Natural hair stylist that believes in healthy beautiful hair. My goal is to educate my clients with love and facts in hair care. Natural hair has no limitations on style . Its all about enjoying the different looks you want to sport. Afro's, twist, corals , and loc's can be expressed in many ways. Getting to know my clients life style helps me to grow as an stylist. Everyone is different in their own way. Curl pattern, steam treatments, oil rejuvenating and soul searching is the base of Natural hair. So come join my passion and journey in Natural Hair.",
        "avatar": "img/avatar/78.jpg",
        "businessName": "Katakana Love",
        "activated": true,
        "address": {
            "street": "Gaylord Drive",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.65546,
            "longitude": -73.44114
        },
        "website": "#",
        "categories": [
            {
                "name": "Braids",
                "pictures": [
                    "img/haircuts/knotlessbraids/20_n.jpg",
                    "img/haircuts/knotlessbraids/57_n.jpg",
                    "img/haircuts/knotlessbraids/84_n.jpg",
                    "img/haircuts/knotlessbraids/700_n.jpg",
                    "img/haircuts/493_n.jpg",
                    "img/haircuts/2769_n.jpg",
                    "img/haircuts/369_n.jpg",
                    "img/haircuts/060_n.jpg"
                ],
                "audience": ["Female"]
            }
        ],
        "services": [
            {
                "name": "Knotless Braids",
                "category": "Braids",
                "price": {
                    "duration": 95,
                    "priceType": "From",
                    "price": "$120"
                }
            }, {
                "name": "Braids",
                "category": "Braids",
                "price": {
                    "duration": 90,
                    "priceType": "From",
                    "price": "$100"
                }
            }
        ]
    }
]