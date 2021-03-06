// Начальная функция

(function(){

	const isMobile = window.innerWidth <= 768
	const isIndexPage = $('.index-page').length
	const header = $('.header')
	const headerNotBgClass = 'background-transparent'

	if (isMobile) {
		$('.header__burger').click(() => {
			header.toggleClass('active')
			$('body').toggleClass('overflow-hidden')
			if (isIndexPage && window.pageYOffset < $('.index-hero').height() - 50) {
				header.toggleClass(headerNotBgClass)
			}
		})

		$(document).click(function (e) {
			var el = '.header__burger';
			if ($(e.target).closest(el).length) return;
			header.removeClass('active')
			$('body').removeClass('overflow-hidden')
			if (isIndexPage  && window.pageYOffset < $('.index-hero').height() - 50) {
				header.addClass(headerNotBgClass)
			}
		});

		if (isIndexPage) {
			const main = $('.main')
			const mainNotPaddingClass = 'not-paddding-top'
			const indexHeroHeight = $('.index-hero').height()

			header.addClass(headerNotBgClass)
			main.addClass(mainNotPaddingClass)

			$(window).scroll(() => {
				if (window.pageYOffset >= indexHeroHeight - 50) {
					header.removeClass(headerNotBgClass)
				} else {
					header.addClass(headerNotBgClass)
				}
			})
		}
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
				if (!isMobile && self.offset().left + self.find('.select-field__list').width() > $(window).width()) {
					self.addClass('right')
				}
				selects.not(self).removeClass('open').removeClass('right')
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
			$(videoBlock).find('video').get(0).setAttribute('src', '')
			$(videoBlock).find('video').get(0).pause()
			$(videoBlock).find('video').get(0).currentTime = 0
			if (isMobile) {
				$(videoBlock).closest('.card-views').find('.card-views__thumbs-video.photo').addClass('hide')
				$(videoBlock).closest('.card-views').find('.card-views__thumbs-video.video').removeClass('hide')
			}
		}

		const initSlider = (slug) => {
			const openModal = $(`#${slug}`)
			const arrows = openModal.find('.card-views__display-arrow')
			const thumbEl = openModal.find('.card-views__thumbs-slider')
			const displayEl = openModal.find('.card-views__display-slider')
			const videoButton = openModal.find('.card-views__thumbs-video.video')
			const photoButton = openModal.find('.card-views__thumbs-video.photo')
			const videoBlock = openModal.find('.card-views__display-video')
			const videoEl = videoBlock.find('video')
			const videoSrc = $(videoEl).data('video')
			let videoShow = 0

			thumbEl.not('.slick-initialized').slick({
				infinite: false,
				lazyLoad: 'ondemand',
				vertical: true,
				slidesToShow: 10,
				slidesToScroll: 1,
				arrows: false,
				asNavFor: displayEl,
				focusOnSelect: true,
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
			
			displayEl.not('.slick-initialized').slick({
				infinite: false,
				lazyLoad: 'ondemand',
				slidesToShow: 1,
				slidesToScroll: 1,
				asNavFor: thumbEl,
				arrows: false,
				responsive: [
					{
						breakpoint: 768,
						settings: {
							adaptiveHeight: true
						}
					}
				]
			})
	
			arrows.click(function(){
				$(displayEl).slick($(this).hasClass('prev') ? 'slickPrev' : 'slickNext')
			})

			thumbEl.on('beforeChange', function() {
				if (videoBlock.hasClass('active')) {
					closeVideo(videoBlock)
				}
			});

			videoButton.click(function() {
				videoBlock.addClass('active')
				videoEl.get(0).setAttribute('src', videoSrc)
				videoEl.get(0).play()
				if (isMobile) {
					$(this).addClass('hide')
					photoButton.removeClass('hide')
				}
			})

			photoButton.click(function() {
				closeVideo(videoBlock)
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

		const initRemodal = (slug) => {
      console.log("initRemodal -> slug", slug)
			$(`#${slug}`).modal()
		}

		$('body').on('click', '.catalog-list-block', function(e) {
			initRemodal($(e.currentTarget).data('modal-id'))
		})

		// let isNextClick = false

		$('body').on('click', '.card-info__next', function(e) {
			// isNextClick = true
			e.stopPropagation()
			const currentSlug = $(e.currentTarget).closest('.card-modal').attr('id')
			let searchIndex = null

			$('.catalog-list-block').each((index, item) => {
				if ($(item).data('modal-id') === currentSlug && searchIndex === null) {
					searchIndex = index
				}
			})
			const nextIndex = searchIndex + 1 < $('.catalog-list-block').length ? searchIndex + 1 : 0
			
			const nextSlug = $('.catalog-list-block').eq(nextIndex).data('modal-id')
			initRemodal(nextSlug)
		});

		$(document).on('modal:after-close', '.modal', function (e) {
			if ($(e.currentTarget).attr('id') !== 'contact-modal') {
				const currentModal = $(e.currentTarget)
				const thumbEl = currentModal.find('.card-views__thumbs-slider')
				const displayEl = currentModal.find('.card-views__display-slider') 
				const currentVideo = currentModal.find('.card-views__display-video')
				
				thumbEl.slick('unslick')
				displayEl.slick('unslick')
				closeVideo(currentVideo)
			}
			const scrollSize = $(window).scrollTop()
			window.location.hash = ''
			$(window).scrollTop(scrollSize)
		});

		$(document).on('modal:open', '.modal', function (e) {
			const id = $(e.currentTarget).attr('id')
			let duration = 0
			if (isMobile) duration = 100
			
    	setTimeout(() => {
				if (id !== 'contact-modal') initSlider(id)
				window.location.href = window.location.origin + window.location.pathname + '#' + id
			},duration)
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

	if ($('[data-instagram]').length) {
		const prefix = '@'
		$('[data-instagram]').on('input propertychange', (e) => {
			const curVal = $(e.currentTarget).val()
			if (curVal.slice(0, 1) !== prefix && curVal !== prefix) {
				$(e.currentTarget).val(prefix + curVal)
			}
		})
	}

	if ($('.payment-page').length) {

		$('.payment-calculator').on('change keyup', '.js-text-input', function () {
			$(this).removeClass('invalid')
			if ($(this).val().length === 0) {
				$(this).addClass('invalid')
			}
		});

		$('.payment-calculator').on('change', '.js-file-input', function () {
			$(this).siblings('.payment-calculator__item-sub-add').removeClass('invalid')
		});

		const validateCalc = () => {
			let isValid = true

			$('.js-text-input').each((index, item) => {
				if ($(item).val().length === 0) {
					$(item).addClass('invalid')
					isValid = false
				}
			})

			if ($('.payment-calculator__item-sub-add').length && $('.payment-calculator__item-sub-add span').text() !== 'Акт приема загружен') {
				$('.js-file-input').siblings('.payment-calculator__item-sub-add').addClass('invalid')
				isValid = false
			}
			
			return isValid
		}

		$('.payment-page__btn').click((e) => {
			let isValidCalc = validateCalc()
			if (isValidCalc) {
				$(e.target).addClass('active').siblings().removeClass('active')
				$('.payment-page__tab').eq($(e.target).index()).addClass('active').siblings().removeClass('active')
				$('.payment-calculator__title').slideUp();
				$('.payment-calculator__list').slideUp();
				$('.payment-calculator__add').slideUp();
			}
		})
	}

	if ($('[data-summ]').length) {
		$('[data-summ]').mask("# ##0 ₽", {reverse: true});
	}

	if ($('[data-date]').length) {
		$('[data-date]').mask("##.##.####");
	}

	if ($('.js-scroll-to').length) {
		$('.js-scroll-to').on("click", function(e){
			e.preventDefault()
			const id = $(this).attr('href')
			const scrollEl = $(id)
			if (scrollEl.length) {
				$('html, body').stop().animate({
					scrollTop: scrollEl.offset().top
				}, 400);
			}

			window.location = scrollEl.length ? `${window.location.pathname}${id}` : `/${id}`
		});
	}

	if ($('.index-portfolio').length) {
		$('.index-portfolio__slider').slick({
			arrows: false,
			variableWidth: true,
			swipeToSlide: true,
		})
	}

	if ($('.index-hero').length) {
		$('.index-hero__video').find('video').get(isMobile ? 1 : 0).play()
	}

	if (window.location.hash && $(window.location.hash).length) {
		$('html, body').stop().animate({
			scrollTop: $(window.location.hash).offset().top
		}, 0);
	}

	if (window.location.hash && $(`[data-remodal-id=${window.location.hash.slice(1)}]`).length) {
		const remodal = $(`[data-remodal-id=${window.location.hash.slice(1)}]`).remodal()
		remodal.open()
	}

	if ($('[data-zoomable]').length) {
		mediumZoom('[data-zoomable]')
	}

	$(function() {
    $('[data-modal]').on('click', function() {
      $($(this).data('modal')).modal();
      return false;
		});
		
		if (
			(window.location.hash && window.location.pathname !== '/') || 
			window.location.hash === '#contact-modal'
		) $(window.location.hash).modal()
  });
})();