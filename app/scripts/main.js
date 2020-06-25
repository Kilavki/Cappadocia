$(function(){
	$('.fairy-tail__slider, .our-trip__slider').slick({
		prevArrow: '<button type="button" class="slick-btn slick-prev"><img src="images/slides/arrow-prev.svg" alt="arrow-prev"></button>',
		nextArrow: '<button type="button" class="slick-btn slick-next"><img src="images/slides/arrow-next.svg" alt="arrow-next"></button>',
		autoplay: true,
		autoplaySpeed: 1000,
		fade: true,
		adaptiveHeight: true,
		responsive: [
			{
				breakpoint: 768,
				settings: {
					arrows: false,
				}
			}
		]
	});

	$('.nav, .our-trip__body').on('click','a', function (event) {
		//отменяем стандартную обработку нажатия по ссылке
		event.preventDefault();
		//забираем идентификатор бока с атрибута href
		var id  = $(this).attr('href'),
		//узнаем высоту от начала страницы до блока на который ссылается якорь
			top = $(id).offset().top;
		//анимируем переход на расстояние - top за 1500 мс
		$('body,html').animate({scrollTop: top}, 1500);
	});
});