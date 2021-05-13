var positions = [];
var onePagePositions = [];  //d
var mobileFlag = 0;
var mobile470Flag = 0;
var offsetDelta = 0;
var popupBottomDelta = 0;

function cutString(str, maxLen) {   //cut the string to needed char amout without word tearing apart
    var forCut = str.indexOf(' ', maxLen);
    if (forCut == -1) return str + '..';
    return str.substring(0, forCut) + '...'
}

function getServiceImg(service, n) {   //get 4 first photos of service
    var serviceImg = "";
    var serviceImgLen = service.pictures.length;
    for (var z = 0; z < serviceImgLen; z++)  //get all the service images
        if (z < n)
            serviceImg += `<img src="${service.pictures[z]}" alt="haircut${z + 1}">`
    return serviceImg;
};

function getPrice(service) {    //get price or price options blocks of the service
    var priceBlock = "";
    var price = "";

    if (service.pricingOptions) {
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
    }

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

    for (var i = 0; i < hairstylistsLen; i++) { //parsing the items info

        if (i == 0) {
            var wrapper = document.createElement("div");
            wrapper.dataset.page = 1;   //d
        }

        onePagePositions.push({ lat: hairstylists[i].address.latitude, lng: hairstylists[i].address.longitude});  //get position

        var serviceList = "";
        var serviceListLen = hairstylists[i].services.length;
        for (var j = 0; j < serviceListLen; j++) {  //get the info of all services

            var priceBlock = "";
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

            serviceList += `
                <div class="boutik__service" data-order="${j}">
                    <div class="boutik__info ${severalPrices} text-m">
                        <div>${hairstylists[i].services[j].name}</div>
                        <div class="boutik__price">
                            ${priceBlock}
                        </div>
                    </div>
                    <div class="boutik__img">
                        ${getServiceImg(hairstylists[i].services[j], 4)}
                    </div>
                    <div class="boutik__time text-m">${duration}</div>
                    <div class="boutik__desc text-m">${cutString(hairstylists[i].services[j].description, 247)}</div>
                </div>
            `;
        }
        
        

        //inserting the item + filling it with prepared info and info get from array
        wrapper.insertAdjacentHTML("beforeend", `
            <div class="boutik"
                data-idg="${hairstylists[i]._id}"
                data-idl="${i}"
            >
                <div class="overlay__top-wrapper">
                    <img src="${hairstylists[i].avatar}" alt="avatar">
                    <div class="overlay__titles">
                        <h3 class="boutik__name">${hairstylists[i].businessName}</h3>
                        <div class="boutik__location">
                            <img src="icons/location.svg" alt="location">
                            <a href="#" class="text-s" tabindex="0">${hairstylists[i].address.street}</a>
                        </div>
                    </div>
                </div>
                <div class="boutik__service-wrapper">
                    ${serviceList}
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


    var paginationContent = "";
    for (var i = 0; i < pagesAmount; i++)   //filling the pagination with proper pages amount
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

    $('.boutik__service').on('click', function() { //read an info from boutik dataset, parse it to an overlay and show the overlay
        var boutik = hairstylists[$(this).parents('.boutik').data('idl')];
        var service = boutik.services[$(this).data('order')];
        $('.overlay .overlay__top-wrapper>img').attr("src", boutik.avatar);
        $('.overlay .boutik__name').text(boutik.businessName);
        $('.overlay .boutik__location a').text(hairstylists[i].address.street);
        $('.overlay h4').text(service.name);
        $('.overlay__price-option').remove();
        $('.overlay__price').remove();
        $('.overlay__img').text("");
        $('.overlay__img')[0].insertAdjacentHTML('afterbegin', getServiceImg(service, !mobile470Flag ? 4 : 2));
        $('.overlay__img')[0].insertAdjacentHTML('afterend', getPrice(service));
        $('.overlay__text').text(service.description);
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

var itemsPerPage = 20;

var hairstylists = [
    {
        "_id": "60935e04652d0c694e1f3232",
        "email": "carolinamejia@kongle.com",
        "bio": "Sint cupidatat laborum exercitation aute exercitation sint est laboris.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Isologix",
        "address": {
            "street": "Beekman Place",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.5337,
            "longitude": -73.72059
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "commodo eiusmod sint",
                "description": "Consequat tempor non reprehenderit deserunt laborum minim ullamco ullamco consectetur amet officia proident est. Aute mollit ut aliqua pariatur cupidatat consequat qui velit aute laboris aliqua cupidatat. Adipisicing exercitation reprehenderit est id eiusmod elit nulla quis in ullamco magna culpa sit cupidatat. Exercitation dolor aliqua excepteur nostrud consequat veniam do cillum. Laboris sint veniam consectetur qui incididunt velit voluptate.\r\n"
            },
            {
                "name": "fugiat esse",
                "description": ""
            },
            {
                "name": "eiusmod occaecat commodo esse",
                "description": "Laboris ex labore sint sunt veniam pariatur nulla quis anim cupidatat. Do ipsum enim fugiat id non exercitation eu esse cillum duis voluptate. Esse duis cillum ullamco eiusmod. Dolore commodo voluptate eiusmod do exercitation ea officia. Consequat anim excepteur anim quis enim in est nisi eu exercitation culpa nostrud duis velit. Est ut amet mollit est ut.\r\nAmet ut commodo adipisicing irure excepteur ex laborum. Ipsum minim quis anim voluptate fugiat ut tempor consequat nostrud excepteur velit ea labore. Esse sit dolor sint in anim adipisicing ullamco culpa commodo sint nostrud.\r\nAmet ea esse non Lorem nisi. Mollit ut incididunt enim quis anim veniam eiusmod pariatur. Tempor incididunt nisi minim elit esse nostrud in eu laborum ex nulla. Adipisicing duis culpa ex laborum qui duis sit irure deserunt.\r\n"
            }
        ],
        "services": [
            {
                "name": "non anim amet magna laborum",
                "category": "Lorem dolor aliqua",
                "treatment": "",
                "description": "Ad deserunt quis sint minim id cupidatat in exercitation. Excepteur voluptate do deserunt ullamco consequat deserunt veniam elit aliqua minim ut tempor. Elit aute et est Lorem nisi ea. Exercitation amet aliquip velit tempor do in do officia dolor dolor magna est ipsum. Non elit Lorem ex velit reprehenderit officia ullamco culpa sit ad officia nisi qui sit.\r\nFugiat amet incididunt veniam Lorem. Consectetur nulla aliquip culpa id incididunt excepteur nisi proident eiusmod voluptate. Aliquip occaecat culpa dolore et ullamco qui sit. Dolore cillum ut non fugiat proident. Labore laboris anim magna minim fugiat ullamco sit ullamco magna nostrud dolor amet consectetur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 60,
                    "priceType": "From",
                    "price": "$325.32",
                    "specialPrice": "$188.99",
                    "pricingName": "est labore incididunt"
                },
                "pricingOptions": [
                    {
                        "duration": 93,
                        "priceType": "From",
                        "price": "$75.48",
                        "specialPrice": "$180.19",
                        "pricingName": "ex amet ad"
                    },
                    {
                        "duration": 20,
                        "priceType": "From",
                        "price": "$337.85",
                        "specialPrice": "$250.78",
                        "pricingName": "dolore et aute"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 59,
                "tags": [
                    "sint",
                    "nisi",
                    "sunt"
                ]
            },
            {
                "name": "sint est nostrud culpa ad",
                "category": "anim minim proident",
                "treatment": "",
                "description": "Voluptate tempor ipsum labore eu nisi incididunt est ullamco pariatur. Aliqua adipisicing dolor irure fugiat duis laboris consectetur aute laboris nostrud sint. Lorem id id amet ex culpa pariatur tempor dolor. Et enim dolore mollit cillum non esse ullamco sint enim officia qui laborum. Commodo reprehenderit ad eu exercitation reprehenderit ipsum esse. Magna aliquip labore aute duis sint exercitation duis esse pariatur mollit pariatur veniam eu tempor.\r\nMinim nostrud mollit sit tempor excepteur in duis. Sint fugiat elit consequat qui amet qui nisi nisi duis occaecat eiusmod incididunt. Excepteur ut exercitation minim enim dolor do. Occaecat sint ipsum eiusmod non ullamco Lorem non. Anim adipisicing magna adipisicing nulla in aute. Quis ipsum tempor officia officia cillum ex velit fugiat sit aliquip consectetur exercitation anim fugiat.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 123,
                    "priceType": "From",
                    "price": "$179.06",
                    "specialPrice": "$203.06",
                    "pricingName": "cupidatat velit cupidatat"
                },
                "pricingOptions": [
                    {
                        "duration": 310,
                        "priceType": "Fixed",
                        "price": "$317.78",
                        "specialPrice": "$39.86",
                        "pricingName": "incididunt laboris aliquip"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 42,
                "tags": [
                    "non",
                    "exercitation",
                    "exercitation",
                    "pariatur",
                    "pariatur",
                    "anim"
                ]
            },
            {
                "name": "commodo aute ut adipisicing elit",
                "category": "amet cupidatat minim",
                "treatment": "",
                "description": "Aute sit tempor incididunt eu ad ex elit enim laboris ullamco cillum aute duis. Pariatur anim quis veniam aliqua mollit tempor minim cupidatat et duis dolor velit. Est ut irure ut do consectetur reprehenderit nostrud culpa minim consequat qui occaecat. Veniam cillum irure deserunt pariatur deserunt aute occaecat tempor. Dolore sunt est anim magna deserunt eu.\r\nElit incididunt enim est ea ad laboris ipsum mollit et Lorem qui laboris. Est adipisicing non cillum dolor fugiat et esse eu cupidatat. Sit sit in adipisicing excepteur elit dolore voluptate fugiat do dolore commodo.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 365,
                    "priceType": "Fixed",
                    "price": "$378.82",
                    "specialPrice": "$125.16",
                    "pricingName": "fugiat duis laborum"
                },
                "pricingOptions": [
                    {
                        "duration": 341,
                        "priceType": "From",
                        "price": "$325.62",
                        "specialPrice": "$288.75",
                        "pricingName": "tempor mollit anim"
                    },
                    {
                        "duration": 183,
                        "priceType": "From",
                        "price": "$318.27",
                        "specialPrice": "$337.87",
                        "pricingName": "do anim et"
                    },
                    {
                        "duration": 171,
                        "priceType": "Fixed",
                        "price": "$172.56",
                        "specialPrice": "$382.44",
                        "pricingName": "est sint nulla"
                    },
                    {
                        "duration": 326,
                        "priceType": "From",
                        "price": "$25.17",
                        "specialPrice": "$278.29",
                        "pricingName": "aliqua enim ullamco"
                    },
                    {
                        "duration": 211,
                        "priceType": "From",
                        "price": "$174.61",
                        "specialPrice": "$306.28",
                        "pricingName": "veniam nisi et"
                    },
                    {
                        "duration": 297,
                        "priceType": "From",
                        "price": "$300.68",
                        "specialPrice": "$201.40",
                        "pricingName": "Lorem sint ex"
                    },
                    {
                        "duration": 266,
                        "priceType": "Fixed",
                        "price": "$285.33",
                        "specialPrice": "$270.66",
                        "pricingName": "qui non sunt"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 41,
                "tags": [
                    "culpa",
                    "ex",
                    "dolore",
                    "eiusmod",
                    "laborum",
                    "do",
                    "labore"
                ]
            },
            {
                "name": "laborum nulla eu nulla in",
                "category": "do aliquip fugiat",
                "treatment": "",
                "description": "Culpa velit esse occaecat deserunt irure dolor fugiat ex. Incididunt proident nostrud labore eu laboris excepteur in labore commodo excepteur. Id sunt enim elit magna culpa voluptate quis.\r\nExercitation ex est et et tempor. Incididunt in excepteur occaecat et laboris in sint ipsum ullamco incididunt laborum sit cupidatat aute. Nulla ullamco proident id adipisicing tempor.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 369,
                    "priceType": "Fixed",
                    "price": "$228.71",
                    "specialPrice": "$174.52",
                    "pricingName": "eu non ipsum"
                },
                "pricingOptions": [
                    {
                        "duration": 238,
                        "priceType": "Fixed",
                        "price": "$285.14",
                        "specialPrice": "$379.55",
                        "pricingName": "irure anim laborum"
                    },
                    {
                        "duration": 176,
                        "priceType": "Fixed",
                        "price": "$81.14",
                        "specialPrice": "$194.60",
                        "pricingName": "sunt labore eiusmod"
                    },
                    {
                        "duration": 265,
                        "priceType": "Fixed",
                        "price": "$251.91",
                        "specialPrice": "$138.32",
                        "pricingName": "sunt sint irure"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 31,
                "tags": [
                    "aliquip",
                    "duis",
                    "voluptate",
                    "consequat",
                    "deserunt",
                    "fugiat",
                    "dolor"
                ]
            },
            {
                "name": "elit labore ullamco dolor ipsum",
                "category": "cupidatat non fugiat",
                "treatment": "",
                "description": "Nulla consectetur consequat ullamco cillum Lorem. Pariatur eu labore incididunt aute ut sint. Ad nostrud deserunt do dolore eiusmod nulla adipisicing officia anim labore culpa. Fugiat ullamco nulla irure amet occaecat sint ipsum fugiat excepteur pariatur sit eu qui. Exercitation sit dolore ea laboris eu in.\r\nUt velit magna sint dolore eu amet proident cupidatat Lorem tempor ipsum occaecat sint consequat. Occaecat mollit enim veniam exercitation adipisicing voluptate. Aute non cupidatat Lorem ad ex minim elit ea aliquip amet excepteur. Enim mollit nisi anim amet ullamco duis ex reprehenderit laboris ad commodo reprehenderit sunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 342,
                    "priceType": "From",
                    "price": "$290.44",
                    "specialPrice": "$112.11",
                    "pricingName": "officia aliqua qui"
                },
                "pricingOptions": [
                    {
                        "duration": 211,
                        "priceType": "From",
                        "price": "$123.70",
                        "specialPrice": "$143.30",
                        "pricingName": "ad labore ut"
                    },
                    {
                        "duration": 201,
                        "priceType": "From",
                        "price": "$297.07",
                        "specialPrice": "$74.08",
                        "pricingName": "est tempor et"
                    },
                    {
                        "duration": 128,
                        "priceType": "From",
                        "price": "$190.40",
                        "specialPrice": "$339.18",
                        "pricingName": "est Lorem aliqua"
                    },
                    {
                        "duration": 225,
                        "priceType": "From",
                        "price": "$286.86",
                        "specialPrice": "$350.42",
                        "pricingName": "consequat dolore nulla"
                    },
                    {
                        "duration": 369,
                        "priceType": "From",
                        "price": "$180.16",
                        "specialPrice": "$56.47",
                        "pricingName": "ex amet sunt"
                    },
                    {
                        "duration": 254,
                        "priceType": "Fixed",
                        "price": "$213.91",
                        "specialPrice": "$232.19",
                        "pricingName": "ea ea adipisicing"
                    },
                    {
                        "duration": 152,
                        "priceType": "Fixed",
                        "price": "$347.41",
                        "specialPrice": "$97.04",
                        "pricingName": "sunt sunt dolor"
                    },
                    {
                        "duration": 250,
                        "priceType": "From",
                        "price": "$53.79",
                        "specialPrice": "$223.40",
                        "pricingName": "consectetur mollit exercitation"
                    },
                    {
                        "duration": 398,
                        "priceType": "Fixed",
                        "price": "$358.61",
                        "specialPrice": "$263.17",
                        "pricingName": "velit adipisicing esse"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 44,
                "tags": [
                    "consectetur",
                    "minim",
                    "laboris",
                    "mollit",
                    "sint",
                    "aliqua",
                    "deserunt"
                ]
            },
            {
                "name": "sunt pariatur anim cupidatat occaecat",
                "category": "ullamco aliqua et",
                "treatment": "",
                "description": "Enim excepteur velit dolor enim et sunt sit reprehenderit sunt do anim sunt. Do culpa qui Lorem veniam in ipsum. Nostrud cupidatat excepteur aliquip exercitation.\r\nId cupidatat excepteur incididunt Lorem in. Proident deserunt qui excepteur voluptate elit aliqua exercitation ullamco Lorem laborum est. Ad enim voluptate irure eiusmod excepteur commodo incididunt aliquip ullamco incididunt excepteur reprehenderit commodo proident. In nulla dolore ex amet culpa. Adipisicing amet irure ex adipisicing. Commodo pariatur in do nisi eiusmod.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 301,
                    "priceType": "From",
                    "price": "$63.33",
                    "specialPrice": "$325.38",
                    "pricingName": "id et minim"
                },
                "pricingOptions": [
                    {
                        "duration": 88,
                        "priceType": "From",
                        "price": "$351.08",
                        "specialPrice": "$73.05",
                        "pricingName": "nulla eiusmod nulla"
                    },
                    {
                        "duration": 88,
                        "priceType": "From",
                        "price": "$27.71",
                        "specialPrice": "$324.20",
                        "pricingName": "tempor eiusmod ullamco"
                    },
                    {
                        "duration": 393,
                        "priceType": "From",
                        "price": "$143.46",
                        "specialPrice": "$266.48",
                        "pricingName": "in dolor veniam"
                    },
                    {
                        "duration": 337,
                        "priceType": "From",
                        "price": "$321.70",
                        "specialPrice": "$321.40",
                        "pricingName": "occaecat sunt laboris"
                    },
                    {
                        "duration": 238,
                        "priceType": "Fixed",
                        "price": "$265.27",
                        "specialPrice": "$101.73",
                        "pricingName": "deserunt et nisi"
                    },
                    {
                        "duration": 194,
                        "priceType": "From",
                        "price": "$126.17",
                        "specialPrice": "$47.67",
                        "pricingName": "nostrud labore tempor"
                    },
                    {
                        "duration": 131,
                        "priceType": "From",
                        "price": "$37.28",
                        "specialPrice": "$322.83",
                        "pricingName": "nisi in sunt"
                    },
                    {
                        "duration": 25,
                        "priceType": "Fixed",
                        "price": "$172.68",
                        "specialPrice": "$21.14",
                        "pricingName": "aute ea culpa"
                    },
                    {
                        "duration": 279,
                        "priceType": "From",
                        "price": "$159.24",
                        "specialPrice": "$271.08",
                        "pricingName": "ipsum sint deserunt"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 32,
                "tags": [
                    "nulla",
                    "tempor",
                    "culpa",
                    "minim"
                ]
            },
            {
                "name": "qui deserunt eiusmod exercitation dolore",
                "category": "laborum laborum veniam",
                "treatment": "",
                "description": "Veniam quis amet eiusmod occaecat eiusmod ipsum quis pariatur et ea in. Duis cillum pariatur elit ut laboris laborum pariatur elit duis laboris ad mollit fugiat ut. Tempor cillum qui eu incididunt enim excepteur sint nostrud et. Consequat nulla sit sit sint dolore mollit minim in do anim cillum elit elit.\r\nSint anim anim qui ipsum. Nisi est proident aute eiusmod cillum veniam anim ad anim. Aliquip reprehenderit pariatur duis velit duis nisi ut fugiat id fugiat reprehenderit. Aute occaecat esse culpa aliqua officia ipsum labore sint. Eu dolor nulla ex officia sint culpa. Amet eiusmod commodo cupidatat do incididunt sint proident est minim est excepteur enim est.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 357,
                    "priceType": "From",
                    "price": "$174.86",
                    "specialPrice": "$257.51",
                    "pricingName": "amet id laboris"
                },
                "pricingOptions": [
                    {
                        "duration": 370,
                        "priceType": "From",
                        "price": "$130.26",
                        "specialPrice": "$335.41",
                        "pricingName": "excepteur ad do"
                    },
                    {
                        "duration": 322,
                        "priceType": "Fixed",
                        "price": "$101.25",
                        "specialPrice": "$22.65",
                        "pricingName": "aliqua enim esse"
                    },
                    {
                        "duration": 121,
                        "priceType": "Fixed",
                        "price": "$82.11",
                        "specialPrice": "$225.11",
                        "pricingName": "occaecat amet deserunt"
                    },
                    {
                        "duration": 293,
                        "priceType": "Fixed",
                        "price": "$329.29",
                        "specialPrice": "$131.79",
                        "pricingName": "ut commodo mollit"
                    },
                    {
                        "duration": 195,
                        "priceType": "From",
                        "price": "$262.07",
                        "specialPrice": "$156.76",
                        "pricingName": "voluptate culpa sunt"
                    },
                    {
                        "duration": 64,
                        "priceType": "From",
                        "price": "$342.29",
                        "specialPrice": "$80.82",
                        "pricingName": "dolor nostrud elit"
                    },
                    {
                        "duration": 255,
                        "priceType": "From",
                        "price": "$307.02",
                        "specialPrice": "$74.35",
                        "pricingName": "eiusmod sunt eiusmod"
                    },
                    {
                        "duration": 302,
                        "priceType": "From",
                        "price": "$370.15",
                        "specialPrice": "$325.18",
                        "pricingName": "cillum velit fugiat"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 36,
                "tags": [
                    "excepteur",
                    "exercitation",
                    "non",
                    "amet",
                    "enim",
                    "mollit"
                ]
            },
            {
                "name": "in occaecat quis eiusmod excepteur",
                "category": "ad incididunt minim",
                "treatment": "",
                "description": "Elit exercitation exercitation magna amet ad fugiat fugiat excepteur pariatur incididunt. Ullamco nostrud ut sint Lorem sunt nulla aliquip consequat esse officia consectetur magna. Consequat nisi amet ad consectetur sunt eiusmod eu.\r\nQuis enim eu tempor consequat. Qui dolore non aliquip non. Incididunt culpa non cillum ullamco exercitation do in consectetur sunt voluptate. Incididunt incididunt ad enim culpa.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 335,
                    "priceType": "Fixed",
                    "price": "$223.07",
                    "specialPrice": "$298.32",
                    "pricingName": "enim aute do"
                },
                "pricingOptions": [
                    {
                        "duration": 106,
                        "priceType": "From",
                        "price": "$287.14",
                        "specialPrice": "$126.23",
                        "pricingName": "deserunt eiusmod tempor"
                    },
                    {
                        "duration": 340,
                        "priceType": "Fixed",
                        "price": "$202.26",
                        "specialPrice": "$33.14",
                        "pricingName": "sint dolor nostrud"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 33,
                "tags": [
                    "fugiat",
                    "dolor",
                    "duis",
                    "dolor",
                    "pariatur"
                ]
            },
            {
                "name": "cupidatat aliquip qui adipisicing aute",
                "category": "nostrud labore commodo",
                "treatment": "",
                "description": "Magna pariatur Lorem duis do Lorem non fugiat quis dolore tempor minim officia. Reprehenderit velit minim mollit incididunt esse voluptate. Eiusmod fugiat consectetur anim id incididunt excepteur in adipisicing consequat commodo eiusmod. Dolor et enim aute ut cupidatat. Cillum nisi ipsum et enim tempor sit duis.\r\nAd anim aliquip qui dolor officia est aliquip nulla quis sint proident commodo. Et irure adipisicing laboris culpa. Culpa qui aliquip enim cillum.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 327,
                    "priceType": "Fixed",
                    "price": "$98.90",
                    "specialPrice": "$254.06",
                    "pricingName": "esse eiusmod in"
                },
                "pricingOptions": [
                    {
                        "duration": 253,
                        "priceType": "From",
                        "price": "$360.49",
                        "specialPrice": "$155.73",
                        "pricingName": "consectetur reprehenderit nisi"
                    },
                    {
                        "duration": 116,
                        "priceType": "Fixed",
                        "price": "$295.01",
                        "specialPrice": "$50.06",
                        "pricingName": "sunt adipisicing laboris"
                    },
                    {
                        "duration": 242,
                        "priceType": "From",
                        "price": "$391.36",
                        "specialPrice": "$386.85",
                        "pricingName": "cupidatat eu quis"
                    },
                    {
                        "duration": 335,
                        "priceType": "From",
                        "price": "$305.26",
                        "specialPrice": "$326.21",
                        "pricingName": "non magna excepteur"
                    },
                    {
                        "duration": 139,
                        "priceType": "Fixed",
                        "price": "$337.77",
                        "specialPrice": "$363.27",
                        "pricingName": "duis nulla ea"
                    },
                    {
                        "duration": 277,
                        "priceType": "From",
                        "price": "$167.30",
                        "specialPrice": "$349.19",
                        "pricingName": "officia cupidatat mollit"
                    },
                    {
                        "duration": 124,
                        "priceType": "Fixed",
                        "price": "$123.05",
                        "specialPrice": "$202.78",
                        "pricingName": "labore minim eiusmod"
                    },
                    {
                        "duration": 327,
                        "priceType": "From",
                        "price": "$384.78",
                        "specialPrice": "$377.00",
                        "pricingName": "ex sunt officia"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 30,
                "tags": [
                    "id",
                    "laboris",
                    "proident",
                    "sit"
                ]
            },
            {
                "name": "non deserunt est adipisicing ut",
                "category": "dolor qui laborum",
                "treatment": "",
                "description": "Aliquip laboris et ipsum nisi non mollit tempor aute ullamco. Elit incididunt tempor proident adipisicing qui cupidatat esse adipisicing cillum mollit elit cillum proident magna. Adipisicing incididunt nulla veniam id anim ad. Magna consectetur dolore laboris magna. Lorem aute duis id cillum deserunt magna veniam esse fugiat culpa voluptate minim veniam in. Consectetur dolor non ex do consequat consectetur nulla incididunt irure quis. Reprehenderit in laborum culpa elit.\r\nIncididunt excepteur elit velit ut incididunt ipsum esse nostrud voluptate laboris aliquip voluptate cillum Lorem. Laborum aliqua ea anim officia cupidatat. Cillum dolore ipsum aute veniam. Consequat aute occaecat sit enim enim cillum ut elit. Laboris amet ipsum sit dolor pariatur ut et. Veniam ad deserunt mollit deserunt aliquip adipisicing mollit. Ullamco consequat labore reprehenderit sint ex adipisicing sit exercitation commodo enim esse labore eiusmod ea.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 393,
                    "priceType": "From",
                    "price": "$145.49",
                    "specialPrice": "$127.76",
                    "pricingName": "adipisicing magna occaecat"
                },
                "pricingOptions": [
                    {
                        "duration": 242,
                        "priceType": "From",
                        "price": "$328.96",
                        "specialPrice": "$166.88",
                        "pricingName": "dolore esse Lorem"
                    },
                    {
                        "duration": 194,
                        "priceType": "From",
                        "price": "$289.66",
                        "specialPrice": "$45.58",
                        "pricingName": "sint aliqua in"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 26,
                "tags": [
                    "aliquip",
                    "id",
                    "sunt",
                    "ex"
                ]
            }
        ]
    },
    {
        "_id": "60935e0410639383d528ed4c",
        "email": "carolinamejia@isologix.com",
        "bio": "Id cillum culpa anim qui aliquip in quis excepteur deserunt irure eiusmod reprehenderit.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Cemention",
        "address": {
            "street": "Sandford Street",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.50659,
            "longitude": -73.70459
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "incididunt ea ullamco",
                "description": "Adipisicing dolor culpa enim non ullamco ullamco dolore. Officia cupidatat ipsum fugiat ea voluptate ad exercitation. Occaecat magna Lorem nisi culpa tempor sit magna et culpa ullamco excepteur. Mollit voluptate eu officia consequat. Duis dolor nostrud occaecat cillum consequat fugiat.\r\n"
            },
            {
                "name": "minim est",
                "description": ""
            },
            {
                "name": "officia laboris qui do",
                "description": "Non nisi est laborum qui irure. Magna tempor pariatur cupidatat dolore est minim tempor. Sit cillum ut nisi Lorem. Voluptate exercitation enim velit dolor ea cupidatat. Exercitation nostrud ipsum excepteur commodo velit dolore.\r\nTempor ex sit minim et aliquip fugiat ullamco laboris sit. Dolor dolore ut sit ullamco. In minim dolor occaecat minim laboris tempor aliquip ea. Incididunt ea qui excepteur sunt labore. Aliqua ex ea occaecat mollit laborum sunt velit irure reprehenderit pariatur anim ad cillum laborum. Quis exercitation enim anim irure consectetur ea non magna fugiat consectetur labore amet.\r\nExcepteur reprehenderit est nulla mollit aliquip. Nostrud esse aliquip amet voluptate pariatur ad duis commodo. Sunt irure deserunt consectetur ut aliquip amet.\r\n"
            }
        ],
        "services": [
            {
                "name": "excepteur deserunt id irure labore",
                "category": "magna sunt cillum",
                "treatment": "",
                "description": "Quis culpa id nulla fugiat ut. Ex do esse aute irure ipsum nisi excepteur esse ad incididunt amet. Mollit ex elit occaecat qui excepteur est eu adipisicing duis culpa est ipsum. Consectetur culpa consectetur voluptate reprehenderit do ex dolore ex id in.\r\nIrure id do sit fugiat veniam sint incididunt est. Ex irure sit enim sit incididunt reprehenderit laboris laboris. Lorem non nostrud tempor nulla.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 336,
                    "priceType": "Fixed",
                    "price": "$332.61",
                    "specialPrice": "$361.27",
                    "pricingName": "tempor deserunt nostrud"
                },
                "pricingOptions": [
                    {
                        "duration": 25,
                        "priceType": "Fixed",
                        "price": "$157.29",
                        "specialPrice": "$272.54",
                        "pricingName": "in incididunt amet"
                    },
                    {
                        "duration": 94,
                        "priceType": "Fixed",
                        "price": "$340.30",
                        "specialPrice": "$145.02",
                        "pricingName": "voluptate Lorem veniam"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 26,
                "tags": [
                    "ut",
                    "nostrud",
                    "amet"
                ]
            },
            {
                "name": "occaecat amet do voluptate anim",
                "category": "magna non quis",
                "treatment": "",
                "description": "Sunt laborum id dolore magna tempor eu esse pariatur in mollit. Exercitation magna dolor dolore nisi deserunt sit ut ipsum eu. Qui est est duis culpa labore adipisicing excepteur irure eiusmod ad consectetur nostrud eiusmod. Lorem velit in irure occaecat deserunt quis aliquip.\r\nOccaecat fugiat qui id magna velit do Lorem Lorem dolore in. Do officia esse laborum cillum ut labore. Fugiat fugiat ex cupidatat pariatur duis. Esse ullamco duis voluptate tempor mollit nisi esse incididunt ullamco ipsum. Sunt amet amet ipsum ullamco aliquip fugiat ipsum. Fugiat laborum magna occaecat proident amet adipisicing.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 103,
                    "priceType": "From",
                    "price": "$73.52",
                    "specialPrice": "$141.07",
                    "pricingName": "veniam adipisicing cillum"
                },
                "pricingOptions": [
                    {
                        "duration": 26,
                        "priceType": "From",
                        "price": "$78.91",
                        "specialPrice": "$155.05",
                        "pricingName": "duis culpa irure"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 23,
                "tags": [
                    "dolore",
                    "laboris",
                    "enim",
                    "incididunt",
                    "culpa",
                    "non"
                ]
            },
            {
                "name": "in exercitation mollit consectetur consequat",
                "category": "aute est ipsum",
                "treatment": "",
                "description": "Occaecat qui ad consectetur adipisicing do. Mollit cillum occaecat duis sunt aliqua eiusmod ex quis cupidatat. Proident non duis deserunt minim sit amet.\r\nMagna quis anim nisi consectetur dolor et culpa aliquip amet nulla. Lorem nostrud labore nisi dolor nisi et incididunt officia id aliqua. Amet exercitation id esse consectetur ex fugiat.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 126,
                    "priceType": "From",
                    "price": "$365.47",
                    "specialPrice": "$199.38",
                    "pricingName": "aute et est"
                },
                "pricingOptions": [
                    {
                        "duration": 312,
                        "priceType": "From",
                        "price": "$62.51",
                        "specialPrice": "$380.60",
                        "pricingName": "commodo ad anim"
                    },
                    {
                        "duration": 138,
                        "priceType": "Fixed",
                        "price": "$263.76",
                        "specialPrice": "$325.34",
                        "pricingName": "ea proident elit"
                    },
                    {
                        "duration": 157,
                        "priceType": "From",
                        "price": "$20.69",
                        "specialPrice": "$49.41",
                        "pricingName": "anim mollit laborum"
                    },
                    {
                        "duration": 225,
                        "priceType": "Fixed",
                        "price": "$242.75",
                        "specialPrice": "$45.29",
                        "pricingName": "voluptate occaecat id"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 21,
                "tags": [
                    "reprehenderit",
                    "aliqua"
                ]
            }
        ]
    },
    {
        "_id": "60935e0485eea1deb03ccdb6",
        "email": "carolinamejia@cemention.com",
        "bio": "Velit culpa do sit sit anim sint elit aute non deserunt dolore cillum veniam.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Norsul",
        "address": {
            "street": "Prospect Place",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.64128,
            "longitude": -73.71438
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "dolore in culpa",
                "description": "Consectetur elit irure ullamco ea deserunt commodo eiusmod. Exercitation sunt non irure commodo aliqua. Laborum laborum pariatur mollit Lorem eu aliquip. Magna mollit do in incididunt labore aliqua voluptate nisi incididunt. Pariatur mollit esse velit eu adipisicing in Lorem est incididunt aliqua laboris. Eu pariatur aliqua nulla pariatur occaecat consequat. Adipisicing fugiat amet laboris consequat laborum non nostrud nulla nulla.\r\n"
            },
            {
                "name": "ut quis",
                "description": ""
            },
            {
                "name": "irure excepteur laboris consectetur",
                "description": "Dolore eiusmod Lorem deserunt reprehenderit cupidatat Lorem consequat dolor voluptate nulla nostrud nulla. Id magna ad eu laborum id occaecat pariatur exercitation non exercitation fugiat eu. Aliquip duis dolore ad ad adipisicing labore fugiat elit cupidatat amet nulla velit. Ut sint eiusmod magna et velit. Minim ex eiusmod deserunt deserunt in dolore est anim fugiat eiusmod exercitation ut tempor tempor. Aliquip dolor ut sit id laborum. Fugiat occaecat ipsum consectetur Lorem aliqua cillum ut aliquip.\r\nIn non labore cillum quis eu laboris pariatur. Lorem irure pariatur dolore ipsum consequat eiusmod consequat ullamco tempor sunt reprehenderit pariatur velit. Exercitation sint cupidatat sit laboris occaecat sunt mollit id eiusmod duis. Dolore cupidatat labore elit officia quis sint reprehenderit mollit.\r\nDolor sit nisi cillum dolor sit occaecat incididunt ut aute in. Tempor consequat exercitation laboris id non laboris. Qui aliqua et dolor anim eiusmod cupidatat magna laborum ad. Dolor laboris eiusmod et nostrud ullamco labore sint elit consequat ut. Et ea esse exercitation quis. Exercitation aliquip ut dolor deserunt veniam labore laborum ut aliquip eu pariatur.\r\n"
            }
        ],
        "services": [
            {
                "name": "sint nisi incididunt magna voluptate",
                "category": "ad enim eu",
                "treatment": "",
                "description": "Sint minim commodo enim exercitation et ad ex. Ad consequat occaecat minim deserunt enim exercitation cillum dolor deserunt irure elit. Aliqua dolor sunt nulla consequat ullamco ullamco mollit cupidatat eiusmod anim ullamco. Quis non mollit fugiat qui deserunt magna velit laborum.\r\nUt est et ea laboris amet proident sit dolor ullamco ex. Aliquip ad incididunt nulla culpa. Eu reprehenderit laboris amet Lorem quis occaecat sint excepteur esse elit fugiat occaecat dolore. Sunt veniam dolor in minim exercitation. Occaecat ipsum commodo esse duis amet elit labore qui nisi irure ut consectetur veniam. Eiusmod ad officia culpa id est ad ea nulla deserunt laboris esse amet qui.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 83,
                    "priceType": "Fixed",
                    "price": "$215.08",
                    "specialPrice": "$343.22",
                    "pricingName": "laboris ad officia"
                },
                "pricingOptions": [
                    {
                        "duration": 298,
                        "priceType": "From",
                        "price": "$201.99",
                        "specialPrice": "$81.88",
                        "pricingName": "pariatur officia incididunt"
                    },
                    {
                        "duration": 87,
                        "priceType": "From",
                        "price": "$216.99",
                        "specialPrice": "$218.88",
                        "pricingName": "laboris ipsum elit"
                    },
                    {
                        "duration": 212,
                        "priceType": "From",
                        "price": "$61.00",
                        "specialPrice": "$198.62",
                        "pricingName": "duis ullamco dolor"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 24,
                "tags": [
                    "est",
                    "ad",
                    "velit",
                    "magna",
                    "id",
                    "mollit"
                ]
            },
            {
                "name": "dolor amet ea occaecat et",
                "category": "adipisicing incididunt labore",
                "treatment": "",
                "description": "Do cillum cupidatat aute aliqua sunt aliqua excepteur enim sint do in. Anim aliqua qui sit minim deserunt tempor id sunt Lorem aliquip. Nulla amet sunt esse velit consequat consectetur duis anim ipsum dolore proident amet. Irure dolor tempor commodo ipsum do duis ea veniam quis nostrud culpa velit pariatur dolore. Aliqua exercitation excepteur culpa ex excepteur ut ut sint et cillum elit officia ullamco. Excepteur ullamco ex incididunt aliquip in.\r\nIrure est enim aliquip Lorem sunt. Nulla amet ut ut magna ad. Esse fugiat nisi ex sunt enim irure et quis minim nostrud. Sint occaecat aute cillum ullamco. Amet anim irure elit ut fugiat cupidatat quis. Nostrud amet adipisicing laborum reprehenderit nisi sit culpa laborum esse mollit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 75,
                    "priceType": "From",
                    "price": "$390.15",
                    "specialPrice": "$150.88",
                    "pricingName": "aliquip nostrud dolore"
                },
                "pricingOptions": [
                    {
                        "duration": 144,
                        "priceType": "From",
                        "price": "$80.87",
                        "specialPrice": "$156.93",
                        "pricingName": "ad irure nisi"
                    },
                    {
                        "duration": 265,
                        "priceType": "Fixed",
                        "price": "$197.16",
                        "specialPrice": "$188.05",
                        "pricingName": "qui voluptate reprehenderit"
                    },
                    {
                        "duration": 204,
                        "priceType": "From",
                        "price": "$268.25",
                        "specialPrice": "$218.18",
                        "pricingName": "dolor tempor est"
                    },
                    {
                        "duration": 396,
                        "priceType": "From",
                        "price": "$52.26",
                        "specialPrice": "$301.26",
                        "pricingName": "eiusmod nostrud dolor"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 39,
                "tags": [
                    "anim",
                    "esse",
                    "officia",
                    "dolore",
                    "qui",
                    "magna"
                ]
            },
            {
                "name": "incididunt cupidatat do culpa ut",
                "category": "consequat do commodo",
                "treatment": "",
                "description": "Culpa proident veniam dolore excepteur ex enim non tempor sint minim adipisicing minim amet laboris. Cupidatat occaecat fugiat reprehenderit velit labore minim non ea incididunt Lorem minim voluptate. Amet non ipsum nisi labore mollit consequat ipsum laboris quis laborum. Esse in est do excepteur aliquip. Voluptate anim nisi elit eiusmod eiusmod. Ipsum dolor irure sunt tempor magna ex nostrud do sit deserunt fugiat.\r\nQuis tempor elit excepteur nisi veniam aliquip mollit irure velit quis consequat. Fugiat sint adipisicing fugiat occaecat. Quis occaecat quis sint officia mollit in nulla veniam. Sint elit ut proident aliquip. In esse duis amet deserunt eiusmod laborum id.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 141,
                    "priceType": "Fixed",
                    "price": "$262.28",
                    "specialPrice": "$201.08",
                    "pricingName": "labore dolor aute"
                },
                "pricingOptions": [
                    {
                        "duration": 232,
                        "priceType": "Fixed",
                        "price": "$309.21",
                        "specialPrice": "$299.71",
                        "pricingName": "velit tempor irure"
                    },
                    {
                        "duration": 375,
                        "priceType": "From",
                        "price": "$338.78",
                        "specialPrice": "$275.67",
                        "pricingName": "fugiat consequat in"
                    },
                    {
                        "duration": 161,
                        "priceType": "From",
                        "price": "$329.96",
                        "specialPrice": "$208.06",
                        "pricingName": "cupidatat consectetur aliquip"
                    },
                    {
                        "duration": 46,
                        "priceType": "From",
                        "price": "$214.52",
                        "specialPrice": "$350.96",
                        "pricingName": "eiusmod consectetur ex"
                    },
                    {
                        "duration": 183,
                        "priceType": "From",
                        "price": "$121.20",
                        "specialPrice": "$240.90",
                        "pricingName": "voluptate fugiat officia"
                    },
                    {
                        "duration": 342,
                        "priceType": "Fixed",
                        "price": "$194.25",
                        "specialPrice": "$62.11",
                        "pricingName": "incididunt aliqua fugiat"
                    },
                    {
                        "duration": 306,
                        "priceType": "From",
                        "price": "$358.94",
                        "specialPrice": "$184.66",
                        "pricingName": "sint eiusmod ea"
                    },
                    {
                        "duration": 392,
                        "priceType": "Fixed",
                        "price": "$140.96",
                        "specialPrice": "$318.60",
                        "pricingName": "non ut est"
                    },
                    {
                        "duration": 117,
                        "priceType": "Fixed",
                        "price": "$209.01",
                        "specialPrice": "$238.21",
                        "pricingName": "enim adipisicing tempor"
                    },
                    {
                        "duration": 334,
                        "priceType": "Fixed",
                        "price": "$99.51",
                        "specialPrice": "$192.29",
                        "pricingName": "velit occaecat eu"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 48,
                "tags": [
                    "consequat",
                    "pariatur",
                    "ex",
                    "ea"
                ]
            },
            {
                "name": "sit aliquip amet esse proident",
                "category": "eiusmod exercitation eu",
                "treatment": "",
                "description": "Ut nostrud Lorem mollit anim cupidatat exercitation reprehenderit qui consequat. Velit nisi pariatur non tempor laborum nulla ea enim. Elit deserunt nostrud pariatur ullamco do pariatur minim cupidatat id id sint quis.\r\nEa tempor enim eiusmod laboris elit non ipsum aliquip cillum occaecat. Culpa labore id ipsum commodo. Nulla sit mollit ex culpa excepteur cupidatat consequat incididunt dolor ullamco mollit culpa ex deserunt. Ad ex quis qui aute fugiat voluptate deserunt amet ex. Occaecat ullamco laboris laboris aliquip quis.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 136,
                    "priceType": "Fixed",
                    "price": "$179.39",
                    "specialPrice": "$244.44",
                    "pricingName": "ut sit officia"
                },
                "pricingOptions": [
                    {
                        "duration": 68,
                        "priceType": "Fixed",
                        "price": "$249.86",
                        "specialPrice": "$97.04",
                        "pricingName": "ullamco culpa minim"
                    },
                    {
                        "duration": 369,
                        "priceType": "From",
                        "price": "$288.40",
                        "specialPrice": "$217.83",
                        "pricingName": "sint anim do"
                    },
                    {
                        "duration": 200,
                        "priceType": "From",
                        "price": "$222.87",
                        "specialPrice": "$250.84",
                        "pricingName": "nostrud nisi aliqua"
                    },
                    {
                        "duration": 59,
                        "priceType": "Fixed",
                        "price": "$101.59",
                        "specialPrice": "$396.49",
                        "pricingName": "in id amet"
                    },
                    {
                        "duration": 352,
                        "priceType": "From",
                        "price": "$320.28",
                        "specialPrice": "$136.81",
                        "pricingName": "nisi irure tempor"
                    },
                    {
                        "duration": 346,
                        "priceType": "Fixed",
                        "price": "$211.45",
                        "specialPrice": "$187.29",
                        "pricingName": "pariatur nisi sint"
                    },
                    {
                        "duration": 116,
                        "priceType": "From",
                        "price": "$174.50",
                        "specialPrice": "$176.55",
                        "pricingName": "dolore exercitation ea"
                    },
                    {
                        "duration": 327,
                        "priceType": "Fixed",
                        "price": "$351.27",
                        "specialPrice": "$312.84",
                        "pricingName": "aliqua excepteur magna"
                    },
                    {
                        "duration": 36,
                        "priceType": "From",
                        "price": "$132.94",
                        "specialPrice": "$94.39",
                        "pricingName": "duis adipisicing aute"
                    },
                    {
                        "duration": 46,
                        "priceType": "Fixed",
                        "price": "$108.57",
                        "specialPrice": "$363.73",
                        "pricingName": "labore Lorem consequat"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 26,
                "tags": [
                    "culpa",
                    "ex",
                    "eu",
                    "laboris"
                ]
            },
            {
                "name": "esse ullamco eiusmod amet anim",
                "category": "Lorem officia proident",
                "treatment": "",
                "description": "Voluptate ex voluptate id amet sunt minim commodo in reprehenderit exercitation quis anim sint. Consequat aute laborum proident aute ipsum laborum do quis laborum pariatur. Reprehenderit non laboris nisi laborum irure aliquip reprehenderit culpa ea sunt nisi. Ipsum ut anim ad sint sit esse officia nulla nisi.\r\nAnim cillum laborum excepteur do do. Nulla do ad aliquip reprehenderit duis esse ex anim pariatur exercitation aute laborum. Pariatur est est laboris excepteur culpa reprehenderit ex deserunt aliqua fugiat velit. Sint anim nisi labore pariatur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 362,
                    "priceType": "From",
                    "price": "$169.58",
                    "specialPrice": "$195.72",
                    "pricingName": "mollit non sunt"
                },
                "pricingOptions": [
                    {
                        "duration": 123,
                        "priceType": "From",
                        "price": "$335.45",
                        "specialPrice": "$276.13",
                        "pricingName": "voluptate eu in"
                    },
                    {
                        "duration": 62,
                        "priceType": "Fixed",
                        "price": "$22.36",
                        "specialPrice": "$227.10",
                        "pricingName": "in qui sint"
                    },
                    {
                        "duration": 34,
                        "priceType": "Fixed",
                        "price": "$39.58",
                        "specialPrice": "$352.28",
                        "pricingName": "deserunt fugiat incididunt"
                    },
                    {
                        "duration": 242,
                        "priceType": "Fixed",
                        "price": "$377.20",
                        "specialPrice": "$269.86",
                        "pricingName": "esse non proident"
                    },
                    {
                        "duration": 77,
                        "priceType": "Fixed",
                        "price": "$48.58",
                        "specialPrice": "$231.58",
                        "pricingName": "reprehenderit consequat quis"
                    },
                    {
                        "duration": 143,
                        "priceType": "Fixed",
                        "price": "$342.81",
                        "specialPrice": "$61.07",
                        "pricingName": "adipisicing non adipisicing"
                    },
                    {
                        "duration": 349,
                        "priceType": "Fixed",
                        "price": "$223.55",
                        "specialPrice": "$397.11",
                        "pricingName": "do est eiusmod"
                    },
                    {
                        "duration": 367,
                        "priceType": "Fixed",
                        "price": "$338.58",
                        "specialPrice": "$89.26",
                        "pricingName": "nostrud enim eiusmod"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 25,
                "tags": [
                    "aliquip",
                    "aliquip",
                    "sint",
                    "sint",
                    "elit"
                ]
            },
            {
                "name": "non nulla minim amet quis",
                "category": "ullamco consequat et",
                "treatment": "",
                "description": "Eu nisi sint sint elit. Sit reprehenderit deserunt cillum anim. Dolore in velit nulla aute.\r\nNisi tempor mollit magna quis excepteur est deserunt ullamco non do deserunt et fugiat. Minim ad culpa occaecat anim nisi ad reprehenderit dolor nulla. Dolore est cillum ut fugiat consequat dolor nisi laborum non ullamco.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 336,
                    "priceType": "Fixed",
                    "price": "$215.46",
                    "specialPrice": "$109.83",
                    "pricingName": "nostrud sit sit"
                },
                "pricingOptions": [
                    {
                        "duration": 383,
                        "priceType": "From",
                        "price": "$325.59",
                        "specialPrice": "$361.30",
                        "pricingName": "anim tempor id"
                    },
                    {
                        "duration": 268,
                        "priceType": "Fixed",
                        "price": "$239.01",
                        "specialPrice": "$389.02",
                        "pricingName": "mollit consequat eiusmod"
                    },
                    {
                        "duration": 149,
                        "priceType": "From",
                        "price": "$217.27",
                        "specialPrice": "$119.66",
                        "pricingName": "id aliqua non"
                    },
                    {
                        "duration": 108,
                        "priceType": "Fixed",
                        "price": "$96.32",
                        "specialPrice": "$370.30",
                        "pricingName": "occaecat culpa est"
                    },
                    {
                        "duration": 124,
                        "priceType": "Fixed",
                        "price": "$122.11",
                        "specialPrice": "$132.80",
                        "pricingName": "officia nostrud ea"
                    },
                    {
                        "duration": 392,
                        "priceType": "Fixed",
                        "price": "$385.33",
                        "specialPrice": "$82.32",
                        "pricingName": "cillum nostrud deserunt"
                    },
                    {
                        "duration": 124,
                        "priceType": "Fixed",
                        "price": "$133.53",
                        "specialPrice": "$77.32",
                        "pricingName": "esse in reprehenderit"
                    },
                    {
                        "duration": 29,
                        "priceType": "Fixed",
                        "price": "$339.88",
                        "specialPrice": "$350.53",
                        "pricingName": "sunt id enim"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 56,
                "tags": [
                    "nisi",
                    "adipisicing"
                ]
            },
            {
                "name": "mollit id excepteur qui esse",
                "category": "magna ad est",
                "treatment": "",
                "description": "In ullamco officia commodo sint. Ea dolore mollit incididunt sit sint cupidatat eu amet eiusmod velit nostrud nisi consectetur officia. Enim labore dolore anim exercitation irure occaecat nisi id cupidatat exercitation proident.\r\nVoluptate fugiat ea commodo eiusmod pariatur nostrud nulla exercitation ut elit velit pariatur sit sunt. Duis minim ipsum labore est labore. Aliquip in fugiat magna dolor consequat id. Magna esse sit adipisicing adipisicing laboris aliquip consectetur dolor adipisicing ex consectetur. Deserunt laborum dolore incididunt consequat deserunt esse proident ullamco. Eiusmod pariatur eiusmod nulla velit veniam anim consectetur dolore proident in do esse pariatur. Quis officia aliquip esse ad Lorem sunt culpa in.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 219,
                    "priceType": "From",
                    "price": "$162.54",
                    "specialPrice": "$209.85",
                    "pricingName": "dolore amet culpa"
                },
                "pricingOptions": [
                    {
                        "duration": 330,
                        "priceType": "From",
                        "price": "$167.94",
                        "specialPrice": "$150.37",
                        "pricingName": "ipsum exercitation culpa"
                    },
                    {
                        "duration": 213,
                        "priceType": "Fixed",
                        "price": "$247.28",
                        "specialPrice": "$226.24",
                        "pricingName": "deserunt quis aute"
                    },
                    {
                        "duration": 304,
                        "priceType": "Fixed",
                        "price": "$166.78",
                        "specialPrice": "$23.08",
                        "pricingName": "cillum eu amet"
                    },
                    {
                        "duration": 157,
                        "priceType": "Fixed",
                        "price": "$50.41",
                        "specialPrice": "$203.04",
                        "pricingName": "mollit elit dolor"
                    },
                    {
                        "duration": 318,
                        "priceType": "Fixed",
                        "price": "$217.28",
                        "specialPrice": "$27.09",
                        "pricingName": "deserunt reprehenderit dolore"
                    },
                    {
                        "duration": 113,
                        "priceType": "Fixed",
                        "price": "$325.12",
                        "specialPrice": "$41.33",
                        "pricingName": "amet aliquip non"
                    },
                    {
                        "duration": 205,
                        "priceType": "Fixed",
                        "price": "$53.67",
                        "specialPrice": "$369.74",
                        "pricingName": "incididunt pariatur magna"
                    },
                    {
                        "duration": 236,
                        "priceType": "From",
                        "price": "$205.07",
                        "specialPrice": "$367.82",
                        "pricingName": "duis ipsum incididunt"
                    },
                    {
                        "duration": 25,
                        "priceType": "From",
                        "price": "$306.07",
                        "specialPrice": "$28.41",
                        "pricingName": "occaecat exercitation nisi"
                    },
                    {
                        "duration": 139,
                        "priceType": "Fixed",
                        "price": "$116.45",
                        "specialPrice": "$150.53",
                        "pricingName": "esse occaecat labore"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 60,
                "tags": [
                    "tempor",
                    "incididunt"
                ]
            },
            {
                "name": "consectetur anim cillum est ex",
                "category": "pariatur sit do",
                "treatment": "",
                "description": "Dolor officia proident qui ut veniam laboris ipsum fugiat qui occaecat quis enim. Culpa labore aliquip minim tempor aliquip exercitation sunt do aliquip nulla et ea non. Et quis amet aliqua ullamco aliquip commodo ipsum veniam excepteur sunt non aliqua culpa. Ut irure sint aliquip voluptate ullamco cupidatat ex non laboris.\r\nVoluptate magna qui minim proident cupidatat laborum deserunt. Commodo minim in eiusmod velit id adipisicing. Velit fugiat pariatur est minim id nisi velit velit. Nulla nisi velit sint sint quis.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 392,
                    "priceType": "Fixed",
                    "price": "$262.80",
                    "specialPrice": "$327.96",
                    "pricingName": "magna aliqua velit"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": true,
                "extraTime": 35,
                "tags": [
                    "est",
                    "velit",
                    "ullamco",
                    "dolore",
                    "nisi",
                    "voluptate",
                    "deserunt"
                ]
            },
            {
                "name": "pariatur aute Lorem id anim",
                "category": "eiusmod aute pariatur",
                "treatment": "",
                "description": "Sit commodo elit qui magna eu nisi do cillum do voluptate. Nulla pariatur cupidatat qui consectetur. Dolor commodo nisi elit deserunt mollit ipsum sint incididunt ullamco. Nulla non proident consequat culpa do nostrud. Dolor exercitation esse Lorem duis id veniam deserunt ut nostrud ullamco occaecat aute ullamco. Et incididunt dolore aute do incididunt enim mollit aliqua excepteur dolor. Laborum Lorem qui ex culpa est eu laborum proident non.\r\nAliqua anim consequat deserunt cupidatat esse deserunt non consectetur ipsum. Et eu nisi nulla pariatur non exercitation consectetur duis. Adipisicing sunt laboris aliqua quis. Adipisicing est enim non qui eiusmod. Eiusmod non non quis velit sint consectetur occaecat aliqua sunt. Mollit veniam do ad nulla exercitation ea quis pariatur minim labore. Proident veniam officia cillum veniam ullamco.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 344,
                    "priceType": "Fixed",
                    "price": "$308.69",
                    "specialPrice": "$231.13",
                    "pricingName": "officia veniam pariatur"
                },
                "pricingOptions": [
                    {
                        "duration": 203,
                        "priceType": "From",
                        "price": "$314.81",
                        "specialPrice": "$156.46",
                        "pricingName": "cillum sit duis"
                    },
                    {
                        "duration": 320,
                        "priceType": "From",
                        "price": "$247.61",
                        "specialPrice": "$209.24",
                        "pricingName": "dolore veniam cupidatat"
                    },
                    {
                        "duration": 70,
                        "priceType": "From",
                        "price": "$227.01",
                        "specialPrice": "$136.48",
                        "pricingName": "nostrud non ea"
                    },
                    {
                        "duration": 58,
                        "priceType": "From",
                        "price": "$396.65",
                        "specialPrice": "$339.49",
                        "pricingName": "velit nulla consectetur"
                    },
                    {
                        "duration": 293,
                        "priceType": "From",
                        "price": "$76.30",
                        "specialPrice": "$249.45",
                        "pricingName": "est occaecat irure"
                    },
                    {
                        "duration": 379,
                        "priceType": "From",
                        "price": "$254.86",
                        "specialPrice": "$137.99",
                        "pricingName": "tempor dolor id"
                    },
                    {
                        "duration": 56,
                        "priceType": "Fixed",
                        "price": "$129.22",
                        "specialPrice": "$134.23",
                        "pricingName": "pariatur sunt velit"
                    },
                    {
                        "duration": 351,
                        "priceType": "From",
                        "price": "$397.59",
                        "specialPrice": "$100.60",
                        "pricingName": "officia eiusmod id"
                    },
                    {
                        "duration": 366,
                        "priceType": "Fixed",
                        "price": "$202.56",
                        "specialPrice": "$244.51",
                        "pricingName": "dolor labore incididunt"
                    },
                    {
                        "duration": 392,
                        "priceType": "From",
                        "price": "$264.12",
                        "specialPrice": "$171.43",
                        "pricingName": "minim culpa esse"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 53,
                "tags": [
                    "nostrud",
                    "aliquip",
                    "proident",
                    "proident"
                ]
            }
        ]
    },
    {
        "_id": "60935e043382e6b68fe7a41c",
        "email": "carolinamejia@norsul.com",
        "bio": "Pariatur amet laboris elit duis fugiat ea aliquip.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Frenex",
        "address": {
            "street": "Locust Street",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.56469,
            "longitude": -73.72866
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "consectetur voluptate tempor",
                "description": "Nisi ut aliqua commodo commodo minim sit do nostrud voluptate ullamco sit. Ipsum magna mollit elit ullamco ipsum enim laboris magna elit ipsum ut dolor. Proident aliquip velit aliqua ipsum sit tempor nostrud deserunt ad.\r\n"
            },
            {
                "name": "laborum qui",
                "description": ""
            },
            {
                "name": "id veniam fugiat duis",
                "description": "Incididunt consequat ad commodo quis nostrud dolore commodo. Laborum esse ullamco sunt ullamco excepteur incididunt. Aliqua sint elit nulla exercitation sint nisi id laboris do non amet sint est amet.\r\nEt exercitation ea ex sit dolor ea ullamco tempor sunt fugiat pariatur ex. Laborum consequat cupidatat et fugiat sint. Ipsum excepteur esse dolore aute esse proident esse officia magna ea sit laboris duis. In sunt cupidatat dolor ipsum ut qui.\r\nLorem voluptate in excepteur minim sint sunt aute ipsum ipsum. Irure qui do nulla mollit do. Laboris proident deserunt esse pariatur fugiat enim aliqua adipisicing amet aliqua nostrud do aliqua.\r\n"
            }
        ],
        "services": [
            {
                "name": "voluptate dolore sint Lorem sunt",
                "category": "labore tempor qui",
                "treatment": "",
                "description": "Nulla adipisicing voluptate irure excepteur sunt ipsum et. Elit qui ea aliquip excepteur aliquip nostrud cupidatat. Tempor do sunt duis duis sit excepteur id dolor.\r\nEa consectetur exercitation aute elit laboris irure. Ut commodo voluptate excepteur fugiat amet ad cupidatat ex voluptate ex nisi. Ea do incididunt ut mollit officia cupidatat. Aute ipsum reprehenderit ex minim voluptate in veniam id sit ea do non. Eu sint anim proident deserunt adipisicing labore esse id. Sit eiusmod amet ad pariatur esse Lorem.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 339,
                    "priceType": "Fixed",
                    "price": "$169.72",
                    "specialPrice": "$178.04",
                    "pricingName": "officia excepteur ipsum"
                },
                "pricingOptions": [
                    {
                        "duration": 39,
                        "priceType": "Fixed",
                        "price": "$66.91",
                        "specialPrice": "$296.53",
                        "pricingName": "nostrud sint incididunt"
                    },
                    {
                        "duration": 293,
                        "priceType": "From",
                        "price": "$210.94",
                        "specialPrice": "$31.71",
                        "pricingName": "id ea deserunt"
                    },
                    {
                        "duration": 142,
                        "priceType": "From",
                        "price": "$203.27",
                        "specialPrice": "$57.81",
                        "pricingName": "magna nostrud ea"
                    },
                    {
                        "duration": 30,
                        "priceType": "From",
                        "price": "$285.12",
                        "specialPrice": "$140.24",
                        "pricingName": "velit velit consequat"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 30,
                "tags": [
                    "nisi",
                    "pariatur",
                    "ex"
                ]
            },
            {
                "name": "consequat culpa laboris adipisicing dolore",
                "category": "ullamco officia reprehenderit",
                "treatment": "",
                "description": "Nostrud labore est nulla et tempor ea consectetur quis ex est in magna. Voluptate laborum laboris commodo dolore dolor laborum mollit officia. Veniam irure velit enim velit Lorem est dolor labore nisi. Ut aliqua officia ex Lorem qui deserunt.\r\nCillum fugiat aliquip irure do magna commodo voluptate quis. Veniam mollit ex ex mollit. Non mollit dolore ullamco anim officia consectetur id cillum ut est elit ex incididunt excepteur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 172,
                    "priceType": "Fixed",
                    "price": "$331.03",
                    "specialPrice": "$225.78",
                    "pricingName": "cillum et ut"
                },
                "pricingOptions": [
                    {
                        "duration": 319,
                        "priceType": "Fixed",
                        "price": "$392.35",
                        "specialPrice": "$310.99",
                        "pricingName": "excepteur voluptate ea"
                    },
                    {
                        "duration": 276,
                        "priceType": "From",
                        "price": "$108.11",
                        "specialPrice": "$259.19",
                        "pricingName": "sunt in ullamco"
                    },
                    {
                        "duration": 249,
                        "priceType": "Fixed",
                        "price": "$185.29",
                        "specialPrice": "$107.57",
                        "pricingName": "eiusmod ad consectetur"
                    },
                    {
                        "duration": 199,
                        "priceType": "Fixed",
                        "price": "$68.76",
                        "specialPrice": "$396.88",
                        "pricingName": "exercitation occaecat ad"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 45,
                "tags": [
                    "aute",
                    "aliqua",
                    "velit",
                    "mollit",
                    "id",
                    "duis"
                ]
            }
        ]
    },
    {
        "_id": "60935e0407f8c1503528e673",
        "email": "carolinamejia@frenex.com",
        "bio": "Ad tempor ea sint occaecat tempor do deserunt.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Portico",
        "address": {
            "street": "Johnson Street",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.63696,
            "longitude": -73.51409
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "aliquip esse veniam",
                "description": "Ullamco nulla sit reprehenderit ut qui duis ut ad minim voluptate qui pariatur est. Labore eu eiusmod ut ad consectetur excepteur consectetur. Occaecat Lorem reprehenderit excepteur excepteur aliqua ea labore deserunt anim ea quis occaecat enim dolore. Duis enim amet officia mollit anim consequat pariatur. Magna nulla qui irure commodo. Amet pariatur est aliqua sit anim nulla in.\r\n"
            },
            {
                "name": "veniam Lorem",
                "description": ""
            },
            {
                "name": "duis laboris incididunt sunt",
                "description": "Duis sunt amet enim velit. Magna cillum nulla duis occaecat eu id do occaecat pariatur esse laborum laborum. Non commodo officia culpa aute irure sint mollit et tempor reprehenderit do esse pariatur. Consectetur duis adipisicing enim adipisicing nulla cillum id dolore non pariatur non.\r\nIn eiusmod aute sint nostrud sint. Pariatur occaecat in ad esse nulla. Ipsum consequat ipsum do ut nulla nisi ea cillum reprehenderit. Consequat ad ut exercitation reprehenderit labore. Anim officia enim ipsum laborum eu amet commodo. Nostrud ea aliquip elit sit reprehenderit aliqua commodo dolor officia in incididunt nisi. Veniam culpa anim incididunt nulla incididunt.\r\nNulla in ex dolore adipisicing pariatur et magna sunt nulla quis nulla proident cillum dolore. Enim do sint pariatur commodo ut Lorem anim labore occaecat labore consectetur nostrud incididunt incididunt. Sint dolor fugiat culpa minim deserunt sint minim sint. Elit ullamco laborum quis ad qui duis consequat.\r\n"
            }
        ],
        "services": [
            {
                "name": "qui pariatur id et officia",
                "category": "eiusmod reprehenderit proident",
                "treatment": "",
                "description": "Tempor quis fugiat amet voluptate cillum irure irure dolore quis labore exercitation commodo. Id minim id aute commodo ullamco. Non esse nostrud ex ipsum aliqua culpa velit. Ullamco ut excepteur nisi reprehenderit elit nostrud. Officia incididunt fugiat minim consectetur veniam tempor et.\r\nAmet proident nisi consectetur proident id esse do amet. Do ipsum aliqua officia deserunt cillum aute cillum excepteur anim ad. Id in amet nostrud tempor dolore veniam ea.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 295,
                    "priceType": "Fixed",
                    "price": "$281.62",
                    "specialPrice": "$341.30",
                    "pricingName": "enim nisi velit"
                },
                "pricingOptions": [
                    {
                        "duration": 366,
                        "priceType": "Fixed",
                        "price": "$88.32",
                        "specialPrice": "$353.03",
                        "pricingName": "fugiat aliqua velit"
                    },
                    {
                        "duration": 337,
                        "priceType": "Fixed",
                        "price": "$249.06",
                        "specialPrice": "$378.36",
                        "pricingName": "nisi anim Lorem"
                    },
                    {
                        "duration": 365,
                        "priceType": "From",
                        "price": "$216.54",
                        "specialPrice": "$355.94",
                        "pricingName": "Lorem dolor quis"
                    },
                    {
                        "duration": 297,
                        "priceType": "From",
                        "price": "$356.72",
                        "specialPrice": "$322.86",
                        "pricingName": "ullamco sunt pariatur"
                    },
                    {
                        "duration": 352,
                        "priceType": "Fixed",
                        "price": "$264.82",
                        "specialPrice": "$141.10",
                        "pricingName": "eu mollit laboris"
                    },
                    {
                        "duration": 332,
                        "priceType": "From",
                        "price": "$381.65",
                        "specialPrice": "$128.27",
                        "pricingName": "labore fugiat velit"
                    },
                    {
                        "duration": 364,
                        "priceType": "Fixed",
                        "price": "$77.96",
                        "specialPrice": "$95.69",
                        "pricingName": "eu ipsum eiusmod"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 29,
                "tags": [
                    "incididunt",
                    "ad",
                    "esse",
                    "labore",
                    "sint",
                    "nisi"
                ]
            },
            {
                "name": "tempor exercitation ea velit enim",
                "category": "irure cillum pariatur",
                "treatment": "",
                "description": "Aute mollit consequat velit ullamco veniam voluptate. Aliquip mollit velit ut et Lorem aliqua occaecat sint deserunt occaecat labore enim esse. Minim dolor labore id cupidatat est sunt aliqua exercitation ullamco irure. Amet sit minim elit voluptate laborum commodo aliqua. Aliquip eiusmod velit reprehenderit sunt ex amet.\r\nIpsum proident occaecat irure nostrud proident Lorem incididunt aliquip esse pariatur. Est irure Lorem magna non consequat aute cillum eu ipsum sunt ex. Aliqua excepteur mollit aute fugiat cupidatat nostrud Lorem officia ut in culpa. Cillum ut esse reprehenderit elit est ut velit aliquip enim. Minim nostrud id dolor duis tempor sit eu ut ad.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 148,
                    "priceType": "Fixed",
                    "price": "$190.52",
                    "specialPrice": "$191.24",
                    "pricingName": "nisi elit quis"
                },
                "pricingOptions": [
                    {
                        "duration": 114,
                        "priceType": "From",
                        "price": "$22.79",
                        "specialPrice": "$398.00",
                        "pricingName": "nisi in enim"
                    },
                    {
                        "duration": 90,
                        "priceType": "Fixed",
                        "price": "$374.45",
                        "specialPrice": "$158.46",
                        "pricingName": "est reprehenderit aliqua"
                    },
                    {
                        "duration": 378,
                        "priceType": "From",
                        "price": "$168.68",
                        "specialPrice": "$107.66",
                        "pricingName": "cillum in excepteur"
                    },
                    {
                        "duration": 299,
                        "priceType": "From",
                        "price": "$76.55",
                        "specialPrice": "$367.59",
                        "pricingName": "sint enim Lorem"
                    },
                    {
                        "duration": 385,
                        "priceType": "From",
                        "price": "$206.98",
                        "specialPrice": "$356.28",
                        "pricingName": "fugiat nisi eiusmod"
                    },
                    {
                        "duration": 193,
                        "priceType": "From",
                        "price": "$223.94",
                        "specialPrice": "$22.36",
                        "pricingName": "esse cillum in"
                    },
                    {
                        "duration": 236,
                        "priceType": "Fixed",
                        "price": "$369.37",
                        "specialPrice": "$136.81",
                        "pricingName": "deserunt id dolor"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 36,
                "tags": [
                    "labore",
                    "ad",
                    "ex"
                ]
            },
            {
                "name": "eiusmod ut minim magna occaecat",
                "category": "eu voluptate tempor",
                "treatment": "",
                "description": "Labore incididunt proident officia eu esse eiusmod irure ullamco nostrud est. Duis esse quis ea esse tempor nostrud sint duis sit velit voluptate nisi excepteur. Qui velit nisi laboris proident ipsum amet nisi duis.\r\nId non fugiat ullamco et sint ea duis eiusmod ullamco. Eu consectetur eu pariatur veniam cupidatat elit. Id nostrud aliqua amet ipsum veniam. Voluptate quis anim mollit pariatur et ipsum cupidatat proident consequat consectetur qui laborum.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 278,
                    "priceType": "From",
                    "price": "$196.33",
                    "specialPrice": "$328.53",
                    "pricingName": "voluptate ullamco sit"
                },
                "pricingOptions": [
                    {
                        "duration": 312,
                        "priceType": "From",
                        "price": "$160.07",
                        "specialPrice": "$266.13",
                        "pricingName": "ipsum nulla ipsum"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 51,
                "tags": [
                    "quis",
                    "sint",
                    "eiusmod",
                    "ex",
                    "cupidatat",
                    "aliqua"
                ]
            },
            {
                "name": "voluptate excepteur do nulla pariatur",
                "category": "do ut adipisicing",
                "treatment": "",
                "description": "Aliquip ex mollit voluptate qui. Fugiat fugiat Lorem cillum dolore ea in esse nulla excepteur reprehenderit ad velit. Eiusmod sunt dolor est aliquip ut elit aliquip tempor in. Culpa labore ad officia occaecat pariatur non cupidatat et exercitation anim. Aute veniam sit anim exercitation ea laboris quis in eiusmod id occaecat voluptate sit ipsum. Officia aute eiusmod fugiat reprehenderit consequat officia sint.\r\nMagna adipisicing cillum proident excepteur anim aliquip deserunt ad veniam eiusmod amet reprehenderit. Consectetur aliqua aliqua irure duis adipisicing adipisicing Lorem culpa elit qui excepteur sint. Mollit Lorem dolore sunt commodo aute adipisicing Lorem in cupidatat occaecat anim ad. Laborum laboris commodo laboris non excepteur tempor mollit. Ad ullamco cillum officia esse aliquip commodo dolor eu mollit nisi in.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 79,
                    "priceType": "From",
                    "price": "$327.41",
                    "specialPrice": "$255.01",
                    "pricingName": "nostrud incididunt et"
                },
                "pricingOptions": [
                    {
                        "duration": 47,
                        "priceType": "From",
                        "price": "$212.26",
                        "specialPrice": "$356.25",
                        "pricingName": "id consectetur consectetur"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 54,
                "tags": [
                    "amet",
                    "exercitation",
                    "officia",
                    "in",
                    "fugiat",
                    "voluptate"
                ]
            },
            {
                "name": "proident enim aliqua laborum pariatur",
                "category": "ea aute nostrud",
                "treatment": "",
                "description": "Culpa duis pariatur sit ad excepteur ad id fugiat dolore est nostrud ea. Aute voluptate Lorem fugiat ex excepteur sit cupidatat minim nulla velit. Esse exercitation ex ea tempor. Dolore sint Lorem consectetur ipsum adipisicing. Labore aute commodo Lorem irure nisi incididunt sint quis exercitation in ipsum eu dolore.\r\nQuis quis cupidatat ea eu occaecat eu sint non. Eiusmod deserunt eiusmod aliquip nisi fugiat in et commodo nostrud aute. Amet fugiat sint incididunt reprehenderit non culpa Lorem sit. Occaecat dolor velit veniam ullamco eu pariatur consectetur nostrud qui nisi laborum.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 99,
                    "priceType": "Fixed",
                    "price": "$144.73",
                    "specialPrice": "$375.50",
                    "pricingName": "anim non duis"
                },
                "pricingOptions": [
                    {
                        "duration": 71,
                        "priceType": "Fixed",
                        "price": "$75.89",
                        "specialPrice": "$380.34",
                        "pricingName": "dolore ex pariatur"
                    },
                    {
                        "duration": 190,
                        "priceType": "Fixed",
                        "price": "$263.47",
                        "specialPrice": "$222.62",
                        "pricingName": "enim occaecat veniam"
                    },
                    {
                        "duration": 305,
                        "priceType": "From",
                        "price": "$329.44",
                        "specialPrice": "$248.64",
                        "pricingName": "commodo officia proident"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 58,
                "tags": [
                    "dolore",
                    "non",
                    "cupidatat",
                    "aute",
                    "deserunt"
                ]
            },
            {
                "name": "officia officia deserunt dolor cupidatat",
                "category": "nisi reprehenderit non",
                "treatment": "",
                "description": "Occaecat ex amet voluptate sunt ex excepteur est mollit in enim duis enim. Culpa qui veniam incididunt eiusmod eu aliquip Lorem in esse qui Lorem fugiat officia fugiat. Qui sunt incididunt irure eiusmod anim.\r\nSint non elit reprehenderit non Lorem enim magna proident. Veniam amet do sunt irure. Ea ea ullamco ex pariatur sint veniam voluptate eiusmod elit id enim est eiusmod elit. Proident eiusmod Lorem ad irure officia id fugiat ipsum commodo sunt qui laborum ex. Est aliquip deserunt in ipsum eiusmod eiusmod ex est consectetur. Cillum veniam aliqua commodo ullamco sit velit velit sunt et veniam nisi mollit est.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 195,
                    "priceType": "Fixed",
                    "price": "$90.36",
                    "specialPrice": "$140.07",
                    "pricingName": "tempor qui sit"
                },
                "pricingOptions": [
                    {
                        "duration": 164,
                        "priceType": "From",
                        "price": "$248.66",
                        "specialPrice": "$232.32",
                        "pricingName": "consequat incididunt mollit"
                    },
                    {
                        "duration": 393,
                        "priceType": "From",
                        "price": "$95.34",
                        "specialPrice": "$328.08",
                        "pricingName": "minim est est"
                    },
                    {
                        "duration": 100,
                        "priceType": "Fixed",
                        "price": "$99.29",
                        "specialPrice": "$113.92",
                        "pricingName": "deserunt mollit laboris"
                    },
                    {
                        "duration": 113,
                        "priceType": "From",
                        "price": "$33.30",
                        "specialPrice": "$260.59",
                        "pricingName": "incididunt dolore enim"
                    },
                    {
                        "duration": 231,
                        "priceType": "From",
                        "price": "$171.75",
                        "specialPrice": "$138.56",
                        "pricingName": "excepteur culpa eu"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 46,
                "tags": [
                    "minim",
                    "nulla",
                    "exercitation",
                    "laboris",
                    "consequat",
                    "deserunt",
                    "voluptate"
                ]
            },
            {
                "name": "ut culpa excepteur cupidatat deserunt",
                "category": "proident qui enim",
                "treatment": "",
                "description": "Mollit nostrud ad minim esse ut enim in minim culpa. Adipisicing aute consequat do eu incididunt veniam ea consequat eu pariatur. Officia anim labore veniam aliqua nulla in do eiusmod. Qui minim laborum ullamco dolore ipsum. Ut cupidatat excepteur magna dolore culpa laborum. Qui ex Lorem eiusmod dolore deserunt aliqua irure occaecat pariatur sit non minim sunt.\r\nMinim Lorem nostrud aliqua aliqua nostrud amet ea sunt eu sit nulla velit nostrud. Sit incididunt minim nostrud aliquip anim amet ipsum nostrud sunt cillum. Exercitation aliqua fugiat nulla ex cupidatat proident incididunt aliqua enim eu. Aute labore ullamco dolore est ad dolore irure cupidatat nostrud amet labore dolor adipisicing. Est tempor ex veniam ut excepteur quis et do ad. Consectetur eu laborum nulla nostrud.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 43,
                    "priceType": "Fixed",
                    "price": "$123.88",
                    "specialPrice": "$118.07",
                    "pricingName": "ipsum quis esse"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": true,
                "extraTime": 21,
                "tags": [
                    "ullamco",
                    "labore",
                    "cupidatat"
                ]
            }
        ]
    },
    {
        "_id": "60935e048d491994261442d5",
        "email": "carolinamejia@portico.com",
        "bio": "Exercitation ipsum occaecat laborum sunt nulla qui adipisicing aliqua nulla est aliqua velit.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Pasturia",
        "address": {
            "street": "Polar Street",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.54208,
            "longitude": -73.55598
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "exercitation ipsum labore",
                "description": "Exercitation do eu pariatur proident dolor pariatur magna veniam elit eiusmod fugiat. Amet irure Lorem reprehenderit qui anim eiusmod culpa. Do deserunt quis velit deserunt officia. In id ea est do do ut aliqua in excepteur quis pariatur anim. Laboris nulla ullamco laborum do sint consequat nulla in sint.\r\n"
            },
            {
                "name": "ullamco enim",
                "description": ""
            },
            {
                "name": "aliquip esse excepteur commodo",
                "description": "Aute cillum do nisi incididunt cillum enim. Anim ipsum ex et ullamco minim et anim cupidatat et irure deserunt tempor. Occaecat aute magna consectetur nulla Lorem cupidatat. Sunt laboris ad elit eiusmod labore in ex voluptate.\r\nExcepteur culpa esse sit elit ex sunt aliquip sit ad. Velit fugiat quis ullamco excepteur in magna non aute ad amet Lorem est occaecat sint. Consequat sit mollit amet magna.\r\nLaborum officia ullamco aliqua et est incididunt tempor enim nisi fugiat est consequat mollit. Velit velit commodo minim sint pariatur veniam. Cupidatat nulla velit aute culpa. Lorem et adipisicing laborum laboris ut quis mollit deserunt.\r\n"
            }
        ],
        "services": [
            {
                "name": "ut adipisicing adipisicing cupidatat est",
                "category": "aliquip quis esse",
                "treatment": "",
                "description": "Magna commodo do deserunt consequat aliqua enim aute officia consectetur. Et commodo Lorem elit id labore amet aute irure in sunt. Nostrud consequat labore velit quis minim esse deserunt. Id culpa consectetur commodo aliquip do laboris exercitation excepteur. Minim voluptate deserunt ea labore. Ut aute nisi labore commodo minim consequat ea dolore ut magna excepteur.\r\nCillum aute elit ex in ut reprehenderit proident occaecat est deserunt veniam et. Ad qui amet excepteur nisi qui. Occaecat fugiat laboris ex amet dolor dolore sint. Dolore fugiat Lorem sunt adipisicing Lorem non cillum ut. Occaecat duis enim ipsum ex cupidatat. Pariatur sit aute sunt Lorem consectetur ipsum consectetur irure aute qui consectetur sunt ut. Laboris reprehenderit consequat aliquip culpa ullamco deserunt irure est cillum incididunt dolor quis.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 203,
                    "priceType": "From",
                    "price": "$218.73",
                    "specialPrice": "$320.93",
                    "pricingName": "nostrud sint ipsum"
                },
                "pricingOptions": [
                    {
                        "duration": 62,
                        "priceType": "From",
                        "price": "$72.58",
                        "specialPrice": "$388.49",
                        "pricingName": "amet voluptate dolor"
                    },
                    {
                        "duration": 24,
                        "priceType": "From",
                        "price": "$380.12",
                        "specialPrice": "$274.14",
                        "pricingName": "sunt eiusmod sint"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 52,
                "tags": [
                    "cupidatat",
                    "eiusmod",
                    "aliqua",
                    "ad",
                    "ullamco",
                    "dolore"
                ]
            },
            {
                "name": "excepteur laborum proident ut incididunt",
                "category": "ea nostrud eu",
                "treatment": "",
                "description": "Reprehenderit anim sunt ex mollit excepteur ut laboris reprehenderit et veniam aliquip ullamco laborum ex. Sit ipsum est anim mollit non do amet duis irure aliquip ex sint consequat. Amet incididunt exercitation non do et quis laborum ex sunt laboris excepteur cillum. Duis non sit velit Lorem. Anim veniam minim anim ipsum voluptate excepteur ullamco voluptate dolore anim est.\r\nAliquip cupidatat laborum sunt incididunt ipsum occaecat pariatur nulla amet elit elit aliqua aliquip mollit. Magna eiusmod fugiat dolore dolor laboris minim duis minim sint ut ea sit dolore. Qui ad ex ea officia dolor est. Aute ipsum nisi labore voluptate velit amet magna excepteur labore eu exercitation. Sint esse veniam minim nulla veniam.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 360,
                    "priceType": "Fixed",
                    "price": "$297.83",
                    "specialPrice": "$364.13",
                    "pricingName": "sint anim sunt"
                },
                "pricingOptions": [
                    {
                        "duration": 99,
                        "priceType": "Fixed",
                        "price": "$121.86",
                        "specialPrice": "$20.25",
                        "pricingName": "id tempor commodo"
                    },
                    {
                        "duration": 175,
                        "priceType": "Fixed",
                        "price": "$102.87",
                        "specialPrice": "$376.61",
                        "pricingName": "irure et culpa"
                    },
                    {
                        "duration": 93,
                        "priceType": "Fixed",
                        "price": "$350.54",
                        "specialPrice": "$69.68",
                        "pricingName": "minim exercitation enim"
                    },
                    {
                        "duration": 46,
                        "priceType": "From",
                        "price": "$188.97",
                        "specialPrice": "$297.70",
                        "pricingName": "est ipsum reprehenderit"
                    },
                    {
                        "duration": 297,
                        "priceType": "From",
                        "price": "$300.62",
                        "specialPrice": "$259.29",
                        "pricingName": "velit laborum enim"
                    },
                    {
                        "duration": 367,
                        "priceType": "From",
                        "price": "$166.64",
                        "specialPrice": "$308.51",
                        "pricingName": "dolor consequat amet"
                    },
                    {
                        "duration": 214,
                        "priceType": "From",
                        "price": "$206.15",
                        "specialPrice": "$256.22",
                        "pricingName": "minim mollit cillum"
                    },
                    {
                        "duration": 305,
                        "priceType": "Fixed",
                        "price": "$26.37",
                        "specialPrice": "$98.83",
                        "pricingName": "ad anim officia"
                    },
                    {
                        "duration": 275,
                        "priceType": "From",
                        "price": "$280.46",
                        "specialPrice": "$100.89",
                        "pricingName": "sit veniam non"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 45,
                "tags": [
                    "ullamco",
                    "enim",
                    "reprehenderit",
                    "dolore",
                    "nostrud",
                    "est"
                ]
            },
            {
                "name": "irure incididunt laboris incididunt proident",
                "category": "cillum ex non",
                "treatment": "",
                "description": "Tempor ullamco incididunt laboris reprehenderit velit ipsum excepteur sit ullamco ullamco cillum aute minim elit. Ad sit anim culpa ut consequat sint voluptate ipsum proident sint. Amet irure dolore laboris veniam laboris amet cupidatat. Culpa occaecat qui cupidatat sit ipsum. Occaecat nisi dolore laboris consequat est ex proident mollit dolor do ut. Eu proident fugiat qui et. Reprehenderit velit sunt nisi minim ad aliqua ut dolor incididunt magna laborum minim dolor magna.\r\nNostrud et adipisicing aliquip aliquip non proident duis reprehenderit ad ea consequat Lorem. Id enim exercitation elit eiusmod excepteur aliquip officia aliqua dolore occaecat ex. Mollit ipsum elit cupidatat ad. Esse magna non eu enim ea irure magna eu cupidatat sint exercitation culpa eu. Lorem consectetur duis aliqua eiusmod. Dolore exercitation duis amet non elit et dolor in anim laborum.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 246,
                    "priceType": "Fixed",
                    "price": "$178.50",
                    "specialPrice": "$330.88",
                    "pricingName": "mollit consequat cupidatat"
                },
                "pricingOptions": [
                    {
                        "duration": 45,
                        "priceType": "Fixed",
                        "price": "$162.82",
                        "specialPrice": "$178.29",
                        "pricingName": "voluptate aliqua ullamco"
                    },
                    {
                        "duration": 345,
                        "priceType": "Fixed",
                        "price": "$75.27",
                        "specialPrice": "$155.16",
                        "pricingName": "quis duis enim"
                    },
                    {
                        "duration": 357,
                        "priceType": "Fixed",
                        "price": "$338.68",
                        "specialPrice": "$335.28",
                        "pricingName": "ex sit excepteur"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 33,
                "tags": [
                    "voluptate",
                    "occaecat",
                    "ipsum"
                ]
            },
            {
                "name": "nisi in minim minim Lorem",
                "category": "non qui aliqua",
                "treatment": "",
                "description": "Reprehenderit irure aliqua veniam Lorem tempor ipsum sit. Sunt laborum occaecat proident deserunt nostrud proident do sint cillum do ipsum duis enim veniam. Excepteur reprehenderit nulla magna eiusmod magna tempor mollit esse veniam velit. Nulla duis consectetur proident ut amet tempor do sit eu ipsum. Laborum mollit ad aliquip eiusmod mollit cupidatat occaecat minim dolor magna. Do veniam aute nulla exercitation enim aliquip.\r\nConsequat nulla sit irure excepteur eiusmod excepteur ut et. Elit anim reprehenderit ea elit labore ut in qui laborum dolore in do non. Do veniam enim ullamco labore dolor.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 193,
                    "priceType": "From",
                    "price": "$210.99",
                    "specialPrice": "$328.89",
                    "pricingName": "aute deserunt ullamco"
                },
                "pricingOptions": [
                    {
                        "duration": 324,
                        "priceType": "From",
                        "price": "$271.77",
                        "specialPrice": "$98.46",
                        "pricingName": "et ut occaecat"
                    },
                    {
                        "duration": 103,
                        "priceType": "From",
                        "price": "$219.02",
                        "specialPrice": "$301.89",
                        "pricingName": "nisi ea duis"
                    },
                    {
                        "duration": 361,
                        "priceType": "From",
                        "price": "$392.49",
                        "specialPrice": "$370.66",
                        "pricingName": "consequat ex et"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 33,
                "tags": [
                    "veniam",
                    "ex",
                    "ut",
                    "minim",
                    "nostrud",
                    "nisi",
                    "aliquip"
                ]
            },
            {
                "name": "fugiat duis est dolore enim",
                "category": "officia anim do",
                "treatment": "",
                "description": "Deserunt ad quis commodo minim reprehenderit sunt proident irure culpa eiusmod sit. Quis culpa tempor amet cupidatat aute ex quis. Anim cupidatat eiusmod esse aliqua sint proident irure ea velit non. Reprehenderit cillum dolore eiusmod elit Lorem dolore esse tempor consectetur id sit minim.\r\nMagna nostrud officia tempor quis labore excepteur Lorem est laboris ex magna nostrud cupidatat esse. Laborum occaecat mollit nulla adipisicing anim minim aliquip. Reprehenderit excepteur Lorem esse fugiat duis officia reprehenderit non.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 155,
                    "priceType": "From",
                    "price": "$373.11",
                    "specialPrice": "$114.38",
                    "pricingName": "duis voluptate ea"
                },
                "pricingOptions": [
                    {
                        "duration": 208,
                        "priceType": "From",
                        "price": "$45.88",
                        "specialPrice": "$215.22",
                        "pricingName": "ipsum ex elit"
                    },
                    {
                        "duration": 191,
                        "priceType": "From",
                        "price": "$71.31",
                        "specialPrice": "$20.79",
                        "pricingName": "et Lorem occaecat"
                    },
                    {
                        "duration": 398,
                        "priceType": "Fixed",
                        "price": "$61.11",
                        "specialPrice": "$346.65",
                        "pricingName": "quis mollit dolore"
                    },
                    {
                        "duration": 126,
                        "priceType": "From",
                        "price": "$72.63",
                        "specialPrice": "$78.52",
                        "pricingName": "exercitation sit laborum"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 47,
                "tags": [
                    "aliqua",
                    "deserunt",
                    "do"
                ]
            },
            {
                "name": "incididunt proident consequat incididunt ipsum",
                "category": "incididunt proident voluptate",
                "treatment": "",
                "description": "Ea consectetur ipsum nulla dolor reprehenderit dolore consectetur quis veniam occaecat sunt. Voluptate laboris ullamco consequat excepteur esse. Eu esse consequat consectetur exercitation proident incididunt. Ipsum proident do qui sit irure dolore.\r\nCillum non sint nulla anim. Eiusmod deserunt laborum dolore minim mollit laborum fugiat eiusmod enim incididunt consequat exercitation enim in. Non sint elit aute dolor ad nisi duis sint cupidatat quis deserunt magna ex. Incididunt ad anim culpa minim sint consequat ipsum ea cillum ut reprehenderit culpa. Tempor consectetur in anim veniam laboris ipsum aute non aliquip deserunt commodo nulla.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 392,
                    "priceType": "Fixed",
                    "price": "$214.09",
                    "specialPrice": "$374.03",
                    "pricingName": "occaecat qui mollit"
                },
                "pricingOptions": [
                    {
                        "duration": 211,
                        "priceType": "From",
                        "price": "$122.95",
                        "specialPrice": "$152.83",
                        "pricingName": "irure nisi do"
                    },
                    {
                        "duration": 324,
                        "priceType": "Fixed",
                        "price": "$216.89",
                        "specialPrice": "$209.79",
                        "pricingName": "voluptate velit incididunt"
                    },
                    {
                        "duration": 204,
                        "priceType": "From",
                        "price": "$321.40",
                        "specialPrice": "$30.69",
                        "pricingName": "consequat sit do"
                    },
                    {
                        "duration": 268,
                        "priceType": "Fixed",
                        "price": "$256.10",
                        "specialPrice": "$307.57",
                        "pricingName": "velit veniam est"
                    },
                    {
                        "duration": 216,
                        "priceType": "From",
                        "price": "$300.50",
                        "specialPrice": "$267.74",
                        "pricingName": "nulla id elit"
                    },
                    {
                        "duration": 337,
                        "priceType": "From",
                        "price": "$138.15",
                        "specialPrice": "$129.50",
                        "pricingName": "pariatur elit consectetur"
                    },
                    {
                        "duration": 299,
                        "priceType": "From",
                        "price": "$135.19",
                        "specialPrice": "$395.47",
                        "pricingName": "fugiat quis duis"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 31,
                "tags": [
                    "ea",
                    "elit",
                    "tempor",
                    "Lorem",
                    "voluptate",
                    "sint"
                ]
            },
            {
                "name": "quis excepteur nisi anim velit",
                "category": "eiusmod adipisicing eiusmod",
                "treatment": "",
                "description": "In amet amet nostrud tempor nulla. Magna ut consectetur eu occaecat non officia non Lorem tempor. Eiusmod culpa anim elit nulla. Velit sunt incididunt labore commodo occaecat ut labore occaecat minim id pariatur tempor dolore. Ullamco ea laborum ad Lorem mollit. Nostrud dolore excepteur quis elit in duis aute occaecat ullamco et.\r\nAute sit velit id id laboris aliquip aliqua anim minim aliqua excepteur nostrud officia anim. Nulla deserunt culpa sint duis anim minim labore nulla consequat. Qui fugiat dolor cupidatat consequat ullamco incididunt velit do cupidatat ad tempor non nostrud incididunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 141,
                    "priceType": "Fixed",
                    "price": "$106.70",
                    "specialPrice": "$289.86",
                    "pricingName": "id deserunt dolor"
                },
                "pricingOptions": [
                    {
                        "duration": 70,
                        "priceType": "Fixed",
                        "price": "$120.36",
                        "specialPrice": "$359.23",
                        "pricingName": "ad ea aute"
                    },
                    {
                        "duration": 118,
                        "priceType": "Fixed",
                        "price": "$195.58",
                        "specialPrice": "$360.29",
                        "pricingName": "nisi id ex"
                    },
                    {
                        "duration": 143,
                        "priceType": "From",
                        "price": "$93.82",
                        "specialPrice": "$301.08",
                        "pricingName": "ad minim aliqua"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 46,
                "tags": [
                    "voluptate",
                    "incididunt"
                ]
            },
            {
                "name": "reprehenderit nulla voluptate sit labore",
                "category": "duis non laboris",
                "treatment": "",
                "description": "Do eu sint pariatur enim magna commodo esse minim amet in consectetur sint cupidatat amet. Qui magna in Lorem labore ipsum nostrud. Tempor ut reprehenderit occaecat veniam est elit et. Ipsum consequat do qui dolore consequat magna velit in magna est. Incididunt qui duis sit anim quis dolore est excepteur aliquip culpa esse reprehenderit pariatur sint. Exercitation magna incididunt velit mollit laboris. Labore ullamco exercitation labore sunt eiusmod ullamco consectetur nisi officia eu adipisicing labore.\r\nEa incididunt esse eiusmod occaecat dolore laborum et veniam do irure. Do duis aliquip amet laborum Lorem. Officia cupidatat irure esse anim dolore qui nulla dolore reprehenderit. Velit excepteur excepteur cupidatat fugiat qui excepteur sunt. Enim commodo cillum deserunt Lorem adipisicing sit occaecat in laboris consequat incididunt. Deserunt officia ea minim id mollit Lorem elit. Labore officia eu qui consequat.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 45,
                    "priceType": "From",
                    "price": "$99.57",
                    "specialPrice": "$372.69",
                    "pricingName": "labore non veniam"
                },
                "pricingOptions": [
                    {
                        "duration": 124,
                        "priceType": "From",
                        "price": "$165.50",
                        "specialPrice": "$259.39",
                        "pricingName": "ut irure aliquip"
                    },
                    {
                        "duration": 151,
                        "priceType": "Fixed",
                        "price": "$362.00",
                        "specialPrice": "$175.95",
                        "pricingName": "irure sunt aute"
                    },
                    {
                        "duration": 273,
                        "priceType": "From",
                        "price": "$269.46",
                        "specialPrice": "$169.26",
                        "pricingName": "minim ea qui"
                    },
                    {
                        "duration": 41,
                        "priceType": "Fixed",
                        "price": "$209.10",
                        "specialPrice": "$321.25",
                        "pricingName": "dolore ex consequat"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 52,
                "tags": [
                    "do",
                    "velit",
                    "esse",
                    "deserunt",
                    "fugiat",
                    "et",
                    "fugiat"
                ]
            },
            {
                "name": "officia consectetur tempor qui tempor",
                "category": "irure dolor reprehenderit",
                "treatment": "",
                "description": "Pariatur fugiat do Lorem est incididunt cupidatat. Enim laboris ex non labore ea ut minim est commodo velit cillum deserunt id sunt. Eu ut excepteur pariatur deserunt.\r\nSit non culpa ad ad exercitation cupidatat. Voluptate anim sunt labore incididunt magna velit in sit. Tempor consequat occaecat incididunt mollit excepteur cillum.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 395,
                    "priceType": "From",
                    "price": "$334.57",
                    "specialPrice": "$394.21",
                    "pricingName": "adipisicing et qui"
                },
                "pricingOptions": [
                    {
                        "duration": 152,
                        "priceType": "From",
                        "price": "$152.77",
                        "specialPrice": "$190.06",
                        "pricingName": "ullamco qui ut"
                    },
                    {
                        "duration": 191,
                        "priceType": "From",
                        "price": "$252.25",
                        "specialPrice": "$262.69",
                        "pricingName": "adipisicing tempor in"
                    },
                    {
                        "duration": 67,
                        "priceType": "Fixed",
                        "price": "$94.18",
                        "specialPrice": "$60.54",
                        "pricingName": "irure laboris nostrud"
                    },
                    {
                        "duration": 310,
                        "priceType": "Fixed",
                        "price": "$275.94",
                        "specialPrice": "$95.70",
                        "pricingName": "voluptate dolore minim"
                    },
                    {
                        "duration": 178,
                        "priceType": "Fixed",
                        "price": "$157.61",
                        "specialPrice": "$166.12",
                        "pricingName": "commodo magna deserunt"
                    },
                    {
                        "duration": 91,
                        "priceType": "From",
                        "price": "$111.79",
                        "specialPrice": "$312.26",
                        "pricingName": "cillum qui exercitation"
                    },
                    {
                        "duration": 120,
                        "priceType": "From",
                        "price": "$283.05",
                        "specialPrice": "$67.79",
                        "pricingName": "do reprehenderit culpa"
                    },
                    {
                        "duration": 310,
                        "priceType": "From",
                        "price": "$319.89",
                        "specialPrice": "$155.70",
                        "pricingName": "amet voluptate qui"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 42,
                "tags": [
                    "laboris",
                    "officia",
                    "quis",
                    "occaecat",
                    "proident"
                ]
            }
        ]
    },
    {
        "_id": "60935e042185c7fc410a6508",
        "email": "carolinamejia@pasturia.com",
        "bio": "Nisi non et reprehenderit deserunt mollit do.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Locazone",
        "address": {
            "street": "Clifford Place",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.63266,
            "longitude": -73.51426
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "elit exercitation excepteur",
                "description": "Ad nostrud proident culpa nulla esse. Ut eu aliqua enim irure cillum proident culpa. Consequat et fugiat pariatur nostrud ea dolore deserunt eu pariatur adipisicing aliquip. Aliquip ullamco nisi ad ea et commodo consequat labore.\r\n"
            },
            {
                "name": "quis officia",
                "description": ""
            },
            {
                "name": "excepteur velit proident magna",
                "description": "Et eiusmod commodo nulla excepteur enim cupidatat. Amet pariatur minim minim excepteur sunt cupidatat. In cupidatat anim nulla amet cupidatat proident magna cillum amet cupidatat aliqua.\r\nNisi reprehenderit dolor sunt aliqua duis laboris cupidatat elit duis nostrud consectetur commodo ea voluptate. Proident nisi eiusmod reprehenderit nisi quis sunt proident nulla consequat veniam anim excepteur culpa ipsum. Ex ipsum in qui aute aliquip excepteur enim voluptate minim. Eu amet mollit id deserunt. In nisi fugiat Lorem veniam fugiat consequat nulla ipsum magna nulla ut. Amet do tempor labore deserunt laboris eu fugiat eu exercitation. Exercitation aliquip enim qui incididunt dolor eu dolore pariatur.\r\nVelit veniam laboris proident sint cupidatat duis ex incididunt ad aliqua ex nulla enim qui. Pariatur exercitation ea id commodo proident occaecat adipisicing incididunt aliqua ut eu laboris excepteur. Ut labore irure qui esse tempor velit magna consequat ea quis.\r\n"
            }
        ],
        "services": [
            {
                "name": "sunt ea fugiat duis laboris",
                "category": "id officia veniam",
                "treatment": "",
                "description": "Ex dolor anim voluptate ex duis elit cillum fugiat sit cillum velit exercitation. Nulla occaecat do cupidatat labore duis tempor. Consectetur ea sit qui Lorem minim esse sunt ullamco. Labore sunt tempor aliqua reprehenderit exercitation pariatur deserunt in excepteur. Quis proident nulla minim officia esse officia culpa sit irure proident ad consectetur ad ex. Ut Lorem cillum aliquip eu ad anim aliqua Lorem mollit non elit nisi elit commodo. Pariatur excepteur qui magna labore veniam enim elit est non consequat excepteur magna ex aliqua.\r\nVoluptate culpa excepteur dolore cupidatat ea proident pariatur est non Lorem proident. Consequat deserunt in anim Lorem dolore nulla. Qui sit duis aliqua consequat est occaecat ullamco eu nostrud cillum dolore reprehenderit dolor. Fugiat esse et pariatur nisi ut laborum tempor eiusmod veniam culpa eu sunt sint voluptate. Cupidatat consectetur velit tempor commodo amet in sit incididunt elit do id adipisicing incididunt. Laborum nisi dolor deserunt elit culpa anim reprehenderit Lorem.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 153,
                    "priceType": "From",
                    "price": "$392.25",
                    "specialPrice": "$230.32",
                    "pricingName": "irure ut proident"
                },
                "pricingOptions": [
                    {
                        "duration": 248,
                        "priceType": "Fixed",
                        "price": "$97.40",
                        "specialPrice": "$118.66",
                        "pricingName": "aliquip ex dolore"
                    },
                    {
                        "duration": 372,
                        "priceType": "From",
                        "price": "$91.70",
                        "specialPrice": "$283.65",
                        "pricingName": "laboris fugiat dolor"
                    },
                    {
                        "duration": 293,
                        "priceType": "Fixed",
                        "price": "$386.65",
                        "specialPrice": "$201.32",
                        "pricingName": "pariatur incididunt velit"
                    },
                    {
                        "duration": 135,
                        "priceType": "From",
                        "price": "$51.03",
                        "specialPrice": "$318.34",
                        "pricingName": "ea consectetur elit"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 46,
                "tags": [
                    "amet",
                    "irure",
                    "officia",
                    "aliquip",
                    "nisi",
                    "enim"
                ]
            },
            {
                "name": "elit nisi aliquip eu fugiat",
                "category": "est et aute",
                "treatment": "",
                "description": "Commodo non aliqua ad mollit laborum. Duis laborum adipisicing sint ipsum Lorem occaecat ex Lorem consectetur ex ad. Qui quis aute eu nostrud proident. Eu cillum magna adipisicing enim amet eiusmod eu. Sint ullamco do sint commodo nostrud irure aute adipisicing elit anim ullamco quis dolore duis.\r\nVelit labore dolor Lorem officia veniam magna. Officia amet id consequat fugiat ad exercitation deserunt ad ut Lorem proident nostrud nostrud. Consectetur cillum sint commodo irure eiusmod in laborum minim laborum cupidatat quis cillum duis nostrud. Amet amet do adipisicing eu nisi et mollit consectetur aute. Eiusmod pariatur labore exercitation ut duis mollit magna sint ipsum fugiat. Amet ullamco amet dolor velit excepteur ipsum Lorem sit duis enim minim commodo cupidatat eu. Est ea dolor ullamco ullamco sunt eiusmod culpa amet ex.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 160,
                    "priceType": "Fixed",
                    "price": "$31.43",
                    "specialPrice": "$293.67",
                    "pricingName": "anim quis minim"
                },
                "pricingOptions": [
                    {
                        "duration": 360,
                        "priceType": "Fixed",
                        "price": "$197.24",
                        "specialPrice": "$37.01",
                        "pricingName": "dolore ullamco ad"
                    },
                    {
                        "duration": 180,
                        "priceType": "From",
                        "price": "$376.97",
                        "specialPrice": "$155.09",
                        "pricingName": "ea eiusmod aliquip"
                    },
                    {
                        "duration": 170,
                        "priceType": "Fixed",
                        "price": "$248.08",
                        "specialPrice": "$140.40",
                        "pricingName": "minim duis voluptate"
                    },
                    {
                        "duration": 209,
                        "priceType": "Fixed",
                        "price": "$314.53",
                        "specialPrice": "$26.83",
                        "pricingName": "consequat non est"
                    },
                    {
                        "duration": 148,
                        "priceType": "Fixed",
                        "price": "$353.19",
                        "specialPrice": "$91.91",
                        "pricingName": "sint mollit voluptate"
                    },
                    {
                        "duration": 306,
                        "priceType": "Fixed",
                        "price": "$103.51",
                        "specialPrice": "$35.76",
                        "pricingName": "elit enim do"
                    },
                    {
                        "duration": 48,
                        "priceType": "Fixed",
                        "price": "$237.86",
                        "specialPrice": "$75.90",
                        "pricingName": "cillum aliquip ad"
                    },
                    {
                        "duration": 88,
                        "priceType": "Fixed",
                        "price": "$201.15",
                        "specialPrice": "$279.48",
                        "pricingName": "esse deserunt ea"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 47,
                "tags": [
                    "excepteur",
                    "anim",
                    "duis",
                    "amet"
                ]
            },
            {
                "name": "excepteur laborum culpa irure in",
                "category": "ex cupidatat dolore",
                "treatment": "",
                "description": "Incididunt excepteur quis non exercitation dolor occaecat amet elit labore culpa et mollit. Et quis ullamco proident consequat. Pariatur fugiat ullamco culpa proident dolore aute aliquip. Ex ipsum nostrud excepteur aliquip excepteur in ad dolor exercitation proident quis ullamco consequat Lorem. Ea non nulla ea qui commodo esse ullamco reprehenderit velit nisi cillum ex consectetur.\r\nEsse sint ad labore voluptate ut cillum reprehenderit laborum. Dolor excepteur esse consequat cupidatat non ad nostrud veniam. Ad esse nulla fugiat exercitation cupidatat et.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 312,
                    "priceType": "Fixed",
                    "price": "$229.66",
                    "specialPrice": "$264.62",
                    "pricingName": "minim non laborum"
                },
                "pricingOptions": [
                    {
                        "duration": 384,
                        "priceType": "From",
                        "price": "$385.70",
                        "specialPrice": "$358.11",
                        "pricingName": "dolore sunt et"
                    },
                    {
                        "duration": 388,
                        "priceType": "Fixed",
                        "price": "$90.50",
                        "specialPrice": "$44.47",
                        "pricingName": "do anim excepteur"
                    },
                    {
                        "duration": 240,
                        "priceType": "Fixed",
                        "price": "$232.59",
                        "specialPrice": "$98.89",
                        "pricingName": "pariatur occaecat id"
                    },
                    {
                        "duration": 165,
                        "priceType": "From",
                        "price": "$132.40",
                        "specialPrice": "$86.13",
                        "pricingName": "veniam ullamco labore"
                    },
                    {
                        "duration": 284,
                        "priceType": "From",
                        "price": "$170.45",
                        "specialPrice": "$385.40",
                        "pricingName": "laborum ex id"
                    },
                    {
                        "duration": 184,
                        "priceType": "From",
                        "price": "$261.94",
                        "specialPrice": "$180.20",
                        "pricingName": "exercitation consequat sunt"
                    },
                    {
                        "duration": 108,
                        "priceType": "Fixed",
                        "price": "$293.97",
                        "specialPrice": "$270.81",
                        "pricingName": "cupidatat anim nulla"
                    },
                    {
                        "duration": 294,
                        "priceType": "From",
                        "price": "$46.58",
                        "specialPrice": "$230.53",
                        "pricingName": "dolor est esse"
                    },
                    {
                        "duration": 286,
                        "priceType": "From",
                        "price": "$217.81",
                        "specialPrice": "$392.91",
                        "pricingName": "aute tempor dolore"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 32,
                "tags": [
                    "magna",
                    "ullamco",
                    "ut"
                ]
            },
            {
                "name": "eu cupidatat in consequat elit",
                "category": "sint magna ullamco",
                "treatment": "",
                "description": "Cillum incididunt aliqua laboris Lorem non pariatur adipisicing cupidatat sit Lorem officia nostrud labore. Ullamco est enim eu consectetur veniam nisi est nulla sunt est ea enim. Pariatur fugiat ipsum aliquip dolor ullamco irure cillum esse do aute tempor ex occaecat.\r\nEsse quis laborum anim officia ut aliqua veniam ad anim. Laboris ea adipisicing mollit dolore laboris qui ut do amet amet exercitation velit proident in. Nostrud nostrud reprehenderit duis duis. Excepteur veniam occaecat magna qui. Sit incididunt ex enim labore eiusmod veniam. Est velit amet ex qui aliqua do incididunt velit consequat est tempor consectetur eiusmod. Nisi non cupidatat nulla aute in occaecat id excepteur ut anim.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 23,
                    "priceType": "From",
                    "price": "$336.51",
                    "specialPrice": "$159.64",
                    "pricingName": "ea amet non"
                },
                "pricingOptions": [
                    {
                        "duration": 134,
                        "priceType": "Fixed",
                        "price": "$89.32",
                        "specialPrice": "$65.27",
                        "pricingName": "aute et aliqua"
                    },
                    {
                        "duration": 254,
                        "priceType": "Fixed",
                        "price": "$139.58",
                        "specialPrice": "$74.28",
                        "pricingName": "anim ipsum magna"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 56,
                "tags": [
                    "nisi",
                    "sit",
                    "Lorem",
                    "consequat",
                    "tempor"
                ]
            },
            {
                "name": "voluptate officia ullamco do id",
                "category": "Lorem id irure",
                "treatment": "",
                "description": "Eu reprehenderit eiusmod sint amet nostrud voluptate qui dolore commodo tempor consectetur sunt. Irure dolore aliqua est id nulla excepteur ad. Anim cupidatat ex minim in eu commodo consequat. Ipsum mollit cupidatat mollit veniam exercitation dolore id adipisicing elit qui quis proident anim excepteur. Amet minim quis irure culpa Lorem esse. Veniam culpa exercitation non dolore deserunt non enim in cupidatat sint incididunt do exercitation.\r\nAute non nisi ex irure do aute consectetur commodo pariatur officia ut. Ad eiusmod enim culpa aliqua consequat quis tempor cupidatat enim quis aliquip elit. Nisi aliqua dolor ullamco in incididunt non quis exercitation ullamco dolor laborum laborum amet. Ut sit id nisi et exercitation aliqua nulla do reprehenderit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 373,
                    "priceType": "From",
                    "price": "$300.39",
                    "specialPrice": "$382.82",
                    "pricingName": "culpa occaecat irure"
                },
                "pricingOptions": [
                    {
                        "duration": 178,
                        "priceType": "From",
                        "price": "$338.01",
                        "specialPrice": "$137.71",
                        "pricingName": "tempor ex cupidatat"
                    },
                    {
                        "duration": 285,
                        "priceType": "From",
                        "price": "$255.39",
                        "specialPrice": "$340.53",
                        "pricingName": "sint velit est"
                    },
                    {
                        "duration": 363,
                        "priceType": "Fixed",
                        "price": "$363.37",
                        "specialPrice": "$35.17",
                        "pricingName": "veniam do dolore"
                    },
                    {
                        "duration": 90,
                        "priceType": "From",
                        "price": "$372.59",
                        "specialPrice": "$194.55",
                        "pricingName": "eu Lorem deserunt"
                    },
                    {
                        "duration": 42,
                        "priceType": "From",
                        "price": "$265.15",
                        "specialPrice": "$299.25",
                        "pricingName": "ullamco in pariatur"
                    },
                    {
                        "duration": 101,
                        "priceType": "Fixed",
                        "price": "$258.23",
                        "specialPrice": "$173.74",
                        "pricingName": "ullamco mollit cillum"
                    },
                    {
                        "duration": 336,
                        "priceType": "Fixed",
                        "price": "$101.31",
                        "specialPrice": "$88.91",
                        "pricingName": "magna cillum duis"
                    },
                    {
                        "duration": 277,
                        "priceType": "Fixed",
                        "price": "$211.43",
                        "specialPrice": "$70.36",
                        "pricingName": "ipsum adipisicing elit"
                    },
                    {
                        "duration": 376,
                        "priceType": "Fixed",
                        "price": "$65.72",
                        "specialPrice": "$283.57",
                        "pricingName": "quis nisi irure"
                    },
                    {
                        "duration": 37,
                        "priceType": "Fixed",
                        "price": "$257.62",
                        "specialPrice": "$339.95",
                        "pricingName": "proident esse aliqua"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 56,
                "tags": [
                    "reprehenderit",
                    "esse",
                    "ad",
                    "aliqua",
                    "amet"
                ]
            }
        ]
    },
    {
        "_id": "60935e04ce8339dd92e9a8c1",
        "email": "carolinamejia@locazone.com",
        "bio": "Amet velit labore laboris labore ut aute cillum eiusmod.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Filodyne",
        "address": {
            "street": "Ocean Court",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.46781,
            "longitude": -73.60664
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "laboris exercitation proident",
                "description": "Enim ullamco in pariatur excepteur nostrud mollit adipisicing excepteur enim et. Proident elit deserunt velit esse do laborum. Excepteur esse sit est sunt. Et in proident sint minim eu aute fugiat excepteur esse culpa non excepteur. Eiusmod et ex aute qui.\r\n"
            },
            {
                "name": "cupidatat est",
                "description": ""
            },
            {
                "name": "officia sit duis commodo",
                "description": "Lorem occaecat elit minim fugiat mollit fugiat. Esse adipisicing mollit nulla quis duis eiusmod. Elit laboris commodo incididunt ullamco laboris excepteur Lorem est. Nisi exercitation voluptate eu occaecat fugiat nostrud officia ex et officia dolor non fugiat non. Id velit laborum ad est sunt ad. Sunt laboris consequat aliquip proident.\r\nEa anim ullamco nulla velit nisi ut esse veniam ullamco sit ex adipisicing voluptate. Exercitation duis eu elit velit ea consequat consequat. Aliqua sint pariatur nostrud aliquip proident ad voluptate.\r\nQuis non aliqua magna aliquip occaecat nisi cillum laboris in aliqua anim aute ut tempor. Labore enim magna sint proident sit ea deserunt eiusmod id dolore. Qui amet non pariatur labore nostrud deserunt fugiat eiusmod laborum nisi in exercitation velit et.\r\n"
            }
        ],
        "services": [
            {
                "name": "enim dolore laboris id eu",
                "category": "proident esse duis",
                "treatment": "",
                "description": "Minim exercitation id laborum deserunt pariatur id. Irure ullamco aliquip nulla occaecat fugiat adipisicing voluptate ad Lorem. Ullamco laborum excepteur nisi deserunt aliqua. Reprehenderit ut mollit voluptate aute ipsum labore aliquip quis mollit deserunt quis incididunt non. Sunt adipisicing ex sunt ullamco cupidatat enim et laboris nulla exercitation. Ullamco nisi pariatur eu elit qui eu ea tempor exercitation tempor occaecat minim ad eu. Exercitation nostrud reprehenderit reprehenderit occaecat commodo non exercitation ex in ullamco mollit reprehenderit excepteur.\r\nNostrud duis laboris Lorem consectetur tempor quis. Minim ex ut irure sunt commodo eiusmod do ea deserunt sit. Proident esse quis et est consequat incididunt. Qui anim elit dolore esse aute aliqua deserunt velit ea cillum minim. Dolore et adipisicing amet eiusmod culpa proident eu. Elit in magna qui occaecat voluptate. Deserunt irure culpa sint amet ut excepteur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 185,
                    "priceType": "From",
                    "price": "$260.71",
                    "specialPrice": "$315.19",
                    "pricingName": "veniam reprehenderit minim"
                },
                "pricingOptions": [
                    {
                        "duration": 293,
                        "priceType": "Fixed",
                        "price": "$184.45",
                        "specialPrice": "$309.69",
                        "pricingName": "laborum quis est"
                    },
                    {
                        "duration": 335,
                        "priceType": "Fixed",
                        "price": "$68.12",
                        "specialPrice": "$190.26",
                        "pricingName": "nisi pariatur proident"
                    },
                    {
                        "duration": 99,
                        "priceType": "From",
                        "price": "$94.82",
                        "specialPrice": "$372.57",
                        "pricingName": "proident ea duis"
                    },
                    {
                        "duration": 140,
                        "priceType": "From",
                        "price": "$331.51",
                        "specialPrice": "$327.77",
                        "pricingName": "ex cupidatat dolor"
                    },
                    {
                        "duration": 89,
                        "priceType": "From",
                        "price": "$228.38",
                        "specialPrice": "$336.21",
                        "pricingName": "nostrud excepteur fugiat"
                    },
                    {
                        "duration": 393,
                        "priceType": "Fixed",
                        "price": "$257.64",
                        "specialPrice": "$332.88",
                        "pricingName": "anim exercitation velit"
                    },
                    {
                        "duration": 161,
                        "priceType": "Fixed",
                        "price": "$188.65",
                        "specialPrice": "$106.75",
                        "pricingName": "Lorem sit qui"
                    },
                    {
                        "duration": 146,
                        "priceType": "Fixed",
                        "price": "$120.48",
                        "specialPrice": "$53.14",
                        "pricingName": "elit aliquip occaecat"
                    },
                    {
                        "duration": 365,
                        "priceType": "Fixed",
                        "price": "$25.92",
                        "specialPrice": "$343.72",
                        "pricingName": "quis eu cupidatat"
                    },
                    {
                        "duration": 98,
                        "priceType": "From",
                        "price": "$374.31",
                        "specialPrice": "$114.58",
                        "pricingName": "anim dolor enim"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 60,
                "tags": [
                    "excepteur",
                    "eu",
                    "adipisicing",
                    "irure"
                ]
            },
            {
                "name": "sunt excepteur dolore dolore exercitation",
                "category": "sit adipisicing cupidatat",
                "treatment": "",
                "description": "Tempor aliquip amet magna officia veniam eiusmod. Excepteur sunt eu amet excepteur. Ea velit esse voluptate veniam do deserunt. Labore qui veniam cillum incididunt incididunt dolore officia pariatur nulla excepteur qui exercitation. Laboris anim non officia dolor sint commodo enim tempor deserunt.\r\nLaboris mollit aliquip non excepteur ad cupidatat occaecat qui officia enim occaecat enim dolore. Commodo nostrud ipsum amet sint labore aute quis. Excepteur ea tempor adipisicing ex fugiat cupidatat ullamco. Exercitation nulla tempor commodo officia sint magna ut est aute labore. Consequat excepteur non tempor magna officia commodo ullamco voluptate. Deserunt nulla nostrud ad amet laboris.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 376,
                    "priceType": "From",
                    "price": "$59.37",
                    "specialPrice": "$125.58",
                    "pricingName": "eu qui ex"
                },
                "pricingOptions": [
                    {
                        "duration": 374,
                        "priceType": "Fixed",
                        "price": "$394.51",
                        "specialPrice": "$127.54",
                        "pricingName": "ullamco irure sunt"
                    },
                    {
                        "duration": 198,
                        "priceType": "Fixed",
                        "price": "$59.94",
                        "specialPrice": "$204.15",
                        "pricingName": "elit est incididunt"
                    },
                    {
                        "duration": 45,
                        "priceType": "From",
                        "price": "$206.79",
                        "specialPrice": "$66.59",
                        "pricingName": "minim sit culpa"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 50,
                "tags": [
                    "minim",
                    "laborum",
                    "amet",
                    "est"
                ]
            },
            {
                "name": "labore amet officia eiusmod aliqua",
                "category": "excepteur in ullamco",
                "treatment": "",
                "description": "Anim consectetur laboris ea ut. Laboris labore do Lorem labore. Lorem eu culpa amet aliqua pariatur veniam.\r\nNon adipisicing sit velit deserunt. Cupidatat ipsum duis excepteur nostrud aliquip ipsum anim cillum eu. Amet deserunt mollit quis proident est sit non id velit. Dolore labore quis sunt labore ad in culpa magna id culpa.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 155,
                    "priceType": "Fixed",
                    "price": "$279.21",
                    "specialPrice": "$177.79",
                    "pricingName": "cillum ad velit"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": false,
                "extraTime": 35,
                "tags": [
                    "reprehenderit",
                    "Lorem",
                    "sint",
                    "dolore"
                ]
            }
        ]
    },
    {
        "_id": "60935e04643ca02a3817f76d",
        "email": "carolinamejia@filodyne.com",
        "bio": "Ea amet dolor dolore officia irure qui consequat occaecat do ullamco qui nulla esse.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Turnling",
        "address": {
            "street": "Eldert Street",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.67577,
            "longitude": -73.50107
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "eu qui do",
                "description": "Dolor nisi deserunt est ex ipsum ad nostrud veniam cillum do. Adipisicing laborum non aliquip quis voluptate laboris aliquip minim commodo est aute ullamco consequat sit. Duis non et id quis. Id sunt elit non duis proident cillum magna qui dolor laborum tempor ad dolore. Irure consequat exercitation incididunt sint. Aliqua culpa excepteur exercitation consectetur amet do nisi non enim duis ad elit labore minim. Amet do officia magna excepteur excepteur minim tempor ad veniam eu esse.\r\n"
            },
            {
                "name": "ipsum velit",
                "description": ""
            },
            {
                "name": "dolor ex nisi anim",
                "description": "Minim irure pariatur adipisicing velit dolor ipsum proident laborum quis laboris ut. Qui cillum ullamco aliquip cillum pariatur ipsum in. Elit exercitation quis eu ea exercitation aute ullamco occaecat consectetur. Reprehenderit cupidatat ea consequat velit consectetur in laboris occaecat nulla proident tempor laboris aute cupidatat. Commodo et dolor tempor commodo elit minim aliqua. Et sint mollit anim anim occaecat dolore deserunt ullamco exercitation reprehenderit cupidatat laboris incididunt tempor.\r\nNulla cillum qui ad ut aliqua cupidatat ea qui duis non cillum ex culpa est. Veniam deserunt deserunt ea do fugiat cupidatat ea sunt sit eiusmod commodo officia amet qui. Consequat ea nulla excepteur ea id nulla voluptate elit deserunt quis nostrud magna exercitation incididunt. Laboris eiusmod est voluptate velit ipsum sint Lorem ullamco elit ipsum nisi cupidatat aute ad. Ut excepteur aliqua ad qui pariatur.\r\nVoluptate dolor officia culpa adipisicing. Ipsum culpa exercitation pariatur ipsum id aute nulla in nisi. Consectetur magna cupidatat nostrud eu esse eu ipsum minim non reprehenderit elit proident ullamco laborum. Commodo dolore deserunt incididunt anim nostrud esse fugiat Lorem aliqua ex. Eu consectetur non ea amet dolore reprehenderit nisi laboris excepteur do quis. Sunt culpa in aute consectetur proident ea ipsum deserunt cillum ipsum ut do. Elit dolor sunt veniam commodo.\r\n"
            }
        ],
        "services": [
            {
                "name": "et labore esse sit excepteur",
                "category": "elit cillum fugiat",
                "treatment": "",
                "description": "Nostrud sit et laborum voluptate adipisicing id culpa. Consequat cillum id in aute nisi ex. Voluptate magna qui ipsum labore officia dolor quis duis minim nisi irure mollit. Sint incididunt laborum ullamco anim amet officia proident est mollit ipsum ullamco minim ipsum dolore. Proident ad fugiat aliquip nostrud sint ex officia.\r\nUllamco culpa Lorem proident anim velit ad ex eiusmod aliquip. Irure mollit ea voluptate occaecat commodo aute est qui. Adipisicing velit consequat laborum ipsum ut. In velit ad mollit cillum consequat. Ipsum et velit eu est minim aliquip eu nisi officia. Ut do aliquip ad minim nisi laborum officia in consectetur. Mollit dolor quis ut in proident.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 86,
                    "priceType": "Fixed",
                    "price": "$56.29",
                    "specialPrice": "$102.83",
                    "pricingName": "culpa consequat ipsum"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": true,
                "extraTime": 43,
                "tags": [
                    "qui",
                    "esse",
                    "do",
                    "proident",
                    "magna",
                    "et",
                    "adipisicing"
                ]
            },
            {
                "name": "fugiat consectetur proident consequat minim",
                "category": "nulla laboris deserunt",
                "treatment": "",
                "description": "Eu reprehenderit velit mollit aliquip excepteur officia dolor cillum sit enim culpa velit enim consectetur. Proident do et enim reprehenderit enim commodo pariatur quis. Proident occaecat quis magna et laborum aliqua magna cupidatat ipsum laboris velit laborum non. Deserunt laboris occaecat in laborum do id qui incididunt adipisicing. Aute amet ea aliqua adipisicing et id nisi aliqua laborum adipisicing ex ut quis. In nostrud elit amet et aliquip elit ipsum. Commodo consequat quis fugiat enim eiusmod exercitation labore sunt officia culpa proident cillum labore.\r\nAdipisicing nisi ex occaecat et enim eu Lorem esse do eiusmod aute. Veniam voluptate nulla enim consectetur culpa et officia exercitation excepteur deserunt. Laboris laboris voluptate eu ullamco proident proident fugiat esse consectetur nostrud deserunt reprehenderit. Mollit cupidatat aliquip deserunt laboris velit reprehenderit sit nulla do mollit exercitation.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 209,
                    "priceType": "From",
                    "price": "$145.55",
                    "specialPrice": "$329.73",
                    "pricingName": "ea officia enim"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": true,
                "extraTime": 57,
                "tags": [
                    "mollit",
                    "elit",
                    "exercitation",
                    "laboris",
                    "consectetur",
                    "mollit"
                ]
            },
            {
                "name": "dolor proident id cillum duis",
                "category": "laborum amet do",
                "treatment": "",
                "description": "Ullamco Lorem sint tempor ut occaecat sit do fugiat cupidatat. Id amet ex nostrud ex. Laboris ipsum nulla deserunt in occaecat ipsum ad tempor consequat adipisicing amet tempor.\r\nExercitation consequat labore minim veniam non consectetur eu enim incididunt sunt tempor culpa est minim. Anim reprehenderit ut dolor eiusmod fugiat aliqua elit laboris in nulla incididunt. Quis officia dolore ad commodo fugiat. Qui incididunt qui labore mollit laborum adipisicing ipsum. Cupidatat dolor proident commodo mollit proident ipsum. Magna anim do ea ea sunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 155,
                    "priceType": "Fixed",
                    "price": "$222.09",
                    "specialPrice": "$168.41",
                    "pricingName": "velit esse officia"
                },
                "pricingOptions": [
                    {
                        "duration": 398,
                        "priceType": "Fixed",
                        "price": "$235.46",
                        "specialPrice": "$376.33",
                        "pricingName": "fugiat veniam laboris"
                    },
                    {
                        "duration": 230,
                        "priceType": "From",
                        "price": "$257.40",
                        "specialPrice": "$279.65",
                        "pricingName": "pariatur ullamco ullamco"
                    },
                    {
                        "duration": 313,
                        "priceType": "Fixed",
                        "price": "$97.86",
                        "specialPrice": "$314.69",
                        "pricingName": "ipsum commodo eu"
                    },
                    {
                        "duration": 77,
                        "priceType": "Fixed",
                        "price": "$23.70",
                        "specialPrice": "$80.38",
                        "pricingName": "sint eiusmod sit"
                    },
                    {
                        "duration": 367,
                        "priceType": "From",
                        "price": "$304.62",
                        "specialPrice": "$69.81",
                        "pricingName": "duis dolore do"
                    },
                    {
                        "duration": 313,
                        "priceType": "Fixed",
                        "price": "$34.88",
                        "specialPrice": "$134.62",
                        "pricingName": "nisi culpa ullamco"
                    },
                    {
                        "duration": 387,
                        "priceType": "From",
                        "price": "$132.86",
                        "specialPrice": "$158.06",
                        "pricingName": "pariatur aute adipisicing"
                    },
                    {
                        "duration": 33,
                        "priceType": "From",
                        "price": "$269.58",
                        "specialPrice": "$94.56",
                        "pricingName": "pariatur esse nulla"
                    },
                    {
                        "duration": 30,
                        "priceType": "From",
                        "price": "$124.59",
                        "specialPrice": "$379.90",
                        "pricingName": "velit occaecat aliquip"
                    },
                    {
                        "duration": 257,
                        "priceType": "Fixed",
                        "price": "$50.91",
                        "specialPrice": "$310.99",
                        "pricingName": "reprehenderit deserunt incididunt"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 56,
                "tags": [
                    "nisi",
                    "ea",
                    "aute"
                ]
            },
            {
                "name": "tempor eiusmod veniam nostrud laboris",
                "category": "laborum id et",
                "treatment": "",
                "description": "Veniam non laboris ullamco consectetur ut consequat Lorem esse anim cupidatat sunt elit cillum ea. Voluptate ut in in laborum nostrud Lorem cillum. Enim esse sunt consequat eiusmod reprehenderit.\r\nMagna proident laborum consectetur labore reprehenderit duis est exercitation. Sit veniam cupidatat officia fugiat nostrud sit proident culpa est. Eu culpa est qui dolor dolor est. Do magna voluptate et irure. Minim voluptate ea veniam nostrud sit sit elit in labore qui in voluptate ullamco.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 35,
                    "priceType": "From",
                    "price": "$182.19",
                    "specialPrice": "$296.41",
                    "pricingName": "ut mollit dolor"
                },
                "pricingOptions": [
                    {
                        "duration": 235,
                        "priceType": "From",
                        "price": "$335.93",
                        "specialPrice": "$304.03",
                        "pricingName": "qui anim Lorem"
                    },
                    {
                        "duration": 332,
                        "priceType": "From",
                        "price": "$62.34",
                        "specialPrice": "$95.12",
                        "pricingName": "ea ut ipsum"
                    },
                    {
                        "duration": 312,
                        "priceType": "Fixed",
                        "price": "$37.24",
                        "specialPrice": "$206.16",
                        "pricingName": "ullamco veniam et"
                    },
                    {
                        "duration": 76,
                        "priceType": "Fixed",
                        "price": "$167.47",
                        "specialPrice": "$391.16",
                        "pricingName": "culpa irure cillum"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 53,
                "tags": [
                    "quis",
                    "in",
                    "dolor",
                    "consequat"
                ]
            },
            {
                "name": "excepteur aliqua enim ipsum commodo",
                "category": "enim ut sit",
                "treatment": "",
                "description": "Laborum veniam excepteur aliqua occaecat. Officia adipisicing ad quis ut voluptate et consectetur laboris commodo est do veniam est mollit. Tempor deserunt irure pariatur nulla. Lorem officia minim elit duis nulla elit incididunt. Est consectetur sint voluptate officia est aute adipisicing. Dolor culpa non deserunt et voluptate sint minim sunt. Laboris deserunt eiusmod reprehenderit dolor proident enim reprehenderit aliqua incididunt nostrud ipsum.\r\nEu pariatur elit consequat dolore. Amet in dolor in nisi incididunt commodo eiusmod. In cupidatat pariatur Lorem eiusmod. Mollit ut sint voluptate sint reprehenderit in Lorem. Tempor ad est est in non ullamco quis esse ipsum Lorem nulla velit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 77,
                    "priceType": "Fixed",
                    "price": "$329.02",
                    "specialPrice": "$136.27",
                    "pricingName": "magna enim culpa"
                },
                "pricingOptions": [
                    {
                        "duration": 268,
                        "priceType": "From",
                        "price": "$68.63",
                        "specialPrice": "$189.32",
                        "pricingName": "laboris labore id"
                    },
                    {
                        "duration": 321,
                        "priceType": "Fixed",
                        "price": "$316.38",
                        "specialPrice": "$198.07",
                        "pricingName": "adipisicing voluptate ullamco"
                    },
                    {
                        "duration": 122,
                        "priceType": "From",
                        "price": "$251.55",
                        "specialPrice": "$366.71",
                        "pricingName": "laborum aute et"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 30,
                "tags": [
                    "laborum",
                    "eiusmod"
                ]
            },
            {
                "name": "reprehenderit commodo ad ea mollit",
                "category": "elit consequat amet",
                "treatment": "",
                "description": "Non cillum qui ipsum consequat pariatur. Sunt amet proident dolore velit. Est magna pariatur enim nisi velit. Proident proident proident nulla nostrud labore aute elit dolor Lorem occaecat occaecat excepteur adipisicing veniam. Quis nisi reprehenderit et esse fugiat ullamco laboris ad ex. Dolor cillum minim et do enim reprehenderit est. Fugiat magna incididunt aute minim sunt excepteur.\r\nAute duis ut voluptate commodo ad ipsum nulla eu. Tempor duis minim mollit nulla consequat ullamco consequat. Reprehenderit quis commodo fugiat eiusmod nulla aliqua nisi. Qui labore duis ut reprehenderit minim in commodo non anim tempor. Qui do dolore aliqua dolore et labore culpa.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 80,
                    "priceType": "Fixed",
                    "price": "$352.64",
                    "specialPrice": "$308.31",
                    "pricingName": "qui laboris ea"
                },
                "pricingOptions": [
                    {
                        "duration": 314,
                        "priceType": "From",
                        "price": "$221.17",
                        "specialPrice": "$211.99",
                        "pricingName": "ipsum labore sunt"
                    },
                    {
                        "duration": 366,
                        "priceType": "From",
                        "price": "$83.92",
                        "specialPrice": "$322.06",
                        "pricingName": "est labore in"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 28,
                "tags": [
                    "in",
                    "duis",
                    "eu"
                ]
            }
        ]
    },
    {
        "_id": "60935e04e049559e4a397c79",
        "email": "carolinamejia@turnling.com",
        "bio": "Excepteur do aliqua deserunt aute nostrud et aliquip.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Miracula",
        "address": {
            "street": "Beard Street",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.54311,
            "longitude": -73.62308
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "cillum reprehenderit sunt",
                "description": "Ipsum pariatur incididunt enim anim fugiat dolor eiusmod. Velit cupidatat velit sunt fugiat aliquip deserunt ad. Nostrud ea dolor duis amet enim laborum adipisicing labore culpa excepteur est minim. Ut deserunt deserunt proident aliquip Lorem ex commodo. Adipisicing duis adipisicing labore ipsum enim enim officia Lorem sit eu nulla id in quis. Minim pariatur non nostrud duis enim ipsum occaecat ad labore sit nulla reprehenderit sint. Proident esse ex sint ipsum Lorem enim id anim cupidatat dolore ullamco ex amet ullamco.\r\n"
            },
            {
                "name": "esse amet",
                "description": ""
            },
            {
                "name": "nostrud ad ipsum est",
                "description": "Commodo enim ad in esse dolore commodo minim non consequat dolore ullamco excepteur. Eu Lorem anim amet nisi voluptate exercitation reprehenderit aute ad duis veniam velit. Magna eiusmod adipisicing ullamco amet. Incididunt reprehenderit proident aute magna tempor amet occaecat adipisicing. Lorem et nostrud aliqua do ad aliqua est velit officia proident.\r\nQui non quis cupidatat eiusmod ex esse. Id pariatur voluptate in ipsum. Nisi deserunt cupidatat eiusmod excepteur voluptate velit aliquip.\r\nCulpa magna eiusmod ea nisi duis nisi et est cupidatat aliquip do minim culpa sint. Fugiat duis sint deserunt deserunt. Quis occaecat nisi consectetur culpa labore aute.\r\n"
            }
        ],
        "services": [
            {
                "name": "laborum aliqua cillum aliquip culpa",
                "category": "duis commodo nulla",
                "treatment": "",
                "description": "Sunt aute dolor in laborum irure sunt deserunt sunt ullamco ea. Laboris est ut non et nisi. Eiusmod dolor deserunt nisi minim deserunt amet cupidatat amet eiusmod fugiat esse occaecat nisi. Proident fugiat ipsum dolore amet labore ut anim commodo do ut. Amet aute laboris tempor in sunt.\r\nMollit aliqua incididunt pariatur voluptate voluptate ipsum do consectetur. Ea fugiat magna exercitation et ipsum ex minim nisi aute est irure ullamco laborum aliqua. Minim consequat duis exercitation elit nulla irure do proident nostrud aute. Consequat qui anim qui pariatur consectetur Lorem dolor exercitation sit. Dolor mollit pariatur ad Lorem adipisicing tempor proident veniam ullamco. Id aliquip consectetur irure non laboris velit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 24,
                    "priceType": "Fixed",
                    "price": "$119.48",
                    "specialPrice": "$243.13",
                    "pricingName": "labore non fugiat"
                },
                "pricingOptions": [
                    {
                        "duration": 177,
                        "priceType": "Fixed",
                        "price": "$374.99",
                        "specialPrice": "$38.72",
                        "pricingName": "voluptate laboris excepteur"
                    },
                    {
                        "duration": 344,
                        "priceType": "From",
                        "price": "$277.46",
                        "specialPrice": "$164.74",
                        "pricingName": "minim minim laborum"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 35,
                "tags": [
                    "dolore",
                    "commodo",
                    "occaecat",
                    "elit",
                    "quis"
                ]
            },
            {
                "name": "do officia in consectetur velit",
                "category": "Lorem nulla do",
                "treatment": "",
                "description": "Eiusmod consequat amet enim voluptate eu pariatur id. Duis consequat veniam et reprehenderit aute amet amet adipisicing in irure commodo mollit ad sunt. Velit nostrud cupidatat culpa reprehenderit consectetur in. Mollit fugiat do mollit veniam consectetur consequat laboris laboris aliqua.\r\nAute voluptate dolore ad Lorem id velit. Ad consequat aliqua veniam velit est adipisicing est ea consequat enim nulla excepteur. Aute eu id dolore irure proident sit anim magna ea magna excepteur enim sit excepteur. Pariatur ullamco ex ipsum duis nostrud nulla. Proident mollit ut adipisicing adipisicing irure aute do anim anim. Laboris voluptate enim amet quis ad officia ea nulla.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 59,
                    "priceType": "Fixed",
                    "price": "$142.52",
                    "specialPrice": "$349.63",
                    "pricingName": "consequat occaecat ullamco"
                },
                "pricingOptions": [
                    {
                        "duration": 384,
                        "priceType": "From",
                        "price": "$266.04",
                        "specialPrice": "$392.28",
                        "pricingName": "laboris mollit in"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 38,
                "tags": [
                    "esse",
                    "anim",
                    "Lorem",
                    "mollit",
                    "commodo",
                    "esse"
                ]
            },
            {
                "name": "ut voluptate ea est in",
                "category": "Lorem ea labore",
                "treatment": "",
                "description": "Laborum commodo excepteur enim cupidatat in consectetur. Do minim consequat consequat proident nulla eiusmod ut enim dolore Lorem proident eiusmod cillum non. Do deserunt magna culpa duis elit amet dolore anim reprehenderit ullamco amet. Ut nisi aliqua culpa elit nulla eu officia id. Aliquip duis esse reprehenderit Lorem ex labore amet nulla nisi labore eu tempor. Deserunt excepteur fugiat velit ea dolore exercitation ex laboris in proident non. Sit dolor culpa elit excepteur in deserunt tempor ut do nostrud labore.\r\nAdipisicing eiusmod officia nulla nulla cupidatat proident pariatur incididunt non mollit do eiusmod. Velit nostrud voluptate qui do culpa cillum Lorem tempor qui deserunt. Excepteur enim aute do aliquip laborum ad do esse aute ut consequat non magna. Qui sit laborum ipsum occaecat proident laboris cillum ea excepteur. Eiusmod ex exercitation irure irure ad eu.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 73,
                    "priceType": "Fixed",
                    "price": "$129.68",
                    "specialPrice": "$127.64",
                    "pricingName": "velit anim occaecat"
                },
                "pricingOptions": [
                    {
                        "duration": 345,
                        "priceType": "From",
                        "price": "$316.67",
                        "specialPrice": "$210.43",
                        "pricingName": "tempor labore ut"
                    },
                    {
                        "duration": 332,
                        "priceType": "Fixed",
                        "price": "$81.60",
                        "specialPrice": "$273.83",
                        "pricingName": "est labore excepteur"
                    },
                    {
                        "duration": 339,
                        "priceType": "Fixed",
                        "price": "$398.43",
                        "specialPrice": "$64.94",
                        "pricingName": "quis pariatur exercitation"
                    },
                    {
                        "duration": 86,
                        "priceType": "From",
                        "price": "$225.85",
                        "specialPrice": "$93.12",
                        "pricingName": "sit incididunt adipisicing"
                    },
                    {
                        "duration": 140,
                        "priceType": "From",
                        "price": "$257.98",
                        "specialPrice": "$94.59",
                        "pricingName": "commodo cillum id"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 46,
                "tags": [
                    "anim",
                    "eu",
                    "nisi",
                    "laboris"
                ]
            },
            {
                "name": "id sit nisi labore laboris",
                "category": "eu duis ullamco",
                "treatment": "",
                "description": "Qui dolor exercitation in deserunt tempor officia deserunt consequat id consequat ex. Voluptate do consequat id officia reprehenderit cupidatat ut. Nulla mollit consectetur excepteur Lorem do cillum aute deserunt tempor cillum irure duis. Minim nostrud elit occaecat quis irure consectetur quis exercitation aute consequat deserunt. Amet ad consequat id elit velit fugiat ut nostrud incididunt.\r\nDolore et aute dolore laboris sit. Culpa reprehenderit enim esse esse in ut tempor minim. Adipisicing deserunt laborum sunt excepteur dolore amet quis id cupidatat aliqua tempor aliqua in.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 239,
                    "priceType": "Fixed",
                    "price": "$285.89",
                    "specialPrice": "$173.23",
                    "pricingName": "eu irure qui"
                },
                "pricingOptions": [
                    {
                        "duration": 365,
                        "priceType": "Fixed",
                        "price": "$344.60",
                        "specialPrice": "$74.44",
                        "pricingName": "ea officia do"
                    },
                    {
                        "duration": 77,
                        "priceType": "Fixed",
                        "price": "$29.74",
                        "specialPrice": "$115.69",
                        "pricingName": "mollit officia in"
                    },
                    {
                        "duration": 151,
                        "priceType": "From",
                        "price": "$41.97",
                        "specialPrice": "$227.48",
                        "pricingName": "occaecat non esse"
                    },
                    {
                        "duration": 189,
                        "priceType": "From",
                        "price": "$228.30",
                        "specialPrice": "$53.43",
                        "pricingName": "aliqua ea quis"
                    },
                    {
                        "duration": 41,
                        "priceType": "Fixed",
                        "price": "$34.96",
                        "specialPrice": "$25.09",
                        "pricingName": "veniam nisi pariatur"
                    },
                    {
                        "duration": 345,
                        "priceType": "Fixed",
                        "price": "$236.40",
                        "specialPrice": "$316.14",
                        "pricingName": "nostrud veniam cillum"
                    },
                    {
                        "duration": 152,
                        "priceType": "Fixed",
                        "price": "$364.20",
                        "specialPrice": "$52.20",
                        "pricingName": "fugiat officia consectetur"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 26,
                "tags": [
                    "ea",
                    "est",
                    "culpa",
                    "officia",
                    "cupidatat",
                    "laborum"
                ]
            },
            {
                "name": "aliqua laboris dolor cupidatat enim",
                "category": "officia minim ullamco",
                "treatment": "",
                "description": "Sit enim non excepteur elit irure consequat nisi qui ipsum pariatur nostrud cupidatat incididunt. Duis cupidatat esse ipsum minim amet labore deserunt sint anim laborum mollit incididunt. Excepteur aute ut nisi Lorem deserunt irure sit anim do reprehenderit ullamco dolor dolor fugiat. Sunt ex laboris cupidatat consectetur ut consectetur ullamco consequat ipsum laborum. Amet voluptate fugiat ea eu esse dolore.\r\nLorem esse eiusmod minim eiusmod pariatur commodo dolore laboris. Esse adipisicing Lorem cillum magna. Commodo irure dolor aute dolore. Nisi dolor nostrud enim quis eu cupidatat ad elit voluptate non aute sint nostrud. Aute ex dolor elit excepteur nulla nulla. Sunt deserunt non qui magna aliquip anim nulla non commodo excepteur laborum enim ipsum. Nisi aliquip ad commodo elit anim deserunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 252,
                    "priceType": "From",
                    "price": "$119.12",
                    "specialPrice": "$244.57",
                    "pricingName": "sit ex pariatur"
                },
                "pricingOptions": [
                    {
                        "duration": 40,
                        "priceType": "Fixed",
                        "price": "$296.59",
                        "specialPrice": "$185.52",
                        "pricingName": "proident irure consequat"
                    },
                    {
                        "duration": 265,
                        "priceType": "From",
                        "price": "$395.99",
                        "specialPrice": "$73.74",
                        "pricingName": "eiusmod laboris non"
                    },
                    {
                        "duration": 333,
                        "priceType": "Fixed",
                        "price": "$101.14",
                        "specialPrice": "$300.06",
                        "pricingName": "anim ea excepteur"
                    },
                    {
                        "duration": 321,
                        "priceType": "From",
                        "price": "$260.15",
                        "specialPrice": "$216.85",
                        "pricingName": "nostrud sit aute"
                    },
                    {
                        "duration": 272,
                        "priceType": "Fixed",
                        "price": "$290.65",
                        "specialPrice": "$170.25",
                        "pricingName": "ullamco labore ad"
                    },
                    {
                        "duration": 27,
                        "priceType": "Fixed",
                        "price": "$365.85",
                        "specialPrice": "$70.24",
                        "pricingName": "nulla minim ut"
                    },
                    {
                        "duration": 220,
                        "priceType": "From",
                        "price": "$212.61",
                        "specialPrice": "$206.18",
                        "pricingName": "elit reprehenderit labore"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 38,
                "tags": [
                    "duis",
                    "pariatur",
                    "veniam",
                    "quis",
                    "velit",
                    "deserunt"
                ]
            },
            {
                "name": "eu cillum labore dolor in",
                "category": "nostrud nisi in",
                "treatment": "",
                "description": "Duis deserunt et nulla eiusmod cupidatat anim laboris sit ut enim culpa ex. Nostrud magna reprehenderit veniam magna nostrud tempor tempor incididunt pariatur cupidatat laboris pariatur. Commodo do proident do aliqua ad laboris fugiat incididunt pariatur amet culpa nulla. Lorem exercitation ullamco non proident amet non labore enim aute. Cupidatat sint amet duis ut id sit irure aliqua magna.\r\nAliquip eu deserunt mollit ullamco ut amet ex pariatur cupidatat id ullamco. Sunt veniam occaecat aliqua laborum excepteur laborum sint qui quis amet occaecat cillum adipisicing velit. Quis consectetur mollit veniam deserunt cupidatat veniam magna laboris elit. In consectetur magna id occaecat incididunt cupidatat dolor minim consequat quis ullamco quis. Consequat dolor occaecat adipisicing esse nostrud ea irure. In enim occaecat exercitation velit anim veniam excepteur voluptate.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 250,
                    "priceType": "From",
                    "price": "$361.96",
                    "specialPrice": "$126.33",
                    "pricingName": "id aliquip labore"
                },
                "pricingOptions": [
                    {
                        "duration": 398,
                        "priceType": "Fixed",
                        "price": "$151.83",
                        "specialPrice": "$127.91",
                        "pricingName": "aliquip in laboris"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 50,
                "tags": [
                    "voluptate",
                    "est",
                    "sunt"
                ]
            },
            {
                "name": "nisi amet duis irure labore",
                "category": "adipisicing enim ipsum",
                "treatment": "",
                "description": "Ipsum esse voluptate anim enim non consequat incididunt. Sint elit minim sunt incididunt nulla pariatur in laboris consectetur non ad tempor. Ut esse enim enim in consectetur in. Aute aliquip irure commodo minim mollit voluptate deserunt cillum. Minim consectetur fugiat enim consequat mollit enim anim in.\r\nMagna esse laboris consectetur exercitation nostrud excepteur ipsum labore anim fugiat ut id esse. In amet veniam ad consequat ea exercitation quis ut labore magna anim dolore laborum dolore. Culpa irure non dolor est consequat commodo sunt elit amet. Nisi tempor eiusmod mollit quis id eiusmod id do nisi et aute Lorem consequat. Enim voluptate nulla ex nostrud sunt reprehenderit elit voluptate id voluptate cillum tempor velit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 38,
                    "priceType": "Fixed",
                    "price": "$143.77",
                    "specialPrice": "$356.94",
                    "pricingName": "laborum duis consectetur"
                },
                "pricingOptions": [
                    {
                        "duration": 39,
                        "priceType": "Fixed",
                        "price": "$363.59",
                        "specialPrice": "$215.62",
                        "pricingName": "dolore enim eiusmod"
                    },
                    {
                        "duration": 67,
                        "priceType": "From",
                        "price": "$37.70",
                        "specialPrice": "$321.61",
                        "pricingName": "quis id proident"
                    },
                    {
                        "duration": 270,
                        "priceType": "From",
                        "price": "$136.45",
                        "specialPrice": "$118.47",
                        "pricingName": "cillum consequat velit"
                    },
                    {
                        "duration": 333,
                        "priceType": "From",
                        "price": "$111.28",
                        "specialPrice": "$199.49",
                        "pricingName": "reprehenderit amet consequat"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 57,
                "tags": [
                    "elit",
                    "minim",
                    "cillum",
                    "esse",
                    "nisi"
                ]
            },
            {
                "name": "veniam consequat culpa aliquip irure",
                "category": "tempor eu esse",
                "treatment": "",
                "description": "Deserunt excepteur fugiat enim incididunt. Duis occaecat occaecat nisi dolor adipisicing in Lorem ad elit eu sint commodo esse tempor. Enim anim mollit ad ex non veniam sit quis cillum fugiat qui.\r\nVoluptate excepteur velit anim deserunt. Amet cupidatat amet excepteur ullamco fugiat ad exercitation. Ad pariatur quis tempor velit qui non tempor elit sint voluptate. Enim pariatur esse dolore sit exercitation ad sit nisi minim.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 124,
                    "priceType": "Fixed",
                    "price": "$84.87",
                    "specialPrice": "$240.52",
                    "pricingName": "enim ipsum proident"
                },
                "pricingOptions": [
                    {
                        "duration": 91,
                        "priceType": "From",
                        "price": "$174.26",
                        "specialPrice": "$223.71",
                        "pricingName": "aute irure ad"
                    },
                    {
                        "duration": 137,
                        "priceType": "Fixed",
                        "price": "$99.12",
                        "specialPrice": "$333.69",
                        "pricingName": "nostrud nisi fugiat"
                    },
                    {
                        "duration": 147,
                        "priceType": "Fixed",
                        "price": "$132.90",
                        "specialPrice": "$366.76",
                        "pricingName": "qui magna ullamco"
                    },
                    {
                        "duration": 21,
                        "priceType": "Fixed",
                        "price": "$135.80",
                        "specialPrice": "$28.38",
                        "pricingName": "culpa et duis"
                    },
                    {
                        "duration": 150,
                        "priceType": "Fixed",
                        "price": "$212.12",
                        "specialPrice": "$249.74",
                        "pricingName": "velit ullamco in"
                    },
                    {
                        "duration": 251,
                        "priceType": "From",
                        "price": "$157.68",
                        "specialPrice": "$176.50",
                        "pricingName": "anim ipsum ad"
                    },
                    {
                        "duration": 330,
                        "priceType": "From",
                        "price": "$219.67",
                        "specialPrice": "$29.94",
                        "pricingName": "in aliquip aliqua"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 53,
                "tags": [
                    "labore",
                    "cillum"
                ]
            },
            {
                "name": "consectetur adipisicing magna aute proident",
                "category": "Lorem non adipisicing",
                "treatment": "",
                "description": "Ad aliqua ea culpa aute laboris eu minim aute ad cupidatat. Officia enim cupidatat pariatur sit Lorem sit consectetur enim. Eu cupidatat ex non eu voluptate. Elit non velit velit sunt sint ad ipsum velit exercitation id nostrud Lorem est aute. Adipisicing fugiat laborum magna enim exercitation. Mollit ea excepteur excepteur cupidatat elit. Est aliqua ipsum minim cillum consectetur esse est reprehenderit fugiat.\r\nConsectetur fugiat mollit sit incididunt qui elit sunt culpa consectetur incididunt quis pariatur. Sint elit aliquip qui aliqua exercitation tempor occaecat exercitation ex do irure ea. Sit culpa in ut eiusmod et aliqua elit amet. Proident pariatur ex cillum eiusmod ut elit labore. Magna commodo dolor aliqua in. Ea qui irure nostrud cillum commodo est proident officia. Et nisi officia anim proident sint magna cillum tempor velit exercitation duis ea id.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 217,
                    "priceType": "Fixed",
                    "price": "$55.84",
                    "specialPrice": "$119.77",
                    "pricingName": "elit ex quis"
                },
                "pricingOptions": [
                    {
                        "duration": 267,
                        "priceType": "From",
                        "price": "$89.60",
                        "specialPrice": "$248.28",
                        "pricingName": "incididunt deserunt sunt"
                    },
                    {
                        "duration": 197,
                        "priceType": "Fixed",
                        "price": "$41.64",
                        "specialPrice": "$282.87",
                        "pricingName": "minim aliquip incididunt"
                    },
                    {
                        "duration": 367,
                        "priceType": "From",
                        "price": "$332.77",
                        "specialPrice": "$60.28",
                        "pricingName": "magna pariatur quis"
                    },
                    {
                        "duration": 214,
                        "priceType": "Fixed",
                        "price": "$278.98",
                        "specialPrice": "$227.22",
                        "pricingName": "occaecat consectetur culpa"
                    },
                    {
                        "duration": 101,
                        "priceType": "From",
                        "price": "$219.96",
                        "specialPrice": "$256.85",
                        "pricingName": "aliqua ut commodo"
                    },
                    {
                        "duration": 153,
                        "priceType": "From",
                        "price": "$307.39",
                        "specialPrice": "$178.17",
                        "pricingName": "non laborum commodo"
                    },
                    {
                        "duration": 333,
                        "priceType": "Fixed",
                        "price": "$334.85",
                        "specialPrice": "$100.83",
                        "pricingName": "cillum Lorem incididunt"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 32,
                "tags": [
                    "officia",
                    "fugiat"
                ]
            },
            {
                "name": "cupidatat ad ullamco ad ea",
                "category": "in officia minim",
                "treatment": "",
                "description": "In incididunt cillum cillum voluptate consequat labore id culpa culpa duis consequat labore. Tempor elit tempor et pariatur duis fugiat anim eiusmod incididunt enim nisi. Ad enim cillum dolore irure culpa aliquip nostrud id proident ipsum cupidatat anim. Non in dolore non sunt amet exercitation id. Fugiat eiusmod nostrud ex id non consequat. Nisi excepteur eiusmod proident ut duis magna laboris est.\r\nConsectetur occaecat ut in velit ipsum pariatur est ea deserunt sunt excepteur aute. Id laborum pariatur esse esse cupidatat eiusmod aute enim reprehenderit ex tempor ea sunt aliqua. Cupidatat dolore tempor ad aliqua aliquip mollit laborum. Aute ad ullamco elit qui nisi ex. Sit magna qui ex irure eu est.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 106,
                    "priceType": "Fixed",
                    "price": "$337.31",
                    "specialPrice": "$185.33",
                    "pricingName": "mollit cupidatat anim"
                },
                "pricingOptions": [
                    {
                        "duration": 347,
                        "priceType": "Fixed",
                        "price": "$399.71",
                        "specialPrice": "$262.25",
                        "pricingName": "eiusmod sint deserunt"
                    },
                    {
                        "duration": 228,
                        "priceType": "From",
                        "price": "$312.78",
                        "specialPrice": "$265.23",
                        "pricingName": "esse do cupidatat"
                    },
                    {
                        "duration": 276,
                        "priceType": "Fixed",
                        "price": "$74.08",
                        "specialPrice": "$326.71",
                        "pricingName": "deserunt do occaecat"
                    },
                    {
                        "duration": 232,
                        "priceType": "Fixed",
                        "price": "$250.98",
                        "specialPrice": "$293.01",
                        "pricingName": "pariatur ut excepteur"
                    },
                    {
                        "duration": 335,
                        "priceType": "From",
                        "price": "$137.30",
                        "specialPrice": "$209.27",
                        "pricingName": "do Lorem adipisicing"
                    },
                    {
                        "duration": 41,
                        "priceType": "From",
                        "price": "$182.81",
                        "specialPrice": "$93.30",
                        "pricingName": "esse ullamco proident"
                    },
                    {
                        "duration": 280,
                        "priceType": "From",
                        "price": "$184.98",
                        "specialPrice": "$392.16",
                        "pricingName": "anim sunt ad"
                    },
                    {
                        "duration": 187,
                        "priceType": "From",
                        "price": "$132.91",
                        "specialPrice": "$62.99",
                        "pricingName": "amet quis do"
                    },
                    {
                        "duration": 284,
                        "priceType": "From",
                        "price": "$298.02",
                        "specialPrice": "$298.36",
                        "pricingName": "sit pariatur deserunt"
                    },
                    {
                        "duration": 383,
                        "priceType": "Fixed",
                        "price": "$216.15",
                        "specialPrice": "$335.66",
                        "pricingName": "adipisicing consequat ex"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 51,
                "tags": [
                    "commodo",
                    "qui",
                    "proident",
                    "amet"
                ]
            }
        ]
    },
    {
        "_id": "60935e04869d80cd55b0d1ac",
        "email": "carolinamejia@miracula.com",
        "bio": "Eiusmod dolor nostrud quis occaecat minim elit deserunt laboris irure eiusmod ex voluptate nostrud magna.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Assurity",
        "address": {
            "street": "Havemeyer Street",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.567,
            "longitude": -73.73464
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "ea nisi cupidatat",
                "description": "Lorem elit ipsum do elit tempor adipisicing amet eiusmod eiusmod sit aliqua exercitation. Excepteur magna anim incididunt adipisicing ut qui incididunt adipisicing aliquip culpa ipsum minim ut culpa. Eu incididunt minim laboris commodo dolore Lorem laborum proident duis ipsum esse excepteur. Sunt aliquip nostrud eu non sint fugiat. Consectetur minim cupidatat dolore minim aute irure in qui veniam amet. Fugiat ad minim dolore ut veniam id ipsum laborum labore et aliquip.\r\n"
            },
            {
                "name": "cillum ad",
                "description": ""
            },
            {
                "name": "ipsum et nisi tempor",
                "description": "Tempor eiusmod aute sit ut officia deserunt nisi pariatur. Consectetur ut commodo sunt est laborum tempor eiusmod voluptate cillum aliqua ipsum. Sit mollit fugiat sit qui quis mollit occaecat ipsum sit ex. Dolore proident sunt cillum quis ipsum adipisicing minim quis incididunt velit incididunt nisi do. Anim pariatur aliqua Lorem reprehenderit ad excepteur non sit exercitation.\r\nEst deserunt occaecat ullamco est amet sit. Aliquip exercitation veniam do nostrud ut nulla sint ex officia proident excepteur sit. Lorem exercitation ad esse ipsum id nostrud laboris incididunt. Qui irure excepteur ipsum nulla voluptate dolor. Aute ipsum culpa irure aute proident minim nulla exercitation anim amet laborum officia. Ut enim exercitation ipsum dolore do ad consequat dolore ea. Dolore esse adipisicing consequat commodo nostrud culpa enim quis.\r\nSit esse deserunt commodo officia aute est culpa aliqua laborum esse. Eu consectetur in nulla veniam laborum. Nisi Lorem reprehenderit aliquip exercitation cupidatat dolore exercitation voluptate fugiat in. Laboris pariatur dolor fugiat occaecat aute sit eu laboris veniam voluptate occaecat ullamco pariatur. Et consequat consectetur esse minim consectetur pariatur proident do aliquip cupidatat laborum ex occaecat.\r\n"
            }
        ],
        "services": [
            {
                "name": "Lorem pariatur nulla voluptate laboris",
                "category": "cillum incididunt minim",
                "treatment": "",
                "description": "Officia exercitation ex non occaecat exercitation. Ut sit in excepteur veniam non culpa non exercitation incididunt esse laboris. Sunt est irure eiusmod sint aute mollit laborum. Non laborum commodo consequat reprehenderit veniam duis tempor proident mollit excepteur. Pariatur aliqua velit sit voluptate do consequat laborum occaecat ad cupidatat labore exercitation culpa non. Deserunt cupidatat exercitation dolor eu aliqua et dolor minim irure eiusmod.\r\nNon eiusmod cillum occaecat esse pariatur non laborum. Consequat aliqua officia aute aute elit amet occaecat ex proident sit ad cillum adipisicing fugiat. Nisi tempor qui aliqua tempor anim Lorem duis occaecat irure.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 72,
                    "priceType": "From",
                    "price": "$197.11",
                    "specialPrice": "$132.11",
                    "pricingName": "nostrud adipisicing Lorem"
                },
                "pricingOptions": [
                    {
                        "duration": 230,
                        "priceType": "From",
                        "price": "$269.34",
                        "specialPrice": "$94.42",
                        "pricingName": "dolor excepteur deserunt"
                    },
                    {
                        "duration": 160,
                        "priceType": "Fixed",
                        "price": "$336.66",
                        "specialPrice": "$172.57",
                        "pricingName": "ipsum Lorem duis"
                    },
                    {
                        "duration": 396,
                        "priceType": "Fixed",
                        "price": "$281.89",
                        "specialPrice": "$76.55",
                        "pricingName": "sunt velit id"
                    },
                    {
                        "duration": 197,
                        "priceType": "Fixed",
                        "price": "$175.07",
                        "specialPrice": "$353.95",
                        "pricingName": "esse officia laborum"
                    },
                    {
                        "duration": 91,
                        "priceType": "Fixed",
                        "price": "$348.27",
                        "specialPrice": "$29.86",
                        "pricingName": "ullamco esse do"
                    },
                    {
                        "duration": 252,
                        "priceType": "From",
                        "price": "$201.95",
                        "specialPrice": "$66.76",
                        "pricingName": "sint ipsum laboris"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 51,
                "tags": [
                    "aliqua",
                    "laboris",
                    "culpa"
                ]
            },
            {
                "name": "sunt duis amet cupidatat sint",
                "category": "laboris non voluptate",
                "treatment": "",
                "description": "Sit do commodo ad eiusmod. Cupidatat nulla aliqua laboris cillum laborum excepteur officia ea culpa. Ad reprehenderit ex veniam deserunt adipisicing minim.\r\nExercitation cillum ullamco adipisicing in. Magna occaecat laborum irure ipsum adipisicing proident labore magna id mollit ex. Dolore eiusmod veniam velit quis duis consequat consequat. Est ullamco excepteur velit ut dolore incididunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 342,
                    "priceType": "Fixed",
                    "price": "$100.67",
                    "specialPrice": "$249.23",
                    "pricingName": "nostrud qui qui"
                },
                "pricingOptions": [
                    {
                        "duration": 215,
                        "priceType": "Fixed",
                        "price": "$262.60",
                        "specialPrice": "$70.75",
                        "pricingName": "cillum ullamco ea"
                    },
                    {
                        "duration": 242,
                        "priceType": "From",
                        "price": "$318.57",
                        "specialPrice": "$190.15",
                        "pricingName": "ad proident exercitation"
                    },
                    {
                        "duration": 39,
                        "priceType": "From",
                        "price": "$215.86",
                        "specialPrice": "$80.49",
                        "pricingName": "commodo labore labore"
                    },
                    {
                        "duration": 215,
                        "priceType": "Fixed",
                        "price": "$229.21",
                        "specialPrice": "$210.79",
                        "pricingName": "adipisicing dolore quis"
                    },
                    {
                        "duration": 193,
                        "priceType": "Fixed",
                        "price": "$86.87",
                        "specialPrice": "$158.06",
                        "pricingName": "aute fugiat ipsum"
                    },
                    {
                        "duration": 228,
                        "priceType": "From",
                        "price": "$397.02",
                        "specialPrice": "$339.09",
                        "pricingName": "dolore eu ea"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 41,
                "tags": [
                    "fugiat",
                    "exercitation",
                    "qui",
                    "aliqua",
                    "enim",
                    "nostrud"
                ]
            },
            {
                "name": "cupidatat consectetur magna labore exercitation",
                "category": "excepteur ad veniam",
                "treatment": "",
                "description": "Minim irure non incididunt nulla nulla duis do reprehenderit labore eu reprehenderit est laborum. Aute amet mollit eu amet amet consectetur laboris aliqua voluptate anim reprehenderit commodo. Velit mollit incididunt occaecat incididunt. Proident elit ex reprehenderit ut quis nulla. Laborum reprehenderit esse aliquip consequat aliqua et aliqua tempor. Enim laboris in cupidatat cupidatat Lorem duis dolore fugiat dolor. Quis aliquip id duis proident magna reprehenderit aliqua consequat nulla anim ullamco id.\r\nEiusmod culpa commodo non laborum incididunt culpa enim. Consequat elit nostrud excepteur sint nisi sit pariatur tempor velit ut sint occaecat irure. Nostrud duis proident labore excepteur aliquip. Labore culpa et incididunt amet fugiat commodo sunt non laborum velit. Sint elit nisi deserunt mollit esse dolore eu sint dolor elit. Veniam eu proident ipsum officia anim anim irure sit magna commodo fugiat esse.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 336,
                    "priceType": "From",
                    "price": "$124.37",
                    "specialPrice": "$307.65",
                    "pricingName": "deserunt est dolore"
                },
                "pricingOptions": [
                    {
                        "duration": 270,
                        "priceType": "From",
                        "price": "$198.75",
                        "specialPrice": "$162.45",
                        "pricingName": "culpa esse officia"
                    },
                    {
                        "duration": 296,
                        "priceType": "From",
                        "price": "$274.81",
                        "specialPrice": "$218.93",
                        "pricingName": "mollit ullamco laboris"
                    },
                    {
                        "duration": 27,
                        "priceType": "From",
                        "price": "$47.02",
                        "specialPrice": "$271.03",
                        "pricingName": "ad mollit id"
                    },
                    {
                        "duration": 143,
                        "priceType": "Fixed",
                        "price": "$240.91",
                        "specialPrice": "$42.97",
                        "pricingName": "magna enim laboris"
                    },
                    {
                        "duration": 57,
                        "priceType": "Fixed",
                        "price": "$226.77",
                        "specialPrice": "$182.27",
                        "pricingName": "adipisicing ipsum ex"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 32,
                "tags": [
                    "eu",
                    "exercitation",
                    "dolor",
                    "ipsum",
                    "Lorem",
                    "sint",
                    "laboris"
                ]
            },
            {
                "name": "magna proident cillum exercitation est",
                "category": "incididunt et duis",
                "treatment": "",
                "description": "Ea aute quis reprehenderit aliquip laboris commodo et in sint exercitation. Nulla commodo qui Lorem esse occaecat est commodo excepteur irure sit aute ea. Nulla in ut tempor eiusmod nostrud tempor. Cillum excepteur velit Lorem consectetur labore nisi laborum pariatur id officia officia laboris tempor laboris. Ex adipisicing velit cillum cupidatat ipsum ex exercitation. Eiusmod occaecat culpa quis dolor sit dolor. Exercitation labore excepteur aute cupidatat nulla excepteur laborum laborum ullamco adipisicing occaecat in.\r\nEiusmod qui consectetur minim cillum dolore aute. Nisi incididunt ut consectetur sint commodo. Sit irure occaecat nisi aliquip commodo cupidatat ullamco eu ipsum minim est ex aute. Do nisi enim nisi cupidatat aliquip id nisi ex labore sunt ut irure et. Sint minim anim aute mollit laboris proident laborum ipsum enim in voluptate velit. Mollit minim quis veniam adipisicing tempor officia. Fugiat tempor elit nisi Lorem aliquip.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 232,
                    "priceType": "From",
                    "price": "$367.64",
                    "specialPrice": "$183.83",
                    "pricingName": "excepteur id laborum"
                },
                "pricingOptions": [
                    {
                        "duration": 379,
                        "priceType": "Fixed",
                        "price": "$340.54",
                        "specialPrice": "$116.15",
                        "pricingName": "aliqua enim enim"
                    },
                    {
                        "duration": 320,
                        "priceType": "From",
                        "price": "$151.31",
                        "specialPrice": "$71.02",
                        "pricingName": "adipisicing dolor consectetur"
                    },
                    {
                        "duration": 184,
                        "priceType": "Fixed",
                        "price": "$188.58",
                        "specialPrice": "$107.35",
                        "pricingName": "magna sint duis"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 44,
                "tags": [
                    "tempor",
                    "officia",
                    "qui",
                    "id",
                    "dolor",
                    "velit"
                ]
            },
            {
                "name": "commodo sit commodo culpa veniam",
                "category": "non consectetur aute",
                "treatment": "",
                "description": "Labore ipsum enim qui consectetur nulla consectetur. Velit veniam dolor est Lorem ad sunt adipisicing amet ad non. Minim enim adipisicing aute dolor adipisicing commodo consequat qui sunt et cupidatat velit reprehenderit. Est culpa irure sint proident velit sit enim consectetur sunt dolore. Nisi non in dolor velit.\r\nUllamco cillum cillum id ullamco id officia eiusmod aliquip. In eu voluptate aliquip aute sint tempor ex eu id anim laboris cupidatat. Ex consequat exercitation voluptate nisi nisi. Dolore quis ullamco et consequat ipsum sunt nisi minim veniam dolore mollit est ad.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 192,
                    "priceType": "Fixed",
                    "price": "$305.64",
                    "specialPrice": "$126.40",
                    "pricingName": "veniam laborum duis"
                },
                "pricingOptions": [
                    {
                        "duration": 281,
                        "priceType": "Fixed",
                        "price": "$248.56",
                        "specialPrice": "$47.03",
                        "pricingName": "nisi aute velit"
                    },
                    {
                        "duration": 143,
                        "priceType": "From",
                        "price": "$245.80",
                        "specialPrice": "$346.16",
                        "pricingName": "Lorem est reprehenderit"
                    },
                    {
                        "duration": 387,
                        "priceType": "Fixed",
                        "price": "$82.50",
                        "specialPrice": "$212.78",
                        "pricingName": "aute deserunt officia"
                    },
                    {
                        "duration": 146,
                        "priceType": "From",
                        "price": "$270.25",
                        "specialPrice": "$310.88",
                        "pricingName": "consectetur sunt amet"
                    },
                    {
                        "duration": 129,
                        "priceType": "From",
                        "price": "$396.85",
                        "specialPrice": "$51.35",
                        "pricingName": "ad deserunt et"
                    },
                    {
                        "duration": 346,
                        "priceType": "Fixed",
                        "price": "$134.28",
                        "specialPrice": "$380.85",
                        "pricingName": "nulla ad est"
                    },
                    {
                        "duration": 302,
                        "priceType": "Fixed",
                        "price": "$226.79",
                        "specialPrice": "$97.92",
                        "pricingName": "id ullamco minim"
                    },
                    {
                        "duration": 159,
                        "priceType": "Fixed",
                        "price": "$257.56",
                        "specialPrice": "$366.25",
                        "pricingName": "laborum culpa ex"
                    },
                    {
                        "duration": 322,
                        "priceType": "Fixed",
                        "price": "$211.54",
                        "specialPrice": "$198.96",
                        "pricingName": "qui eiusmod pariatur"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 60,
                "tags": [
                    "irure",
                    "ullamco",
                    "voluptate",
                    "voluptate",
                    "id",
                    "non"
                ]
            },
            {
                "name": "quis occaecat in nostrud consequat",
                "category": "consequat ullamco est",
                "treatment": "",
                "description": "Est ad aliquip cillum nulla amet amet veniam dolor nisi adipisicing adipisicing cillum tempor. Nulla ea occaecat amet voluptate dolor voluptate magna occaecat incididunt amet ullamco esse. Elit pariatur velit qui consequat dolor esse id labore minim excepteur. Dolor eiusmod nulla qui incididunt veniam anim veniam elit occaecat quis aute aliquip dolor ipsum.\r\nAnim non mollit ipsum ut exercitation consequat irure minim cupidatat. Reprehenderit non sunt pariatur magna excepteur eu labore nulla. Deserunt ut cupidatat cupidatat ut cillum aliquip. Nisi in proident consequat adipisicing. Esse minim ex consequat ipsum quis ea sit magna nisi esse labore culpa. Commodo quis incididunt voluptate minim aute sunt qui ex consequat ea laborum. Aute deserunt occaecat nulla ut mollit ipsum elit consectetur nisi mollit deserunt eu.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 263,
                    "priceType": "From",
                    "price": "$346.87",
                    "specialPrice": "$371.56",
                    "pricingName": "laboris occaecat commodo"
                },
                "pricingOptions": [
                    {
                        "duration": 287,
                        "priceType": "Fixed",
                        "price": "$145.98",
                        "specialPrice": "$62.76",
                        "pricingName": "magna ullamco sit"
                    },
                    {
                        "duration": 361,
                        "priceType": "Fixed",
                        "price": "$392.44",
                        "specialPrice": "$225.35",
                        "pricingName": "mollit est Lorem"
                    },
                    {
                        "duration": 183,
                        "priceType": "Fixed",
                        "price": "$22.49",
                        "specialPrice": "$369.81",
                        "pricingName": "magna elit voluptate"
                    },
                    {
                        "duration": 287,
                        "priceType": "Fixed",
                        "price": "$25.83",
                        "specialPrice": "$202.97",
                        "pricingName": "proident officia cupidatat"
                    },
                    {
                        "duration": 202,
                        "priceType": "From",
                        "price": "$373.20",
                        "specialPrice": "$112.12",
                        "pricingName": "minim fugiat fugiat"
                    },
                    {
                        "duration": 24,
                        "priceType": "Fixed",
                        "price": "$31.74",
                        "specialPrice": "$41.23",
                        "pricingName": "ad quis ea"
                    },
                    {
                        "duration": 292,
                        "priceType": "Fixed",
                        "price": "$151.86",
                        "specialPrice": "$93.12",
                        "pricingName": "aliqua cupidatat culpa"
                    },
                    {
                        "duration": 396,
                        "priceType": "From",
                        "price": "$328.86",
                        "specialPrice": "$387.59",
                        "pricingName": "proident veniam excepteur"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 58,
                "tags": [
                    "minim",
                    "voluptate",
                    "culpa",
                    "deserunt",
                    "amet"
                ]
            },
            {
                "name": "duis nulla veniam id dolor",
                "category": "ipsum laborum consectetur",
                "treatment": "",
                "description": "Non commodo enim occaecat labore excepteur sit labore cupidatat. Commodo id ut occaecat proident sunt ullamco culpa. Dolore enim fugiat deserunt ad. Tempor ullamco sint minim laborum incididunt Lorem irure qui. Sint sint occaecat quis tempor quis laboris pariatur et. Esse nisi eu laborum id dolor culpa non id.\r\nEiusmod ipsum do et duis ea. Reprehenderit deserunt elit fugiat do dolore non laborum. Nisi officia aute cupidatat aute adipisicing nisi velit. Amet in culpa exercitation incididunt eiusmod Lorem voluptate cupidatat occaecat. Ea exercitation Lorem excepteur commodo ad et minim quis. Mollit cupidatat in magna nisi.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 116,
                    "priceType": "Fixed",
                    "price": "$160.59",
                    "specialPrice": "$226.33",
                    "pricingName": "Lorem incididunt adipisicing"
                },
                "pricingOptions": [
                    {
                        "duration": 196,
                        "priceType": "Fixed",
                        "price": "$117.19",
                        "specialPrice": "$196.94",
                        "pricingName": "aliquip nisi nostrud"
                    },
                    {
                        "duration": 193,
                        "priceType": "Fixed",
                        "price": "$107.94",
                        "specialPrice": "$41.94",
                        "pricingName": "excepteur et deserunt"
                    },
                    {
                        "duration": 356,
                        "priceType": "Fixed",
                        "price": "$165.95",
                        "specialPrice": "$389.10",
                        "pricingName": "magna mollit elit"
                    },
                    {
                        "duration": 218,
                        "priceType": "From",
                        "price": "$23.72",
                        "specialPrice": "$186.44",
                        "pricingName": "enim aute esse"
                    },
                    {
                        "duration": 388,
                        "priceType": "Fixed",
                        "price": "$141.49",
                        "specialPrice": "$359.26",
                        "pricingName": "ullamco commodo laborum"
                    },
                    {
                        "duration": 373,
                        "priceType": "Fixed",
                        "price": "$326.34",
                        "specialPrice": "$115.70",
                        "pricingName": "ea sunt pariatur"
                    },
                    {
                        "duration": 307,
                        "priceType": "Fixed",
                        "price": "$353.81",
                        "specialPrice": "$238.49",
                        "pricingName": "est quis ipsum"
                    },
                    {
                        "duration": 20,
                        "priceType": "From",
                        "price": "$344.34",
                        "specialPrice": "$324.07",
                        "pricingName": "laboris culpa proident"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 27,
                "tags": [
                    "quis",
                    "amet"
                ]
            }
        ]
    },
    {
        "_id": "60935e04b13220b16be94b7b",
        "email": "carolinamejia@assurity.com",
        "bio": "Consequat eiusmod ullamco labore adipisicing id officia voluptate nulla pariatur pariatur ea elit consequat.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Zillacom",
        "address": {
            "street": "Corbin Place",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.63723,
            "longitude": -73.62813
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "nulla voluptate laboris",
                "description": "Incididunt duis ea ex nostrud officia voluptate ea sit excepteur veniam anim tempor. Consequat enim est Lorem dolor exercitation veniam in ex proident officia labore tempor aute veniam. Reprehenderit eiusmod Lorem et incididunt ipsum veniam do ullamco magna fugiat nostrud. Ad in et dolor pariatur sint.\r\n"
            },
            {
                "name": "eiusmod non",
                "description": ""
            },
            {
                "name": "magna cupidatat in esse",
                "description": "Mollit cillum cupidatat ut eiusmod duis aliqua consequat magna sit sit ullamco ullamco do sint. Non amet nisi cupidatat incididunt magna veniam mollit. Voluptate sint duis eiusmod occaecat qui incididunt tempor exercitation elit aliqua reprehenderit est. Do nulla ea sint occaecat. Commodo officia anim esse ea esse quis veniam ut Lorem minim qui reprehenderit ullamco elit. Laborum sunt esse aute ut aliquip ad ea Lorem enim proident in.\r\nId eiusmod exercitation ullamco reprehenderit amet aute Lorem ex nostrud eu. Culpa officia sit commodo dolor nostrud anim ea irure dolor. Eiusmod elit consectetur mollit nisi non aliqua commodo. Nulla commodo dolore do magna ipsum tempor. Est exercitation elit non irure. Exercitation culpa ad nisi et commodo.\r\nAd consectetur ut et proident ipsum esse. Et ex dolor excepteur dolore magna laboris nostrud aliqua esse deserunt minim sit aliqua. Ipsum esse laboris nisi esse labore laboris. Quis esse id anim exercitation labore nulla ea aliqua cillum culpa.\r\n"
            }
        ],
        "services": [
            {
                "name": "officia magna ullamco et sunt",
                "category": "occaecat quis velit",
                "treatment": "",
                "description": "Aliqua ipsum elit occaecat elit adipisicing sit quis. Esse incididunt et reprehenderit ipsum. Officia exercitation Lorem esse ad ex aliqua cillum officia labore sint culpa incididunt pariatur. Nulla id ad sint anim. Est sint Lorem elit culpa quis incididunt proident id exercitation eiusmod id fugiat reprehenderit amet. In exercitation dolore nulla commodo incididunt dolore ut nostrud sit Lorem exercitation amet.\r\nIncididunt consequat ullamco anim ipsum ut nulla. Id incididunt mollit in cupidatat dolor mollit. Nostrud voluptate quis officia nisi excepteur qui nulla. Magna adipisicing ea Lorem aliquip excepteur anim.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 383,
                    "priceType": "Fixed",
                    "price": "$220.88",
                    "specialPrice": "$216.89",
                    "pricingName": "fugiat Lorem nisi"
                },
                "pricingOptions": [
                    {
                        "duration": 112,
                        "priceType": "Fixed",
                        "price": "$106.06",
                        "specialPrice": "$274.59",
                        "pricingName": "ullamco id ut"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 40,
                "tags": [
                    "laboris",
                    "esse",
                    "enim",
                    "enim",
                    "fugiat",
                    "minim",
                    "est"
                ]
            },
            {
                "name": "labore pariatur et nulla enim",
                "category": "non aliqua culpa",
                "treatment": "",
                "description": "Velit cupidatat ad consectetur dolore laborum in dolore ea labore fugiat velit ad velit in. Magna est culpa proident nisi. Aute et consequat duis eiusmod excepteur dolor sint tempor veniam amet.\r\nCommodo amet labore irure eiusmod anim ex laborum laborum ullamco quis sunt adipisicing ut. Minim consequat et id do culpa quis anim cupidatat elit. Esse fugiat id velit ex in.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 155,
                    "priceType": "From",
                    "price": "$347.35",
                    "specialPrice": "$144.34",
                    "pricingName": "do do fugiat"
                },
                "pricingOptions": [
                    {
                        "duration": 159,
                        "priceType": "From",
                        "price": "$153.91",
                        "specialPrice": "$390.66",
                        "pricingName": "sint et magna"
                    },
                    {
                        "duration": 22,
                        "priceType": "From",
                        "price": "$74.58",
                        "specialPrice": "$117.77",
                        "pricingName": "id reprehenderit ipsum"
                    },
                    {
                        "duration": 333,
                        "priceType": "Fixed",
                        "price": "$212.28",
                        "specialPrice": "$331.80",
                        "pricingName": "labore consequat velit"
                    },
                    {
                        "duration": 395,
                        "priceType": "Fixed",
                        "price": "$268.16",
                        "specialPrice": "$263.39",
                        "pricingName": "ullamco proident cillum"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 34,
                "tags": [
                    "reprehenderit",
                    "consequat",
                    "enim",
                    "minim"
                ]
            },
            {
                "name": "excepteur magna laborum irure exercitation",
                "category": "elit velit reprehenderit",
                "treatment": "",
                "description": "Do reprehenderit laborum nulla eu ea cillum esse cillum mollit consequat adipisicing veniam. Dolor dolor tempor et est laboris enim Lorem. Cupidatat nulla incididunt Lorem et proident quis ex. Sint exercitation ad elit laborum et consequat do exercitation.\r\nEu ad consequat quis consectetur commodo non incididunt mollit excepteur dolore aute sint non. Amet consectetur dolor enim sint dolor voluptate qui quis duis. Laborum cupidatat nisi laborum aliquip in anim officia dolor dolore. Occaecat qui est aute excepteur dolore duis eu pariatur et ullamco fugiat ex.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 361,
                    "priceType": "From",
                    "price": "$39.18",
                    "specialPrice": "$306.34",
                    "pricingName": "deserunt nisi reprehenderit"
                },
                "pricingOptions": [
                    {
                        "duration": 31,
                        "priceType": "From",
                        "price": "$65.27",
                        "specialPrice": "$294.25",
                        "pricingName": "ex ad qui"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 46,
                "tags": [
                    "veniam",
                    "cillum"
                ]
            },
            {
                "name": "labore dolor quis dolore dolor",
                "category": "voluptate tempor cupidatat",
                "treatment": "",
                "description": "Exercitation magna proident aliquip ad. Exercitation culpa pariatur officia ipsum et mollit consequat sint. Reprehenderit pariatur laborum eiusmod est adipisicing nisi ullamco magna fugiat adipisicing laborum cillum. Dolore officia nostrud mollit adipisicing ullamco do irure incididunt.\r\nAliquip qui qui reprehenderit voluptate id aute eiusmod deserunt. Non nisi irure enim consectetur voluptate dolore id sint cupidatat nostrud proident et amet. Ullamco ex cupidatat incididunt qui incididunt consectetur ullamco qui duis cupidatat aliqua. Dolor reprehenderit ipsum non labore consectetur veniam anim est. Duis ea tempor commodo consectetur aliquip proident ad qui irure irure nostrud non do.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 80,
                    "priceType": "From",
                    "price": "$280.58",
                    "specialPrice": "$348.52",
                    "pricingName": "voluptate veniam esse"
                },
                "pricingOptions": [
                    {
                        "duration": 355,
                        "priceType": "From",
                        "price": "$358.80",
                        "specialPrice": "$173.95",
                        "pricingName": "eu dolore duis"
                    },
                    {
                        "duration": 195,
                        "priceType": "Fixed",
                        "price": "$334.66",
                        "specialPrice": "$87.62",
                        "pricingName": "nisi qui aliqua"
                    },
                    {
                        "duration": 352,
                        "priceType": "Fixed",
                        "price": "$43.35",
                        "specialPrice": "$131.65",
                        "pricingName": "veniam culpa labore"
                    },
                    {
                        "duration": 377,
                        "priceType": "Fixed",
                        "price": "$88.70",
                        "specialPrice": "$243.74",
                        "pricingName": "reprehenderit minim sunt"
                    },
                    {
                        "duration": 27,
                        "priceType": "Fixed",
                        "price": "$90.62",
                        "specialPrice": "$42.68",
                        "pricingName": "amet veniam eiusmod"
                    },
                    {
                        "duration": 142,
                        "priceType": "Fixed",
                        "price": "$132.92",
                        "specialPrice": "$267.99",
                        "pricingName": "veniam enim sunt"
                    },
                    {
                        "duration": 306,
                        "priceType": "Fixed",
                        "price": "$207.20",
                        "specialPrice": "$118.09",
                        "pricingName": "Lorem fugiat occaecat"
                    },
                    {
                        "duration": 148,
                        "priceType": "From",
                        "price": "$273.44",
                        "specialPrice": "$391.72",
                        "pricingName": "Lorem commodo veniam"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 40,
                "tags": [
                    "nostrud",
                    "adipisicing",
                    "est",
                    "esse",
                    "proident",
                    "aliquip"
                ]
            },
            {
                "name": "consequat do aliquip aliquip aute",
                "category": "dolore excepteur irure",
                "treatment": "",
                "description": "Incididunt amet magna ea aliquip minim do magna id voluptate veniam reprehenderit. Est sunt pariatur veniam enim. Elit cillum sunt officia mollit sunt nulla sunt deserunt.\r\nExercitation excepteur velit eiusmod sit eu ea incididunt minim aute duis reprehenderit. Eiusmod proident eiusmod eu minim do eu commodo ullamco exercitation proident. Enim aliqua duis do ad fugiat laborum excepteur veniam dolor magna voluptate nostrud consectetur. Consequat officia voluptate ipsum exercitation reprehenderit minim aliqua esse. Anim fugiat proident nostrud est voluptate est ex adipisicing. Duis qui aliquip nulla irure et enim mollit labore aliquip est consequat est laboris reprehenderit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 209,
                    "priceType": "From",
                    "price": "$397.96",
                    "specialPrice": "$232.25",
                    "pricingName": "ea eiusmod commodo"
                },
                "pricingOptions": [
                    {
                        "duration": 362,
                        "priceType": "From",
                        "price": "$91.38",
                        "specialPrice": "$173.35",
                        "pricingName": "sunt dolor nisi"
                    },
                    {
                        "duration": 190,
                        "priceType": "From",
                        "price": "$394.62",
                        "specialPrice": "$36.01",
                        "pricingName": "duis proident deserunt"
                    },
                    {
                        "duration": 77,
                        "priceType": "From",
                        "price": "$329.53",
                        "specialPrice": "$197.62",
                        "pricingName": "proident veniam ex"
                    },
                    {
                        "duration": 322,
                        "priceType": "From",
                        "price": "$197.36",
                        "specialPrice": "$312.32",
                        "pricingName": "minim non mollit"
                    },
                    {
                        "duration": 169,
                        "priceType": "From",
                        "price": "$141.79",
                        "specialPrice": "$311.56",
                        "pricingName": "aute nostrud veniam"
                    },
                    {
                        "duration": 327,
                        "priceType": "From",
                        "price": "$357.83",
                        "specialPrice": "$105.84",
                        "pricingName": "ut velit magna"
                    },
                    {
                        "duration": 30,
                        "priceType": "Fixed",
                        "price": "$293.00",
                        "specialPrice": "$253.13",
                        "pricingName": "deserunt tempor incididunt"
                    },
                    {
                        "duration": 48,
                        "priceType": "From",
                        "price": "$284.47",
                        "specialPrice": "$139.81",
                        "pricingName": "consequat officia officia"
                    },
                    {
                        "duration": 111,
                        "priceType": "From",
                        "price": "$134.40",
                        "specialPrice": "$390.83",
                        "pricingName": "deserunt qui magna"
                    },
                    {
                        "duration": 216,
                        "priceType": "Fixed",
                        "price": "$375.61",
                        "specialPrice": "$103.43",
                        "pricingName": "cillum sunt aliqua"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 57,
                "tags": [
                    "tempor",
                    "mollit"
                ]
            },
            {
                "name": "dolor adipisicing officia anim officia",
                "category": "labore non eu",
                "treatment": "",
                "description": "Officia ea qui duis minim id sit exercitation. Aliqua ut cillum dolor voluptate amet culpa eu deserunt. Ad ea laborum exercitation incididunt do ad ex. Quis laborum aliqua aute ut. Proident voluptate magna sunt consectetur esse nulla aute ea consequat ea est laborum. Mollit duis irure culpa amet est excepteur ullamco nostrud.\r\nEst aute esse est minim tempor sit sunt nulla adipisicing consectetur pariatur ipsum. Aliquip incididunt pariatur magna amet ut. Laboris aute pariatur officia sunt sunt ullamco. Duis et ea magna id adipisicing mollit ad exercitation magna culpa dolore. In cupidatat culpa labore deserunt amet incididunt velit consequat reprehenderit minim velit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 155,
                    "priceType": "From",
                    "price": "$85.77",
                    "specialPrice": "$239.02",
                    "pricingName": "voluptate officia excepteur"
                },
                "pricingOptions": [
                    {
                        "duration": 283,
                        "priceType": "From",
                        "price": "$296.64",
                        "specialPrice": "$303.74",
                        "pricingName": "ex id eu"
                    },
                    {
                        "duration": 371,
                        "priceType": "From",
                        "price": "$111.98",
                        "specialPrice": "$163.98",
                        "pricingName": "dolor sit magna"
                    },
                    {
                        "duration": 246,
                        "priceType": "Fixed",
                        "price": "$231.96",
                        "specialPrice": "$20.79",
                        "pricingName": "quis qui non"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 55,
                "tags": [
                    "consequat",
                    "culpa",
                    "excepteur",
                    "Lorem"
                ]
            },
            {
                "name": "ad id consectetur et irure",
                "category": "fugiat mollit ex",
                "treatment": "",
                "description": "Ut in consectetur nostrud esse ex tempor non sunt. Mollit velit tempor exercitation ipsum do labore elit sint. Et eu fugiat ullamco non non aliqua deserunt et nostrud. Sit aliquip elit deserunt voluptate aliquip cupidatat magna amet sint non cillum.\r\nUllamco aliquip id reprehenderit velit. Et voluptate enim esse officia esse id incididunt sunt aliquip pariatur. Quis velit nulla exercitation consequat in fugiat. Elit veniam eu labore dolor mollit non deserunt veniam sit ad sint. Lorem nisi deserunt cupidatat et quis fugiat est proident consequat irure aliquip sint quis.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 91,
                    "priceType": "Fixed",
                    "price": "$309.14",
                    "specialPrice": "$150.71",
                    "pricingName": "dolor veniam Lorem"
                },
                "pricingOptions": [
                    {
                        "duration": 321,
                        "priceType": "From",
                        "price": "$250.32",
                        "specialPrice": "$352.89",
                        "pricingName": "nulla adipisicing ullamco"
                    },
                    {
                        "duration": 309,
                        "priceType": "From",
                        "price": "$23.57",
                        "specialPrice": "$123.54",
                        "pricingName": "veniam incididunt sit"
                    },
                    {
                        "duration": 274,
                        "priceType": "From",
                        "price": "$165.47",
                        "specialPrice": "$232.07",
                        "pricingName": "non voluptate aute"
                    },
                    {
                        "duration": 346,
                        "priceType": "Fixed",
                        "price": "$63.06",
                        "specialPrice": "$386.29",
                        "pricingName": "cupidatat laboris sit"
                    },
                    {
                        "duration": 231,
                        "priceType": "From",
                        "price": "$122.13",
                        "specialPrice": "$56.57",
                        "pricingName": "ullamco nulla nisi"
                    },
                    {
                        "duration": 161,
                        "priceType": "From",
                        "price": "$128.47",
                        "specialPrice": "$311.78",
                        "pricingName": "duis nisi nisi"
                    },
                    {
                        "duration": 372,
                        "priceType": "Fixed",
                        "price": "$115.58",
                        "specialPrice": "$113.87",
                        "pricingName": "fugiat reprehenderit aute"
                    },
                    {
                        "duration": 297,
                        "priceType": "Fixed",
                        "price": "$175.52",
                        "specialPrice": "$231.41",
                        "pricingName": "aliqua cillum nostrud"
                    },
                    {
                        "duration": 20,
                        "priceType": "From",
                        "price": "$355.65",
                        "specialPrice": "$113.19",
                        "pricingName": "laborum est nisi"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 29,
                "tags": [
                    "nulla",
                    "enim",
                    "nulla",
                    "irure"
                ]
            }
        ]
    },
    {
        "_id": "60935e04f2cde69855beed5c",
        "email": "carolinamejia@zillacom.com",
        "bio": "Reprehenderit minim cillum sint aute adipisicing sunt adipisicing amet dolore.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Uxmox",
        "address": {
            "street": "Newkirk Avenue",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.65786,
            "longitude": -73.67848
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "excepteur aute sint",
                "description": "Minim mollit cupidatat proident dolor et tempor ex id labore ad. Qui commodo laboris minim adipisicing nisi. Culpa quis incididunt id ea nulla id aute commodo velit incididunt ad mollit et qui. Consequat commodo adipisicing nostrud eiusmod dolor dolor. Veniam velit nostrud non labore laboris sint reprehenderit culpa non. Reprehenderit consequat magna dolore cupidatat. Elit et ex eiusmod tempor laboris ut non anim.\r\n"
            },
            {
                "name": "laboris cupidatat",
                "description": ""
            },
            {
                "name": "nisi eu pariatur magna",
                "description": "Ea aute minim sunt voluptate anim laborum duis consequat. Commodo ullamco consequat duis non laborum ad anim exercitation elit. Dolor aliquip enim excepteur amet. Exercitation magna id incididunt est. Cupidatat voluptate veniam cupidatat fugiat exercitation. Nostrud mollit exercitation deserunt sit sint minim ea elit ex officia nulla consequat excepteur tempor. Duis adipisicing sit irure cillum velit sunt deserunt eiusmod consequat veniam.\r\nAmet sunt velit ipsum ad consequat ipsum nostrud occaecat fugiat sit ex. Commodo anim aute enim pariatur consequat ullamco. Cillum velit adipisicing qui et non id aute Lorem. Pariatur Lorem culpa sit id ea reprehenderit occaecat ex exercitation consectetur voluptate aliqua. Proident magna pariatur id quis qui commodo et enim anim esse esse nisi nulla est. Cupidatat adipisicing enim fugiat excepteur exercitation incididunt laborum tempor id aute dolor cillum sint.\r\nCillum ipsum est occaecat non sint reprehenderit nisi laboris incididunt eiusmod sit anim est. Aliqua non deserunt dolor anim dolor laborum labore reprehenderit velit qui dolore ut. Veniam incididunt voluptate eiusmod tempor elit do dolor enim. Id ex labore laboris pariatur amet cupidatat officia sit nulla veniam aute laborum. Consectetur proident non elit ea nulla aute proident.\r\n"
            }
        ],
        "services": [
            {
                "name": "cillum sint occaecat nisi et",
                "category": "ipsum eiusmod ullamco",
                "treatment": "",
                "description": "Eiusmod cupidatat incididunt non nisi velit aute qui ad nisi duis. Non enim ex enim nostrud eu deserunt nisi culpa nostrud reprehenderit mollit veniam eu. Anim non ad aliqua eu ea officia tempor id quis. Officia sunt nisi dolor et cupidatat elit aliqua nulla fugiat in proident.\r\nAliqua tempor nulla deserunt ipsum. Magna magna aute ad ex mollit tempor. Aliquip in fugiat esse aute aliquip minim irure sint esse excepteur est. Pariatur duis excepteur Lorem veniam amet cillum ea fugiat nostrud exercitation qui. Adipisicing nostrud deserunt veniam proident quis.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 130,
                    "priceType": "Fixed",
                    "price": "$302.83",
                    "specialPrice": "$159.68",
                    "pricingName": "velit ullamco ex"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": false,
                "extraTime": 56,
                "tags": [
                    "occaecat",
                    "id",
                    "eu",
                    "sit"
                ]
            },
            {
                "name": "tempor officia excepteur Lorem minim",
                "category": "ut quis enim",
                "treatment": "",
                "description": "Ullamco mollit aliquip nostrud occaecat non labore esse consequat. Cillum do adipisicing non commodo. Consectetur proident ullamco quis ut nisi cillum mollit officia sit ut qui cupidatat laboris. Laborum culpa ullamco aliquip ex ullamco voluptate minim ad Lorem aliqua adipisicing sit. In occaecat ea quis ea voluptate tempor aliqua incididunt velit dolore. Velit deserunt tempor sit amet elit ipsum. Aliqua ea veniam eiusmod aliqua sunt id deserunt.\r\nNisi pariatur sit minim do. Pariatur velit sint labore ullamco dolor consectetur cillum do non. Tempor velit Lorem labore reprehenderit elit proident ullamco aliqua exercitation non amet. Culpa ut qui nulla reprehenderit velit esse non proident ea do.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 110,
                    "priceType": "From",
                    "price": "$209.19",
                    "specialPrice": "$245.41",
                    "pricingName": "nostrud ullamco exercitation"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": true,
                "extraTime": 37,
                "tags": [
                    "consectetur",
                    "occaecat",
                    "reprehenderit",
                    "esse"
                ]
            },
            {
                "name": "anim cillum excepteur irure commodo",
                "category": "nulla deserunt duis",
                "treatment": "",
                "description": "Officia enim reprehenderit sint et id qui quis consectetur id labore mollit dolore Lorem. Irure laborum cillum labore exercitation duis et non aute et esse. Est consequat amet consequat labore pariatur ut nulla elit commodo labore eu duis consequat ex. Ipsum sunt voluptate occaecat officia exercitation fugiat esse ipsum velit sunt sint aliqua mollit eiusmod. Deserunt aliqua velit nisi aute officia anim laboris velit amet id labore do. Pariatur enim officia sit magna nostrud officia laboris veniam consectetur.\r\nUllamco qui laborum voluptate velit voluptate nostrud exercitation eiusmod minim. Cillum eiusmod aliquip magna eu ea est. Ullamco laboris excepteur ut quis do.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 55,
                    "priceType": "From",
                    "price": "$148.39",
                    "specialPrice": "$146.13",
                    "pricingName": "nisi deserunt enim"
                },
                "pricingOptions": [
                    {
                        "duration": 281,
                        "priceType": "From",
                        "price": "$161.71",
                        "specialPrice": "$344.09",
                        "pricingName": "proident deserunt occaecat"
                    },
                    {
                        "duration": 325,
                        "priceType": "Fixed",
                        "price": "$169.98",
                        "specialPrice": "$290.03",
                        "pricingName": "dolore consectetur sunt"
                    },
                    {
                        "duration": 179,
                        "priceType": "Fixed",
                        "price": "$96.47",
                        "specialPrice": "$188.20",
                        "pricingName": "do reprehenderit ad"
                    },
                    {
                        "duration": 211,
                        "priceType": "Fixed",
                        "price": "$100.92",
                        "specialPrice": "$20.46",
                        "pricingName": "ex consectetur incididunt"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 50,
                "tags": [
                    "do",
                    "officia"
                ]
            },
            {
                "name": "eu eiusmod sint nostrud commodo",
                "category": "minim excepteur in",
                "treatment": "",
                "description": "Consectetur veniam nostrud elit ea id nostrud cupidatat irure adipisicing id velit quis. Aliquip sint consectetur fugiat laborum magna adipisicing Lorem et adipisicing. Mollit ut anim eiusmod esse quis voluptate deserunt enim. Eiusmod ipsum aute pariatur ea consectetur magna officia cillum dolor aute voluptate enim consectetur tempor.\r\nAliquip consequat nostrud aliquip incididunt velit nostrud ex nisi incididunt proident. Voluptate pariatur incididunt non excepteur commodo veniam exercitation. Consectetur amet ad incididunt ut fugiat consequat culpa do nostrud.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 221,
                    "priceType": "From",
                    "price": "$129.85",
                    "specialPrice": "$212.95",
                    "pricingName": "irure exercitation et"
                },
                "pricingOptions": [
                    {
                        "duration": 57,
                        "priceType": "From",
                        "price": "$221.36",
                        "specialPrice": "$266.12",
                        "pricingName": "minim cupidatat et"
                    },
                    {
                        "duration": 376,
                        "priceType": "From",
                        "price": "$212.06",
                        "specialPrice": "$191.30",
                        "pricingName": "proident culpa nulla"
                    },
                    {
                        "duration": 297,
                        "priceType": "Fixed",
                        "price": "$73.73",
                        "specialPrice": "$355.14",
                        "pricingName": "minim reprehenderit qui"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 54,
                "tags": [
                    "ea",
                    "dolore",
                    "nulla",
                    "eu",
                    "ex",
                    "eiusmod"
                ]
            },
            {
                "name": "nostrud cupidatat proident esse dolor",
                "category": "ut adipisicing nisi",
                "treatment": "",
                "description": "Velit labore sint Lorem tempor nisi ullamco Lorem in deserunt pariatur ad reprehenderit officia. Aliqua duis voluptate aute dolor commodo et dolor adipisicing velit est irure fugiat. Laboris magna eu est excepteur proident duis enim proident consequat. Mollit nulla eu commodo velit fugiat aliquip ea occaecat reprehenderit eiusmod sunt.\r\nCupidatat nostrud nostrud commodo aute ut dolor sunt nostrud non occaecat cillum tempor proident voluptate. Consequat fugiat do voluptate pariatur commodo sunt eu irure irure dolor mollit dolore aliquip laborum. Lorem consectetur cillum eu sint elit laborum consequat excepteur in elit labore amet.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 170,
                    "priceType": "From",
                    "price": "$156.98",
                    "specialPrice": "$391.49",
                    "pricingName": "Lorem incididunt velit"
                },
                "pricingOptions": [
                    {
                        "duration": 35,
                        "priceType": "From",
                        "price": "$292.78",
                        "specialPrice": "$257.35",
                        "pricingName": "Lorem anim commodo"
                    },
                    {
                        "duration": 56,
                        "priceType": "Fixed",
                        "price": "$65.16",
                        "specialPrice": "$319.19",
                        "pricingName": "excepteur dolore culpa"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 38,
                "tags": [
                    "dolore",
                    "Lorem",
                    "duis"
                ]
            },
            {
                "name": "laboris anim consectetur ullamco magna",
                "category": "sunt veniam ullamco",
                "treatment": "",
                "description": "Quis ea nostrud nostrud qui elit ut voluptate adipisicing consequat occaecat ex sit pariatur occaecat. Laborum deserunt anim exercitation exercitation incididunt dolor ad deserunt excepteur elit laborum culpa. Ullamco amet in aliqua duis esse voluptate in ex cupidatat excepteur. Sit nulla in magna amet amet.\r\nAd ea cupidatat et reprehenderit laboris nisi non voluptate irure eu commodo elit velit. Ad ullamco eu culpa ea nulla nostrud ipsum tempor ex ipsum aliquip sint. Culpa occaecat irure excepteur fugiat eu quis. Tempor culpa incididunt reprehenderit eu laborum magna enim excepteur. Consectetur amet reprehenderit et reprehenderit sit ea dolor.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 58,
                    "priceType": "From",
                    "price": "$115.08",
                    "specialPrice": "$393.22",
                    "pricingName": "reprehenderit ipsum reprehenderit"
                },
                "pricingOptions": [
                    {
                        "duration": 149,
                        "priceType": "Fixed",
                        "price": "$74.72",
                        "specialPrice": "$376.65",
                        "pricingName": "consequat do excepteur"
                    },
                    {
                        "duration": 150,
                        "priceType": "From",
                        "price": "$54.40",
                        "specialPrice": "$182.35",
                        "pricingName": "ipsum irure ullamco"
                    },
                    {
                        "duration": 317,
                        "priceType": "Fixed",
                        "price": "$125.87",
                        "specialPrice": "$335.24",
                        "pricingName": "id laboris eu"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 47,
                "tags": [
                    "cillum",
                    "amet",
                    "magna",
                    "culpa"
                ]
            },
            {
                "name": "officia ea tempor in velit",
                "category": "fugiat sit consequat",
                "treatment": "",
                "description": "Sunt esse tempor voluptate id consectetur quis non aute ipsum fugiat Lorem consectetur. Sint exercitation ut ut commodo culpa nostrud irure. Consectetur eiusmod cillum consequat tempor consequat. Reprehenderit laborum dolore laborum consequat minim.\r\nCommodo eu labore pariatur ut officia qui ex voluptate. Cupidatat aute et aute in. Esse dolor qui quis aliquip aliqua laborum ipsum nisi. Sint esse ea do velit ea incididunt excepteur. Occaecat anim voluptate aute amet ipsum amet.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 207,
                    "priceType": "From",
                    "price": "$261.35",
                    "specialPrice": "$248.75",
                    "pricingName": "est minim veniam"
                },
                "pricingOptions": [
                    {
                        "duration": 190,
                        "priceType": "From",
                        "price": "$299.57",
                        "specialPrice": "$177.87",
                        "pricingName": "non eu cupidatat"
                    },
                    {
                        "duration": 209,
                        "priceType": "From",
                        "price": "$23.64",
                        "specialPrice": "$365.69",
                        "pricingName": "anim excepteur nostrud"
                    },
                    {
                        "duration": 126,
                        "priceType": "Fixed",
                        "price": "$223.16",
                        "specialPrice": "$259.56",
                        "pricingName": "elit cillum magna"
                    },
                    {
                        "duration": 379,
                        "priceType": "Fixed",
                        "price": "$31.07",
                        "specialPrice": "$20.44",
                        "pricingName": "occaecat excepteur nisi"
                    },
                    {
                        "duration": 53,
                        "priceType": "Fixed",
                        "price": "$238.48",
                        "specialPrice": "$358.44",
                        "pricingName": "velit eu consectetur"
                    },
                    {
                        "duration": 216,
                        "priceType": "From",
                        "price": "$278.47",
                        "specialPrice": "$390.97",
                        "pricingName": "ex commodo Lorem"
                    },
                    {
                        "duration": 400,
                        "priceType": "Fixed",
                        "price": "$370.47",
                        "specialPrice": "$112.84",
                        "pricingName": "excepteur tempor in"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 35,
                "tags": [
                    "in",
                    "ut",
                    "exercitation",
                    "aliquip",
                    "amet",
                    "dolore"
                ]
            },
            {
                "name": "adipisicing occaecat nisi do ex",
                "category": "nostrud officia dolore",
                "treatment": "",
                "description": "Ex ullamco dolore sint laboris ea esse proident nulla aliquip culpa pariatur consectetur. Duis enim est aute adipisicing sit laboris ullamco sint consectetur nulla duis cupidatat anim anim. Quis tempor proident non sit aliquip voluptate anim. Voluptate sint cillum cillum proident laborum occaecat consequat. Incididunt sit do sit do sit exercitation consequat sunt do. Esse laboris non ullamco occaecat consectetur nulla minim aliquip irure anim. Minim do id do nisi est do et sint.\r\nUllamco eu esse sunt occaecat minim sunt exercitation officia veniam eu reprehenderit consequat minim Lorem. Deserunt ad adipisicing est nulla irure anim laborum ut aute sint pariatur consequat labore deserunt. Nulla ad nulla adipisicing pariatur cillum pariatur aliqua exercitation consequat nostrud est velit. Proident id proident Lorem adipisicing id veniam pariatur magna pariatur commodo commodo aute sunt. Duis magna sit in sit aute labore aliqua culpa. Magna proident fugiat nulla voluptate. Tempor cillum pariatur labore duis aliquip nisi amet sint reprehenderit reprehenderit enim laborum incididunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 45,
                    "priceType": "Fixed",
                    "price": "$286.56",
                    "specialPrice": "$235.96",
                    "pricingName": "in commodo do"
                },
                "pricingOptions": [
                    {
                        "duration": 197,
                        "priceType": "Fixed",
                        "price": "$244.65",
                        "specialPrice": "$394.63",
                        "pricingName": "consectetur dolore exercitation"
                    },
                    {
                        "duration": 210,
                        "priceType": "From",
                        "price": "$110.77",
                        "specialPrice": "$177.82",
                        "pricingName": "aliqua aute laboris"
                    },
                    {
                        "duration": 102,
                        "priceType": "From",
                        "price": "$197.13",
                        "specialPrice": "$149.59",
                        "pricingName": "ullamco voluptate sint"
                    },
                    {
                        "duration": 20,
                        "priceType": "From",
                        "price": "$155.79",
                        "specialPrice": "$70.84",
                        "pricingName": "irure Lorem velit"
                    },
                    {
                        "duration": 128,
                        "priceType": "Fixed",
                        "price": "$274.21",
                        "specialPrice": "$28.78",
                        "pricingName": "est mollit excepteur"
                    },
                    {
                        "duration": 342,
                        "priceType": "Fixed",
                        "price": "$31.19",
                        "specialPrice": "$346.61",
                        "pricingName": "et mollit ad"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 50,
                "tags": [
                    "adipisicing",
                    "incididunt"
                ]
            },
            {
                "name": "consectetur sint laboris incididunt amet",
                "category": "qui incididunt quis",
                "treatment": "",
                "description": "Irure excepteur veniam esse amet proident esse aliquip occaecat. Duis veniam sunt eu ullamco deserunt culpa fugiat cillum. Nulla ad ipsum nostrud anim amet mollit mollit consequat duis exercitation.\r\nConsequat nostrud non laboris est et tempor officia. Esse pariatur consequat officia id duis est occaecat duis ad. Nisi aute consequat adipisicing ea excepteur reprehenderit cupidatat irure nulla ullamco incididunt. Consequat dolor cupidatat esse duis adipisicing cupidatat sint.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 246,
                    "priceType": "Fixed",
                    "price": "$173.59",
                    "specialPrice": "$116.72",
                    "pricingName": "Lorem ea in"
                },
                "pricingOptions": [
                    {
                        "duration": 367,
                        "priceType": "From",
                        "price": "$334.94",
                        "specialPrice": "$258.37",
                        "pricingName": "fugiat excepteur dolore"
                    },
                    {
                        "duration": 93,
                        "priceType": "Fixed",
                        "price": "$142.09",
                        "specialPrice": "$247.78",
                        "pricingName": "sit eiusmod magna"
                    },
                    {
                        "duration": 283,
                        "priceType": "Fixed",
                        "price": "$201.95",
                        "specialPrice": "$242.77",
                        "pricingName": "eiusmod voluptate nulla"
                    },
                    {
                        "duration": 331,
                        "priceType": "From",
                        "price": "$389.93",
                        "specialPrice": "$176.72",
                        "pricingName": "mollit qui ut"
                    },
                    {
                        "duration": 204,
                        "priceType": "From",
                        "price": "$121.81",
                        "specialPrice": "$49.80",
                        "pricingName": "veniam quis aliqua"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 52,
                "tags": [
                    "et",
                    "ut",
                    "aliquip",
                    "magna",
                    "commodo",
                    "eu",
                    "sunt"
                ]
            }
        ]
    },
    {
        "_id": "60935e0433eb95e861f6ff2b",
        "email": "carolinamejia@uxmox.com",
        "bio": "Laboris excepteur in pariatur nostrud sit.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Accel",
        "address": {
            "street": "Madison Street",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.59905,
            "longitude": -73.63286
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "aliquip proident ad",
                "description": "Laboris ullamco sunt nulla aute sint et veniam cupidatat amet enim exercitation dolore aute reprehenderit. Cillum qui tempor anim id consectetur magna cillum proident incididunt laborum veniam do. Non labore magna labore occaecat quis. Consectetur ut ut cillum mollit quis velit commodo proident proident.\r\n"
            },
            {
                "name": "laborum ipsum",
                "description": ""
            },
            {
                "name": "sit incididunt laborum proident",
                "description": "Ad Lorem excepteur ad velit consequat anim reprehenderit commodo cillum commodo. Exercitation eu nostrud aliquip ullamco labore excepteur est duis consequat exercitation sint cillum cupidatat. Amet incididunt adipisicing ad aliqua nisi fugiat.\r\nVoluptate reprehenderit culpa voluptate laborum qui eiusmod deserunt ea et aute magna. In mollit amet quis ad. Consequat eiusmod tempor eu velit consectetur. Excepteur deserunt aute velit Lorem proident irure mollit non. Qui sint sint sit consectetur cupidatat aute ut nulla. Magna reprehenderit proident cillum ullamco quis velit amet aute nulla consequat deserunt mollit id.\r\nEiusmod non consequat ex deserunt irure non exercitation culpa sint. Sunt culpa nulla quis occaecat dolor enim veniam deserunt. In nisi cupidatat labore nulla eu duis in commodo ipsum esse est minim eu nulla. Ex veniam ut aute tempor ea velit nisi nulla nisi anim eu cillum. Nulla mollit ut veniam magna consectetur aute culpa in magna enim id dolore nostrud anim. Officia laboris laboris irure aute dolore laboris anim pariatur nisi laboris occaecat Lorem est. Est ex mollit incididunt quis ipsum.\r\n"
            }
        ],
        "services": [
            {
                "name": "deserunt deserunt consequat deserunt nisi",
                "category": "officia eiusmod ipsum",
                "treatment": "",
                "description": "Proident fugiat ullamco commodo mollit duis do id velit aliqua ullamco Lorem reprehenderit esse. Id nostrud consectetur esse elit. Laborum anim nostrud labore anim aliquip anim labore voluptate ut voluptate anim aliqua dolore enim. Deserunt consectetur amet nulla culpa. Amet id eiusmod ipsum aliquip adipisicing. Labore velit enim eiusmod mollit anim consectetur enim magna occaecat fugiat eu anim duis ullamco. Sunt cillum cupidatat quis exercitation excepteur id.\r\nAliqua voluptate laboris reprehenderit qui cupidatat laborum voluptate consequat. Esse minim duis quis fugiat. Lorem laborum sunt labore tempor sit Lorem est. Proident ex nisi exercitation nostrud. Nostrud amet consequat sunt cillum anim sit velit esse. Nostrud tempor id occaecat ad anim anim magna anim eu est irure.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 340,
                    "priceType": "From",
                    "price": "$380.18",
                    "specialPrice": "$201.25",
                    "pricingName": "laboris dolor aute"
                },
                "pricingOptions": [
                    {
                        "duration": 192,
                        "priceType": "From",
                        "price": "$252.46",
                        "specialPrice": "$134.20",
                        "pricingName": "mollit laboris ut"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 52,
                "tags": [
                    "incididunt",
                    "anim",
                    "irure",
                    "officia",
                    "do"
                ]
            },
            {
                "name": "aliqua exercitation anim ipsum ut",
                "category": "sunt consectetur quis",
                "treatment": "",
                "description": "Duis nisi cillum ex esse eiusmod aliqua sint. Amet deserunt qui cillum dolore. Do officia velit incididunt quis aute. Pariatur culpa et mollit duis anim nostrud magna amet amet consectetur. Sunt id nulla nulla commodo veniam esse esse. Adipisicing sint et ea aliqua est.\r\nIrure quis cillum reprehenderit cupidatat nisi. Officia laborum commodo sit minim do dolor. Anim mollit duis et anim sit qui et ipsum est. Et sunt sunt laboris nostrud et veniam. Qui non Lorem duis est sunt anim excepteur deserunt. Esse duis enim voluptate mollit minim voluptate eu fugiat in. Ut dolor et et qui officia nulla qui minim sint ut.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 342,
                    "priceType": "From",
                    "price": "$97.90",
                    "specialPrice": "$135.24",
                    "pricingName": "do et eiusmod"
                },
                "pricingOptions": [
                    {
                        "duration": 358,
                        "priceType": "From",
                        "price": "$117.42",
                        "specialPrice": "$87.02",
                        "pricingName": "quis esse ad"
                    },
                    {
                        "duration": 207,
                        "priceType": "Fixed",
                        "price": "$85.01",
                        "specialPrice": "$121.47",
                        "pricingName": "enim enim qui"
                    },
                    {
                        "duration": 118,
                        "priceType": "Fixed",
                        "price": "$51.12",
                        "specialPrice": "$291.27",
                        "pricingName": "proident dolore quis"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 58,
                "tags": [
                    "pariatur",
                    "laboris",
                    "aliqua",
                    "laborum",
                    "amet"
                ]
            },
            {
                "name": "tempor voluptate dolore ex occaecat",
                "category": "duis mollit excepteur",
                "treatment": "",
                "description": "Culpa ea voluptate excepteur consequat dolore. Aute adipisicing mollit commodo duis officia proident ea ex irure. Qui quis fugiat labore tempor enim dolore. Eu in consequat consequat dolore aliquip cupidatat.\r\nAliqua ullamco nulla magna sunt et Lorem. Proident laboris officia exercitation officia ut magna culpa. Aute commodo sint qui ad dolore aliquip Lorem cupidatat laboris commodo dolore mollit. Ullamco do dolor exercitation cillum. Occaecat consectetur non nostrud laborum est. Esse cillum ex minim mollit deserunt dolore et enim dolore non. Sit amet anim anim anim aliqua duis laborum eiusmod.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 218,
                    "priceType": "Fixed",
                    "price": "$368.14",
                    "specialPrice": "$236.44",
                    "pricingName": "pariatur nostrud ex"
                },
                "pricingOptions": [
                    {
                        "duration": 107,
                        "priceType": "Fixed",
                        "price": "$369.77",
                        "specialPrice": "$67.07",
                        "pricingName": "do elit id"
                    },
                    {
                        "duration": 320,
                        "priceType": "Fixed",
                        "price": "$92.65",
                        "specialPrice": "$307.23",
                        "pricingName": "ut qui duis"
                    },
                    {
                        "duration": 129,
                        "priceType": "Fixed",
                        "price": "$147.78",
                        "specialPrice": "$97.87",
                        "pricingName": "minim deserunt in"
                    },
                    {
                        "duration": 315,
                        "priceType": "Fixed",
                        "price": "$83.03",
                        "specialPrice": "$272.18",
                        "pricingName": "eiusmod culpa exercitation"
                    },
                    {
                        "duration": 50,
                        "priceType": "Fixed",
                        "price": "$109.29",
                        "specialPrice": "$258.23",
                        "pricingName": "tempor ullamco culpa"
                    },
                    {
                        "duration": 62,
                        "priceType": "From",
                        "price": "$379.15",
                        "specialPrice": "$77.06",
                        "pricingName": "cillum laborum ea"
                    },
                    {
                        "duration": 217,
                        "priceType": "From",
                        "price": "$266.57",
                        "specialPrice": "$118.19",
                        "pricingName": "velit aliquip sunt"
                    },
                    {
                        "duration": 304,
                        "priceType": "Fixed",
                        "price": "$97.20",
                        "specialPrice": "$38.60",
                        "pricingName": "voluptate in labore"
                    },
                    {
                        "duration": 249,
                        "priceType": "From",
                        "price": "$302.72",
                        "specialPrice": "$121.84",
                        "pricingName": "ad enim commodo"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 33,
                "tags": [
                    "laboris",
                    "nulla",
                    "ad",
                    "sunt",
                    "incididunt",
                    "ea"
                ]
            },
            {
                "name": "nisi Lorem aliquip minim velit",
                "category": "aute deserunt aliqua",
                "treatment": "",
                "description": "Sint nulla aliqua duis enim aute. Culpa sunt magna aliqua magna eiusmod. Ut ipsum dolore incididunt officia in nisi ut quis. Ullamco sint quis consequat sunt pariatur quis sit aliqua Lorem laboris ad dolore aliquip.\r\nVoluptate et laborum ea mollit consectetur voluptate non ullamco ullamco incididunt Lorem excepteur laborum aliqua. Mollit nulla sit reprehenderit amet amet quis ipsum amet aliqua aute. Adipisicing aliquip nisi aliquip officia tempor do nisi sint aliqua. Sint fugiat consequat excepteur quis irure consectetur ut.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 37,
                    "priceType": "Fixed",
                    "price": "$288.71",
                    "specialPrice": "$144.40",
                    "pricingName": "esse mollit eiusmod"
                },
                "pricingOptions": [
                    {
                        "duration": 180,
                        "priceType": "From",
                        "price": "$350.90",
                        "specialPrice": "$32.56",
                        "pricingName": "proident aliqua amet"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 46,
                "tags": [
                    "excepteur",
                    "dolor",
                    "fugiat",
                    "adipisicing",
                    "labore"
                ]
            },
            {
                "name": "incididunt dolore culpa deserunt pariatur",
                "category": "ad ut consequat",
                "treatment": "",
                "description": "Incididunt aliquip sit pariatur occaecat. Culpa ullamco voluptate sit nulla. Fugiat laboris enim et irure.\r\nAliquip deserunt enim mollit officia nostrud ex incididunt commodo. Nulla aliquip ex sunt velit sint. Culpa dolor fugiat aute qui aliquip.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 109,
                    "priceType": "From",
                    "price": "$40.20",
                    "specialPrice": "$160.67",
                    "pricingName": "enim enim incididunt"
                },
                "pricingOptions": [
                    {
                        "duration": 295,
                        "priceType": "From",
                        "price": "$48.98",
                        "specialPrice": "$264.77",
                        "pricingName": "eiusmod eiusmod anim"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 37,
                "tags": [
                    "tempor",
                    "eiusmod",
                    "est",
                    "reprehenderit"
                ]
            },
            {
                "name": "tempor non sint enim ullamco",
                "category": "duis sit sunt",
                "treatment": "",
                "description": "Dolor nulla quis eiusmod sunt amet veniam minim dolore ipsum ex quis exercitation nulla. Culpa laborum in dolore ad voluptate dolor fugiat ea ea. Ullamco anim nisi et proident anim non.\r\nMinim excepteur qui culpa ipsum. Duis exercitation enim dolor id exercitation. Laboris culpa et nisi est consectetur. Cillum laboris est ullamco pariatur dolor quis Lorem commodo dolore fugiat elit incididunt anim nulla. Irure amet labore elit dolore sunt ad culpa incididunt minim magna.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 372,
                    "priceType": "Fixed",
                    "price": "$73.34",
                    "specialPrice": "$316.68",
                    "pricingName": "excepteur eiusmod sit"
                },
                "pricingOptions": [
                    {
                        "duration": 317,
                        "priceType": "Fixed",
                        "price": "$387.50",
                        "specialPrice": "$364.35",
                        "pricingName": "irure dolor do"
                    },
                    {
                        "duration": 213,
                        "priceType": "From",
                        "price": "$369.60",
                        "specialPrice": "$218.41",
                        "pricingName": "laborum adipisicing Lorem"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 33,
                "tags": [
                    "ipsum",
                    "aliquip",
                    "voluptate",
                    "et",
                    "aute",
                    "esse"
                ]
            }
        ]
    },
    {
        "_id": "60935e041f79501f696efbc2",
        "email": "carolinamejia@accel.com",
        "bio": "Proident fugiat incididunt occaecat tempor fugiat consectetur excepteur duis anim.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Makingway",
        "address": {
            "street": "Bouck Court",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.55311,
            "longitude": -73.49505
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "qui nulla tempor",
                "description": "Voluptate in sunt sit eu labore laborum voluptate id. Consequat eu aute est duis in dolore fugiat magna. Id ea ut exercitation consequat mollit quis enim consectetur enim voluptate ut et. Nisi minim sint velit culpa eiusmod ex pariatur et in nostrud id voluptate. Reprehenderit veniam voluptate reprehenderit pariatur ea ullamco laborum aute labore cupidatat officia ea aute. Ut nulla dolore eiusmod aliquip anim aute voluptate nisi esse ut enim. Sit Lorem culpa pariatur veniam officia qui mollit do nulla dolor proident voluptate aliquip excepteur.\r\n"
            },
            {
                "name": "irure ea",
                "description": ""
            },
            {
                "name": "nostrud excepteur tempor fugiat",
                "description": "Adipisicing cillum pariatur aliqua eu ipsum qui labore incididunt elit do exercitation. Dolore aliquip eu ipsum adipisicing velit consectetur dolore labore anim quis veniam dolor aliqua. Aute enim velit irure do anim deserunt ea. Officia laborum duis minim exercitation irure qui mollit ea cillum aliqua. Non laborum officia sunt id sint est laboris irure ea.\r\nNisi anim minim ullamco tempor culpa sit quis Lorem. Ipsum deserunt amet laboris nisi. Elit sint magna et esse duis officia enim aliquip esse excepteur id.\r\nLorem dolore aliquip proident voluptate tempor. Dolore laboris non deserunt dolor esse proident qui reprehenderit cillum fugiat esse consequat. Mollit commodo et laborum mollit et sunt sint amet ea sunt aliqua esse tempor quis. Minim incididunt occaecat laborum Lorem duis proident. Elit commodo voluptate nostrud elit quis pariatur nisi anim minim nulla labore quis labore. Ad fugiat eiusmod voluptate ex aliquip eiusmod. Fugiat fugiat anim incididunt proident labore do aliqua sint ullamco est consequat anim occaecat.\r\n"
            }
        ],
        "services": [
            {
                "name": "voluptate incididunt dolor irure ad",
                "category": "exercitation cillum sunt",
                "treatment": "",
                "description": "Eu cupidatat anim cupidatat esse occaecat labore aute irure tempor. Incididunt dolor tempor dolore ullamco cillum laboris aliqua magna. Ad cupidatat eu cillum nostrud quis. Non consectetur aute duis duis officia laboris exercitation exercitation esse excepteur ad minim. Nisi Lorem incididunt pariatur esse voluptate fugiat ex nisi eiusmod esse deserunt nostrud anim.\r\nExercitation in ipsum quis duis enim tempor reprehenderit aute laborum officia. Laborum aute dolor officia quis ex aliqua ad eiusmod. Nostrud nostrud duis laboris commodo exercitation ipsum. Eu deserunt dolor qui velit velit officia consequat pariatur eu tempor laboris ut occaecat sint. Dolor do veniam elit amet irure reprehenderit velit. Voluptate enim anim irure non.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 167,
                    "priceType": "Fixed",
                    "price": "$345.80",
                    "specialPrice": "$302.52",
                    "pricingName": "aliqua magna nisi"
                },
                "pricingOptions": [
                    {
                        "duration": 287,
                        "priceType": "Fixed",
                        "price": "$67.01",
                        "specialPrice": "$311.68",
                        "pricingName": "esse ullamco ex"
                    },
                    {
                        "duration": 251,
                        "priceType": "Fixed",
                        "price": "$153.48",
                        "specialPrice": "$269.31",
                        "pricingName": "ipsum minim irure"
                    },
                    {
                        "duration": 60,
                        "priceType": "From",
                        "price": "$77.41",
                        "specialPrice": "$348.60",
                        "pricingName": "reprehenderit pariatur ullamco"
                    },
                    {
                        "duration": 244,
                        "priceType": "From",
                        "price": "$257.54",
                        "specialPrice": "$97.00",
                        "pricingName": "enim pariatur qui"
                    },
                    {
                        "duration": 241,
                        "priceType": "From",
                        "price": "$320.98",
                        "specialPrice": "$209.92",
                        "pricingName": "velit non sunt"
                    },
                    {
                        "duration": 176,
                        "priceType": "From",
                        "price": "$241.41",
                        "specialPrice": "$57.73",
                        "pricingName": "laborum sit do"
                    },
                    {
                        "duration": 46,
                        "priceType": "Fixed",
                        "price": "$150.61",
                        "specialPrice": "$66.68",
                        "pricingName": "est id eu"
                    },
                    {
                        "duration": 281,
                        "priceType": "Fixed",
                        "price": "$23.15",
                        "specialPrice": "$145.17",
                        "pricingName": "exercitation et adipisicing"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 25,
                "tags": [
                    "quis",
                    "proident",
                    "consequat",
                    "voluptate"
                ]
            },
            {
                "name": "in aliqua velit anim laboris",
                "category": "voluptate velit laborum",
                "treatment": "",
                "description": "Reprehenderit eu nostrud in consectetur. Adipisicing consectetur ea exercitation laboris mollit Lorem anim proident officia mollit. Nisi amet aute culpa cillum irure. Laborum amet veniam ipsum aliqua et dolor reprehenderit culpa nisi ex laboris officia.\r\nProident tempor nostrud ut reprehenderit magna enim qui mollit culpa magna amet. Veniam elit ut enim dolore amet voluptate est laboris anim velit ea incididunt. Sit Lorem do nulla reprehenderit consequat veniam mollit fugiat consequat. Adipisicing consequat excepteur duis et elit excepteur sit dolore minim cillum. Amet consequat consectetur amet exercitation cupidatat reprehenderit est ad ullamco dolore cillum sit aute. Consectetur proident consequat ipsum duis exercitation labore. Commodo sit id incididunt quis voluptate et commodo consequat in est.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 312,
                    "priceType": "From",
                    "price": "$310.37",
                    "specialPrice": "$356.54",
                    "pricingName": "anim Lorem laborum"
                },
                "pricingOptions": [
                    {
                        "duration": 375,
                        "priceType": "From",
                        "price": "$289.05",
                        "specialPrice": "$304.15",
                        "pricingName": "nisi anim ad"
                    },
                    {
                        "duration": 156,
                        "priceType": "Fixed",
                        "price": "$240.72",
                        "specialPrice": "$399.05",
                        "pricingName": "labore ad laborum"
                    },
                    {
                        "duration": 310,
                        "priceType": "Fixed",
                        "price": "$346.63",
                        "specialPrice": "$51.46",
                        "pricingName": "laboris id aliquip"
                    },
                    {
                        "duration": 60,
                        "priceType": "From",
                        "price": "$225.92",
                        "specialPrice": "$319.20",
                        "pricingName": "excepteur minim minim"
                    },
                    {
                        "duration": 268,
                        "priceType": "From",
                        "price": "$140.97",
                        "specialPrice": "$267.12",
                        "pricingName": "eiusmod Lorem non"
                    },
                    {
                        "duration": 95,
                        "priceType": "Fixed",
                        "price": "$357.32",
                        "specialPrice": "$149.59",
                        "pricingName": "aliqua aliquip anim"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 37,
                "tags": [
                    "minim",
                    "Lorem",
                    "consequat",
                    "officia",
                    "et"
                ]
            },
            {
                "name": "elit elit nostrud dolor sunt",
                "category": "ullamco consectetur cupidatat",
                "treatment": "",
                "description": "Ex cillum officia amet do. Sunt laboris labore occaecat cillum officia. Nulla sunt reprehenderit labore est consectetur proident nulla non est mollit. Nulla culpa aliquip culpa et dolore duis tempor incididunt occaecat proident et. Nisi do ipsum labore cupidatat commodo ut duis cillum dolor excepteur veniam ut elit consequat. Laboris enim deserunt fugiat ea elit ea cupidatat.\r\nUt culpa laborum esse do nulla duis duis. Lorem est commodo occaecat sint qui consectetur tempor occaecat sit eiusmod laborum nulla. Consectetur esse ea officia ut fugiat. Mollit fugiat laborum quis do sint occaecat minim veniam cillum. Fugiat in culpa eu eiusmod fugiat reprehenderit eiusmod exercitation irure nulla cupidatat nisi non. Deserunt proident est incididunt exercitation anim anim qui ullamco irure.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 273,
                    "priceType": "Fixed",
                    "price": "$283.20",
                    "specialPrice": "$172.07",
                    "pricingName": "et qui quis"
                },
                "pricingOptions": [
                    {
                        "duration": 250,
                        "priceType": "From",
                        "price": "$63.92",
                        "specialPrice": "$327.69",
                        "pricingName": "voluptate labore proident"
                    },
                    {
                        "duration": 158,
                        "priceType": "Fixed",
                        "price": "$292.09",
                        "specialPrice": "$235.23",
                        "pricingName": "sit voluptate occaecat"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 52,
                "tags": [
                    "adipisicing",
                    "fugiat",
                    "elit"
                ]
            },
            {
                "name": "Lorem veniam laboris est dolor",
                "category": "ullamco ad culpa",
                "treatment": "",
                "description": "Est eu do labore cupidatat incididunt et consectetur nisi amet adipisicing ad consectetur ipsum labore. Non nulla eu sit exercitation cupidatat. Reprehenderit veniam sunt nisi culpa proident consequat.\r\nOccaecat nisi anim qui commodo non quis incididunt. Occaecat laborum velit nostrud culpa mollit. Do excepteur veniam eu aute est incididunt minim excepteur nulla. Culpa laborum ea laboris ea dolor. Excepteur Lorem elit pariatur duis laborum officia sint laborum voluptate voluptate. Occaecat dolore enim occaecat anim proident cupidatat sint officia elit mollit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 306,
                    "priceType": "From",
                    "price": "$323.02",
                    "specialPrice": "$322.60",
                    "pricingName": "officia ex sunt"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": false,
                "extraTime": 29,
                "tags": [
                    "qui",
                    "laboris",
                    "eiusmod",
                    "reprehenderit",
                    "culpa",
                    "adipisicing",
                    "sunt"
                ]
            },
            {
                "name": "eiusmod cillum voluptate nisi aute",
                "category": "duis in culpa",
                "treatment": "",
                "description": "Enim velit pariatur nulla Lorem commodo ipsum aliqua mollit do aliquip. Tempor veniam irure reprehenderit do ut fugiat veniam. Exercitation sint exercitation cillum aute et nisi exercitation do elit fugiat aliquip anim deserunt. Veniam aliqua dolor duis laboris irure sint ad aliquip eiusmod aliquip exercitation. Labore ipsum reprehenderit aute ipsum exercitation duis laborum. Sunt officia minim elit culpa non cupidatat minim ea nulla commodo.\r\nUllamco pariatur eiusmod non proident. Eiusmod do nisi duis et cupidatat adipisicing. Enim consectetur consectetur in ut tempor excepteur irure elit veniam consectetur velit qui minim. Cupidatat labore tempor irure ipsum aliqua mollit. Voluptate do est esse voluptate fugiat labore eu nisi excepteur ex ut.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 387,
                    "priceType": "From",
                    "price": "$233.19",
                    "specialPrice": "$213.36",
                    "pricingName": "sunt laboris laborum"
                },
                "pricingOptions": [
                    {
                        "duration": 388,
                        "priceType": "Fixed",
                        "price": "$69.40",
                        "specialPrice": "$333.51",
                        "pricingName": "eiusmod amet id"
                    },
                    {
                        "duration": 276,
                        "priceType": "From",
                        "price": "$59.79",
                        "specialPrice": "$160.10",
                        "pricingName": "cillum non et"
                    },
                    {
                        "duration": 160,
                        "priceType": "Fixed",
                        "price": "$46.24",
                        "specialPrice": "$143.67",
                        "pricingName": "mollit ex magna"
                    },
                    {
                        "duration": 129,
                        "priceType": "From",
                        "price": "$286.24",
                        "specialPrice": "$186.14",
                        "pricingName": "veniam velit commodo"
                    },
                    {
                        "duration": 148,
                        "priceType": "From",
                        "price": "$258.47",
                        "specialPrice": "$355.48",
                        "pricingName": "tempor laboris reprehenderit"
                    },
                    {
                        "duration": 85,
                        "priceType": "Fixed",
                        "price": "$22.84",
                        "specialPrice": "$294.21",
                        "pricingName": "dolor id in"
                    },
                    {
                        "duration": 119,
                        "priceType": "From",
                        "price": "$175.61",
                        "specialPrice": "$266.40",
                        "pricingName": "tempor occaecat cupidatat"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 29,
                "tags": [
                    "ex",
                    "laboris",
                    "reprehenderit",
                    "esse"
                ]
            },
            {
                "name": "magna laborum fugiat sunt reprehenderit",
                "category": "ea aute qui",
                "treatment": "",
                "description": "Et officia mollit pariatur esse est ut consequat elit excepteur in ad et. Commodo dolore eiusmod sit ad. Qui voluptate proident dolor amet incididunt nulla ullamco. Sunt aliquip ut fugiat consequat esse duis commodo laboris aliqua elit nisi minim proident nisi. Sit commodo laborum veniam mollit quis. Est consequat dolor et laborum ut velit adipisicing. Irure velit voluptate incididunt labore consectetur non occaecat ut mollit et irure.\r\nExcepteur ea et aute elit mollit aliquip est cillum labore culpa ipsum aute quis magna. Enim ad commodo deserunt ipsum. Anim duis laboris culpa cillum sunt culpa amet non do.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 95,
                    "priceType": "Fixed",
                    "price": "$25.91",
                    "specialPrice": "$357.62",
                    "pricingName": "ad aliquip amet"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": false,
                "extraTime": 27,
                "tags": [
                    "in",
                    "mollit",
                    "irure",
                    "enim",
                    "adipisicing",
                    "pariatur",
                    "deserunt"
                ]
            },
            {
                "name": "adipisicing et excepteur magna sunt",
                "category": "esse exercitation labore",
                "treatment": "",
                "description": "Fugiat aliqua non culpa sunt fugiat consequat mollit magna aute. Culpa sint sint ea proident sit. Veniam tempor Lorem anim elit laborum Lorem aliqua dolore nulla ea in. Aute non ipsum ex sit ut mollit labore esse enim velit do ad. Duis laboris excepteur occaecat nulla Lorem duis. Duis aliqua consectetur incididunt ut irure esse exercitation exercitation excepteur adipisicing pariatur.\r\nMagna sit ullamco deserunt amet aute ea excepteur fugiat laboris ullamco eu. Et eiusmod mollit amet eiusmod cillum deserunt in amet consequat tempor ut mollit laboris. Veniam culpa nisi velit fugiat. Et mollit cillum aute id sit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 376,
                    "priceType": "From",
                    "price": "$46.71",
                    "specialPrice": "$299.72",
                    "pricingName": "veniam esse adipisicing"
                },
                "pricingOptions": [
                    {
                        "duration": 44,
                        "priceType": "Fixed",
                        "price": "$78.65",
                        "specialPrice": "$281.28",
                        "pricingName": "culpa officia nisi"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 32,
                "tags": [
                    "in",
                    "nostrud",
                    "do",
                    "elit",
                    "non",
                    "Lorem",
                    "veniam"
                ]
            }
        ]
    },
    {
        "_id": "60935e04988e3040cae0ea6e",
        "email": "carolinamejia@makingway.com",
        "bio": "Elit cillum dolore nulla eu ad dolore.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Comtract",
        "address": {
            "street": "Stone Avenue",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.4797,
            "longitude": -73.50928
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "anim est deserunt",
                "description": "Quis excepteur eiusmod aute sint enim est amet duis cupidatat proident. Est elit aute proident ullamco do incididunt. Consectetur sint duis irure fugiat enim mollit eiusmod officia minim eiusmod est consequat ipsum.\r\n"
            },
            {
                "name": "esse proident",
                "description": ""
            },
            {
                "name": "cupidatat nisi cupidatat minim",
                "description": "Magna quis culpa ex non amet consectetur id anim irure. Sit minim nisi amet aute aliquip laborum commodo. Eiusmod nulla anim proident culpa consectetur.\r\nPariatur ex labore ullamco magna. Qui esse deserunt cillum ullamco irure eu ea sunt. Nulla nostrud adipisicing laboris dolore elit id laborum veniam et id aliqua excepteur occaecat.\r\nEnim in velit duis aliquip nostrud fugiat esse sint fugiat nostrud nostrud. Voluptate ex adipisicing culpa reprehenderit quis cupidatat irure. Eiusmod esse ut pariatur est aliqua sit consequat ex eu minim excepteur culpa velit qui. Quis occaecat veniam elit veniam duis. Laboris excepteur occaecat laborum et voluptate. Consequat do deserunt laborum exercitation ex Lorem duis laborum. Laborum ipsum esse culpa labore sunt do magna est pariatur.\r\n"
            }
        ],
        "services": [
            {
                "name": "id ea aliquip eu et",
                "category": "consequat Lorem ea",
                "treatment": "",
                "description": "Proident reprehenderit velit anim cupidatat irure sunt incididunt duis irure. Lorem veniam incididunt anim culpa culpa adipisicing eu ea magna occaecat do sunt aliquip. Enim et fugiat reprehenderit cupidatat excepteur elit tempor sint nulla aliqua officia proident laboris id. Esse laborum in ipsum eu voluptate anim. Reprehenderit elit officia pariatur fugiat elit exercitation ullamco magna irure elit eu ullamco duis.\r\nConsectetur do non culpa aute irure ex ipsum aliquip Lorem velit incididunt qui. Exercitation mollit enim voluptate id. Adipisicing sit consectetur proident adipisicing irure. Dolor est dolore qui mollit ipsum proident proident aliqua quis et. Ipsum elit ut sit enim ex amet irure. Minim et nostrud ut cupidatat commodo adipisicing dolor commodo aute.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 136,
                    "priceType": "Fixed",
                    "price": "$101.16",
                    "specialPrice": "$210.91",
                    "pricingName": "incididunt incididunt fugiat"
                },
                "pricingOptions": [
                    {
                        "duration": 397,
                        "priceType": "Fixed",
                        "price": "$237.81",
                        "specialPrice": "$157.06",
                        "pricingName": "elit labore exercitation"
                    },
                    {
                        "duration": 69,
                        "priceType": "Fixed",
                        "price": "$385.44",
                        "specialPrice": "$188.84",
                        "pricingName": "pariatur reprehenderit id"
                    },
                    {
                        "duration": 364,
                        "priceType": "Fixed",
                        "price": "$186.85",
                        "specialPrice": "$230.57",
                        "pricingName": "esse occaecat sunt"
                    },
                    {
                        "duration": 103,
                        "priceType": "From",
                        "price": "$48.29",
                        "specialPrice": "$317.78",
                        "pricingName": "Lorem amet amet"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 34,
                "tags": [
                    "id",
                    "non",
                    "cillum",
                    "non"
                ]
            },
            {
                "name": "in irure adipisicing occaecat ea",
                "category": "do laboris labore",
                "treatment": "",
                "description": "Dolore dolor culpa ea pariatur ullamco incididunt. Enim dolor proident anim sit ad do do id est adipisicing esse officia. Dolore qui tempor labore cupidatat aliqua nisi et Lorem nulla.\r\nEnim fugiat aute eiusmod do consequat. Et ex elit sint esse exercitation cupidatat Lorem est dolor laborum. Magna excepteur pariatur voluptate anim esse. Reprehenderit aute cupidatat aliqua minim ullamco cupidatat esse nisi proident pariatur ad velit fugiat.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 230,
                    "priceType": "From",
                    "price": "$389.36",
                    "specialPrice": "$257.88",
                    "pricingName": "excepteur in est"
                },
                "pricingOptions": [
                    {
                        "duration": 197,
                        "priceType": "From",
                        "price": "$354.31",
                        "specialPrice": "$293.38",
                        "pricingName": "ea laborum et"
                    },
                    {
                        "duration": 240,
                        "priceType": "Fixed",
                        "price": "$46.25",
                        "specialPrice": "$245.78",
                        "pricingName": "aute proident consectetur"
                    },
                    {
                        "duration": 216,
                        "priceType": "From",
                        "price": "$101.68",
                        "specialPrice": "$353.24",
                        "pricingName": "occaecat do Lorem"
                    },
                    {
                        "duration": 269,
                        "priceType": "Fixed",
                        "price": "$55.12",
                        "specialPrice": "$184.24",
                        "pricingName": "ipsum velit ipsum"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 41,
                "tags": [
                    "labore",
                    "incididunt",
                    "dolor",
                    "dolore",
                    "incididunt",
                    "non",
                    "cillum"
                ]
            },
            {
                "name": "pariatur cillum aliqua esse mollit",
                "category": "laboris ex esse",
                "treatment": "",
                "description": "Ullamco nisi minim irure est consequat in ut tempor sunt sunt irure. Elit consectetur aliqua irure consequat occaecat ad sit ad ex dolore eiusmod. Voluptate est irure mollit exercitation consequat consectetur velit adipisicing est occaecat voluptate. Enim sint pariatur magna sint enim aliqua occaecat. Irure ad aliquip reprehenderit consectetur ad.\r\nDuis et dolore officia cupidatat duis elit dolor cupidatat nulla dolore esse nulla incididunt proident. Excepteur in anim ullamco consequat nulla consequat sunt anim. Voluptate non voluptate nulla ex quis amet duis qui do sunt. Duis eu aute nostrud labore tempor dolore sint et. Ex incididunt qui duis ad.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 388,
                    "priceType": "Fixed",
                    "price": "$218.86",
                    "specialPrice": "$162.95",
                    "pricingName": "laborum laborum est"
                },
                "pricingOptions": [
                    {
                        "duration": 89,
                        "priceType": "Fixed",
                        "price": "$199.14",
                        "specialPrice": "$137.76",
                        "pricingName": "deserunt voluptate nisi"
                    },
                    {
                        "duration": 354,
                        "priceType": "From",
                        "price": "$94.43",
                        "specialPrice": "$50.93",
                        "pricingName": "labore pariatur Lorem"
                    },
                    {
                        "duration": 64,
                        "priceType": "Fixed",
                        "price": "$124.09",
                        "specialPrice": "$324.16",
                        "pricingName": "ex deserunt elit"
                    },
                    {
                        "duration": 364,
                        "priceType": "Fixed",
                        "price": "$356.12",
                        "specialPrice": "$359.36",
                        "pricingName": "ex dolore sunt"
                    },
                    {
                        "duration": 175,
                        "priceType": "From",
                        "price": "$370.75",
                        "specialPrice": "$294.97",
                        "pricingName": "do veniam excepteur"
                    },
                    {
                        "duration": 115,
                        "priceType": "From",
                        "price": "$247.07",
                        "specialPrice": "$334.29",
                        "pricingName": "quis irure Lorem"
                    },
                    {
                        "duration": 352,
                        "priceType": "Fixed",
                        "price": "$43.01",
                        "specialPrice": "$177.28",
                        "pricingName": "ipsum nostrud non"
                    },
                    {
                        "duration": 62,
                        "priceType": "Fixed",
                        "price": "$318.45",
                        "specialPrice": "$370.65",
                        "pricingName": "do mollit minim"
                    },
                    {
                        "duration": 239,
                        "priceType": "Fixed",
                        "price": "$383.90",
                        "specialPrice": "$386.51",
                        "pricingName": "aliquip velit consequat"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 24,
                "tags": [
                    "nulla",
                    "dolore"
                ]
            },
            {
                "name": "ullamco sit fugiat nulla laboris",
                "category": "aliquip ex incididunt",
                "treatment": "",
                "description": "Non fugiat cupidatat quis quis ad eiusmod officia. Occaecat adipisicing amet non mollit cupidatat tempor esse Lorem aliquip laboris enim esse dolor occaecat. Proident nulla est do minim.\r\nVoluptate adipisicing ex adipisicing non excepteur commodo et. Ut labore culpa reprehenderit sit. Fugiat occaecat duis cupidatat voluptate nisi. Cillum do cupidatat do non nulla deserunt eu aute ex deserunt. Nulla officia elit qui amet consequat nulla cupidatat.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 291,
                    "priceType": "Fixed",
                    "price": "$207.37",
                    "specialPrice": "$273.87",
                    "pricingName": "deserunt voluptate commodo"
                },
                "pricingOptions": [
                    {
                        "duration": 379,
                        "priceType": "From",
                        "price": "$224.25",
                        "specialPrice": "$343.57",
                        "pricingName": "id nostrud Lorem"
                    },
                    {
                        "duration": 319,
                        "priceType": "Fixed",
                        "price": "$53.95",
                        "specialPrice": "$170.33",
                        "pricingName": "sunt pariatur mollit"
                    },
                    {
                        "duration": 316,
                        "priceType": "From",
                        "price": "$380.46",
                        "specialPrice": "$232.12",
                        "pricingName": "magna tempor minim"
                    },
                    {
                        "duration": 285,
                        "priceType": "Fixed",
                        "price": "$44.71",
                        "specialPrice": "$385.74",
                        "pricingName": "duis do voluptate"
                    },
                    {
                        "duration": 359,
                        "priceType": "From",
                        "price": "$313.18",
                        "specialPrice": "$341.92",
                        "pricingName": "eiusmod id non"
                    },
                    {
                        "duration": 61,
                        "priceType": "Fixed",
                        "price": "$52.57",
                        "specialPrice": "$389.55",
                        "pricingName": "et elit esse"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 59,
                "tags": [
                    "esse",
                    "in",
                    "laboris",
                    "laborum"
                ]
            },
            {
                "name": "eu aliqua nisi laborum veniam",
                "category": "id ipsum quis",
                "treatment": "",
                "description": "Incididunt minim ea cupidatat reprehenderit et sint enim duis cupidatat aliqua laborum labore. Cillum tempor reprehenderit dolor est fugiat qui id occaecat qui. Lorem velit minim eiusmod minim ex ad anim ipsum minim laboris commodo consectetur nisi. Labore veniam ea Lorem amet nulla reprehenderit ea. Laborum occaecat mollit sint ad cillum duis laboris eu adipisicing. Elit aute ad esse consectetur nisi velit nostrud fugiat irure Lorem proident. Laboris laboris sint veniam excepteur ex ea anim velit fugiat mollit.\r\nCillum ex ea amet velit exercitation ea. Id velit laboris aute quis. Voluptate sunt mollit proident mollit aliquip elit adipisicing veniam nostrud do est reprehenderit qui irure. Minim ea magna culpa est consequat. Cupidatat in est Lorem amet commodo deserunt. Labore consequat velit ut qui irure exercitation ad labore sint.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 210,
                    "priceType": "Fixed",
                    "price": "$188.68",
                    "specialPrice": "$365.65",
                    "pricingName": "Lorem Lorem ad"
                },
                "pricingOptions": [
                    {
                        "duration": 282,
                        "priceType": "From",
                        "price": "$65.93",
                        "specialPrice": "$75.62",
                        "pricingName": "pariatur reprehenderit id"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 45,
                "tags": [
                    "tempor",
                    "ea",
                    "veniam",
                    "ex",
                    "aliquip",
                    "reprehenderit"
                ]
            },
            {
                "name": "do aliquip reprehenderit anim aliquip",
                "category": "id ut dolore",
                "treatment": "",
                "description": "Veniam deserunt nisi anim esse. Qui elit cupidatat magna amet ipsum labore nulla. Incididunt nulla do anim consectetur cupidatat proident consectetur sint. Nisi sunt laborum officia deserunt eu est elit ad aute nulla incididunt et. Esse quis ullamco labore elit ad. Proident cupidatat eu enim pariatur officia id velit tempor minim exercitation mollit dolore tempor esse. Excepteur aliquip labore duis ut tempor velit voluptate cupidatat consequat.\r\nMollit magna sint nostrud eu tempor ullamco proident. Pariatur commodo et ut id. Mollit id eiusmod ipsum adipisicing occaecat. Sit aute commodo sunt do ea enim pariatur. Consectetur id nostrud reprehenderit ad veniam. Minim veniam mollit dolore do quis est.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 334,
                    "priceType": "Fixed",
                    "price": "$124.93",
                    "specialPrice": "$399.25",
                    "pricingName": "consectetur cillum aute"
                },
                "pricingOptions": [
                    {
                        "duration": 49,
                        "priceType": "Fixed",
                        "price": "$152.37",
                        "specialPrice": "$204.30",
                        "pricingName": "ipsum ad commodo"
                    },
                    {
                        "duration": 272,
                        "priceType": "Fixed",
                        "price": "$70.88",
                        "specialPrice": "$37.24",
                        "pricingName": "minim elit cupidatat"
                    },
                    {
                        "duration": 277,
                        "priceType": "From",
                        "price": "$379.70",
                        "specialPrice": "$160.28",
                        "pricingName": "occaecat nostrud culpa"
                    },
                    {
                        "duration": 311,
                        "priceType": "From",
                        "price": "$298.22",
                        "specialPrice": "$84.41",
                        "pricingName": "ut excepteur ea"
                    },
                    {
                        "duration": 38,
                        "priceType": "From",
                        "price": "$170.76",
                        "specialPrice": "$384.62",
                        "pricingName": "nulla irure minim"
                    },
                    {
                        "duration": 144,
                        "priceType": "Fixed",
                        "price": "$72.56",
                        "specialPrice": "$261.49",
                        "pricingName": "eu do sunt"
                    },
                    {
                        "duration": 372,
                        "priceType": "Fixed",
                        "price": "$22.06",
                        "specialPrice": "$224.21",
                        "pricingName": "voluptate eiusmod duis"
                    },
                    {
                        "duration": 300,
                        "priceType": "From",
                        "price": "$223.57",
                        "specialPrice": "$102.24",
                        "pricingName": "sint quis pariatur"
                    },
                    {
                        "duration": 365,
                        "priceType": "From",
                        "price": "$234.55",
                        "specialPrice": "$236.10",
                        "pricingName": "sit dolor est"
                    },
                    {
                        "duration": 136,
                        "priceType": "From",
                        "price": "$122.07",
                        "specialPrice": "$68.82",
                        "pricingName": "labore proident elit"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 34,
                "tags": [
                    "dolore",
                    "commodo",
                    "nisi",
                    "cillum",
                    "ea",
                    "dolore",
                    "amet"
                ]
            },
            {
                "name": "velit elit commodo incididunt ut",
                "category": "ex ea enim",
                "treatment": "",
                "description": "Excepteur commodo laboris irure quis dolore do occaecat cillum voluptate ullamco proident voluptate esse. Cupidatat voluptate id exercitation culpa proident sunt consequat sint duis amet. Do id ullamco duis deserunt non in proident adipisicing enim culpa laborum dolor culpa cupidatat. Deserunt sint pariatur officia nostrud nostrud tempor adipisicing.\r\nNisi in nostrud reprehenderit veniam eiusmod ut nostrud fugiat dolore quis ex nostrud amet consequat. Voluptate ad sint incididunt sunt magna sint qui proident. Dolor pariatur ad aliqua non consequat consequat velit ipsum anim eiusmod labore. Nostrud consequat irure elit reprehenderit anim incididunt labore adipisicing fugiat dolore incididunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 36,
                    "priceType": "From",
                    "price": "$38.44",
                    "specialPrice": "$285.66",
                    "pricingName": "cillum eu amet"
                },
                "pricingOptions": [
                    {
                        "duration": 296,
                        "priceType": "From",
                        "price": "$340.69",
                        "specialPrice": "$346.82",
                        "pricingName": "deserunt deserunt nostrud"
                    },
                    {
                        "duration": 32,
                        "priceType": "Fixed",
                        "price": "$227.58",
                        "specialPrice": "$201.09",
                        "pricingName": "sint pariatur irure"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 33,
                "tags": [
                    "quis",
                    "proident",
                    "non",
                    "officia",
                    "aliqua",
                    "dolor",
                    "eu"
                ]
            },
            {
                "name": "labore laborum eu minim laboris",
                "category": "cupidatat dolor amet",
                "treatment": "",
                "description": "Dolor aliquip tempor et ipsum occaecat mollit veniam esse deserunt ex do. Exercitation consequat eu pariatur ut. Esse duis dolor est cupidatat aliqua id consequat pariatur proident ad consequat magna ut ex. Aliquip nostrud anim officia ipsum culpa Lorem. Officia sunt laboris consectetur ullamco aliquip eiusmod proident anim nisi adipisicing proident excepteur aliqua velit. Ullamco deserunt Lorem occaecat eiusmod in duis ex et enim ex. Lorem id occaecat voluptate magna commodo cupidatat labore excepteur reprehenderit non ut officia.\r\nAnim cupidatat id do velit amet. Ipsum aliqua irure pariatur est excepteur. Voluptate do exercitation ipsum est.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 302,
                    "priceType": "Fixed",
                    "price": "$55.06",
                    "specialPrice": "$114.70",
                    "pricingName": "reprehenderit occaecat laboris"
                },
                "pricingOptions": [
                    {
                        "duration": 218,
                        "priceType": "From",
                        "price": "$170.43",
                        "specialPrice": "$109.42",
                        "pricingName": "mollit in proident"
                    },
                    {
                        "duration": 26,
                        "priceType": "From",
                        "price": "$108.91",
                        "specialPrice": "$70.34",
                        "pricingName": "aliqua qui labore"
                    },
                    {
                        "duration": 235,
                        "priceType": "From",
                        "price": "$144.56",
                        "specialPrice": "$317.88",
                        "pricingName": "incididunt adipisicing qui"
                    },
                    {
                        "duration": 134,
                        "priceType": "Fixed",
                        "price": "$112.80",
                        "specialPrice": "$268.04",
                        "pricingName": "pariatur quis nostrud"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 20,
                "tags": [
                    "sit",
                    "duis",
                    "sunt",
                    "tempor",
                    "elit",
                    "anim",
                    "qui"
                ]
            }
        ]
    },
    {
        "_id": "60935e046b8cd18383b72b02",
        "email": "carolinamejia@comtract.com",
        "bio": "Consequat nisi proident ut nisi elit culpa.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Pushcart",
        "address": {
            "street": "Florence Avenue",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.69276,
            "longitude": -73.47588
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "cupidatat ex sunt",
                "description": "Deserunt eu non do tempor laborum aute. Cupidatat Lorem sint amet dolor commodo veniam consectetur et. Et ullamco aute ut esse pariatur. Voluptate nostrud excepteur non nostrud. Et officia id mollit fugiat qui irure anim est irure ipsum nulla. Ullamco sunt sunt in voluptate duis ad ut quis Lorem ad mollit incididunt.\r\n"
            },
            {
                "name": "incididunt aliquip",
                "description": ""
            },
            {
                "name": "Lorem adipisicing nostrud voluptate",
                "description": "Cupidatat Lorem anim cupidatat Lorem sint id officia sint duis do. Dolor non ut ullamco labore adipisicing laborum Lorem proident. Exercitation incididunt consectetur anim ipsum labore consequat fugiat do velit qui deserunt nostrud excepteur ut. Irure Lorem ipsum in magna fugiat deserunt velit mollit dolor amet. Eu ad deserunt cillum cupidatat ad eiusmod dolore tempor ipsum consequat exercitation nulla.\r\nQuis consectetur aliqua enim esse enim. Excepteur amet esse nostrud exercitation esse irure irure non aliqua commodo veniam occaecat culpa magna. Fugiat veniam magna duis est officia fugiat occaecat non amet id irure sit. Fugiat consectetur elit voluptate consequat ad anim irure. Tempor cupidatat labore laboris ad dolor deserunt sit fugiat qui mollit cupidatat.\r\nNon ut eu velit ullamco exercitation esse ut ex labore elit voluptate. Aliquip veniam sunt velit elit aliqua deserunt proident adipisicing incididunt est nostrud enim. Veniam nostrud exercitation voluptate tempor sunt consectetur exercitation pariatur consectetur esse veniam pariatur ad.\r\n"
            }
        ],
        "services": [
            {
                "name": "ut ea reprehenderit nisi duis",
                "category": "proident cillum adipisicing",
                "treatment": "",
                "description": "Ullamco consectetur culpa laboris in minim amet aliquip tempor non magna eu. Nisi sunt sint velit ipsum nisi cupidatat. Voluptate est fugiat eu nostrud laboris exercitation aliquip ea exercitation laboris deserunt deserunt. Elit voluptate id nulla laborum irure adipisicing ad tempor pariatur culpa Lorem in. Aliqua do sint dolor aute voluptate ullamco in. Cillum ullamco nostrud ut nostrud est eiusmod.\r\nVoluptate esse eiusmod eiusmod consectetur laborum adipisicing elit dolor est aliqua aute Lorem. Exercitation quis aute excepteur proident cupidatat ea irure deserunt adipisicing et amet in eiusmod. Labore ad tempor laborum excepteur in. Deserunt enim occaecat nulla eu enim dolor excepteur anim excepteur exercitation incididunt. Laboris adipisicing amet ut nisi magna. Minim pariatur aliqua ipsum officia amet sunt minim consequat anim laborum nisi. Elit exercitation nostrud duis voluptate occaecat voluptate pariatur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 256,
                    "priceType": "From",
                    "price": "$78.48",
                    "specialPrice": "$107.61",
                    "pricingName": "velit adipisicing laborum"
                },
                "pricingOptions": [
                    {
                        "duration": 141,
                        "priceType": "Fixed",
                        "price": "$131.10",
                        "specialPrice": "$144.75",
                        "pricingName": "officia aliquip commodo"
                    },
                    {
                        "duration": 334,
                        "priceType": "From",
                        "price": "$32.62",
                        "specialPrice": "$308.92",
                        "pricingName": "ipsum dolore do"
                    },
                    {
                        "duration": 178,
                        "priceType": "Fixed",
                        "price": "$370.35",
                        "specialPrice": "$378.41",
                        "pricingName": "ut et proident"
                    },
                    {
                        "duration": 147,
                        "priceType": "From",
                        "price": "$332.66",
                        "specialPrice": "$44.63",
                        "pricingName": "aliquip eu laboris"
                    },
                    {
                        "duration": 376,
                        "priceType": "Fixed",
                        "price": "$371.93",
                        "specialPrice": "$372.67",
                        "pricingName": "eu est sint"
                    },
                    {
                        "duration": 366,
                        "priceType": "Fixed",
                        "price": "$95.44",
                        "specialPrice": "$205.75",
                        "pricingName": "proident velit consequat"
                    },
                    {
                        "duration": 146,
                        "priceType": "Fixed",
                        "price": "$392.63",
                        "specialPrice": "$193.47",
                        "pricingName": "magna sunt sit"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 30,
                "tags": [
                    "officia",
                    "dolor",
                    "laborum",
                    "eiusmod",
                    "Lorem"
                ]
            },
            {
                "name": "ullamco cillum anim ut sint",
                "category": "do ad minim",
                "treatment": "",
                "description": "Adipisicing deserunt est pariatur amet culpa laboris officia nisi. Minim non nulla esse ut sint cupidatat esse dolor et exercitation mollit excepteur. Dolor et elit Lorem tempor ad aliquip magna ad aute cupidatat veniam. Ex sint excepteur id in officia id nostrud sint dolore deserunt mollit ullamco est amet. Amet eiusmod ea aliquip ullamco dolore. Lorem id fugiat excepteur deserunt et in occaecat adipisicing officia.\r\nUt do est excepteur veniam veniam esse Lorem eiusmod voluptate. Tempor sunt elit dolore pariatur amet irure reprehenderit aute cupidatat sunt pariatur sint irure. Sunt ipsum aliqua mollit occaecat.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 254,
                    "priceType": "From",
                    "price": "$240.16",
                    "specialPrice": "$231.66",
                    "pricingName": "consequat deserunt qui"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": true,
                "extraTime": 59,
                "tags": [
                    "nostrud",
                    "cillum",
                    "amet",
                    "voluptate"
                ]
            },
            {
                "name": "id laboris duis consectetur esse",
                "category": "nulla sunt eu",
                "treatment": "",
                "description": "Dolor proident ut nisi nisi dolore adipisicing officia sit. Tempor laborum cupidatat ea quis sunt aliqua laboris sit occaecat excepteur Lorem. Dolore consectetur labore tempor laboris minim. Commodo commodo commodo eu nisi veniam quis. Ut laboris ad irure do deserunt occaecat anim ex labore anim quis ex aute amet. Sunt quis velit et ut amet.\r\nQui laborum do id voluptate cillum id sit minim laborum culpa mollit id eu minim. Nulla non amet non aliquip aute ex anim esse occaecat amet incididunt irure dolore. Lorem ad consequat aliqua magna culpa. Aliqua Lorem excepteur sit anim. Enim irure aliqua sint ipsum ut occaecat ex dolor laboris in magna ut deserunt esse.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 312,
                    "priceType": "Fixed",
                    "price": "$260.63",
                    "specialPrice": "$166.26",
                    "pricingName": "enim culpa enim"
                },
                "pricingOptions": [
                    {
                        "duration": 175,
                        "priceType": "From",
                        "price": "$134.34",
                        "specialPrice": "$294.61",
                        "pricingName": "cillum ullamco amet"
                    },
                    {
                        "duration": 378,
                        "priceType": "From",
                        "price": "$147.42",
                        "specialPrice": "$136.28",
                        "pricingName": "labore minim deserunt"
                    },
                    {
                        "duration": 61,
                        "priceType": "From",
                        "price": "$263.41",
                        "specialPrice": "$360.63",
                        "pricingName": "aute deserunt nostrud"
                    },
                    {
                        "duration": 210,
                        "priceType": "From",
                        "price": "$200.89",
                        "specialPrice": "$134.29",
                        "pricingName": "occaecat irure in"
                    },
                    {
                        "duration": 145,
                        "priceType": "From",
                        "price": "$286.78",
                        "specialPrice": "$396.74",
                        "pricingName": "ad labore et"
                    },
                    {
                        "duration": 93,
                        "priceType": "From",
                        "price": "$137.89",
                        "specialPrice": "$209.64",
                        "pricingName": "in pariatur ad"
                    },
                    {
                        "duration": 286,
                        "priceType": "From",
                        "price": "$385.06",
                        "specialPrice": "$189.04",
                        "pricingName": "irure esse dolor"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 25,
                "tags": [
                    "commodo",
                    "exercitation"
                ]
            },
            {
                "name": "sit reprehenderit esse incididunt velit",
                "category": "magna aute occaecat",
                "treatment": "",
                "description": "Ad et proident aliqua esse consectetur consectetur. Laboris cillum in ipsum anim anim esse deserunt laboris eu qui. Est nostrud esse culpa minim qui qui nostrud laboris fugiat ipsum. Nostrud anim culpa fugiat aute non esse proident do.\r\nEnim pariatur elit et aliquip ad minim. Est aliquip ullamco adipisicing ex et. Dolor voluptate id Lorem ut cillum amet culpa. Sint cupidatat pariatur aute irure dolore Lorem eu quis ea. Quis quis et incididunt tempor exercitation incididunt consectetur laboris ut.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 248,
                    "priceType": "From",
                    "price": "$206.00",
                    "specialPrice": "$293.77",
                    "pricingName": "aliqua non id"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": true,
                "extraTime": 49,
                "tags": [
                    "incididunt",
                    "officia",
                    "fugiat",
                    "elit",
                    "nostrud"
                ]
            },
            {
                "name": "cupidatat adipisicing qui aliquip consequat",
                "category": "ut sunt dolor",
                "treatment": "",
                "description": "Consequat veniam qui officia ullamco Lorem labore. Magna ad nulla consectetur tempor aliquip eu ipsum mollit tempor. Deserunt dolor cupidatat exercitation dolore. Non ex mollit anim sint Lorem ad incididunt officia reprehenderit sint laborum est cupidatat. Qui incididunt sunt amet consequat ipsum pariatur id minim nulla. Lorem cupidatat labore mollit elit pariatur commodo labore non. Consequat non magna officia nisi.\r\nNisi consectetur consequat adipisicing voluptate elit laborum anim commodo qui commodo. Nulla id dolor laboris excepteur minim nulla ex fugiat. Laboris do duis minim non elit pariatur nisi pariatur minim. Occaecat cupidatat qui labore est veniam irure aliqua aute enim. Laborum adipisicing mollit id veniam pariatur ullamco ex culpa labore. Culpa velit id sit magna elit. Aliquip esse nostrud ex ullamco adipisicing.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 238,
                    "priceType": "Fixed",
                    "price": "$82.01",
                    "specialPrice": "$306.73",
                    "pricingName": "excepteur Lorem occaecat"
                },
                "pricingOptions": [
                    {
                        "duration": 175,
                        "priceType": "From",
                        "price": "$134.42",
                        "specialPrice": "$52.26",
                        "pricingName": "ullamco sit reprehenderit"
                    },
                    {
                        "duration": 393,
                        "priceType": "From",
                        "price": "$133.08",
                        "specialPrice": "$82.11",
                        "pricingName": "commodo pariatur mollit"
                    },
                    {
                        "duration": 361,
                        "priceType": "From",
                        "price": "$189.81",
                        "specialPrice": "$378.42",
                        "pricingName": "nostrud voluptate incididunt"
                    },
                    {
                        "duration": 67,
                        "priceType": "From",
                        "price": "$129.50",
                        "specialPrice": "$209.61",
                        "pricingName": "minim exercitation ad"
                    },
                    {
                        "duration": 203,
                        "priceType": "From",
                        "price": "$350.04",
                        "specialPrice": "$280.40",
                        "pricingName": "quis consectetur ad"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 36,
                "tags": [
                    "commodo",
                    "nostrud",
                    "id",
                    "nostrud"
                ]
            }
        ]
    },
    {
        "_id": "60935e04c1098e6b02814655",
        "email": "carolinamejia@pushcart.com",
        "bio": "Quis nisi nisi cillum proident et ipsum nostrud aute adipisicing voluptate pariatur deserunt ipsum.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Savvy",
        "address": {
            "street": "Barwell Terrace",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.66276,
            "longitude": -73.67677
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "commodo cillum ut",
                "description": "Aliqua id aliqua cupidatat laboris consequat enim dolor anim culpa laboris irure adipisicing cupidatat. Eiusmod tempor ea ullamco ipsum ipsum. Sit irure laboris commodo quis nisi occaecat. Id qui esse ut officia.\r\n"
            },
            {
                "name": "incididunt duis",
                "description": ""
            },
            {
                "name": "cillum adipisicing labore elit",
                "description": "Veniam laborum commodo pariatur nostrud pariatur. Veniam irure ullamco veniam eiusmod anim cillum officia et fugiat ex dolore deserunt dolor. Occaecat nisi consectetur nostrud eu magna ipsum. Quis sit ullamco in est exercitation exercitation incididunt non magna non. Excepteur tempor commodo sint fugiat excepteur exercitation consectetur. In sunt incididunt duis et est voluptate consequat sunt irure duis.\r\nVeniam dolore enim elit minim nisi pariatur eiusmod id Lorem Lorem. Ex incididunt enim est reprehenderit. Irure irure dolore eiusmod ex voluptate labore sit anim nulla officia Lorem laborum. Cillum fugiat exercitation aute irure amet non magna tempor voluptate. Enim dolore id eu consequat nisi do deserunt nulla sint.\r\nReprehenderit adipisicing laboris ullamco sit aliquip excepteur culpa ad mollit in ut pariatur officia labore. Laborum consequat minim ipsum consequat voluptate. Sit aute in id nulla nostrud.\r\n"
            }
        ],
        "services": [
            {
                "name": "elit ullamco laboris do voluptate",
                "category": "proident occaecat proident",
                "treatment": "",
                "description": "Labore labore ullamco ut occaecat amet proident voluptate nostrud. Labore amet aliqua id laborum elit est ex proident non ex incididunt non. Pariatur sit incididunt adipisicing consectetur proident nostrud ad voluptate consequat commodo dolor aliquip laboris deserunt. Minim sint magna ad nostrud cillum veniam ipsum. Velit aliqua sint laboris ad velit irure excepteur aliquip ex sit nulla reprehenderit laboris.\r\nDo duis quis fugiat laboris sunt culpa laborum laboris pariatur anim occaecat mollit. Nulla elit reprehenderit dolore ipsum. Dolore fugiat non id Lorem quis ea mollit nisi ad aute nulla ut magna duis.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 190,
                    "priceType": "Fixed",
                    "price": "$281.14",
                    "specialPrice": "$254.99",
                    "pricingName": "fugiat est Lorem"
                },
                "pricingOptions": [
                    {
                        "duration": 330,
                        "priceType": "Fixed",
                        "price": "$373.73",
                        "specialPrice": "$252.20",
                        "pricingName": "sint reprehenderit consectetur"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 23,
                "tags": [
                    "non",
                    "occaecat"
                ]
            },
            {
                "name": "et fugiat sit quis anim",
                "category": "excepteur non tempor",
                "treatment": "",
                "description": "Aliquip magna reprehenderit ea irure deserunt adipisicing id ad fugiat. Aliquip incididunt deserunt aliquip consectetur qui pariatur adipisicing quis adipisicing non eiusmod dolor incididunt magna. Dolore occaecat ut Lorem magna mollit fugiat amet. In reprehenderit eiusmod aute esse aute. Amet esse sit nulla laborum non. Reprehenderit reprehenderit cupidatat laborum do aliquip sunt veniam ad consectetur culpa sit aliquip. Nisi veniam pariatur nostrud pariatur in sunt consequat.\r\nAute ad voluptate id ea labore do excepteur qui cillum ut reprehenderit cupidatat. In voluptate ipsum dolore cillum consectetur. Aliquip veniam sint excepteur sit culpa voluptate deserunt ad irure sint reprehenderit tempor ut proident.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 290,
                    "priceType": "Fixed",
                    "price": "$123.56",
                    "specialPrice": "$233.36",
                    "pricingName": "qui tempor dolore"
                },
                "pricingOptions": [
                    {
                        "duration": 365,
                        "priceType": "From",
                        "price": "$193.64",
                        "specialPrice": "$139.71",
                        "pricingName": "laborum aliqua qui"
                    },
                    {
                        "duration": 355,
                        "priceType": "Fixed",
                        "price": "$72.40",
                        "specialPrice": "$333.60",
                        "pricingName": "sint dolor nisi"
                    },
                    {
                        "duration": 301,
                        "priceType": "From",
                        "price": "$77.73",
                        "specialPrice": "$142.11",
                        "pricingName": "officia enim ex"
                    },
                    {
                        "duration": 71,
                        "priceType": "From",
                        "price": "$158.75",
                        "specialPrice": "$295.16",
                        "pricingName": "fugiat commodo culpa"
                    },
                    {
                        "duration": 387,
                        "priceType": "From",
                        "price": "$46.33",
                        "specialPrice": "$278.25",
                        "pricingName": "velit ad elit"
                    },
                    {
                        "duration": 370,
                        "priceType": "From",
                        "price": "$328.83",
                        "specialPrice": "$396.80",
                        "pricingName": "cillum sit aute"
                    },
                    {
                        "duration": 367,
                        "priceType": "Fixed",
                        "price": "$384.10",
                        "specialPrice": "$349.08",
                        "pricingName": "consectetur cupidatat enim"
                    },
                    {
                        "duration": 274,
                        "priceType": "From",
                        "price": "$148.26",
                        "specialPrice": "$200.95",
                        "pricingName": "nulla consectetur qui"
                    },
                    {
                        "duration": 254,
                        "priceType": "Fixed",
                        "price": "$387.57",
                        "specialPrice": "$128.05",
                        "pricingName": "voluptate veniam aliqua"
                    },
                    {
                        "duration": 263,
                        "priceType": "Fixed",
                        "price": "$146.53",
                        "specialPrice": "$245.27",
                        "pricingName": "ea deserunt culpa"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 37,
                "tags": [
                    "do",
                    "ex"
                ]
            }
        ]
    },
    {
        "_id": "60935e04dd6e9c1e1bbb1818",
        "email": "carolinamejia@savvy.com",
        "bio": "Qui pariatur est Lorem proident reprehenderit culpa culpa amet.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Bedder",
        "address": {
            "street": "Schroeders Avenue",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.63125,
            "longitude": -73.53433
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "consequat occaecat qui",
                "description": "Fugiat minim occaecat deserunt eiusmod exercitation non incididunt aliqua enim nulla aliqua. Qui elit nulla adipisicing commodo ad aliquip ad proident elit culpa elit dolore qui enim. Culpa mollit cupidatat et eiusmod deserunt nulla quis reprehenderit reprehenderit est labore exercitation. Veniam exercitation ipsum amet adipisicing veniam ullamco do. Adipisicing est enim Lorem ullamco sit qui Lorem. Id laborum amet proident cupidatat dolor esse ea nisi.\r\n"
            },
            {
                "name": "nostrud enim",
                "description": ""
            },
            {
                "name": "esse sunt aliqua laborum",
                "description": "Est ut ut velit nisi veniam sint cupidatat. Esse exercitation id aute nisi ipsum duis mollit. Enim dolore aliqua anim anim mollit ipsum veniam nulla eiusmod. Enim ex laboris duis aute Lorem ex pariatur laboris fugiat do qui consequat est.\r\nPariatur qui veniam occaecat cupidatat. Cupidatat ea id consequat ea minim voluptate. Et exercitation dolore reprehenderit veniam eu ut velit cillum irure qui officia anim deserunt. Deserunt pariatur occaecat tempor ex exercitation mollit magna. Do labore mollit dolor aliqua eiusmod.\r\nDolor ex Lorem quis reprehenderit nisi do ea. Elit dolor tempor aliqua dolore aute id voluptate adipisicing minim voluptate cillum. Elit proident velit sit aute eu sit veniam. Incididunt aliquip excepteur consequat cillum et nulla reprehenderit ullamco est pariatur sit et reprehenderit elit. Nostrud deserunt dolor tempor tempor mollit exercitation dolor. Nisi sunt consectetur non ex consectetur adipisicing. Lorem nulla ex ipsum elit pariatur duis amet consequat tempor nostrud Lorem nulla.\r\n"
            }
        ],
        "services": [
            {
                "name": "aliquip cupidatat quis et nisi",
                "category": "velit amet non",
                "treatment": "",
                "description": "Cupidatat commodo occaecat non nulla ad. Occaecat duis irure minim ad culpa ullamco commodo nulla velit voluptate qui aute est. Nisi sunt cillum voluptate commodo dolore cillum.\r\nLaboris officia amet excepteur Lorem aliqua mollit ex. Reprehenderit consequat nulla duis mollit adipisicing nulla dolor laborum eiusmod quis laboris reprehenderit. Ad consectetur elit id consequat duis quis exercitation est mollit proident eu labore ipsum.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 323,
                    "priceType": "From",
                    "price": "$199.87",
                    "specialPrice": "$248.85",
                    "pricingName": "eiusmod consectetur occaecat"
                },
                "pricingOptions": [
                    {
                        "duration": 354,
                        "priceType": "From",
                        "price": "$106.28",
                        "specialPrice": "$121.64",
                        "pricingName": "adipisicing consectetur consequat"
                    },
                    {
                        "duration": 82,
                        "priceType": "From",
                        "price": "$204.80",
                        "specialPrice": "$77.63",
                        "pricingName": "laborum culpa nulla"
                    },
                    {
                        "duration": 235,
                        "priceType": "Fixed",
                        "price": "$72.33",
                        "specialPrice": "$200.69",
                        "pricingName": "irure anim ut"
                    },
                    {
                        "duration": 155,
                        "priceType": "Fixed",
                        "price": "$110.34",
                        "specialPrice": "$162.46",
                        "pricingName": "non non ullamco"
                    },
                    {
                        "duration": 334,
                        "priceType": "Fixed",
                        "price": "$148.15",
                        "specialPrice": "$398.07",
                        "pricingName": "Lorem consequat officia"
                    },
                    {
                        "duration": 47,
                        "priceType": "Fixed",
                        "price": "$232.45",
                        "specialPrice": "$262.38",
                        "pricingName": "tempor enim tempor"
                    },
                    {
                        "duration": 240,
                        "priceType": "From",
                        "price": "$84.87",
                        "specialPrice": "$101.35",
                        "pricingName": "dolore culpa culpa"
                    },
                    {
                        "duration": 52,
                        "priceType": "Fixed",
                        "price": "$198.15",
                        "specialPrice": "$179.91",
                        "pricingName": "minim et mollit"
                    },
                    {
                        "duration": 377,
                        "priceType": "Fixed",
                        "price": "$134.19",
                        "specialPrice": "$203.90",
                        "pricingName": "veniam sint occaecat"
                    },
                    {
                        "duration": 43,
                        "priceType": "From",
                        "price": "$274.21",
                        "specialPrice": "$376.15",
                        "pricingName": "elit fugiat cupidatat"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 45,
                "tags": [
                    "eiusmod",
                    "qui",
                    "magna",
                    "deserunt"
                ]
            },
            {
                "name": "quis est laborum commodo consectetur",
                "category": "qui in non",
                "treatment": "",
                "description": "Labore laborum officia amet incididunt amet id. Laboris fugiat aliqua dolore occaecat magna eiusmod amet et incididunt nisi. Commodo magna sint irure reprehenderit occaecat eu exercitation labore adipisicing eiusmod. Sit labore nulla quis consectetur dolor excepteur fugiat qui. Incididunt cupidatat in laborum Lorem excepteur aliquip voluptate nostrud. Commodo velit enim tempor incididunt anim. Nulla occaecat eiusmod velit aliqua labore voluptate esse exercitation sit sint cupidatat laborum.\r\nEx aliquip fugiat laboris esse aliquip. Duis tempor enim sunt voluptate qui proident pariatur sunt nulla labore ipsum officia. Sit cillum ut deserunt velit consectetur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 378,
                    "priceType": "Fixed",
                    "price": "$376.86",
                    "specialPrice": "$242.98",
                    "pricingName": "ea officia dolore"
                },
                "pricingOptions": [
                    {
                        "duration": 28,
                        "priceType": "From",
                        "price": "$146.74",
                        "specialPrice": "$136.00",
                        "pricingName": "proident reprehenderit labore"
                    },
                    {
                        "duration": 388,
                        "priceType": "Fixed",
                        "price": "$113.69",
                        "specialPrice": "$207.66",
                        "pricingName": "adipisicing duis sit"
                    },
                    {
                        "duration": 361,
                        "priceType": "Fixed",
                        "price": "$326.46",
                        "specialPrice": "$357.32",
                        "pricingName": "sit non sint"
                    },
                    {
                        "duration": 188,
                        "priceType": "From",
                        "price": "$395.29",
                        "specialPrice": "$63.18",
                        "pricingName": "in ea aliquip"
                    },
                    {
                        "duration": 191,
                        "priceType": "Fixed",
                        "price": "$235.30",
                        "specialPrice": "$271.51",
                        "pricingName": "adipisicing et dolore"
                    },
                    {
                        "duration": 265,
                        "priceType": "Fixed",
                        "price": "$232.86",
                        "specialPrice": "$145.05",
                        "pricingName": "ullamco voluptate adipisicing"
                    },
                    {
                        "duration": 67,
                        "priceType": "From",
                        "price": "$269.98",
                        "specialPrice": "$204.36",
                        "pricingName": "consequat cillum dolore"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 58,
                "tags": [
                    "qui",
                    "consectetur",
                    "anim",
                    "exercitation",
                    "occaecat",
                    "Lorem"
                ]
            },
            {
                "name": "irure reprehenderit do reprehenderit eu",
                "category": "magna veniam tempor",
                "treatment": "",
                "description": "Laborum esse occaecat tempor est ex dolor sint veniam. Ipsum proident dolor veniam non nostrud. Laboris tempor duis aliquip dolor veniam veniam velit quis aliqua esse Lorem consequat. Laborum non Lorem culpa aliqua. Elit nisi adipisicing velit cillum commodo anim eu sunt adipisicing adipisicing voluptate eiusmod. Ea deserunt consectetur pariatur anim.\r\nMagna veniam consectetur et culpa velit incididunt. Cillum culpa exercitation reprehenderit et commodo ad consequat incididunt dolore duis exercitation qui. Excepteur qui adipisicing reprehenderit aliquip dolore quis. Minim consectetur laboris tempor incididunt. Id eiusmod cillum incididunt ipsum adipisicing. Ipsum et excepteur non minim amet. Ut amet consequat ipsum aliquip est sunt nisi cupidatat do nostrud.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 68,
                    "priceType": "Fixed",
                    "price": "$250.61",
                    "specialPrice": "$197.75",
                    "pricingName": "id sunt nulla"
                },
                "pricingOptions": [
                    {
                        "duration": 236,
                        "priceType": "From",
                        "price": "$30.17",
                        "specialPrice": "$251.43",
                        "pricingName": "cillum sunt in"
                    },
                    {
                        "duration": 208,
                        "priceType": "Fixed",
                        "price": "$130.41",
                        "specialPrice": "$66.27",
                        "pricingName": "id velit minim"
                    },
                    {
                        "duration": 355,
                        "priceType": "From",
                        "price": "$294.52",
                        "specialPrice": "$86.87",
                        "pricingName": "culpa in consequat"
                    },
                    {
                        "duration": 209,
                        "priceType": "Fixed",
                        "price": "$38.66",
                        "specialPrice": "$260.90",
                        "pricingName": "quis pariatur ad"
                    },
                    {
                        "duration": 317,
                        "priceType": "Fixed",
                        "price": "$302.94",
                        "specialPrice": "$319.81",
                        "pricingName": "id enim nostrud"
                    },
                    {
                        "duration": 97,
                        "priceType": "From",
                        "price": "$108.70",
                        "specialPrice": "$114.51",
                        "pricingName": "consequat dolore irure"
                    },
                    {
                        "duration": 214,
                        "priceType": "Fixed",
                        "price": "$355.01",
                        "specialPrice": "$67.92",
                        "pricingName": "ex consectetur adipisicing"
                    },
                    {
                        "duration": 213,
                        "priceType": "From",
                        "price": "$312.18",
                        "specialPrice": "$68.85",
                        "pricingName": "occaecat aliquip sit"
                    },
                    {
                        "duration": 282,
                        "priceType": "Fixed",
                        "price": "$186.01",
                        "specialPrice": "$317.97",
                        "pricingName": "anim amet consequat"
                    },
                    {
                        "duration": 277,
                        "priceType": "Fixed",
                        "price": "$152.87",
                        "specialPrice": "$91.26",
                        "pricingName": "dolor consequat mollit"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 30,
                "tags": [
                    "ullamco",
                    "ut",
                    "tempor",
                    "in"
                ]
            },
            {
                "name": "id cupidatat aute qui enim",
                "category": "consectetur et in",
                "treatment": "",
                "description": "Est proident dolore mollit esse consectetur voluptate ex officia esse consectetur reprehenderit elit in exercitation. Quis ea irure consectetur consectetur duis veniam. Amet aliquip cillum aliqua cillum est culpa. Pariatur amet aliquip sint proident sit ad velit deserunt. Velit officia nulla excepteur velit veniam do velit sunt quis elit fugiat eu est sint. Sunt qui aute consequat ut.\r\nDo ut pariatur do id non elit sint et nisi velit consectetur. Velit qui voluptate fugiat ipsum in ea proident. Qui magna aute duis ad irure proident nisi sint fugiat proident tempor qui laboris consectetur. Magna aliquip deserunt consectetur est. Enim amet sunt magna adipisicing amet commodo mollit eiusmod nostrud proident ad occaecat anim dolore.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 121,
                    "priceType": "From",
                    "price": "$327.35",
                    "specialPrice": "$188.50",
                    "pricingName": "aute ullamco in"
                },
                "pricingOptions": [
                    {
                        "duration": 200,
                        "priceType": "Fixed",
                        "price": "$338.75",
                        "specialPrice": "$32.05",
                        "pricingName": "incididunt exercitation eiusmod"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 22,
                "tags": [
                    "voluptate",
                    "incididunt",
                    "aute",
                    "elit",
                    "occaecat",
                    "dolore"
                ]
            },
            {
                "name": "consequat cupidatat magna cillum non",
                "category": "do eu qui",
                "treatment": "",
                "description": "Incididunt labore excepteur sint ex ut voluptate. Aliqua est aute ex deserunt sit id est consequat ad do. Et proident nisi incididunt qui. Aute nulla commodo laboris in ipsum.\r\nId sunt amet officia sunt veniam laborum culpa irure magna elit do cillum ad. Adipisicing eu adipisicing officia ad officia do sit sunt quis. Nulla proident anim eu id pariatur. Aute consectetur sint adipisicing irure anim do ipsum commodo elit. Consectetur nisi tempor deserunt dolor irure commodo. Duis et ea eu cupidatat ea. Consectetur enim excepteur et aliquip consequat commodo sit commodo pariatur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 123,
                    "priceType": "Fixed",
                    "price": "$225.59",
                    "specialPrice": "$320.89",
                    "pricingName": "ex sint eiusmod"
                },
                "pricingOptions": [
                    {
                        "duration": 70,
                        "priceType": "From",
                        "price": "$146.24",
                        "specialPrice": "$197.21",
                        "pricingName": "labore duis amet"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 31,
                "tags": [
                    "amet",
                    "officia",
                    "ullamco",
                    "consectetur",
                    "deserunt",
                    "aliquip",
                    "id"
                ]
            }
        ]
    },
    {
        "_id": "60935e043d1cffb4f4015b76",
        "email": "carolinamejia@bedder.com",
        "bio": "Velit aliquip reprehenderit nisi mollit aute sit proident aliqua.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Sultrax",
        "address": {
            "street": "Charles Place",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.51025,
            "longitude": -73.46546
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "non laboris nisi",
                "description": "Mollit anim nisi est ut enim veniam mollit aliqua exercitation Lorem do. Lorem aliqua duis labore do mollit occaecat consequat sint velit ea. Sunt sit Lorem ad irure labore tempor officia. Ad in consequat ullamco labore elit labore dolor esse ex et aliqua non. Ad commodo deserunt et ullamco reprehenderit duis nulla deserunt deserunt duis reprehenderit culpa. Ut irure consectetur id anim in est veniam. In dolor elit enim do culpa nisi mollit.\r\n"
            },
            {
                "name": "labore cupidatat",
                "description": ""
            },
            {
                "name": "enim incididunt incididunt commodo",
                "description": "Officia veniam consequat ea amet Lorem irure eu est veniam. Lorem non aliquip ullamco nisi quis duis nostrud culpa enim. In laboris incididunt anim quis in officia.\r\nCommodo fugiat duis do dolore culpa minim do eiusmod excepteur aliqua minim non eiusmod. Pariatur ipsum elit do tempor est consectetur aute laboris aute sint ad. Sint sit dolore voluptate excepteur minim enim in mollit nostrud.\r\nCulpa labore do aliqua aliquip. Quis id cillum et eu aliqua id laborum ex excepteur laboris magna. Ex ipsum laborum est elit esse laboris non enim ut.\r\n"
            }
        ],
        "services": [
            {
                "name": "esse nostrud dolor consequat sit",
                "category": "irure aliqua duis",
                "treatment": "",
                "description": "Adipisicing quis laboris adipisicing nostrud dolor aliquip esse enim quis elit deserunt enim consectetur elit. Fugiat proident ipsum nisi adipisicing do deserunt adipisicing culpa dolore nostrud adipisicing deserunt non. Eiusmod dolor fugiat pariatur ullamco est aliqua do. Magna cupidatat excepteur proident sint velit adipisicing eiusmod adipisicing et nulla eu.\r\nSunt nostrud officia non Lorem aliquip deserunt elit sunt sunt fugiat velit dolore. Excepteur enim cupidatat sunt et nisi fugiat anim aliquip proident velit velit velit cillum. Elit esse mollit non pariatur enim veniam et excepteur velit eiusmod aute excepteur non velit. Lorem occaecat est ut ipsum mollit magna commodo magna deserunt cupidatat. Lorem reprehenderit dolore duis commodo sint. Officia exercitation sunt ex voluptate tempor reprehenderit culpa sit ea ad aliqua labore. Deserunt fugiat excepteur nisi id fugiat ipsum minim.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 213,
                    "priceType": "Fixed",
                    "price": "$227.57",
                    "specialPrice": "$115.21",
                    "pricingName": "nisi aliqua sunt"
                },
                "pricingOptions": [
                    {
                        "duration": 112,
                        "priceType": "From",
                        "price": "$32.75",
                        "specialPrice": "$275.70",
                        "pricingName": "magna enim duis"
                    },
                    {
                        "duration": 359,
                        "priceType": "Fixed",
                        "price": "$75.36",
                        "specialPrice": "$98.60",
                        "pricingName": "culpa cillum deserunt"
                    },
                    {
                        "duration": 168,
                        "priceType": "From",
                        "price": "$261.41",
                        "specialPrice": "$80.47",
                        "pricingName": "sunt aute consectetur"
                    },
                    {
                        "duration": 162,
                        "priceType": "Fixed",
                        "price": "$348.31",
                        "specialPrice": "$156.54",
                        "pricingName": "ex ad adipisicing"
                    },
                    {
                        "duration": 290,
                        "priceType": "Fixed",
                        "price": "$275.23",
                        "specialPrice": "$285.54",
                        "pricingName": "ad magna officia"
                    },
                    {
                        "duration": 245,
                        "priceType": "Fixed",
                        "price": "$198.76",
                        "specialPrice": "$194.34",
                        "pricingName": "in labore velit"
                    },
                    {
                        "duration": 288,
                        "priceType": "From",
                        "price": "$224.92",
                        "specialPrice": "$74.90",
                        "pricingName": "aute fugiat ipsum"
                    },
                    {
                        "duration": 65,
                        "priceType": "Fixed",
                        "price": "$72.75",
                        "specialPrice": "$131.55",
                        "pricingName": "non do nulla"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 44,
                "tags": [
                    "eu",
                    "aliqua",
                    "excepteur"
                ]
            },
            {
                "name": "ea aliquip aliquip consequat cupidatat",
                "category": "laboris dolore nisi",
                "treatment": "",
                "description": "Nulla do incididunt laborum ex dolore. Labore laboris ipsum sunt sunt ex excepteur. Nulla esse consequat dolore mollit reprehenderit ut nostrud magna. Ea do pariatur Lorem labore ex ad. Incididunt magna ipsum sunt aute enim ipsum ad ullamco mollit proident voluptate sit. Nostrud aliquip aute quis id sint occaecat. Enim occaecat velit excepteur fugiat veniam.\r\nAliqua deserunt eiusmod excepteur velit minim occaecat. Laborum cillum eiusmod quis Lorem. Et consectetur excepteur fugiat minim consequat. Exercitation consequat sunt nisi adipisicing eu aute minim in est consectetur ex.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 292,
                    "priceType": "From",
                    "price": "$71.93",
                    "specialPrice": "$180.70",
                    "pricingName": "culpa amet est"
                },
                "pricingOptions": [
                    {
                        "duration": 343,
                        "priceType": "From",
                        "price": "$320.39",
                        "specialPrice": "$239.02",
                        "pricingName": "veniam irure nulla"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 33,
                "tags": [
                    "amet",
                    "adipisicing",
                    "in",
                    "est"
                ]
            },
            {
                "name": "sunt ad labore Lorem eiusmod",
                "category": "sint consequat dolore",
                "treatment": "",
                "description": "Fugiat voluptate et id exercitation aliquip laborum non tempor aute sint irure. Mollit laborum veniam tempor sunt. Velit est et sit et irure. Lorem mollit cillum consectetur enim amet eu officia laboris dolore.\r\nSunt exercitation sunt quis et occaecat irure labore officia aliqua ullamco consectetur qui. Qui id elit eu dolore non esse occaecat duis ad aute do dolor irure irure. Sint aute culpa fugiat incididunt tempor ad elit. Occaecat velit dolore aute dolor non mollit proident pariatur non aliqua. Pariatur fugiat est elit laborum Lorem elit ex aute. Tempor aliquip in nostrud dolor do ipsum magna duis dolore.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 202,
                    "priceType": "Fixed",
                    "price": "$207.79",
                    "specialPrice": "$393.07",
                    "pricingName": "quis sunt consectetur"
                },
                "pricingOptions": [
                    {
                        "duration": 219,
                        "priceType": "Fixed",
                        "price": "$274.66",
                        "specialPrice": "$106.92",
                        "pricingName": "laboris commodo pariatur"
                    },
                    {
                        "duration": 94,
                        "priceType": "Fixed",
                        "price": "$206.31",
                        "specialPrice": "$244.03",
                        "pricingName": "laboris consectetur consectetur"
                    },
                    {
                        "duration": 395,
                        "priceType": "From",
                        "price": "$82.38",
                        "specialPrice": "$163.14",
                        "pricingName": "labore elit occaecat"
                    },
                    {
                        "duration": 322,
                        "priceType": "From",
                        "price": "$127.59",
                        "specialPrice": "$308.04",
                        "pricingName": "sit labore labore"
                    },
                    {
                        "duration": 169,
                        "priceType": "Fixed",
                        "price": "$292.34",
                        "specialPrice": "$392.08",
                        "pricingName": "irure amet ea"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 25,
                "tags": [
                    "enim",
                    "non",
                    "excepteur",
                    "consectetur",
                    "cillum",
                    "et",
                    "irure"
                ]
            },
            {
                "name": "pariatur dolore elit consectetur esse",
                "category": "aute deserunt commodo",
                "treatment": "",
                "description": "Consectetur excepteur minim aute velit occaecat in. Tempor aliquip duis in commodo consequat irure elit ad amet est adipisicing. Aute consequat aliquip pariatur eu dolor irure. Tempor id tempor nisi commodo minim aliquip officia incididunt laboris ad veniam. Amet officia tempor ea nisi dolor. Sit aliquip culpa in anim est duis nisi. Aliquip reprehenderit quis excepteur amet minim nostrud sint magna consequat tempor dolor.\r\nOccaecat commodo culpa pariatur occaecat eu consequat velit consectetur veniam nostrud ex mollit. Minim incididunt sint commodo tempor qui. Id eu dolor cupidatat ut aliquip. Non non deserunt est est in aute Lorem anim nostrud cillum occaecat velit velit laborum. Labore et tempor veniam consectetur esse eu dolore laborum incididunt et ipsum. Cupidatat ut excepteur reprehenderit et consequat ex ut Lorem voluptate nostrud incididunt quis exercitation magna.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 264,
                    "priceType": "From",
                    "price": "$37.58",
                    "specialPrice": "$390.21",
                    "pricingName": "fugiat Lorem consequat"
                },
                "pricingOptions": [
                    {
                        "duration": 335,
                        "priceType": "Fixed",
                        "price": "$267.27",
                        "specialPrice": "$53.82",
                        "pricingName": "enim ullamco aliqua"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 27,
                "tags": [
                    "occaecat",
                    "voluptate"
                ]
            }
        ]
    },
    {
        "_id": "60935e04320cb303afd9483e",
        "email": "carolinamejia@sultrax.com",
        "bio": "Consequat amet eu velit sint.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Katakana",
        "address": {
            "street": "Gaylord Drive",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.65546,
            "longitude": -73.44114
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "enim non quis",
                "description": "Eiusmod aliquip dolor consequat incididunt nulla incididunt fugiat. Adipisicing occaecat magna sit excepteur irure officia ullamco sunt qui do culpa esse proident veniam. Nisi non laborum qui sit esse minim veniam dolor exercitation eiusmod duis ea.\r\n"
            },
            {
                "name": "ipsum consectetur",
                "description": ""
            },
            {
                "name": "fugiat nisi est sunt",
                "description": "Nostrud nostrud do sunt cupidatat occaecat deserunt amet fugiat. Sunt quis aliqua consequat non voluptate adipisicing ullamco cillum. Sit magna nostrud excepteur reprehenderit ipsum dolore in consectetur exercitation Lorem ut consectetur amet incididunt. Non dolore laboris quis mollit ipsum enim est. Sint proident deserunt anim incididunt sit ullamco in elit labore ut ex mollit dolor aliqua. Ad labore commodo exercitation anim excepteur qui Lorem aliqua. Aliqua voluptate est sint eiusmod adipisicing nostrud non enim dolor dolore elit.\r\nCupidatat sint sint aliquip ad minim culpa esse voluptate ea duis in. Aliqua elit labore commodo laborum quis tempor. Elit pariatur deserunt id ad eu nostrud esse. Duis ipsum aliquip magna id culpa id. Labore amet ea eiusmod excepteur anim reprehenderit veniam eiusmod veniam do consequat amet esse. Officia est culpa et aute elit reprehenderit Lorem.\r\nIn sint occaecat fugiat veniam. Duis adipisicing consectetur cillum est deserunt sit tempor in aliquip aliquip. Excepteur dolore id proident sint deserunt minim nulla qui aute dolor. Laborum laboris consectetur occaecat nulla elit nostrud anim voluptate fugiat est non minim excepteur. Aliquip sit ullamco cillum incididunt sunt pariatur minim ex. Fugiat pariatur laboris anim in sit. Laborum exercitation enim consequat labore.\r\n"
            }
        ],
        "services": [
            {
                "name": "labore id exercitation velit proident",
                "category": "excepteur cupidatat ullamco",
                "treatment": "",
                "description": "Ut tempor tempor labore ipsum velit commodo ad amet exercitation ex laboris sint culpa nisi. Nisi dolore velit sunt eu. Eu occaecat ipsum consequat magna pariatur sit ut. Qui qui dolore laboris excepteur consequat laborum duis.\r\nAnim pariatur ea commodo incididunt. Eiusmod nisi culpa reprehenderit amet cillum. Dolor ipsum consequat in est occaecat nulla reprehenderit eu dolor. Aute consectetur aute laboris nisi excepteur dolore ullamco do. Sit consectetur aliquip et voluptate labore consectetur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 98,
                    "priceType": "From",
                    "price": "$24.70",
                    "specialPrice": "$258.71",
                    "pricingName": "do quis labore"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": true,
                "extraTime": 23,
                "tags": [
                    "esse",
                    "mollit",
                    "irure",
                    "adipisicing",
                    "occaecat",
                    "adipisicing"
                ]
            },
            {
                "name": "minim reprehenderit ad labore id",
                "category": "cillum Lorem quis",
                "treatment": "",
                "description": "Fugiat quis consectetur deserunt proident velit. Adipisicing minim ea aute labore ad labore fugiat. Non esse id veniam id ex ex laborum. Excepteur nostrud culpa fugiat ut laboris eiusmod officia elit consectetur voluptate veniam ullamco excepteur ipsum. Consequat laborum culpa ea dolore sunt ad exercitation aliqua sunt non ut. Consequat eu do eiusmod ad aute elit Lorem ad occaecat mollit sit irure voluptate.\r\nEa minim ut elit minim esse enim cupidatat magna proident. Est eu ipsum ex incididunt proident ad labore ut occaecat et exercitation do consequat ea. Tempor dolore exercitation occaecat nisi velit mollit do amet ea consequat velit. Fugiat nulla id irure proident officia. Irure ad duis velit occaecat. Esse aliqua dolore et aliquip in mollit dolore non nostrud non. Consectetur deserunt et do mollit dolor laboris dolor excepteur cillum irure duis non.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 155,
                    "priceType": "From",
                    "price": "$113.27",
                    "specialPrice": "$123.50",
                    "pricingName": "in occaecat anim"
                },
                "pricingOptions": [
                    {
                        "duration": 225,
                        "priceType": "From",
                        "price": "$317.79",
                        "specialPrice": "$138.74",
                        "pricingName": "voluptate ipsum mollit"
                    },
                    {
                        "duration": 124,
                        "priceType": "Fixed",
                        "price": "$166.65",
                        "specialPrice": "$96.97",
                        "pricingName": "ex aute aute"
                    },
                    {
                        "duration": 46,
                        "priceType": "From",
                        "price": "$44.55",
                        "specialPrice": "$272.04",
                        "pricingName": "minim dolor occaecat"
                    },
                    {
                        "duration": 64,
                        "priceType": "Fixed",
                        "price": "$227.27",
                        "specialPrice": "$311.10",
                        "pricingName": "officia ut quis"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 31,
                "tags": [
                    "nulla",
                    "sit",
                    "est",
                    "laboris",
                    "exercitation"
                ]
            },
            {
                "name": "fugiat duis reprehenderit enim ut",
                "category": "et nulla laboris",
                "treatment": "",
                "description": "Exercitation eu labore adipisicing ea incididunt. Excepteur officia aliqua veniam anim duis velit cillum et. Aute proident et consectetur sunt eiusmod nostrud labore aliqua ea ea dolor.\r\nIpsum pariatur amet sit proident eiusmod et aliquip. Laborum Lorem sint excepteur laborum sint duis consequat. Aute magna culpa quis elit velit dolor ipsum. Nostrud et laborum sit sint sunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 41,
                    "priceType": "Fixed",
                    "price": "$183.14",
                    "specialPrice": "$319.12",
                    "pricingName": "quis fugiat minim"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": false,
                "extraTime": 54,
                "tags": [
                    "duis",
                    "in",
                    "eiusmod",
                    "deserunt",
                    "pariatur",
                    "ex",
                    "sit"
                ]
            },
            {
                "name": "anim nostrud aliquip ut sint",
                "category": "ex deserunt mollit",
                "treatment": "",
                "description": "Qui magna laboris ea velit laborum excepteur aliquip fugiat ex eu sit. Eu ipsum et quis anim sit. Sit tempor fugiat exercitation dolore nisi eu in voluptate.\r\nDolor exercitation ut occaecat non incididunt commodo laborum officia et. Dolor quis non culpa fugiat voluptate elit ad velit do Lorem. Pariatur est excepteur occaecat sint voluptate nulla enim anim velit. Veniam adipisicing ipsum deserunt dolore cillum esse sunt non laboris cillum voluptate nisi veniam. Est adipisicing ullamco occaecat et. Velit do aute quis minim consequat ea ullamco.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 291,
                    "priceType": "Fixed",
                    "price": "$164.65",
                    "specialPrice": "$192.81",
                    "pricingName": "aliquip velit culpa"
                },
                "pricingOptions": [
                    {
                        "duration": 259,
                        "priceType": "From",
                        "price": "$104.57",
                        "specialPrice": "$385.25",
                        "pricingName": "nulla consequat minim"
                    },
                    {
                        "duration": 155,
                        "priceType": "From",
                        "price": "$83.16",
                        "specialPrice": "$99.58",
                        "pricingName": "reprehenderit non incididunt"
                    },
                    {
                        "duration": 162,
                        "priceType": "Fixed",
                        "price": "$91.10",
                        "specialPrice": "$205.52",
                        "pricingName": "sint laboris adipisicing"
                    },
                    {
                        "duration": 337,
                        "priceType": "From",
                        "price": "$269.12",
                        "specialPrice": "$125.65",
                        "pricingName": "quis minim nostrud"
                    },
                    {
                        "duration": 70,
                        "priceType": "Fixed",
                        "price": "$305.39",
                        "specialPrice": "$236.35",
                        "pricingName": "commodo ullamco duis"
                    },
                    {
                        "duration": 234,
                        "priceType": "From",
                        "price": "$384.60",
                        "specialPrice": "$359.75",
                        "pricingName": "tempor minim et"
                    },
                    {
                        "duration": 342,
                        "priceType": "From",
                        "price": "$160.42",
                        "specialPrice": "$233.09",
                        "pricingName": "ut labore anim"
                    },
                    {
                        "duration": 41,
                        "priceType": "Fixed",
                        "price": "$60.66",
                        "specialPrice": "$32.66",
                        "pricingName": "laboris laborum ea"
                    },
                    {
                        "duration": 36,
                        "priceType": "From",
                        "price": "$298.84",
                        "specialPrice": "$62.99",
                        "pricingName": "laboris et dolor"
                    },
                    {
                        "duration": 104,
                        "priceType": "Fixed",
                        "price": "$108.85",
                        "specialPrice": "$259.19",
                        "pricingName": "enim amet proident"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 38,
                "tags": [
                    "fugiat",
                    "Lorem",
                    "culpa",
                    "culpa",
                    "labore",
                    "in",
                    "ut"
                ]
            },
            {
                "name": "proident proident nostrud sint velit",
                "category": "do amet amet",
                "treatment": "",
                "description": "Ea ipsum ea proident commodo culpa. Dolor minim mollit consectetur consequat. Irure fugiat fugiat fugiat do. Cupidatat incididunt officia ut anim nisi. Commodo quis voluptate laborum velit culpa cillum officia consequat labore nulla mollit consectetur mollit. Velit laboris fugiat pariatur enim ea dolore et. Magna ad minim consequat dolore occaecat anim qui est adipisicing cupidatat anim id laborum veniam.\r\nEiusmod voluptate excepteur proident reprehenderit. Cupidatat pariatur sunt duis ullamco incididunt proident voluptate aliquip. Culpa ea mollit in eiusmod dolor veniam laborum anim nisi ea et fugiat aliquip. Elit sint velit sit culpa ex ut ea. In labore reprehenderit anim aliqua velit in irure reprehenderit dolore Lorem eiusmod mollit voluptate do.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 101,
                    "priceType": "Fixed",
                    "price": "$234.34",
                    "specialPrice": "$389.44",
                    "pricingName": "culpa tempor cupidatat"
                },
                "pricingOptions": [
                    {
                        "duration": 378,
                        "priceType": "Fixed",
                        "price": "$51.39",
                        "specialPrice": "$289.20",
                        "pricingName": "aliquip sint pariatur"
                    },
                    {
                        "duration": 379,
                        "priceType": "From",
                        "price": "$63.06",
                        "specialPrice": "$164.98",
                        "pricingName": "cillum nostrud tempor"
                    },
                    {
                        "duration": 80,
                        "priceType": "From",
                        "price": "$162.24",
                        "specialPrice": "$121.37",
                        "pricingName": "occaecat elit consequat"
                    },
                    {
                        "duration": 317,
                        "priceType": "From",
                        "price": "$66.62",
                        "specialPrice": "$44.04",
                        "pricingName": "proident ex cillum"
                    },
                    {
                        "duration": 211,
                        "priceType": "From",
                        "price": "$372.28",
                        "specialPrice": "$224.95",
                        "pricingName": "dolor deserunt eiusmod"
                    },
                    {
                        "duration": 249,
                        "priceType": "Fixed",
                        "price": "$333.77",
                        "specialPrice": "$320.45",
                        "pricingName": "reprehenderit quis ex"
                    },
                    {
                        "duration": 227,
                        "priceType": "From",
                        "price": "$262.61",
                        "specialPrice": "$280.55",
                        "pricingName": "est ut laborum"
                    },
                    {
                        "duration": 231,
                        "priceType": "From",
                        "price": "$389.27",
                        "specialPrice": "$270.45",
                        "pricingName": "veniam enim do"
                    },
                    {
                        "duration": 26,
                        "priceType": "Fixed",
                        "price": "$316.68",
                        "specialPrice": "$308.44",
                        "pricingName": "et consequat anim"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 40,
                "tags": [
                    "commodo",
                    "eu",
                    "fugiat",
                    "ad",
                    "elit",
                    "anim"
                ]
            },
            {
                "name": "cupidatat fugiat laboris ipsum velit",
                "category": "Lorem amet fugiat",
                "treatment": "",
                "description": "Officia aute sint veniam dolore veniam minim adipisicing exercitation dolore est. Excepteur aliqua dolor aliquip non veniam sunt sunt ex nulla nostrud labore ut anim occaecat. Nostrud adipisicing anim excepteur do quis ipsum reprehenderit enim aute. Tempor quis amet minim excepteur ad. Laborum deserunt ut minim occaecat. Duis ea incididunt labore dolore tempor cupidatat dolor adipisicing voluptate.\r\nVelit aliquip dolore deserunt cupidatat quis ullamco est officia esse proident sint id consequat. Mollit qui sit mollit reprehenderit. Esse anim consectetur nisi quis occaecat non elit cillum occaecat. Et cupidatat est non nisi veniam. Pariatur quis laborum cillum sit occaecat aliquip. Mollit occaecat officia aliqua enim deserunt labore ipsum.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 144,
                    "priceType": "Fixed",
                    "price": "$223.68",
                    "specialPrice": "$320.42",
                    "pricingName": "dolore occaecat consequat"
                },
                "pricingOptions": [
                    {
                        "duration": 368,
                        "priceType": "From",
                        "price": "$381.48",
                        "specialPrice": "$33.91",
                        "pricingName": "reprehenderit ullamco anim"
                    },
                    {
                        "duration": 146,
                        "priceType": "Fixed",
                        "price": "$360.62",
                        "specialPrice": "$164.83",
                        "pricingName": "et consequat consequat"
                    },
                    {
                        "duration": 65,
                        "priceType": "From",
                        "price": "$74.94",
                        "specialPrice": "$339.72",
                        "pricingName": "ipsum laborum nostrud"
                    },
                    {
                        "duration": 65,
                        "priceType": "From",
                        "price": "$160.13",
                        "specialPrice": "$273.13",
                        "pricingName": "ex non veniam"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 51,
                "tags": [
                    "ullamco",
                    "officia",
                    "consectetur",
                    "deserunt",
                    "elit"
                ]
            },
            {
                "name": "ullamco aute sint voluptate laboris",
                "category": "proident voluptate magna",
                "treatment": "",
                "description": "Consequat culpa consequat dolore nostrud aliquip esse reprehenderit dolor. Sunt tempor aliquip irure incididunt elit cillum velit consequat. Id nulla do tempor mollit fugiat veniam. Ipsum voluptate irure anim dolor non occaecat officia cupidatat elit ex quis aliqua velit reprehenderit.\r\nAd sunt labore pariatur occaecat labore ex non fugiat. In culpa sit qui ea nisi ea ea officia veniam eiusmod esse sunt cupidatat. Commodo nulla ut laborum fugiat mollit enim velit dolore exercitation do nulla. Amet adipisicing aute culpa enim duis ipsum eu tempor ut cillum. Ex enim eiusmod consequat eu fugiat velit. Ex aute in in aliquip non pariatur. Duis ullamco adipisicing elit sunt officia nulla laboris proident laboris.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 234,
                    "priceType": "Fixed",
                    "price": "$158.62",
                    "specialPrice": "$258.65",
                    "pricingName": "eu sit voluptate"
                },
                "pricingOptions": [
                    {
                        "duration": 43,
                        "priceType": "Fixed",
                        "price": "$230.75",
                        "specialPrice": "$396.04",
                        "pricingName": "consectetur dolore labore"
                    },
                    {
                        "duration": 216,
                        "priceType": "From",
                        "price": "$109.78",
                        "specialPrice": "$260.21",
                        "pricingName": "non cillum consequat"
                    },
                    {
                        "duration": 67,
                        "priceType": "From",
                        "price": "$171.16",
                        "specialPrice": "$229.70",
                        "pricingName": "sint fugiat nostrud"
                    },
                    {
                        "duration": 64,
                        "priceType": "From",
                        "price": "$95.08",
                        "specialPrice": "$325.55",
                        "pricingName": "ex laborum in"
                    },
                    {
                        "duration": 399,
                        "priceType": "Fixed",
                        "price": "$322.91",
                        "specialPrice": "$285.03",
                        "pricingName": "magna elit reprehenderit"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 41,
                "tags": [
                    "in",
                    "ea",
                    "et",
                    "magna",
                    "labore",
                    "proident"
                ]
            }
        ]
    },
    {
        "_id": "60935e04714bd095a19da612",
        "email": "carolinamejia@katakana.com",
        "bio": "Sit enim est voluptate culpa adipisicing magna eiusmod anim Lorem adipisicing.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Eplosion",
        "address": {
            "street": "Aster Court",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.58466,
            "longitude": -73.70946
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "aliquip consequat dolore",
                "description": "Dolor commodo exercitation officia aute sunt culpa ullamco exercitation dolore qui voluptate fugiat duis. Sit nulla in tempor id occaecat eu adipisicing voluptate do. Aliqua magna elit labore voluptate non nostrud proident. Eu adipisicing tempor velit anim velit cupidatat sunt non amet non in minim amet qui. Veniam nostrud minim occaecat nostrud minim amet anim eiusmod ipsum culpa irure magna. Sit enim ullamco cupidatat esse eu anim aute sunt do est consequat Lorem occaecat laborum. Eu sunt nostrud cillum aliquip mollit proident et Lorem id.\r\n"
            },
            {
                "name": "minim tempor",
                "description": ""
            },
            {
                "name": "elit esse exercitation non",
                "description": "Reprehenderit commodo laboris nostrud qui sint veniam reprehenderit aute qui proident non qui magna. Deserunt esse exercitation nisi est ut nostrud est do officia pariatur non veniam. Sit anim mollit nisi amet consectetur. Ullamco sunt ex irure laborum qui. Excepteur veniam qui do esse culpa incididunt fugiat cupidatat minim consequat dolor et mollit labore. Nostrud nostrud aliquip voluptate reprehenderit ea aliquip sit sint do non nulla proident.\r\nConsequat consectetur culpa reprehenderit Lorem et ut. Anim irure amet irure labore pariatur sint commodo laboris aliquip. Enim ipsum aute cillum pariatur pariatur cupidatat ullamco veniam anim. Duis voluptate cillum irure cupidatat Lorem commodo deserunt. Magna ex incididunt esse do non incididunt ipsum. Reprehenderit ea ipsum minim occaecat incididunt sunt ullamco eiusmod. Exercitation culpa laboris minim ex velit dolor qui fugiat consectetur esse excepteur ullamco.\r\nUt tempor id eiusmod labore in. Culpa tempor officia mollit incididunt labore qui. Nisi nisi consectetur labore velit quis nostrud cupidatat sint veniam id mollit nulla laboris.\r\n"
            }
        ],
        "services": [
            {
                "name": "commodo elit commodo ex irure",
                "category": "dolor exercitation eiusmod",
                "treatment": "",
                "description": "Exercitation qui laborum non ex in. Mollit laboris esse ut eiusmod amet culpa sit irure dolore mollit reprehenderit eiusmod aliquip fugiat. Enim aliqua proident culpa nulla proident minim quis quis exercitation laborum ex.\r\nReprehenderit proident nulla aliquip cillum minim. Commodo amet sit cupidatat ullamco dolore excepteur voluptate ea dolore cillum do. In eu eu aliquip irure tempor cupidatat incididunt dolore. Magna enim enim amet ad exercitation. Reprehenderit consectetur proident voluptate culpa aute tempor eiusmod sunt ullamco esse ad do. In ad dolor commodo dolore id exercitation non magna est ad. Duis aliqua adipisicing Lorem magna cillum reprehenderit dolore aliqua in ex est tempor quis officia.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 209,
                    "priceType": "From",
                    "price": "$65.20",
                    "specialPrice": "$277.71",
                    "pricingName": "esse excepteur consequat"
                },
                "pricingOptions": [
                    {
                        "duration": 279,
                        "priceType": "From",
                        "price": "$121.15",
                        "specialPrice": "$77.65",
                        "pricingName": "consequat tempor elit"
                    },
                    {
                        "duration": 150,
                        "priceType": "Fixed",
                        "price": "$118.27",
                        "specialPrice": "$280.71",
                        "pricingName": "minim incididunt nostrud"
                    },
                    {
                        "duration": 95,
                        "priceType": "From",
                        "price": "$391.86",
                        "specialPrice": "$66.07",
                        "pricingName": "ea ipsum irure"
                    },
                    {
                        "duration": 193,
                        "priceType": "Fixed",
                        "price": "$302.37",
                        "specialPrice": "$265.56",
                        "pricingName": "proident officia et"
                    },
                    {
                        "duration": 34,
                        "priceType": "From",
                        "price": "$193.73",
                        "specialPrice": "$52.92",
                        "pricingName": "amet voluptate sint"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 22,
                "tags": [
                    "irure",
                    "pariatur"
                ]
            },
            {
                "name": "anim irure sunt occaecat cupidatat",
                "category": "voluptate consequat laborum",
                "treatment": "",
                "description": "Laboris veniam occaecat ipsum pariatur culpa elit culpa veniam culpa incididunt adipisicing. Do est nulla minim nulla amet aliquip esse enim ut magna occaecat sunt aliqua et. Occaecat nostrud deserunt eu laborum duis. Tempor sint sit do exercitation.\r\nLabore minim aliquip quis veniam commodo aliquip Lorem minim officia aliqua ipsum officia mollit. In aliqua nulla excepteur cillum consectetur in voluptate ullamco tempor quis est sint aliqua. Ut in ea sint dolor adipisicing dolore ea sint officia. Laborum nostrud officia laborum ullamco voluptate exercitation non culpa eiusmod id labore ipsum proident est. Aute nisi mollit culpa aliqua exercitation officia reprehenderit consequat consectetur dolore esse veniam laboris nisi. Officia fugiat sint et nulla minim irure anim id sunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 154,
                    "priceType": "Fixed",
                    "price": "$324.28",
                    "specialPrice": "$300.60",
                    "pricingName": "eiusmod qui dolore"
                },
                "pricingOptions": [
                    {
                        "duration": 32,
                        "priceType": "Fixed",
                        "price": "$385.97",
                        "specialPrice": "$362.20",
                        "pricingName": "sint mollit ad"
                    },
                    {
                        "duration": 261,
                        "priceType": "Fixed",
                        "price": "$377.17",
                        "specialPrice": "$371.74",
                        "pricingName": "amet consequat commodo"
                    },
                    {
                        "duration": 51,
                        "priceType": "Fixed",
                        "price": "$25.69",
                        "specialPrice": "$286.41",
                        "pricingName": "mollit pariatur laboris"
                    },
                    {
                        "duration": 368,
                        "priceType": "From",
                        "price": "$326.81",
                        "specialPrice": "$316.00",
                        "pricingName": "consequat laboris deserunt"
                    },
                    {
                        "duration": 273,
                        "priceType": "Fixed",
                        "price": "$187.88",
                        "specialPrice": "$168.20",
                        "pricingName": "aliquip officia laborum"
                    },
                    {
                        "duration": 67,
                        "priceType": "From",
                        "price": "$229.78",
                        "specialPrice": "$270.74",
                        "pricingName": "in excepteur do"
                    },
                    {
                        "duration": 112,
                        "priceType": "From",
                        "price": "$114.41",
                        "specialPrice": "$252.18",
                        "pricingName": "quis aliqua ad"
                    },
                    {
                        "duration": 340,
                        "priceType": "From",
                        "price": "$282.98",
                        "specialPrice": "$248.11",
                        "pricingName": "cupidatat incididunt pariatur"
                    },
                    {
                        "duration": 329,
                        "priceType": "From",
                        "price": "$279.47",
                        "specialPrice": "$127.43",
                        "pricingName": "duis magna mollit"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 37,
                "tags": [
                    "eiusmod",
                    "enim",
                    "sit",
                    "mollit"
                ]
            },
            {
                "name": "est sunt amet enim do",
                "category": "commodo excepteur excepteur",
                "treatment": "",
                "description": "Labore cillum Lorem ad sint Lorem. Dolor consequat proident id ullamco amet esse qui fugiat labore non voluptate do nisi. Elit Lorem nisi tempor exercitation quis duis labore ad. Anim dolore exercitation nisi irure. Irure eiusmod est officia laborum Lorem sint magna excepteur.\r\nEt commodo fugiat qui adipisicing excepteur non incididunt amet dolore voluptate ullamco. Fugiat Lorem veniam officia irure laborum laboris cillum cillum incididunt laboris in cupidatat. Consectetur exercitation eiusmod culpa pariatur labore. Sit officia magna ex eu eiusmod dolor deserunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 274,
                    "priceType": "Fixed",
                    "price": "$47.10",
                    "specialPrice": "$336.96",
                    "pricingName": "tempor aliqua excepteur"
                },
                "pricingOptions": [
                    {
                        "duration": 35,
                        "priceType": "From",
                        "price": "$156.66",
                        "specialPrice": "$293.21",
                        "pricingName": "deserunt mollit occaecat"
                    },
                    {
                        "duration": 300,
                        "priceType": "From",
                        "price": "$275.86",
                        "specialPrice": "$378.67",
                        "pricingName": "incididunt reprehenderit dolor"
                    },
                    {
                        "duration": 354,
                        "priceType": "Fixed",
                        "price": "$74.76",
                        "specialPrice": "$303.11",
                        "pricingName": "anim officia est"
                    },
                    {
                        "duration": 387,
                        "priceType": "Fixed",
                        "price": "$120.16",
                        "specialPrice": "$272.07",
                        "pricingName": "aliquip irure sunt"
                    },
                    {
                        "duration": 55,
                        "priceType": "Fixed",
                        "price": "$226.30",
                        "specialPrice": "$293.54",
                        "pricingName": "elit enim velit"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 20,
                "tags": [
                    "velit",
                    "est",
                    "aliqua",
                    "sit",
                    "nulla"
                ]
            },
            {
                "name": "Lorem fugiat cillum mollit in",
                "category": "est Lorem non",
                "treatment": "",
                "description": "Veniam elit sint culpa dolore est et culpa. Cupidatat magna ullamco magna qui est ea commodo laboris anim. Laboris do excepteur non labore deserunt ut proident commodo quis deserunt tempor magna. In excepteur enim sunt consequat adipisicing dolore veniam. Cillum deserunt esse exercitation magna in do ea sunt deserunt. Incididunt cillum eu mollit nisi cillum ea exercitation anim laboris laborum culpa dolore irure. Est aliquip ullamco quis exercitation labore eu amet non.\r\nCulpa occaecat magna elit mollit sit nostrud sint exercitation Lorem nulla esse consectetur cillum. Aliquip qui consequat culpa velit cillum sunt irure culpa proident dolor deserunt dolor. Eu deserunt ut eiusmod culpa quis reprehenderit incididunt non voluptate anim aliqua culpa enim. Do officia adipisicing sunt ullamco cupidatat exercitation do veniam.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 396,
                    "priceType": "From",
                    "price": "$393.59",
                    "specialPrice": "$160.40",
                    "pricingName": "duis amet veniam"
                },
                "pricingOptions": [
                    {
                        "duration": 394,
                        "priceType": "From",
                        "price": "$79.42",
                        "specialPrice": "$323.49",
                        "pricingName": "dolore cillum amet"
                    },
                    {
                        "duration": 282,
                        "priceType": "From",
                        "price": "$393.78",
                        "specialPrice": "$39.87",
                        "pricingName": "Lorem fugiat fugiat"
                    },
                    {
                        "duration": 94,
                        "priceType": "Fixed",
                        "price": "$219.96",
                        "specialPrice": "$206.43",
                        "pricingName": "adipisicing elit ullamco"
                    },
                    {
                        "duration": 69,
                        "priceType": "From",
                        "price": "$228.61",
                        "specialPrice": "$146.53",
                        "pricingName": "sunt nostrud consequat"
                    },
                    {
                        "duration": 178,
                        "priceType": "From",
                        "price": "$391.21",
                        "specialPrice": "$113.09",
                        "pricingName": "consectetur incididunt enim"
                    },
                    {
                        "duration": 214,
                        "priceType": "From",
                        "price": "$259.86",
                        "specialPrice": "$316.94",
                        "pricingName": "reprehenderit sit qui"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 27,
                "tags": [
                    "deserunt",
                    "mollit",
                    "non"
                ]
            },
            {
                "name": "veniam exercitation Lorem eu ad",
                "category": "esse deserunt magna",
                "treatment": "",
                "description": "Reprehenderit consequat eu elit nostrud duis ipsum nisi amet voluptate. Labore officia ullamco commodo nostrud fugiat voluptate nisi do duis. Ut esse do non magna aute minim sint commodo sit aliquip occaecat Lorem occaecat veniam.\r\nEu aliqua exercitation ad sint pariatur ipsum magna enim. Labore cillum mollit laboris ad. Exercitation aute mollit cillum non incididunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 362,
                    "priceType": "Fixed",
                    "price": "$343.24",
                    "specialPrice": "$268.42",
                    "pricingName": "Lorem occaecat in"
                },
                "pricingOptions": [
                    {
                        "duration": 355,
                        "priceType": "From",
                        "price": "$284.45",
                        "specialPrice": "$119.40",
                        "pricingName": "esse reprehenderit anim"
                    },
                    {
                        "duration": 24,
                        "priceType": "From",
                        "price": "$264.80",
                        "specialPrice": "$329.56",
                        "pricingName": "deserunt sint labore"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 51,
                "tags": [
                    "quis",
                    "Lorem"
                ]
            },
            {
                "name": "magna occaecat ad consectetur tempor",
                "category": "sit aliquip cillum",
                "treatment": "",
                "description": "Lorem dolor culpa nisi exercitation. Laboris magna nisi deserunt pariatur amet velit officia nulla. Eu labore quis officia Lorem qui consequat officia deserunt cillum in nulla laborum. Et irure quis excepteur excepteur mollit ut proident non exercitation veniam. Nostrud anim non sint quis elit nulla laborum nulla nostrud in officia est. Velit reprehenderit sunt dolore quis aliqua commodo aliqua aliqua consequat commodo nulla nulla adipisicing. Anim reprehenderit est elit sint elit cillum deserunt non eiusmod.\r\nTempor fugiat consectetur fugiat labore voluptate proident ut nostrud eiusmod ullamco incididunt commodo velit. Ut nulla ad sint eu nulla veniam magna nisi id excepteur voluptate consequat deserunt. Deserunt in occaecat qui aliqua aute. Incididunt adipisicing laboris aliquip elit non ea amet sit aliqua ullamco Lorem. Consequat eiusmod sit aliquip proident cupidatat velit nisi.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 390,
                    "priceType": "Fixed",
                    "price": "$221.16",
                    "specialPrice": "$246.66",
                    "pricingName": "irure exercitation consectetur"
                },
                "pricingOptions": [
                    {
                        "duration": 110,
                        "priceType": "From",
                        "price": "$219.16",
                        "specialPrice": "$42.86",
                        "pricingName": "anim consequat cillum"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 27,
                "tags": [
                    "proident",
                    "duis",
                    "esse",
                    "esse"
                ]
            },
            {
                "name": "aute enim fugiat veniam sint",
                "category": "et qui officia",
                "treatment": "",
                "description": "Reprehenderit quis non pariatur est minim ullamco qui. Excepteur consequat ut aute sit est fugiat anim. Elit nulla Lorem nostrud qui qui velit elit elit fugiat elit enim officia enim. Ea est fugiat tempor adipisicing ad tempor ullamco occaecat sint. Occaecat nulla fugiat veniam consectetur ipsum aliquip ex. Velit excepteur incididunt id deserunt do laboris deserunt do culpa elit cillum pariatur.\r\nEst commodo proident amet ex irure. Eu mollit do sint ipsum nisi esse velit. Aute exercitation nisi labore dolore amet occaecat sunt id aliqua veniam exercitation voluptate consectetur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 349,
                    "priceType": "From",
                    "price": "$371.50",
                    "specialPrice": "$393.29",
                    "pricingName": "officia consequat nulla"
                },
                "pricingOptions": [
                    {
                        "duration": 143,
                        "priceType": "Fixed",
                        "price": "$243.62",
                        "specialPrice": "$318.84",
                        "pricingName": "occaecat aute enim"
                    },
                    {
                        "duration": 303,
                        "priceType": "From",
                        "price": "$119.98",
                        "specialPrice": "$254.24",
                        "pricingName": "aute eiusmod eu"
                    },
                    {
                        "duration": 94,
                        "priceType": "From",
                        "price": "$365.07",
                        "specialPrice": "$239.42",
                        "pricingName": "culpa cupidatat ullamco"
                    },
                    {
                        "duration": 286,
                        "priceType": "Fixed",
                        "price": "$193.97",
                        "specialPrice": "$175.87",
                        "pricingName": "dolore nostrud magna"
                    },
                    {
                        "duration": 289,
                        "priceType": "Fixed",
                        "price": "$199.25",
                        "specialPrice": "$238.33",
                        "pricingName": "labore quis velit"
                    },
                    {
                        "duration": 237,
                        "priceType": "From",
                        "price": "$380.88",
                        "specialPrice": "$58.92",
                        "pricingName": "elit duis elit"
                    },
                    {
                        "duration": 157,
                        "priceType": "Fixed",
                        "price": "$334.17",
                        "specialPrice": "$378.57",
                        "pricingName": "sit ipsum anim"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 54,
                "tags": [
                    "culpa",
                    "cillum",
                    "est",
                    "ad",
                    "ad"
                ]
            },
            {
                "name": "magna aliquip qui Lorem aliqua",
                "category": "reprehenderit aute cillum",
                "treatment": "",
                "description": "Mollit sit cillum aliquip ex minim excepteur. Laborum est cillum veniam aliquip ea proident dolore. Non excepteur consequat ex id aliqua culpa nostrud.\r\nEa Lorem adipisicing fugiat velit consectetur eu ipsum pariatur nisi. Tempor sunt qui qui nisi officia magna laborum in. Sit ipsum dolore irure magna occaecat veniam eiusmod Lorem officia.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 344,
                    "priceType": "From",
                    "price": "$275.75",
                    "specialPrice": "$369.97",
                    "pricingName": "quis labore eiusmod"
                },
                "pricingOptions": [
                    {
                        "duration": 164,
                        "priceType": "From",
                        "price": "$297.93",
                        "specialPrice": "$23.30",
                        "pricingName": "sunt deserunt eiusmod"
                    },
                    {
                        "duration": 63,
                        "priceType": "Fixed",
                        "price": "$205.56",
                        "specialPrice": "$394.12",
                        "pricingName": "proident cillum aute"
                    },
                    {
                        "duration": 290,
                        "priceType": "From",
                        "price": "$136.07",
                        "specialPrice": "$181.36",
                        "pricingName": "non cillum enim"
                    },
                    {
                        "duration": 296,
                        "priceType": "Fixed",
                        "price": "$102.25",
                        "specialPrice": "$182.92",
                        "pricingName": "anim labore commodo"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 25,
                "tags": [
                    "sunt",
                    "est",
                    "minim",
                    "consectetur",
                    "qui",
                    "cillum"
                ]
            },
            {
                "name": "dolor et ea incididunt mollit",
                "category": "aliquip sunt tempor",
                "treatment": "",
                "description": "Ut duis anim duis ipsum. Nostrud magna pariatur enim minim cupidatat. Nulla consectetur nisi nulla ipsum Lorem laboris velit dolore nisi proident anim. Occaecat irure mollit minim elit irure sit aliqua quis nisi aliquip magna exercitation veniam. Tempor velit laboris reprehenderit veniam deserunt. Reprehenderit aute deserunt sunt sint fugiat excepteur in.\r\nNisi aute et adipisicing enim anim adipisicing magna proident non esse ullamco ex amet. Occaecat mollit nisi culpa ad sunt cillum mollit sit minim mollit do. Aliquip amet in cupidatat ullamco sit anim dolor aliquip quis non incididunt est exercitation.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 385,
                    "priceType": "Fixed",
                    "price": "$318.45",
                    "specialPrice": "$334.10",
                    "pricingName": "laborum id officia"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": false,
                "extraTime": 34,
                "tags": [
                    "elit",
                    "ut"
                ]
            }
        ]
    },
    {
        "_id": "60935e04e1b19e16d8df2872",
        "email": "carolinamejia@eplosion.com",
        "bio": "Voluptate aute pariatur non do.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Zounds",
        "address": {
            "street": "Radde Place",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.44242,
            "longitude": -73.57923
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "tempor deserunt reprehenderit",
                "description": "Enim tempor laboris ullamco ex exercitation aliquip eiusmod dolore ullamco magna excepteur. Adipisicing sint ea amet exercitation voluptate adipisicing elit elit. Minim eu adipisicing excepteur incididunt. Sit ea labore esse cupidatat. Enim commodo quis id sunt ullamco quis ullamco occaecat nostrud aliquip aliqua. Deserunt veniam veniam cupidatat esse elit minim et ullamco ex labore anim. Commodo aliqua eiusmod esse fugiat.\r\n"
            },
            {
                "name": "ea cupidatat",
                "description": ""
            },
            {
                "name": "voluptate eiusmod culpa veniam",
                "description": "Nostrud adipisicing eu incididunt nostrud commodo nisi ad officia irure. Proident velit nulla ad aliqua mollit cillum elit in. In do pariatur nisi excepteur adipisicing Lorem deserunt. Eu nostrud cupidatat ullamco excepteur incididunt proident enim ipsum occaecat est. Tempor cupidatat anim ipsum aute Lorem pariatur nulla nisi est quis in sunt deserunt. Aliqua pariatur ullamco dolor fugiat quis mollit.\r\nAliquip ullamco ex id est enim esse irure magna ad sint. Amet anim dolore sint eu in officia veniam culpa ex. Consectetur anim non Lorem nisi commodo veniam sunt irure voluptate qui elit. Est consectetur cillum non id do culpa velit id ipsum et. Commodo fugiat aliqua tempor excepteur eiusmod mollit occaecat consequat aute consectetur exercitation.\r\nEt esse do sint commodo irure veniam voluptate in. Et sunt cupidatat qui est consequat velit adipisicing nostrud pariatur excepteur magna ad dolore. Id magna sunt dolore in consequat esse minim eu Lorem. Occaecat eiusmod id anim pariatur laboris eu veniam aute do dolor in. Eu aute in sit nostrud voluptate dolor anim ut exercitation ullamco et duis eu. Elit ullamco labore id ad. Proident tempor nulla aute ex nisi laborum consequat.\r\n"
            }
        ],
        "services": [
            {
                "name": "dolore labore duis culpa consectetur",
                "category": "cupidatat minim cillum",
                "treatment": "",
                "description": "Eiusmod fugiat commodo magna exercitation ut duis minim magna. Laborum veniam pariatur sit irure quis non labore. Enim ipsum mollit fugiat do reprehenderit fugiat. Aute aliqua id esse mollit anim ad culpa esse enim elit sint ullamco excepteur. Consectetur irure ea amet dolore eiusmod ea.\r\nIn reprehenderit do in sint exercitation aliquip. Excepteur aliqua tempor voluptate ut nostrud aliqua culpa amet consequat. Nisi non est ipsum sint consequat eiusmod. Ex veniam aute deserunt amet ullamco pariatur ex consectetur labore consectetur eiusmod.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 105,
                    "priceType": "From",
                    "price": "$238.22",
                    "specialPrice": "$389.77",
                    "pricingName": "amet exercitation consectetur"
                },
                "pricingOptions": [
                    {
                        "duration": 117,
                        "priceType": "From",
                        "price": "$236.46",
                        "specialPrice": "$176.30",
                        "pricingName": "anim laborum qui"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 50,
                "tags": [
                    "enim",
                    "ut",
                    "consequat",
                    "laborum",
                    "reprehenderit",
                    "anim",
                    "culpa"
                ]
            },
            {
                "name": "commodo ad quis exercitation incididunt",
                "category": "nisi eiusmod sint",
                "treatment": "",
                "description": "Proident adipisicing laborum ex nulla est nulla occaecat enim non exercitation. Quis non mollit deserunt ad nisi nulla aute irure. Esse minim minim proident do aute labore velit officia aliquip ea sit. Voluptate laborum anim aliqua aliquip. Velit labore ad nisi do.\r\nEa occaecat Lorem Lorem non sit sunt ex ad culpa ut consequat. Commodo deserunt qui cillum eu incididunt veniam nostrud irure reprehenderit nulla deserunt. Minim mollit officia mollit tempor incididunt qui do qui dolor cillum aliqua enim minim magna. Nisi sint fugiat laboris ex duis est culpa proident deserunt ad voluptate consectetur nisi enim.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 92,
                    "priceType": "From",
                    "price": "$250.21",
                    "specialPrice": "$386.62",
                    "pricingName": "cupidatat et veniam"
                },
                "pricingOptions": [
                    {
                        "duration": 134,
                        "priceType": "From",
                        "price": "$253.09",
                        "specialPrice": "$94.04",
                        "pricingName": "anim sunt voluptate"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 26,
                "tags": [
                    "id",
                    "sunt",
                    "id",
                    "nulla"
                ]
            },
            {
                "name": "deserunt exercitation fugiat nisi ipsum",
                "category": "anim mollit Lorem",
                "treatment": "",
                "description": "Cillum exercitation enim excepteur irure velit id nulla ipsum non. In labore eu duis reprehenderit cupidatat. Sunt non consectetur laboris adipisicing labore excepteur aliqua. Sunt voluptate aliquip sunt laboris ex. Quis laboris laboris ipsum ullamco incididunt dolor labore velit reprehenderit qui cillum tempor nostrud minim. Occaecat aliquip irure magna occaecat.\r\nConsectetur exercitation minim amet duis consequat nisi occaecat id incididunt. Anim dolore fugiat sunt eu culpa quis Lorem tempor voluptate ea qui proident mollit. Ipsum eiusmod exercitation reprehenderit aliqua quis. Consectetur magna excepteur culpa officia Lorem eiusmod voluptate consequat qui. Incididunt laboris aliquip eu irure aliqua ex velit exercitation id proident nisi eiusmod.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 186,
                    "priceType": "Fixed",
                    "price": "$59.76",
                    "specialPrice": "$260.03",
                    "pricingName": "qui ipsum cupidatat"
                },
                "pricingOptions": [
                    {
                        "duration": 113,
                        "priceType": "From",
                        "price": "$290.57",
                        "specialPrice": "$304.34",
                        "pricingName": "adipisicing tempor eiusmod"
                    },
                    {
                        "duration": 248,
                        "priceType": "Fixed",
                        "price": "$119.35",
                        "specialPrice": "$45.75",
                        "pricingName": "commodo irure Lorem"
                    },
                    {
                        "duration": 244,
                        "priceType": "From",
                        "price": "$171.23",
                        "specialPrice": "$212.12",
                        "pricingName": "deserunt laboris duis"
                    },
                    {
                        "duration": 299,
                        "priceType": "Fixed",
                        "price": "$247.06",
                        "specialPrice": "$381.18",
                        "pricingName": "qui in proident"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 30,
                "tags": [
                    "anim",
                    "incididunt",
                    "Lorem",
                    "id",
                    "dolor"
                ]
            },
            {
                "name": "aute labore enim eu ullamco",
                "category": "velit non esse",
                "treatment": "",
                "description": "Consectetur nulla ut labore duis nisi quis ex. Eu voluptate labore Lorem consequat. Sunt magna laboris est tempor incididunt tempor labore nisi. Tempor ad aliqua minim ex ea tempor. Adipisicing non voluptate ea aute laborum elit dolore. Tempor velit sunt pariatur aliquip aute ullamco. Lorem consectetur aliquip reprehenderit culpa sint labore nulla.\r\nIrure ad voluptate dolor irure. Nostrud qui do id fugiat aliquip elit esse proident ex aliquip irure voluptate anim eu. Elit veniam minim in ea esse in. Irure enim exercitation nostrud velit laborum duis occaecat cupidatat sint consectetur. Proident proident aliqua ullamco aute esse nisi fugiat est dolor fugiat ut proident ut. Elit duis enim amet dolor. Et mollit amet officia elit.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 135,
                    "priceType": "From",
                    "price": "$360.27",
                    "specialPrice": "$264.38",
                    "pricingName": "voluptate occaecat tempor"
                },
                "pricingOptions": [
                    {
                        "duration": 181,
                        "priceType": "Fixed",
                        "price": "$258.57",
                        "specialPrice": "$285.23",
                        "pricingName": "reprehenderit qui eiusmod"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 33,
                "tags": [
                    "consectetur",
                    "cillum"
                ]
            },
            {
                "name": "ex aliqua commodo amet velit",
                "category": "consequat Lorem proident",
                "treatment": "",
                "description": "Consequat consequat laborum nulla cillum magna veniam qui non aliqua ipsum. Aliqua qui cupidatat sit qui. Amet Lorem magna nulla occaecat cillum quis exercitation nostrud id laborum ea esse. Anim velit elit velit fugiat aliquip duis Lorem sint sunt. Enim esse culpa aliqua aliquip et sunt labore ex sint qui anim excepteur esse veniam. Irure et laborum culpa laboris ex mollit. Proident veniam ex esse est labore.\r\nAmet minim sit occaecat aliquip minim enim do id. Elit anim commodo et proident laborum. Veniam eiusmod nisi est nulla cillum Lorem aute amet minim ut qui dolore occaecat ea. Occaecat eiusmod voluptate ipsum consequat adipisicing nulla proident minim mollit irure.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 55,
                    "priceType": "From",
                    "price": "$96.98",
                    "specialPrice": "$159.71",
                    "pricingName": "exercitation reprehenderit cupidatat"
                },
                "pricingOptions": [
                    {
                        "duration": 170,
                        "priceType": "Fixed",
                        "price": "$254.67",
                        "specialPrice": "$303.34",
                        "pricingName": "amet excepteur cupidatat"
                    },
                    {
                        "duration": 105,
                        "priceType": "From",
                        "price": "$318.43",
                        "specialPrice": "$219.17",
                        "pricingName": "sunt culpa qui"
                    },
                    {
                        "duration": 91,
                        "priceType": "From",
                        "price": "$181.32",
                        "specialPrice": "$108.41",
                        "pricingName": "culpa aliquip consequat"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 32,
                "tags": [
                    "aliqua",
                    "Lorem",
                    "irure",
                    "sunt"
                ]
            }
        ]
    },
    {
        "_id": "60935e04252bfbc78f59e28a",
        "email": "carolinamejia@zounds.com",
        "bio": "Id elit in exercitation ut eiusmod ut adipisicing.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Grok",
        "address": {
            "street": "Waldane Court",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.58381,
            "longitude": -73.54931
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "ipsum sit aute",
                "description": "Irure esse commodo ipsum eiusmod incididunt aliquip aute ut. Sint ea duis minim ut velit dolor culpa reprehenderit. Amet esse esse ad amet excepteur ea consequat laboris laborum proident adipisicing consectetur reprehenderit. Nisi qui nisi commodo labore eu duis eu aliqua proident quis do ipsum. Voluptate consequat veniam eiusmod ex eiusmod ipsum.\r\n"
            },
            {
                "name": "reprehenderit aliqua",
                "description": ""
            },
            {
                "name": "qui excepteur dolor aliquip",
                "description": "Fugiat sit tempor irure consequat est commodo exercitation veniam ut mollit aliqua reprehenderit ea do. Nulla aliqua reprehenderit elit fugiat tempor laborum veniam laborum. Aliqua laborum qui anim esse magna labore irure laboris ut nisi officia exercitation.\r\nSit dolore enim culpa mollit. Elit esse qui incididunt et commodo reprehenderit enim do. Excepteur excepteur Lorem est et sit qui aute qui tempor ex. Adipisicing sunt ex aliqua cupidatat dolore et voluptate exercitation tempor non enim ex do consequat.\r\nNon deserunt veniam cupidatat sit cillum sunt adipisicing commodo proident incididunt duis quis occaecat. Eu non cupidatat proident elit ad voluptate do proident sunt cillum ex esse. Labore est enim labore consectetur duis anim. Id veniam in consequat eiusmod commodo mollit mollit nulla esse anim. Consectetur deserunt ipsum labore proident pariatur minim. Occaecat ea nostrud nulla et incididunt ea nulla nulla consectetur veniam anim sunt occaecat.\r\n"
            }
        ],
        "services": [
            {
                "name": "qui laborum magna dolore aliquip",
                "category": "laborum et cillum",
                "treatment": "",
                "description": "Incididunt commodo aliquip est magna incididunt do cillum anim dolore sint sint incididunt. Culpa magna eiusmod veniam aliqua cillum dolore laboris labore. Officia nisi fugiat consectetur qui qui.\r\nEt amet minim qui do. Non reprehenderit Lorem adipisicing adipisicing irure enim do id. Tempor mollit ullamco ad id duis aliquip exercitation magna quis officia aliqua tempor. Do enim nisi commodo velit consectetur duis commodo.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 310,
                    "priceType": "Fixed",
                    "price": "$195.47",
                    "specialPrice": "$212.25",
                    "pricingName": "cillum minim consequat"
                },
                "pricingOptions": [
                    {
                        "duration": 323,
                        "priceType": "From",
                        "price": "$332.48",
                        "specialPrice": "$202.24",
                        "pricingName": "irure ad nisi"
                    },
                    {
                        "duration": 393,
                        "priceType": "From",
                        "price": "$181.97",
                        "specialPrice": "$384.52",
                        "pricingName": "veniam sint incididunt"
                    },
                    {
                        "duration": 199,
                        "priceType": "Fixed",
                        "price": "$24.45",
                        "specialPrice": "$41.95",
                        "pricingName": "adipisicing minim minim"
                    },
                    {
                        "duration": 118,
                        "priceType": "From",
                        "price": "$383.18",
                        "specialPrice": "$182.07",
                        "pricingName": "minim magna dolore"
                    },
                    {
                        "duration": 55,
                        "priceType": "From",
                        "price": "$209.04",
                        "specialPrice": "$182.69",
                        "pricingName": "id dolor adipisicing"
                    },
                    {
                        "duration": 342,
                        "priceType": "Fixed",
                        "price": "$255.36",
                        "specialPrice": "$342.09",
                        "pricingName": "nisi enim duis"
                    },
                    {
                        "duration": 123,
                        "priceType": "From",
                        "price": "$111.86",
                        "specialPrice": "$289.50",
                        "pricingName": "sint occaecat ut"
                    },
                    {
                        "duration": 234,
                        "priceType": "From",
                        "price": "$308.15",
                        "specialPrice": "$257.79",
                        "pricingName": "duis commodo Lorem"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 46,
                "tags": [
                    "fugiat",
                    "eiusmod"
                ]
            },
            {
                "name": "quis laborum laborum dolore esse",
                "category": "aute enim sunt",
                "treatment": "",
                "description": "Mollit occaecat eiusmod sunt pariatur voluptate qui elit sit culpa reprehenderit. Do veniam aute est laborum elit est exercitation pariatur dolore laborum sint. Non do enim consectetur est eiusmod dolore deserunt ea sunt officia sint nostrud reprehenderit eiusmod. Voluptate exercitation nulla do in dolor sit veniam fugiat non aliqua consectetur labore. Dolor est minim qui anim et Lorem ea eiusmod culpa ullamco.\r\nConsequat eu do consequat non do nulla consectetur occaecat ea ex magna mollit commodo irure. Dolor magna qui eu sit amet officia incididunt eiusmod. Nisi veniam ipsum quis dolor mollit deserunt irure duis minim. Labore aute aliquip quis id commodo duis amet tempor reprehenderit. Elit proident nisi excepteur aliqua. Exercitation sit incididunt sit culpa deserunt deserunt Lorem cillum quis.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 352,
                    "priceType": "From",
                    "price": "$152.41",
                    "specialPrice": "$178.97",
                    "pricingName": "quis laborum duis"
                },
                "pricingOptions": [
                    {
                        "duration": 284,
                        "priceType": "Fixed",
                        "price": "$345.91",
                        "specialPrice": "$58.39",
                        "pricingName": "magna ad sit"
                    },
                    {
                        "duration": 362,
                        "priceType": "Fixed",
                        "price": "$365.05",
                        "specialPrice": "$129.97",
                        "pricingName": "occaecat nostrud qui"
                    },
                    {
                        "duration": 322,
                        "priceType": "From",
                        "price": "$78.15",
                        "specialPrice": "$290.33",
                        "pricingName": "nisi cupidatat deserunt"
                    },
                    {
                        "duration": 194,
                        "priceType": "Fixed",
                        "price": "$251.04",
                        "specialPrice": "$165.41",
                        "pricingName": "culpa et non"
                    },
                    {
                        "duration": 84,
                        "priceType": "Fixed",
                        "price": "$27.45",
                        "specialPrice": "$153.35",
                        "pricingName": "consectetur consectetur anim"
                    },
                    {
                        "duration": 107,
                        "priceType": "Fixed",
                        "price": "$55.22",
                        "specialPrice": "$92.66",
                        "pricingName": "amet ipsum in"
                    },
                    {
                        "duration": 299,
                        "priceType": "From",
                        "price": "$363.97",
                        "specialPrice": "$233.08",
                        "pricingName": "nostrud Lorem ut"
                    },
                    {
                        "duration": 49,
                        "priceType": "Fixed",
                        "price": "$364.71",
                        "specialPrice": "$157.84",
                        "pricingName": "sit non excepteur"
                    },
                    {
                        "duration": 345,
                        "priceType": "Fixed",
                        "price": "$89.35",
                        "specialPrice": "$55.24",
                        "pricingName": "Lorem anim nulla"
                    },
                    {
                        "duration": 335,
                        "priceType": "From",
                        "price": "$177.16",
                        "specialPrice": "$362.48",
                        "pricingName": "proident ad qui"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 58,
                "tags": [
                    "sint",
                    "ex",
                    "aliquip",
                    "commodo"
                ]
            },
            {
                "name": "quis consectetur duis in duis",
                "category": "aliquip nulla excepteur",
                "treatment": "",
                "description": "Nostrud enim est nulla consectetur Lorem irure velit ut amet magna velit cillum cillum. Quis culpa pariatur quis proident eiusmod laborum amet. Irure fugiat reprehenderit minim nisi tempor exercitation non elit. Aute occaecat fugiat labore voluptate dolore do magna elit ipsum irure. Anim nostrud dolore duis ad labore ullamco commodo incididunt esse reprehenderit ex in. Ad sunt in duis ea dolor anim proident ut.\r\nCulpa reprehenderit exercitation exercitation minim tempor fugiat occaecat laborum laboris culpa dolore sint Lorem tempor. Dolor dolor minim mollit duis pariatur nulla velit qui adipisicing mollit. Pariatur enim culpa voluptate exercitation amet occaecat eiusmod irure qui.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 86,
                    "priceType": "Fixed",
                    "price": "$388.56",
                    "specialPrice": "$259.59",
                    "pricingName": "officia deserunt excepteur"
                },
                "pricingOptions": [
                    {
                        "duration": 380,
                        "priceType": "From",
                        "price": "$349.71",
                        "specialPrice": "$316.22",
                        "pricingName": "pariatur irure dolore"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 31,
                "tags": [
                    "ipsum",
                    "cillum",
                    "aliqua",
                    "ullamco",
                    "duis",
                    "aute"
                ]
            },
            {
                "name": "eu cillum occaecat et enim",
                "category": "consequat dolore nostrud",
                "treatment": "",
                "description": "Lorem ad nulla dolor enim. Eu Lorem consequat pariatur et culpa non est magna pariatur. Amet labore consequat laborum officia aute.\r\nCillum dolor adipisicing occaecat duis. Voluptate pariatur amet qui qui occaecat. Non ad veniam in esse laboris pariatur id culpa officia Lorem aliqua adipisicing laboris Lorem. Adipisicing nostrud ad do Lorem eiusmod ad nulla amet officia non. Dolor aliqua reprehenderit aute sit in enim. In in nostrud amet excepteur voluptate mollit voluptate dolor fugiat.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 160,
                    "priceType": "From",
                    "price": "$80.75",
                    "specialPrice": "$143.10",
                    "pricingName": "ea elit pariatur"
                },
                "pricingOptions": [
                    {
                        "duration": 180,
                        "priceType": "Fixed",
                        "price": "$362.23",
                        "specialPrice": "$190.14",
                        "pricingName": "enim enim pariatur"
                    },
                    {
                        "duration": 200,
                        "priceType": "From",
                        "price": "$68.31",
                        "specialPrice": "$236.64",
                        "pricingName": "labore aliqua in"
                    },
                    {
                        "duration": 152,
                        "priceType": "From",
                        "price": "$224.63",
                        "specialPrice": "$274.69",
                        "pricingName": "duis ullamco qui"
                    },
                    {
                        "duration": 304,
                        "priceType": "Fixed",
                        "price": "$192.08",
                        "specialPrice": "$190.90",
                        "pricingName": "pariatur adipisicing commodo"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 48,
                "tags": [
                    "velit",
                    "duis",
                    "excepteur",
                    "proident",
                    "cillum",
                    "qui",
                    "dolor"
                ]
            },
            {
                "name": "sit fugiat proident eiusmod proident",
                "category": "deserunt proident dolor",
                "treatment": "",
                "description": "Mollit consectetur ad proident elit commodo mollit enim. Nulla cillum ullamco sit cupidatat aute commodo sint ullamco consequat excepteur laboris ullamco. Eu aute fugiat quis culpa nulla Lorem nisi eu laborum incididunt duis. Aute irure amet duis sit pariatur pariatur. Mollit irure dolor dolor adipisicing. Laboris irure aute nulla fugiat et ullamco enim voluptate et non qui nisi eiusmod.\r\nDolor occaecat officia culpa tempor. Sit irure commodo laboris non. Cillum Lorem amet aute irure culpa qui dolore irure esse magna veniam. Minim irure in non minim anim labore sunt aliqua id labore nulla. Non esse est deserunt elit excepteur sint reprehenderit enim voluptate minim id cupidatat. Incididunt do fugiat pariatur in ad. Sit veniam pariatur dolor nulla culpa eu nostrud dolor proident in incididunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 256,
                    "priceType": "Fixed",
                    "price": "$137.23",
                    "specialPrice": "$354.34",
                    "pricingName": "occaecat ut incididunt"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": false,
                "extraTime": 60,
                "tags": [
                    "ullamco",
                    "nulla",
                    "dolore",
                    "duis",
                    "duis",
                    "aute",
                    "incididunt"
                ]
            },
            {
                "name": "in est ullamco et tempor",
                "category": "non ea cupidatat",
                "treatment": "",
                "description": "Velit commodo culpa in culpa ut do magna Lorem excepteur voluptate. Laborum nulla ea occaecat consectetur do do duis consequat pariatur magna ullamco esse. Aliqua laboris sint enim eu ea incididunt et id reprehenderit aliquip ut veniam sint. Cillum qui commodo quis eu laboris aute sunt.\r\nReprehenderit commodo incididunt veniam consequat pariatur non mollit cupidatat cillum deserunt do et irure. Proident et occaecat consectetur ipsum veniam dolore et duis veniam ut magna aliquip aliqua ipsum. Nisi sunt aliquip aute excepteur sint qui eu ex.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 327,
                    "priceType": "From",
                    "price": "$157.08",
                    "specialPrice": "$174.25",
                    "pricingName": "consectetur mollit sunt"
                },
                "pricingOptions": [
                    {
                        "duration": 107,
                        "priceType": "From",
                        "price": "$278.54",
                        "specialPrice": "$175.71",
                        "pricingName": "exercitation veniam sint"
                    },
                    {
                        "duration": 75,
                        "priceType": "From",
                        "price": "$225.91",
                        "specialPrice": "$289.95",
                        "pricingName": "mollit nisi occaecat"
                    },
                    {
                        "duration": 227,
                        "priceType": "From",
                        "price": "$65.41",
                        "specialPrice": "$32.27",
                        "pricingName": "exercitation excepteur elit"
                    },
                    {
                        "duration": 174,
                        "priceType": "From",
                        "price": "$21.23",
                        "specialPrice": "$190.71",
                        "pricingName": "fugiat veniam et"
                    },
                    {
                        "duration": 338,
                        "priceType": "From",
                        "price": "$39.06",
                        "specialPrice": "$291.36",
                        "pricingName": "labore cillum ad"
                    },
                    {
                        "duration": 361,
                        "priceType": "From",
                        "price": "$170.77",
                        "specialPrice": "$381.39",
                        "pricingName": "enim cillum ex"
                    },
                    {
                        "duration": 151,
                        "priceType": "Fixed",
                        "price": "$330.34",
                        "specialPrice": "$315.30",
                        "pricingName": "minim nisi veniam"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 35,
                "tags": [
                    "aliquip",
                    "aliquip",
                    "mollit",
                    "id",
                    "ex",
                    "ex",
                    "irure"
                ]
            },
            {
                "name": "id aute labore est mollit",
                "category": "anim cillum nisi",
                "treatment": "",
                "description": "Consequat minim laboris exercitation mollit. Ad exercitation esse ipsum fugiat voluptate eu duis voluptate sunt est ut non aute et. Irure sint id veniam reprehenderit dolor sit ea enim Lorem labore amet cillum anim. Eiusmod deserunt laboris deserunt nostrud pariatur est id consectetur nostrud sunt laboris.\r\nNulla aute voluptate dolor consequat aute aute ullamco velit exercitation aliqua qui. Enim eiusmod sunt voluptate proident deserunt sit pariatur esse anim non amet adipisicing. Adipisicing cupidatat eiusmod nisi ut excepteur dolor veniam dolore in laboris.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 293,
                    "priceType": "Fixed",
                    "price": "$367.60",
                    "specialPrice": "$136.09",
                    "pricingName": "in velit non"
                },
                "pricingOptions": [
                    {
                        "duration": 156,
                        "priceType": "Fixed",
                        "price": "$127.37",
                        "specialPrice": "$396.09",
                        "pricingName": "consectetur officia eu"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 48,
                "tags": [
                    "cillum",
                    "ullamco",
                    "laborum"
                ]
            },
            {
                "name": "ad cillum aliqua cupidatat consequat",
                "category": "proident id eu",
                "treatment": "",
                "description": "Sit esse quis labore sit ipsum officia cillum. Excepteur occaecat ad in reprehenderit deserunt mollit Lorem. Enim aliquip culpa minim enim velit duis sint commodo laborum sunt consequat labore deserunt consequat. Id magna cupidatat esse fugiat. Eiusmod excepteur mollit aute cillum labore. Fugiat elit laborum qui sit tempor id ea incididunt aute Lorem cupidatat. Dolore sint incididunt eu fugiat.\r\nExcepteur et enim proident nisi qui veniam fugiat eiusmod consequat elit sunt nulla laboris. Sunt culpa elit Lorem consequat excepteur culpa consectetur. Dolore sint dolor cupidatat commodo reprehenderit aliqua dolore nostrud laborum qui. Aliqua Lorem cillum irure mollit. Deserunt laborum consectetur sint minim in. Elit adipisicing eu duis esse elit laboris esse enim sunt qui minim.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 340,
                    "priceType": "From",
                    "price": "$72.54",
                    "specialPrice": "$347.46",
                    "pricingName": "et in quis"
                },
                "pricingOptions": [
                    {
                        "duration": 255,
                        "priceType": "Fixed",
                        "price": "$48.77",
                        "specialPrice": "$65.26",
                        "pricingName": "veniam quis irure"
                    },
                    {
                        "duration": 329,
                        "priceType": "Fixed",
                        "price": "$97.26",
                        "specialPrice": "$78.22",
                        "pricingName": "minim ea ea"
                    },
                    {
                        "duration": 390,
                        "priceType": "From",
                        "price": "$379.67",
                        "specialPrice": "$73.88",
                        "pricingName": "aute minim aliqua"
                    },
                    {
                        "duration": 372,
                        "priceType": "Fixed",
                        "price": "$39.03",
                        "specialPrice": "$36.94",
                        "pricingName": "labore proident ut"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 55,
                "tags": [
                    "elit",
                    "exercitation",
                    "duis",
                    "ea",
                    "sit",
                    "veniam"
                ]
            }
        ]
    },
    {
        "_id": "60935e0426866d49c73c1583",
        "email": "carolinamejia@grok.com",
        "bio": "Ex culpa consectetur labore nulla nostrud ut dolore cupidatat in cupidatat esse.",
        "avatar": "http://placehold.it/32x32",
        "businessName": "Lumbrex",
        "address": {
            "street": "Ira Court",
            "zip": "H2S 2M9",
            "city": "Montreal",
            "state": "Quebec",
            "country": "Canada",
            "latitude": 45.44668,
            "longitude": -73.74146
        },
        "website": "https://kkw.netlify.app",
        "openhours": [],
        "language": [],
        "currency": "",
        "categories": [
            {
                "name": "labore cillum exercitation",
                "description": "Nulla in eiusmod commodo nostrud nulla tempor sit proident esse incididunt voluptate aliqua. Mollit duis laborum nisi labore fugiat cillum. Cillum occaecat esse sint ipsum magna nisi labore officia sit. Amet sunt nisi consectetur excepteur voluptate fugiat elit.\r\n"
            },
            {
                "name": "est aliquip",
                "description": ""
            },
            {
                "name": "reprehenderit aliqua eiusmod exercitation",
                "description": "Consectetur ea deserunt exercitation nulla aute consequat excepteur Lorem sit cillum adipisicing excepteur dolor. Dolore ea magna ex quis. Minim qui ad sunt esse nostrud do nulla minim pariatur velit elit exercitation. Eu pariatur mollit enim consequat.\r\nAute magna pariatur aliqua Lorem ex consequat officia cupidatat. Non enim esse aute labore voluptate sint occaecat anim cupidatat cillum culpa nisi sunt. Elit adipisicing eiusmod aliqua fugiat fugiat exercitation anim anim.\r\nQui culpa mollit nostrud amet fugiat deserunt sit. Cillum sunt minim ipsum et duis veniam culpa in aute qui magna. Eiusmod consequat commodo sint dolore aliqua deserunt enim sint irure reprehenderit irure sunt quis. Ullamco exercitation ut deserunt pariatur cupidatat aliquip magna incididunt fugiat anim. Ipsum reprehenderit adipisicing elit do irure ad ea dolore elit irure mollit adipisicing incididunt ut. Pariatur nisi exercitation eu aliquip eiusmod cillum amet commodo occaecat elit tempor.\r\n"
            }
        ],
        "services": [
            {
                "name": "amet voluptate amet qui ex",
                "category": "cupidatat non aliquip",
                "treatment": "",
                "description": "Commodo commodo in adipisicing occaecat. Aliqua quis velit enim qui voluptate. Dolore duis ad qui dolor velit eu ipsum officia magna esse veniam. Enim adipisicing commodo sunt excepteur consectetur anim amet pariatur aliquip nostrud. Excepteur est commodo est aliquip. Amet ad ea exercitation consectetur Lorem. Quis enim incididunt et cillum excepteur exercitation non nisi velit tempor reprehenderit irure non incididunt.\r\nEa sunt adipisicing dolor dolore eiusmod amet incididunt duis eu incididunt exercitation nostrud minim. Dolor aliquip sunt ut ex est. Fugiat fugiat Lorem mollit duis sint magna sunt reprehenderit ullamco pariatur officia ea. Amet amet excepteur magna eu ut minim.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 28,
                    "priceType": "Fixed",
                    "price": "$269.77",
                    "specialPrice": "$229.25",
                    "pricingName": "officia minim laborum"
                },
                "pricingOptions": [
                    {
                        "duration": 381,
                        "priceType": "Fixed",
                        "price": "$63.86",
                        "specialPrice": "$61.73",
                        "pricingName": "esse sit velit"
                    },
                    {
                        "duration": 20,
                        "priceType": "Fixed",
                        "price": "$58.60",
                        "specialPrice": "$112.55",
                        "pricingName": "laborum dolore veniam"
                    },
                    {
                        "duration": 90,
                        "priceType": "Fixed",
                        "price": "$323.81",
                        "specialPrice": "$114.21",
                        "pricingName": "dolor ipsum elit"
                    },
                    {
                        "duration": 32,
                        "priceType": "Fixed",
                        "price": "$395.27",
                        "specialPrice": "$47.71",
                        "pricingName": "occaecat sunt et"
                    },
                    {
                        "duration": 160,
                        "priceType": "Fixed",
                        "price": "$340.36",
                        "specialPrice": "$156.89",
                        "pricingName": "pariatur commodo incididunt"
                    },
                    {
                        "duration": 113,
                        "priceType": "From",
                        "price": "$186.15",
                        "specialPrice": "$398.88",
                        "pricingName": "est non est"
                    },
                    {
                        "duration": 334,
                        "priceType": "From",
                        "price": "$135.21",
                        "specialPrice": "$394.10",
                        "pricingName": "mollit anim in"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 29,
                "tags": [
                    "reprehenderit",
                    "Lorem",
                    "mollit",
                    "culpa",
                    "dolor",
                    "commodo",
                    "ipsum"
                ]
            },
            {
                "name": "ad dolor eiusmod laboris consequat",
                "category": "tempor fugiat consequat",
                "treatment": "",
                "description": "Lorem sint aliqua exercitation incididunt pariatur. Et dolor occaecat occaecat fugiat aliqua commodo anim officia id. Ea pariatur et eu anim et ullamco minim. Ad amet deserunt pariatur duis do tempor. Velit et consequat aute laboris exercitation amet qui qui reprehenderit fugiat.\r\nVoluptate minim consequat mollit ullamco aliquip. Aute fugiat aute veniam cupidatat cillum ipsum dolore. Laborum est adipisicing veniam non sit pariatur ad pariatur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 175,
                    "priceType": "Fixed",
                    "price": "$55.19",
                    "specialPrice": "$172.55",
                    "pricingName": "officia eu sunt"
                },
                "pricingOptions": [
                    {
                        "duration": 33,
                        "priceType": "From",
                        "price": "$360.35",
                        "specialPrice": "$233.88",
                        "pricingName": "cupidatat exercitation consequat"
                    },
                    {
                        "duration": 370,
                        "priceType": "Fixed",
                        "price": "$241.94",
                        "specialPrice": "$159.66",
                        "pricingName": "enim do exercitation"
                    },
                    {
                        "duration": 322,
                        "priceType": "Fixed",
                        "price": "$186.71",
                        "specialPrice": "$390.68",
                        "pricingName": "esse velit quis"
                    },
                    {
                        "duration": 140,
                        "priceType": "Fixed",
                        "price": "$272.33",
                        "specialPrice": "$215.91",
                        "pricingName": "ullamco voluptate incididunt"
                    },
                    {
                        "duration": 303,
                        "priceType": "Fixed",
                        "price": "$168.86",
                        "specialPrice": "$62.66",
                        "pricingName": "eu proident mollit"
                    },
                    {
                        "duration": 323,
                        "priceType": "From",
                        "price": "$280.39",
                        "specialPrice": "$313.33",
                        "pricingName": "veniam laborum minim"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 51,
                "tags": [
                    "aliquip",
                    "consectetur",
                    "duis",
                    "occaecat"
                ]
            },
            {
                "name": "cillum commodo eiusmod est nisi",
                "category": "incididunt culpa aute",
                "treatment": "",
                "description": "Magna cillum laboris amet aliquip reprehenderit Lorem pariatur ut proident. Nostrud dolore officia id cillum officia aliqua ut dolor officia consequat nisi. Velit proident tempor consequat amet ipsum nulla qui proident adipisicing incididunt deserunt reprehenderit. Qui laborum adipisicing consectetur ad cupidatat esse anim cillum eiusmod esse officia voluptate non tempor. Cupidatat culpa proident aliquip esse pariatur minim id deserunt dolor duis esse pariatur sit. Consectetur est exercitation laborum minim magna anim eu non.\r\nOfficia nostrud aliqua ipsum qui eiusmod deserunt id commodo. Incididunt Lorem aute aliquip laborum voluptate aute aute occaecat id magna adipisicing. Sint Lorem dolore aliquip exercitation et proident nulla laborum labore ut. Irure velit incididunt qui culpa enim enim officia deserunt laborum cupidatat tempor non exercitation dolor.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 356,
                    "priceType": "From",
                    "price": "$79.42",
                    "specialPrice": "$272.77",
                    "pricingName": "et sint anim"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": true,
                "extraTime": 47,
                "tags": [
                    "officia",
                    "veniam",
                    "ipsum"
                ]
            },
            {
                "name": "adipisicing commodo dolore consequat irure",
                "category": "excepteur officia ipsum",
                "treatment": "",
                "description": "Est laboris ea deserunt mollit proident. Qui duis Lorem nulla voluptate nostrud. Est dolor aliqua aute proident. Laboris laboris ea pariatur culpa commodo veniam incididunt magna sunt proident. Elit officia quis do sunt nisi elit minim ex nulla.\r\nEu ea ut exercitation enim qui sint. Laborum cillum pariatur Lorem incididunt occaecat. Ea laboris non veniam in ullamco consectetur nostrud enim esse labore cupidatat irure dolore. Quis consequat id ad anim cillum consectetur eiusmod irure excepteur proident enim ex labore sit. Eiusmod eiusmod qui ad cillum proident dolor nulla ea do voluptate enim elit aliquip consectetur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 97,
                    "priceType": "From",
                    "price": "$317.51",
                    "specialPrice": "$223.67",
                    "pricingName": "excepteur aute aute"
                },
                "pricingOptions": [],
                "enabledExtratimeafter": false,
                "extraTime": 25,
                "tags": [
                    "pariatur",
                    "ea",
                    "dolore"
                ]
            },
            {
                "name": "ad consequat nostrud magna aliqua",
                "category": "cupidatat id elit",
                "treatment": "",
                "description": "Voluptate amet id qui pariatur tempor enim nostrud sunt eu dolore consequat incididunt. Nisi pariatur dolore incididunt sint excepteur. Duis nulla aliquip eu exercitation enim minim excepteur quis. Ullamco fugiat ut qui consectetur occaecat duis excepteur dolor culpa proident ut mollit elit ea. In officia non quis est magna nulla esse tempor. Reprehenderit elit in dolor ut consequat laborum cillum et elit.\r\nOfficia ullamco id irure cillum cillum esse. Consequat ad eu occaecat commodo nisi sunt incididunt irure ipsum laborum incididunt commodo ipsum dolore. Incididunt cupidatat commodo aliqua consequat in irure aliquip esse id. Eu Lorem nostrud ut eu fugiat Lorem. Commodo velit dolore cupidatat sunt.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 22,
                    "priceType": "Fixed",
                    "price": "$337.89",
                    "specialPrice": "$384.09",
                    "pricingName": "ea ullamco sunt"
                },
                "pricingOptions": [
                    {
                        "duration": 189,
                        "priceType": "Fixed",
                        "price": "$58.41",
                        "specialPrice": "$99.70",
                        "pricingName": "minim dolore anim"
                    },
                    {
                        "duration": 202,
                        "priceType": "Fixed",
                        "price": "$117.36",
                        "specialPrice": "$308.19",
                        "pricingName": "reprehenderit non laboris"
                    },
                    {
                        "duration": 365,
                        "priceType": "Fixed",
                        "price": "$364.98",
                        "specialPrice": "$157.69",
                        "pricingName": "laboris voluptate ullamco"
                    },
                    {
                        "duration": 59,
                        "priceType": "From",
                        "price": "$69.31",
                        "specialPrice": "$278.10",
                        "pricingName": "quis tempor tempor"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 33,
                "tags": [
                    "duis",
                    "nostrud"
                ]
            },
            {
                "name": "aliqua do commodo est nostrud",
                "category": "eiusmod et eu",
                "treatment": "",
                "description": "Ipsum velit ipsum qui id non reprehenderit ad. Reprehenderit voluptate commodo ut culpa et pariatur esse nostrud commodo ullamco ea labore qui consectetur. Proident duis minim ut do exercitation incididunt consequat sunt laboris reprehenderit eu quis eu aute.\r\nAd nulla officia ut reprehenderit in. Exercitation et ex ea officia sunt irure aute consectetur nulla irure adipisicing nisi. Culpa deserunt aliquip officia sint dolore ut minim magna quis do consequat qui. Et eu amet irure do esse pariatur. Eiusmod irure laboris id duis laboris minim aliqua ad.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 34,
                    "priceType": "From",
                    "price": "$139.51",
                    "specialPrice": "$295.81",
                    "pricingName": "nisi officia ea"
                },
                "pricingOptions": [
                    {
                        "duration": 174,
                        "priceType": "Fixed",
                        "price": "$277.89",
                        "specialPrice": "$296.67",
                        "pricingName": "nisi officia veniam"
                    },
                    {
                        "duration": 211,
                        "priceType": "From",
                        "price": "$273.24",
                        "specialPrice": "$140.94",
                        "pricingName": "exercitation in velit"
                    },
                    {
                        "duration": 384,
                        "priceType": "From",
                        "price": "$144.30",
                        "specialPrice": "$184.49",
                        "pricingName": "amet ipsum officia"
                    },
                    {
                        "duration": 352,
                        "priceType": "From",
                        "price": "$307.72",
                        "specialPrice": "$363.66",
                        "pricingName": "quis aute eu"
                    },
                    {
                        "duration": 360,
                        "priceType": "From",
                        "price": "$296.65",
                        "specialPrice": "$381.42",
                        "pricingName": "incididunt aute nostrud"
                    },
                    {
                        "duration": 25,
                        "priceType": "Fixed",
                        "price": "$309.14",
                        "specialPrice": "$221.20",
                        "pricingName": "consectetur nisi ullamco"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 45,
                "tags": [
                    "labore",
                    "irure",
                    "officia"
                ]
            },
            {
                "name": "laboris eu ut culpa laboris",
                "category": "deserunt Lorem nostrud",
                "treatment": "",
                "description": "Velit ipsum pariatur tempor nisi in mollit Lorem veniam mollit quis anim elit mollit. Sint exercitation sunt minim id id dolore cillum consectetur ipsum occaecat fugiat dolor minim. Nisi aute incididunt nulla dolor. Irure ipsum mollit enim magna fugiat anim velit incididunt cillum incididunt fugiat. Irure mollit nostrud adipisicing Lorem cillum proident ullamco officia irure.\r\nTempor reprehenderit sint tempor irure enim et culpa qui duis esse elit ipsum enim incididunt. Ad non cupidatat adipisicing non commodo ad anim dolor incididunt magna ea minim. Ad eu sunt esse occaecat dolor aliquip incididunt consectetur do aliquip sunt. Ut ea esse ut anim in tempor ullamco eu magna esse. Quis deserunt velit eiusmod ad nulla commodo. Est id labore mollit sunt ipsum non elit veniam culpa excepteur cillum amet aliqua. Laborum nisi cillum ullamco amet eiusmod qui.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 239,
                    "priceType": "From",
                    "price": "$84.32",
                    "specialPrice": "$234.43",
                    "pricingName": "laboris ea deserunt"
                },
                "pricingOptions": [
                    {
                        "duration": 95,
                        "priceType": "Fixed",
                        "price": "$278.98",
                        "specialPrice": "$285.89",
                        "pricingName": "qui cupidatat consectetur"
                    },
                    {
                        "duration": 347,
                        "priceType": "From",
                        "price": "$221.83",
                        "specialPrice": "$71.94",
                        "pricingName": "ut tempor minim"
                    },
                    {
                        "duration": 209,
                        "priceType": "From",
                        "price": "$326.20",
                        "specialPrice": "$199.09",
                        "pricingName": "velit voluptate nisi"
                    },
                    {
                        "duration": 341,
                        "priceType": "From",
                        "price": "$229.88",
                        "specialPrice": "$100.45",
                        "pricingName": "dolor nisi adipisicing"
                    },
                    {
                        "duration": 146,
                        "priceType": "From",
                        "price": "$109.45",
                        "specialPrice": "$178.87",
                        "pricingName": "aliquip deserunt aliquip"
                    },
                    {
                        "duration": 386,
                        "priceType": "From",
                        "price": "$215.98",
                        "specialPrice": "$114.79",
                        "pricingName": "ad dolore eu"
                    },
                    {
                        "duration": 343,
                        "priceType": "From",
                        "price": "$152.36",
                        "specialPrice": "$343.46",
                        "pricingName": "tempor est sint"
                    },
                    {
                        "duration": 357,
                        "priceType": "Fixed",
                        "price": "$391.35",
                        "specialPrice": "$85.18",
                        "pricingName": "labore deserunt nulla"
                    },
                    {
                        "duration": 160,
                        "priceType": "Fixed",
                        "price": "$350.59",
                        "specialPrice": "$134.84",
                        "pricingName": "do commodo aliquip"
                    }
                ],
                "enabledExtratimeafter": true,
                "extraTime": 20,
                "tags": [
                    "in",
                    "cillum",
                    "tempor"
                ]
            },
            {
                "name": "ex eu aute id deserunt",
                "category": "esse dolor minim",
                "treatment": "",
                "description": "Id quis enim proident est minim quis do cupidatat. Est incididunt dolor qui minim laboris incididunt incididunt occaecat ut cillum. Fugiat duis dolore exercitation cillum ipsum labore tempor anim. Id do irure incididunt commodo Lorem reprehenderit non nulla qui labore. Et adipisicing eiusmod est in officia elit Lorem. Pariatur sunt incididunt officia minim irure labore sit laborum minim fugiat qui. Nostrud mollit ipsum mollit cillum deserunt exercitation sint.\r\nExercitation fugiat ex fugiat ullamco in duis nulla incididunt fugiat. Veniam enim ea nisi cillum incididunt aliquip aute laboris nostrud ea adipisicing. Proident ex consectetur aute eiusmod sint tempor dolor aliquip duis dolor consequat pariatur.\r\n",
                "pictures": [
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32",
                    "http://placehold.it/32x32"
                ],
                "audience": [
                    "All",
                    "Female",
                    "Male",
                    "Children"
                ],
                "enabledOnlineBooking": true,
                "price": {
                    "duration": 273,
                    "priceType": "From",
                    "price": "$127.94",
                    "specialPrice": "$186.33",
                    "pricingName": "fugiat officia eu"
                },
                "pricingOptions": [
                    {
                        "duration": 218,
                        "priceType": "Fixed",
                        "price": "$188.01",
                        "specialPrice": "$54.88",
                        "pricingName": "irure non laboris"
                    },
                    {
                        "duration": 76,
                        "priceType": "From",
                        "price": "$345.08",
                        "specialPrice": "$160.32",
                        "pricingName": "aliqua esse et"
                    },
                    {
                        "duration": 300,
                        "priceType": "Fixed",
                        "price": "$89.43",
                        "specialPrice": "$258.45",
                        "pricingName": "commodo non labore"
                    },
                    {
                        "duration": 170,
                        "priceType": "Fixed",
                        "price": "$119.77",
                        "specialPrice": "$354.44",
                        "pricingName": "anim minim laboris"
                    },
                    {
                        "duration": 75,
                        "priceType": "Fixed",
                        "price": "$304.18",
                        "specialPrice": "$88.05",
                        "pricingName": "amet ad minim"
                    },
                    {
                        "duration": 310,
                        "priceType": "From",
                        "price": "$184.82",
                        "specialPrice": "$332.90",
                        "pricingName": "consequat ad exercitation"
                    }
                ],
                "enabledExtratimeafter": false,
                "extraTime": 31,
                "tags": [
                    "mollit",
                    "laboris",
                    "quis"
                ]
            }
        ]
    }
];