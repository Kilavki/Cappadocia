$(function(){
	$('.fairy-tail__slider, .our-trip__slider').slick({
		prevArrow: '<button type="button" class="slick-btn slick-prev"><img src="images/slides/arrow-prev.svg" alt="arrow-prev"></button>',
		nextArrow: '<button type="button" class="slick-btn slick-next"><img src="images/slides/arrow-next.svg" alt="arrow-next"></button>',
		autoplay: true,
		autoplaySpeed: 10000,
		fade: true,
		adaptiveHeight: true,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					arrows: false,
				}
			}
		]
	});
});