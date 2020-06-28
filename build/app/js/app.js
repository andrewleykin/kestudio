// Начальная функция

(function(){

	const isMobile = window.innerWidth <= 768

	if (isMobile) {
		$('.header__burger').click(() => {
			$('.header').toggleClass('active')
			$('body').toggleClass('overflow-hidden')
		})

		$(document).click(function (e) {
			var el = '.header__burger';
			if ($(e.target).closest(el).length) return;
			$('.header').removeClass('active')
			$('body').removeClass('overflow-hidden')
		});
	}

	if ($('.catalog-filters').length && isMobile) {
		const form = $('.catalog-filters__form')
		const formTitle = $('.catalog-filters__form-title')
		const fields = $('.select-field')
		const filtersItem = $('.catalog-filters__item')
		const resetButton = $('.catalog-filters__form-reset')
		const filterTitleString = 'фильтр'
		const activeClass = 'active'
		const openClass = 'open'
		const hiddenClass = 'hidden'

		const clearField = () => {
			formTitle.html(filterTitleString)
			fields.removeClass(openClass)
			filtersItem.removeClass(hiddenClass)
			$('.catalog-filters__list').removeClass('hidden')
			$('.catalog-filters__form-reset').show()
		}

		const closeForm = () => {
			clearField()
			form.removeClass(activeClass)
			$('body').removeClass('overflow-hidden')
			$('.header__burger').removeClass('hidden')
			$('.catalog-filters__form-reset').hide()
		}

		$('.catalog-filters__btn').click((e) => {
			e.stopPropagation()
			$('body').addClass('overflow-hidden')
			$('.header__burger').addClass('hidden')
			$('.catalog-filters__form').addClass(activeClass)
		})

		$('.catalog-filters__form-close').click(closeForm)
		$('.catalog-filters__result').click(closeForm)

		resetButton.click(() => {
			fields.each((index, field) => {
				if ($(field).find('.range-field__slider-slider').length) {
					$(field).find('.range-field__slider-slider').each((index, item) => {
						if (item.noUiSlider) {
							const start = $(item).data('start')
							const end = $(item).data('end')
							const suffix = $(item).data('suffix')
							$(field).find('.range-field__select-start').html(`${start} ${suffix} `)
							$(field).find('.range-field__select-end').html(` ${end} ${suffix}`)
							item.noUiSlider.set([start, end])
						}
					})
				}
				$(field).find('.select-field__active').html($(field).data('placeholder'))
			})
			$('.select-field__item').removeClass('active')
		})

		formTitle.click((e) => {
			e.stopPropagation()
			if (e.target.tagName === 'I') clearField()
		})

		$(document).click(function (e) {
			var el = '.catalog-filters__form-wrap';
			if ($(e.target).closest(el).length) return;
			closeForm()
		});
	}

	if ($('.select-field').length) {
		const selects = $('.select-field');

		const clearMobile = () => {
			if (isMobile) {
				$('.catalog-filters__form-title').html('фильтр')
				$('.catalog-filters__list').removeClass('hidden')
				$('.catalog-filters__form-reset').show()
			}
		}

		const selectList = (self, active) => {
			const items = self.find('.select-field__item')
			const closeButton = self.find('.select-field__close')
			const resetButton = self.find('.select-field__reset')
			const placeholder = self.data('placeholder')
			let activeItems = []

			items.click(function(e) {
				e.preventDefault()
				const itemText = $(this).text().trim()
				self.addClass('active')

				if (active.text() === placeholder && activeItems.length > 0) {
					activeItems = []
				}

				if (self.hasClass('multiselect-field')) {
					if ($(this).hasClass('active')) {
						$(this).removeClass('active')
						activeItems = activeItems.filter(item => item !== itemText)
						active.html(activeItems.length === 0 ? placeholder : activeItems.join(', '))
						if (activeItems.length === 0) self.removeClass('active')
					} else {
						$(this).addClass('active')
						activeItems.push(itemText)
						active.html(activeItems.join(', '))
					}
				} else {
					active.html(itemText)
					self.removeClass('open')
					clearMobile()
				}
			})

			closeButton.click(function() {
				if (self.hasClass('multiselect-field')) {
					activeItems = []
				}
				self.removeClass('active')
				active.html(placeholder)
			})

			resetButton.click(() => {
				activeItems = []
				active.html(placeholder)
				self.removeClass('open').removeClass('active')
				items.removeClass('active')
				clearMobile()
			})
		}

		const rangeList = (self, active) => {
			const placeholder = self.data('placeholder')
			const closeButton = self.find('.select-field__close')
			const slider = self.find('.range-field__slider-slider')
			const startEl = self.find('.range-field__select-start')
			const endEl = self.find('.range-field__select-end')
			const resetButton = self.find('.range-field__reset')
			const start = +slider.data('start')
			const end = +slider.data('end')
			const min = +slider.data('min')
			const max = +slider.data('max')
			const step = slider.data('step')
			const suffix = slider.data('suffix')
			
			const resetRange = () => {
				startEl.html(`${start} ${suffix} `)
				endEl.html(` ${end} ${suffix}`)
				slider[0].noUiSlider.set([start, end])
				active.html(placeholder)
				self.removeClass('active')
			}

			noUiSlider.create(slider[0], {
				start: [start, end],
				connect: true,
				range: {
					min,
					max
				},
				step,
				format: wNumb({
					decimals: 0
				}),
			});

			slider[0].noUiSlider.on('update', (e) => {
				if (+e[0] !== start || +e[1] !== end) {
					startEl.html(`${e[0]} ${suffix} `)
					endEl.html(` ${e[1]} ${suffix}`)
					active.html(`${e[0]} ${suffix} - ${e[1]} ${suffix}`)
					self.addClass('active')
				}
			});

			resetButton.click(resetRange)
			closeButton.click(resetRange)
		}

		selects.each((index, item) => {
			const self = $(item)
			const active = self.find('.select-field__active')
			const placeholder = self.data('placeholder')

			active.click(() => {
				self.toggleClass('open')
				selects.not(self).removeClass('open')
				if (isMobile) {
					$('.catalog-filters__list').addClass('hidden')
					$('.catalog-filters__form-title').html(`<i></i> ${placeholder}`)
					$('.catalog-filters__form-reset').hide()
				}
			})

			if (self.find('.select-field__list')) {
				selectList(self, active)
			}
			if (self.data('range')) {
				rangeList(self, active)
			}
		})

		$(document).click(function (e) {
			var el = '.select-field';
			if ($(e.target).closest(el).length || isMobile) return;
			selects.removeClass('open')
			$('.catalog-filters__item').removeClass('hidden')
		});
	}

	if ($('.catalog-list').length) {
		const closeVideo = (videoBlock) => {
			$(videoBlock).removeClass('active')
			$(videoBlock).find('video').get(0).pause()
			$(videoBlock).find('video').get(0).currentTime = 0
		}

		const initSlider = (slug) => {
			const openModal = $(`[data-remodal-id=${slug}]`)
			const arrows = openModal.find('.card-views__display-arrow')
			const thumbEl = openModal.find('.card-views__thumbs-slider')
			const displayEl = openModal.find('.card-views__display-slider')
			const videoButton = openModal.find('.card-views__thumbs-video')
			const videoBlock = openModal.find('.card-views__display-video')
			const videoEl = videoBlock.find('video')
			let videoShow = 0

			if (!thumbEl.hasClass('slick-initialized')) {
				thumbEl.slick({
					vertical: true,
					slidesToShow: 4,
					slidesToScroll: 1,
					arrows: false,
					asNavFor: displayEl,
					focusOnSelect: true,
					infinity: true,
					responsive: [
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 4,
								slidesToScroll: 1,
								vertical: false,
								variableWidth: true,
								centerMode: true
							}
						},
					]
				})
			}

			if (!displayEl.hasClass('slick-initialized')) {
				displayEl.slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					asNavFor: thumbEl,
					infinity: true,
					arrows: false
				})
			}
	
			arrows.click(function(){
				$(displayEl).slick($(this).hasClass('prev') ? 'slickPrev' : 'slickNext')
			})

			thumbEl.on('beforeChange', function() {
				if (videoBlock.hasClass('active')) {
					closeVideo(videoBlock)
				}
			});

			videoButton.click(() => {
				videoBlock.addClass('active')
				videoEl.get(0).play()
			})

      videoEl.get(0).addEventListener('ended', function() {
				videoShow++
				
				if (videoShow > 1) {
					closeVideo(videoBlock)
					return
				}

				videoEl.get(0).play()
			})
		}

		$('.catalog-list').on('click', '.catalog-list-block', function(e) {
			const slug = $(e.currentTarget).data('name')
			const remodal = $(`[data-remodal-id=${slug}]`).remodal()
			remodal.open()
			initSlider(slug)
		});

		$(document).on('closed', '.remodal', function (e) {
			$('.card-views__display-video').each((index, item) => {
				closeVideo(item)
			})
		});
	}

	if ($('[data-toggle="datepicker"]').length) {
		$.fn.datepicker.languages['ru-RU'] = {
			format: 'dd.mm.YYYY',
			days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
			daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
			daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
			months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			weekStart: 1,
			startView: 0,
			yearFirst: false,
			yearSuffix: ''
		};

		$('[data-toggle="datepicker"]').datepicker({
			language: 'ru-RU',
			autoHide: true
		});
	}

	if ($('[data-phone]').length) {
		$('[data-phone]').mask('+7 (000) 000 00 00')
	}

	if ($('.payment-page').length) {
		$('.payment-page__btn').click((e) => {
			$(e.target).addClass('active').siblings().removeClass('active')
			$('.payment-page__tab').eq($(e.target).index()).addClass('active').siblings().removeClass('active')
		})
	}

	if ($('[data-summ]').length) {
		$('[data-summ]').mask("# ##0 ₽", {reverse: true});
	}
})();
$(document).ready(function () {
    svg4everybody({});
});
// Библиотека wow.js для анимации

(function () {
	// new WOW().init();
})();
// функция валидации формы
(function(){

	if ($('[data-validation]').length) {
		initializeValidate();
	}
	if($('.form')) {
		clearForm();
	}

	function clearForm(){
		var inputs = $('.form').find('input, textarea'),
			newVal = '';

		for(i=0;i<inputs.length;i++) {
			inputs.eq(i).val(newVal);
		}
	}

	/* Validate Form */
	function initializeValidate() {
		$('[data-validation]').each(function () {
		    var validator = $(this),
		        inputs = validator.find('input:not(:checkbox, [type=hidden]), textarea'),
						submit = validator.find('button[type=submit]'),
						selects = validator.find('.form-select'),
						stopSubmitIndex = 0;
			
		    inputs.each(function() {
		    	$(this).focus(function() {
		    		$(this).parent().removeClass('invalid')
		    	});
				});
				
		    validator.on('change keyup', 'input[data-name]', function () {
						var elm = $(this);
						if (elm.val().trim() === '₽') elm.val('')
		        checkValidity(elm);
				});
				
				selects.each((index, item) => {
					var self = $(item),
						placeholder = self.data('placeholder'),
						active = self.find('.select-field__active');
					
					active.bind('DOMSubtreeModified', function(e){
						if (placeholder !== $(e.target).text()) {
							self.parent().removeClass('invalid').addClass('valid');
						}
					});
				})

		    submit.on('click', function (e) {

					inputs.each((index, item) => {
						if ($(item).data('name')) checkValidity(item)
						if ($(item).parent().hasClass('invalid')) stopSubmitIndex++;
					})

					if (selects.length) {
						selects.each((index, item) => {
							checkSelect(item)
						})
					}

					if (stopSubmitIndex > 0) {
						e.preventDefault();
					}
		    });
		});
	}

	function checkSelect(item) {
		var self = $(item),
			placeholder = self.data('placeholder'),
			active = self.find('.select-field__active');
		
		if (placeholder === active.text()) {
			self.parent().removeClass('valid').addClass('invalid')
		}
	}

	function checkValidity(elm) {
	    var elm = $(elm),
	        val = elm.val(),
	        block = elm.parent(),
	        name_reg = /^[A-Za-zА-Яа-яЁё\-\s]+$/,
					text_reg = /^[A-Za-zА-Яа-яёЁ\s\d]/,
	        mail_reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	        phone_reg = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){11,14}(\s*)?$/,
	        num_reg = /^\d+$/;


	    if (elm.prop('disabled')) {
	        return;
	    } else if (elm.is('[data-name="name"]')) {
	        if (name_reg.test(val)) {
	            block.removeClass('invalid').addClass('valid');
	        } else {
	            block.removeClass('valid').addClass('invalid');
	        }
	    } else if (elm.is('[data-name="email"]')) {
	        if (mail_reg.test(val)) {
	            block.removeClass('invalid').addClass('valid');
	        } else {
	            block.removeClass('valid').addClass('invalid');
	        }
	    } else if (elm.is('[data-name="phone"]')) {
	        if (phone_reg.test(val)) {
	            block.removeClass('invalid').addClass('valid');
	        } else {
	            block.removeClass('valid').addClass('invalid');
	        }
	    } else if (elm.is('[data-name="num"]')) {
	        if (num_reg.test(val)) {
	            block.removeClass('invalid').addClass('valid');
	        } else {
	            block.removeClass('valid').addClass('invalid');
	        }
	    } else if (elm.is('[data-name="text"]')) {
	        if (text_reg.test(val)) {
	            block.removeClass('invalid').addClass('valid');
	        } else {
	            block.removeClass('valid').addClass('invalid');
	        }
	    } 
	}
})();