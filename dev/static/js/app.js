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
		}

		const closeForm = () => {
			form.removeClass(activeClass)
			$('body').removeClass('overflow-hidden')
			$('.header__burger').removeClass('hidden')
			clearField()
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
					$('.catalog-filters__form-title').html('фильтр')
					$('.catalog-filters__list').removeClass('hidden')
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
				$('.catalog-filters__form-title').html('фильтр')
				items.removeClass('active')
				$('.catalog-filters__list').removeClass('hidden')
			})
		}

		const rangeList = (self, active) => {
			const placeholder = self.data('placeholder')
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
				}
			});

			resetButton.click(() => {
				startEl.html(`${start} ${suffix} `)
				endEl.html(` ${end} ${suffix}`)
				slider[0].noUiSlider.set([start, end])
				active.html(placeholder)
			})
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

	if ($('.card-views').length) {
		const initSlider = (slug) => {
			const thumbSlider = '.card-views__thumbs-slider'
			const displaySlider = '.card-views__display-slider'
			const arrows = $('.card-views__display-arrow')
			const thumbEl = $(thumbSlider).closest('.remodal').filter('.remodal-is-opened').find(thumbSlider)
			const displayEl = $(displaySlider).closest('.remodal').filter('.remodal-is-opened').find(displaySlider)

			thumbEl.slick({
				vertical: true,
				slidesToShow: 4,
				slidesToScroll: 1,
				arrows: false,
				asNavFor: displayEl,
				focusOnSelect: true,
				infinity: true
			})
	
			displayEl.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				asNavFor: thumbEl,
				infinity: true,
				arrows: false,
				dots: true,
				customPaging: function() {
					return ''
				}
			})
	
			arrows.click(function(){
				$(displayEl).slick($(this).hasClass('prev') ? 'slickPrev' : 'slickNext')
			})
		}

		$(document).on('opened', '.remodal', function (e) {
			initSlider($(e.target).data('remodal-id'))
		});
	}
})();