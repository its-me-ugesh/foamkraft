//Wrapping all JavaScript code into a IIFE function for prevent global variables creation
(function(){
"use strict";

function initShopTables() {

    jQuery('div.quantity').each(function () {
        var $this = jQuery(this);

        if ($this.find('.plus').length) {
            return;
        }

        $this.find('[type="number"]')
            .before('<input type="button" value="-" class="minus">')
            .after('<input type="button" value="+" class="plus">');
    });

    jQuery('.single_add_to_cart_button').addClass('theme_button');

    jQuery('.plus, .minus').on('click', function (e) {
        var numberField = jQuery(this).parent().find('[type="number"]');
        var currentVal = numberField.val();
        var sign = jQuery(this).val();
        if (sign === '-') {
            if (currentVal > 1) {
                numberField.val(parseFloat(currentVal) - 1);
            }
        } else {
            numberField.val(parseFloat(currentVal) + 1);
        }
        numberField.trigger('change');
    });
}

//quantity arrows
function addQuantityArrows() {
    jQuery('<i class="fa fa-angle-down"></i>').insertAfter('input.minus');
    jQuery('<i class="fa fa-angle-up"></i>').insertAfter('input.plus');
}

//products in carousel
function productsInOwlCarousel() {
    jQuery('.uws-products.carousel-layout').each(function(){
        var $productsWrapper = jQuery( this );
        var $products = $productsWrapper.find('ul.products');
        var $carouselFilters = $productsWrapper.children('.filters');
        if ( $carouselFilters.length ) {
            var filtersClass = '.' + $carouselFilters.attr('class').replace('filters ', '');
            $products.attr('data-filters', filtersClass);
        }

        var $carouselColumns = Number($productsWrapper.attr('class').slice($productsWrapper.attr('class').indexOf('carousel-col-')).replace('carousel_col_', ''));

        var responsiveLg, responsiveMd, responsiveSm, responsiveXs;
        switch ($carouselColumns) {
            case 1:
                responsiveLg = 1;
                responsiveMd = 1;
                responsiveSm = 1;
                responsiveXs = 1;
                break;
            case 2:
                responsiveLg = 2;
                responsiveMd = 2;
                responsiveSm = 1;
                responsiveXs = 1;
                break;
            case 3:
                responsiveLg = 3;
                responsiveMd = 2;
                responsiveSm = 2;
                responsiveXs = 1;
                break;
            case 5:
                responsiveLg = 5;
                responsiveMd = 4;
                responsiveSm = 3;
                responsiveXs = 2;
                break;
            case 6:
                responsiveLg = 6;
                responsiveMd = 4;
                responsiveSm = 3;
                responsiveXs = 2;
                break;
            default:
                responsiveLg = 4;
                responsiveMd = 3;
                responsiveSm = 2;
                responsiveXs = 2;
        }

        var data = $products.data();

        var filters = data.filters ? data.filters : false;

        if (filters) {
            // $carousel.clone().appendTo($carousel.parent()).addClass( filters.substring(1) + '-carousel-original' );
            $products.after($products.clone().addClass('owl-carousel-filter-cloned').css('display', 'none'));
            jQuery(filters).on('click', 'a', function( e ) {
                //processing filter link
                e.preventDefault();
                var $thisA = jQuery(this);
                if ($thisA.hasClass('selected')) {
                    return;
                }
                var filterValue = $thisA.attr('data-filter');
                $thisA.siblings().removeClass('selected active');
                $thisA.addClass('selected active');

                //removing old items
                for (var i = $products.find('.owl-item').length - 1; i >= 0; i--) {
                    $products.trigger('remove.owl.carousel', [1]);
                }

                //adding new items
                console.log( $products.next().find(' > ' +filterValue) );
                var $filteredItems = jQuery($products.next().find(' > ' +filterValue).clone());
                $filteredItems.each(function() {
                    $products.trigger('add.owl.carousel', jQuery(this));
                    jQuery(this).addClass('scaleAppear');
                });

                $products.trigger('refresh.owl.carousel');

                //reinit prettyPhoto in filtered OWL carousel
                if (jQuery().prettyPhoto) {
                    $products.find("a[data-gal^='prettyPhoto']").prettyPhoto({
                        hook: 'data-gal',
                        theme: 'facebook', /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
                        social_tools: false
                    });
                }
            });

        } //filters

        $products.addClass('owl-carousel owl-theme').owlCarousel({
            loop: false,
            margin: 30,
            nav: true,
            dots: false,
            items: $carouselColumns,
            responsive: {
                0: {
                    items: 1
                },
                500: {
                    items: responsiveXs
                },
                767: {
                    items: responsiveSm
                },
                992: {
                    items: responsiveMd
                },
                1200: {
                    items: responsiveLg
                }
            }
        });

    });
}

jQuery(document).ready(function () {

    //////////
    //layout//
    //layout//
    //////////

    productsInOwlCarousel();

    //tables - reloaded - needs CSS
    initShopTables();
    jQuery('.shop_attributes').addClass('table');

    //woo cart update events:
    //- update_checkout
    //- updated_wc_div
    //- updated_cart_totals
    //- updated_shipping_method
    //- applied_coupon
    //- removed_coupon

    jQuery('body').on('updated_cart_totals', function (e) {
        initShopTables();
    });


    jQuery('.woocommerce-review-link').wrap('<span class="review-links greylinks" />');

    //single products variants table
    jQuery('td.label').removeClass('label');

    //sinlge product tabs
    jQuery('.woocommerce-tabs ul.wc-tabs').addClass('nav nav-tabs color4');
    jQuery('.woocommerce-tabs .wc-tab')
        .removeClass('panel')
        .wrapAll('<div class="tab-content big-padding top-color-border color4 bottommargin_30" />');


    //woocommerce pagination
    jQuery('.woocommerce-pagination')
        .addClass('comment-navigation')
        .find('ul.page-numbers')
        .addClass('pagination')
        .find('.current')
        .parent().addClass('active');

    //woo widgets
    jQuery('.widget_layered_nav_filters, .widget_rating_filter').addClass('widget_nav_menu darklinks');
    jQuery('.widget_shopping_cart, .widget_top_rated_products, .widget_products, .widget_recent_reviews, .widget_recently_viewed_products').addClass('darklinks');
    jQuery('.widget_product_categories, .widget_layered_nav').addClass('widget_categories greylinks');

    jQuery('.woocommerce-product-search').find('.search-field').addClass('form-control');

    jQuery('.widget_product_tag_cloud').addClass('widget_tag_cloud');

    jQuery('.price_slider_amount').find('.button').addClass('theme_button color1');

    jQuery('#woocommerce-product-search-field-5').attr('placeholder', 'keyword');

    //woocommerce comment form
    jQuery('#review_form .comment-form').find('input, textarea').each(function () {
        var $this = jQuery(this);
        var placeholder = $this.parent().find('label').text().replace('*', '');
        $this.attr('placeholder', placeholder);
    });


    //view toggler
    jQuery('#toggle_shop_view').on('click', function (e) {
        e.preventDefault();
        jQuery(this).toggleClass('grid-view');
        jQuery('#products, ul.products').toggleClass('grid-view list-view');
        if (jQuery.cookie) {
            if (jQuery('#products, ul.products').hasClass('list-view')) {
                jQuery.cookie('grid-view', 'list-view');
            } else {
                jQuery.cookie('grid-view', 'grid-view');
            }
        }
    });
    if (jQuery.cookie) {
        if (jQuery.cookie('grid-view') == 'list-view') {
            jQuery('#toggle_shop_view').trigger('click');
        }
    }

    //color filter
    jQuery(".color-filters").find("a[data-background-color]").each(function () {
        jQuery(this).css({"background-color": jQuery(this).data("background-color")});
    });

    //average rating filter
    jQuery('.widget_rating_filter .wc-layered-nav-rating').find('a').wrapInner('<span class="count"></span>').find('.star-rating').each(function() {
        jQuery(this).insertBefore(jQuery(this).parent());
    });

    /////////////
    //Carousels//
    /////////////

    //woocommerce thumbnails
    var thumbnailsCarouselWide = jQuery('.thumbnails-wrap, .thumbnails').closest('.col-xs-12').hasClass('col-md-8');
    var thumbnailsColumnsLg = thumbnailsCarouselWide ? 4 : 5;
    var thumbnailsColumnsMd = thumbnailsCarouselWide ? 3 : 4;
    jQuery('.thumbnails, .thumbnails-wrap').addClass('owl-carousel with_shadow_items').owlCarousel({
        loop: false,
        margin: 10,
        nav: false,
        dots: true,
        items: 3,
        responsive: {
            0: {
                items: 3
            },
            767: {
                items: 4
            },
            992: {
                items: thumbnailsColumnsMd
            },
            1200: {
                items: thumbnailsColumnsLg
            }
        }
    });
    //single product gallery
    jQuery('[data-thumb]').find('a').each(function () {
        jQuery(this).attr('data-gal', 'prettyPhoto[gal]');
    });

    //woocommerce related products, upsells products
    var $relatedProductsCarousel = jQuery('.related.products ul.products, .upsells.products ul.products, .cross-sells ul.products');
    var relatedProductsCarouselWide = $relatedProductsCarousel.closest('.col-xs-12').hasClass('col-md-8');
    var relatedColumnsLg = relatedProductsCarouselWide ? 3 : 4;
    var relatedColumnsMd = relatedProductsCarouselWide ? 3 : 4;
    var relatedColumnSm = relatedProductsCarouselWide ? 2 : 3;
    $relatedProductsCarousel.addClass('owl-carousel owl-theme with_shadow_items').owlCarousel({
        loop: false,
        margin: 30,
        nav: true,
        dots: false,
        items: 3,
        responsive: {
            0: {
                items: 1
            },
            767: {
                items: relatedColumnSm
            },
            992: {
                items: relatedColumnsMd
            },
            1200: {
                items: relatedColumnsLg
            }
        }
    });

    //add quantity arrows
    addQuantityArrows();
    jQuery( document.body ).on( 'updated_cart_totals', addQuantityArrows);

    jQuery( document.body ).on( 'updated_cart_totals', function() {
        console.log('text');
    } );

    // add button classes to login link on register page
    jQuery('.woocommerce-simple-registration-login-link').find('a').addClass('theme_button color1 min_width_button');

    // currency switcher dropdown processing
    jQuery('.login-dropdown').find('.woocs_flag_view_item').each(function() {
        var $item = jQuery(this);
        var $itemCurrencyTitle = $item.attr('data-currency');
        var $itemText = jQuery('<span></span>');
        $itemText.html($itemCurrencyTitle)
        $item.append($itemText);
    });

    jQuery('#woocommerce-product-search-field-1').attr('placeholder', 'keyword');

});

//end of IIFE function
})();