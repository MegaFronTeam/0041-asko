"use strict";

// import Swiper from '../libs/swiper/swiper-bundle.min.mjs';
// import JSCCommon from "./JSCCommon.js";

function eventHandler() {
	// const $ = jQuery;
	JSCCommon.init();

	function whenResize() {
		JSCCommon.setFixedNav();
		setCatalogModalHeight();
	}

	function initProdBodyNav() {
		const prodBody = document.querySelector(".sProdBody");
		if (!prodBody) return;
		const head = prodBody.querySelector(".sProdBody__head--base");
		const fixedHead = prodBody.querySelector(".sProdBody__head--fixed");
		const linkSelector =
			'.sProdBody__head--base a[href^="#"], .sProdBody__head--fixed a[href^="#"]';
		const links = Array.from(prodBody.querySelectorAll(linkSelector));
		const sectionIds = Array.from(
			new Set(
				links
					.map(link => link.getAttribute("href"))
					.filter(href => href && href.startsWith("#"))
			)
		);
		const sections = sectionIds
			.map(id => document.querySelector(id))
			.filter(Boolean);
		if (!sections.length) return;

		const linkMap = new Map();
		sectionIds.forEach(id => {
			linkMap.set(
				id,
				links.filter(link => link.getAttribute("href") === id)
			);
		});

		let lastActiveId = null;
		const getOffset = () =>
			fixedHead && fixedHead.classList.contains("active")
				? fixedHead.offsetHeight - 80
				: 0;

		const setActive = id => {
			if (!id || id === lastActiveId) return;
			lastActiveId = id;
			linkMap.forEach((group, key) => {
				group.forEach(link => link.classList.toggle("active", key === id));
			});
		};

		const updateFixedState = () => {
			if (!head || !fixedHead) return;
			const headBottom = head.getBoundingClientRect().bottom;
			fixedHead.classList.toggle("active", headBottom <= 0);
		};

		const updateActiveByScroll = () => {
			const offset = getOffset() + 160;
			const scrollPos = window.scrollY + offset;
			let current = sections[0];
			sections.forEach(section => {
				if (section.offsetTop <= scrollPos) current = section;
			});
			setActive(`#${current.id}`);
		};

		const onScroll = () => {
			updateFixedState();
			updateActiveByScroll();
		};

		window.addEventListener("scroll", onScroll, {passive: true});
		window.addEventListener("resize", onScroll, {passive: true});
		onScroll();

		links.forEach(link => {
			link.addEventListener("click", event => {
				const id = link.getAttribute("href");
				if (!id || !id.startsWith("#")) return;
				const target = document.querySelector(id);
				if (!target) return;
				event.preventDefault();
				const offset = getOffset() + 160;
				const top =
					target.getBoundingClientRect().top + window.scrollY - offset + 1;
				window.scrollTo({top, behavior: "smooth"});
				setActive(id);
			});
		});
	}

	function setCatalogModalHeight() {
		const catalogModalGroup = document.querySelector(
			".catalog-modal__group--menu"
		);

		if (
			!catalogModalGroup ||
			!document.querySelector(".catalog-modal").classList.contains("active")
		) {
			return;
		}

		const promo = document.querySelector(".catalog-modal__group--promo");
		const topNav = document.querySelector(".top-nav");
		const topLine = document.querySelector(".topLine");
		const windowHeight = window.innerHeight;

		let offset = 0;
		offset += promo ? promo.offsetHeight : 0;
		if (topNav) {
			offset += topNav.offsetHeight;

			// Если top-nav не имеет класс fixed, добавляем высоту topLine
			if (!topNav.classList.contains("fixed") && topLine) {
				offset += topLine.offsetHeight;
			}
		}

		const newHeight = offset;
		catalogModalGroup.style.setProperty(
			"--catalog-modal-offset",
			newHeight + "px"
		);
	}

	window.addEventListener(
		"scroll",
		() => {
			JSCCommon.setFixedNav();
			setCatalogModalHeight();
		},
		{passive: true}
	);
	window.addEventListener("resize", whenResize, {passive: true});

	whenResize();
	initProdBodyNav();

	let defaultSl = {
		spaceBetween: 0,
		lazy: {
			loadPrevNext: true,
		},
		watchOverflow: true,
		loop: true,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
		pagination: {
			el: " .swiper-pagination",
			type: "bullets",
			clickable: true,
			// renderBullet: function (index, className) {
			// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
			// }
		},
	};

	new Swiper(".breadcrumb-slider--js", {
		slidesPerView: "auto",
		freeMode: true,
		watchOverflow: true,
	});
	new Swiper(".auto-slider-js", {
		slidesPerView: "auto",
	});

	const swiper4 = new Swiper(".sBanners__slider--js", {
		// slidesPerView: 5,
		...defaultSl,
		slidesPerView: "auto",
		freeMode: true,
		loopFillGroupWithBlank: true,
		touchRatio: 0.2,
		slideToClickedSlide: true,
		freeModeMomentum: true,
	});

	document.querySelectorAll(".sCatalog").forEach(el => {
		const swiper = el.querySelector(".sCatalog__slider--js");
		new Swiper(swiper, {
			slidesPerView: 2,
			spaceBetween: 10,
			breakpoints: {
				768: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1200: {
					slidesPerView: 4,
					spaceBetween: 20,
				},
			},
			navigation: {
				nextEl: el.querySelector(".sCatalog .swiper-button-next"),
				prevEl: el.querySelector(".sCatalog .swiper-button-prev"),
			},
			pagination: {
				el: el.querySelector(" .swiper-pagination"),
				type: "bullets",
				clickable: true,
				// renderBullet: function (index, className) {
				// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
				// }
			},
		});
		const swiper2 = el.querySelector(".sCatalog__slider--2js");
		new Swiper(swiper2, {
			slidesPerView: 2,
			spaceBetween: 10,
			breakpoints: {
				1200: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
			},
			navigation: {
				nextEl: el.querySelector(".sCatalog .swiper-button-next"),
				prevEl: el.querySelector(".sCatalog .swiper-button-prev"),
			},
			pagination: {
				el: el.querySelector(" .swiper-pagination"),
				type: "bullets",
				clickable: true,
				// }
			},
		});
	});

	new Swiper(".sSets__slider--js", {
		slidesPerView: 2,
		spaceBetween: 10,
		breakpoints: {
			1200: {
				slidesPerView: 1,
				spaceBetween: 20,
			},
		},
		navigation: {
			nextEl: ".sSets .swiper-button-next",
			prevEl: ".sSets .swiper-button-prev",
		},
		pagination: {
			el: " .sSets .swiper-pagination",
			type: "bullets",
			clickable: true,
			// renderBullet: function (index, className) {
			// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
			// }
		},
	});

	new Swiper(".sPopular__slider--js", {
		slidesPerView: "auto",
		freeMode: true,
		scrollbar: {
			el: ".sPopular .swiper-scrollbar",
			draggable: true,
			// hide: true,
		},
	});

	new Swiper(".headerBlock__slider--js", {
		// slidesPerView: 5,
		slidesPerView: 1,
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});

	new Swiper(".sNews__slider--js", {
		slidesPerView: 1,
		spaceBetween: 10,
		breakpoints: {
			576: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			768: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 4,
				spaceBetween: 20,
			},
		},
		navigation: {
			nextEl: ".sNews .swiper-button-next",
			prevEl: ".sNews .swiper-button-prev",
		},
		pagination: {
			el: " .sNews .swiper-pagination",
			type: "bullets",
			clickable: true,
			// renderBullet: function (index, className) {
			// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
			// }
		},
	});
	new Swiper(".sRew__slider--js", {
		slidesPerView: 1,
		spaceBetween: 10,
		breakpoints: {
			576: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
			1200: {
				slidesPerView: 3,
				spaceBetween: 20,
			},
		},
		navigation: {
			nextEl: ".sRew .swiper-button-next",
			prevEl: ".sRew .swiper-button-prev",
		},
		pagination: {
			el: " .sRew .swiper-pagination",
			type: "bullets",
			clickable: true,
			// renderBullet: function (index, className) {
			// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
			// }
		},
	});

	new Swiper(".sVideoAbout__slider--js", {
		slidesPerView: 1,
		spaceBetween: 10,
		navigation: {
			nextEl: ".sVideoAbout .swiper-button-next",
			prevEl: ".sVideoAbout .swiper-button-prev",
		},
		pagination: {
			el: " .sVideoAbout .swiper-pagination",
			type: "bullets",
			clickable: true,
			// renderBullet: function (index, className) {
			// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
			// }
		},
	});

	// sAppliances - связанные слайдеры (галерея управляет описанием)
	const sAppliancesGalSlider = new Swiper(".sAppliances__slider-gal--js", {
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		// watchSlidesProgress: true,
	});

	const sAppliancesCaptionSlider = new Swiper(
		".sAppliances__slider-caption--js",
		{
			slidesPerView: 1,
			spaceBetween: 0,
			loop: true,
			navigation: {
				nextEl: ".sAppliances .swiper-button-next",
				prevEl: ".sAppliances .swiper-button-prev",
			},
			// thumb: {
			// 	swiper: sAppliancesGalSlider,
			// },
		}
	);

	// Синхронизация слайдеров
	sAppliancesGalSlider.controller.control = sAppliancesCaptionSlider;
	sAppliancesCaptionSlider.controller.control = sAppliancesGalSlider;

	const catBtnWrap = document.querySelector(".cat-btns--js");

	if (catBtnWrap) {
		const catBtnWrapWidth = catBtnWrap.offsetWidth;
		const catBtns = document.querySelectorAll(".cat-btns--js .cat-btns__btn");
		let catBtnsWidthSum = 0;
		const catBtnsWidthGap = 10;
		catBtns.forEach((el, index) => {
			if (
				catBtnWrapWidth * 2.3 >=
				catBtnsWidthSum + catBtnsWidthGap * (index + 1)
			) {
			} else {
				el.classList.add("d-none-js");
				el.classList.add("cat-btns__btn-hidden");
			}
			catBtnsWidthSum += el.offsetWidth + catBtnsWidthGap;
		});

		const root = document.documentElement; // :root

		root.style.setProperty(
			"--cat-w-mobile",
			(catBtnsWidthSum + catBtnsWidthGap * catBtns.length) / 3 + 100 + "px"
		);

		document
			.querySelector(".cat-btn-toggle--js")
			.addEventListener("click", function () {
				this.classList.toggle("clicked");
				document.querySelectorAll(".cat-btns__btn-hidden").forEach(el => {
					el.classList.toggle("d-none-js");
				});
			});
	}

	$(".sClientsService").on("click", ".sClientsService__head", function () {
		$(this).parent().toggleClass("active");
		$(this).next().slideToggle();
	});

	function currencyFormat(num) {
		return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
	}
	$(".range-wrap").each(function () {
		let _this = $(this);

		var $range = _this.find(".slider-js");

		var $inputFrom = _this.find(".input_from");

		var $inputTo = _this.find(".input_to");

		var instance,
			from,
			to,
			min = $range.data("min"),
			max = $range.data("max");
		$range.ionRangeSlider({
			skin: "round",
			type: "double",
			grid: false,
			grid_snap: false,
			hide_min_max: false,
			hide_from_to: true,
			//here
			onStart: updateInputs,
			onChange: updateInputs,
			onFinish: updateInputs,
		});
		instance = $range.data("ionRangeSlider");

		function updateInputs(data) {
			from = data.from;
			to = data.to;
			$inputFrom.prop("value", currencyFormat(from));
			$inputTo.prop("value", currencyFormat(to)); // InputFormat();
		}

		$inputFrom.on("change input ", function () {
			var val = +$(this).prop("value").replace(/\s/g, ""); // validate

			if (val < min) {
				val = min;
			} else if (val > to) {
				val = to;
			}

			instance.update({
				from: val,
			});
			$(this).prop("value", currencyFormat(val));
			console.log(val);
		});
		$inputTo.on("change input ", function () {
			var val = +$(this).prop("value").replace(/\s/g, ""); // validate

			if (val < from) {
				val = from;
			} else if (val > max) {
				val = max;
			}

			instance.update({
				to: val,
			});
			$(this).prop("value", currencyFormat(val));
		});
	}); //end

	$(".filter-item__head").on("click", function () {
		$(this)
			.next()
			.slideToggle(function () {
				$(this).parent().toggleClass("active");
			});
	});

	// Product gallery slider - vertical thumbnails and horizontal main slider
	const prodThumbsSlider = new Swiper(".sProdHead__slider-sm", {
		spaceBetween: 10,
		slidesPerView: 6,
		direction: "vertical",
		watchSlidesProgress: true,
		navigation: {
			nextEl: ".sProdHead .swiper-button-next",
			prevEl: ".sProdHead .swiper-button-prev",
		},
	});

	const prodMainSlider = new Swiper(".sProdHead__slider-lg", {
		spaceBetween: 10,
		thumbs: {
			swiper: prodThumbsSlider,
		},
	});

	const input = document.querySelector("#phone");
	if (input) {
		const iti = window.intlTelInput(input, {
			initialCountry: "ru", // стартовая страна
			separateDialCode: true, // код страны отдельно слева
			preferredCountries: ["ru", "pl", "ua"],
			autoPlaceholder: "polite", // авто-плейсхолдер с примером формата
			nationalMode: false,
		});
	}

	// Пример: получить номер в полном формате
	// function getPhone() {
	// 	console.log(iti.getNumber()); // +79161760512
	// }
	$(".order-set-title--js").on("click", function () {
		$(this).toggleClass("active");
		$(this).next(".order-set-items--js").slideToggle();
	});

	$(document).on("click", ".icons-block__item--search", function () {
		$(this).toggleClass("active");
		$(".search-block").toggleClass("active");
	});

	$("body").on(
		"click",
		".top-nav__catalog-button--js, .catalog-modal__close--catalog-js, .icons-block__item--catalog-js",
		function () {
			$(this).toggleClass("active");
			$(".catalog-modal").toggleClass("active");
			setCatalogModalHeight();
		}
	);

	$(document).on("click", ".catalog-modal li:has(.sub-menu) a", function (e) {
		e.preventDefault();
		if (!$(this).next().find(".catalog-modal__title").length) {
			$(this)
				.next()[0]
				.insertAdjacentHTML(
					"afterbegin",
					`<li class="catalog-modal__title h4 row mb-4 align-items-center">
				<div class="col"><a class="text-body" href="${this.href}"> ${this.textContent} </a></div>
				<div class="col-auto">
				<div class="catalog-modal__close catalog-modal__close--catalog-mob-js">×</div>
				</div>
				</li>`
				);
		}
		$(this).next().toggleClass("active");
	});

	$("body").on("click", ".catalog-modal__close--catalog-mob-js", function (e) {
		e.preventDefault();
		$(
			".catalog-modal .search-block__dropdown.active, .catalog-modal .sub-menu.active, .catalog-modal__menu-block.active, .catalog-modal__menu-block-item.active "
		).removeClass("active");
	});

	$("body").on("click mouseover", ".catalog-menu-js li", function (e) {
		e.preventDefault();
		const index = $(this).index();
		$(".catalog-menu-js li").removeClass("active");
		$(this).addClass("active");
		$(`.catalog-modal__menu-block-item.active`).removeClass("active");
		$(`.catalog-modal__menu-block-item:nth-child(${index + 1})`).addClass(
			"active"
		);
	});

	$("body").on("click ", ".icons-block__item--profile-js .icon", function (e) {
		e.preventDefault();
		const index = $(this).index();
		$(this).toggleClass("active");
		$(".cabinet-menu--js").toggleClass("active");
	});

	$("body").on(
		"click",
		".filter-toggle--js, .filter-block__head",
		function (e) {
			e.preventDefault();
			$(".filter-block ").toggleClass("active");
			$("body ").toggleClass("fixed");
		}
	);

	// Intersection Observer для отслеживания видимости кнопки фильтра
	const filterToggle = document.querySelector(".filter-toggle--js");
	const filterToggleFixed = document.querySelector(".filter-toggle--fixed");

	if (filterToggle && filterToggleFixed) {
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					// Если элемент вышел из зоны видимости сверху (scrolled past top)
					// entry.isIntersecting будет false, и boundingClientRect.top будет отрицательным
					if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
						filterToggleFixed.classList.add("active");
					} else {
						filterToggleFixed.classList.remove("active");
					}
				});
			},
			{
				threshold: 0, // Проверяем с самого края видимости
				rootMargin: "0px", // Проверяем точно по границе viewport
			}
		);

		observer.observe(filterToggle);
	}

	$(".product-accordion").on("click", function (e) {
		const target = e.target.closest(
			".product-accordion__img-wrap, .product-accordion__title"
		);
		e.preventDefault();
		if (target) {
			$(this).toggleClass("active");
		}
	});

	// Compare sliders with sync
	const compareHeadSlider = new Swiper(".sCompare__slider--head-js", {
		slidesPerView: "auto",
		freeMode: true,
		watchSlidesProgress: true,
		scrollbar: {
			el: ".sCompare .swiper-scrollbar",
			draggable: true,
		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});

	const compareBodySlider = new Swiper(".sCompare__slider--body-js", {
		slidesPerView: "auto",
		freeMode: true,
		thumbr: {
			swiper: compareHeadSlider,
		},
		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},
	});

	// Sync sliders
	compareHeadSlider.controller.control = compareBodySlider;
	compareBodySlider.controller.control = compareHeadSlider;

	const swiper222 = document.querySelector(".sReviews__slider--js");
	new Swiper(swiper222, {
		slidesPerView: 1,
		spaceBetween: 0,
		breakpoints: {
			1200: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
		},
		navigation: {
			nextEl: ".sReviews .swiper-button-next",
			prevEl: ".sReviews .swiper-button-prev",
		},
		pagination: {
			el: ".sReviews .swiper-pagination",
			type: "bullets",
			clickable: true,
			// renderBullet: function (index, className) {
			// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
			// }
		},
	});

	const swiper222ww = document.querySelector(".sReviews__slider--2js");
	new Swiper(swiper222ww, {
		slidesPerView: 1,
		spaceBetween: 0,
		navigation: {
			nextEl: ".sReviews .swiper-button-next",
			prevEl: ".sReviews .swiper-button-prev",
		},
		pagination: {
			el: ".sReviews .swiper-pagination",
			type: "bullets",
			clickable: true,
			// renderBullet: function (index, className) {
			// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
			// }
		},
	});

	$(".compare-item").on("click", ".compare-item__group-title--js", function () {
		$(this).toggleClass("active");
		const index = $(this).parent().index();
		$(
			`.compare-item__group:nth-child(${index + 1}) .compare-item__toggle-block`
		).slideToggle();
	});

	// Function to update hide-btn class based on --order-index
	function updateHideBtnClass() {
		const slides = $(".sCompare__slide--head");
		const slidesCount = slides.length;

		// Remove hide-btn from all slides
		slides.removeClass("hide-btn");

		// Add hide-btn to the slide with --order-index equal to slidesCount
		slides.each(function () {
			const orderIndex = +$(this).css("--order-index");
			console.log(orderIndex, slidesCount);

			if (orderIndex === slidesCount) {
				$(this).addClass("hide-btn");
			}
		});
	}

	// Run on page load
	updateHideBtnClass();

	$(".compare-item").on(
		"click",
		".compare-item__btn-switch-index--js",
		function () {
			const index = $(this).parents(".sCompare__slide").index();
			const orderIndex = $(this)
				.parents(".sCompare__slide")
				.css("--order-index");

			console.log(index, orderIndex);

			$(`.sCompare__slide[style*="--order-index: ${+orderIndex + 1}"]`).css({
				"--order-index": +orderIndex,
			});

			$(`.sCompare__slide:nth-child(${index + 1})`).css({
				"--order-index": +orderIndex + 1,
			});

			// Update hide-btn class after swap
			updateHideBtnClass();
		}
	);

	document.querySelector("body").addEventListener("click", e => {
		const target = e.target.closest(".catalog-modal__group--promo .promo-item");
		const target2 = e.target.closest(".catalog-modal__group--promo");
		if (document.querySelector(".catalog-modal").classList.contains("active"))
			if (!target && target2) {
				document.querySelector(".promo-block").classList.toggle("active");
				setCatalogModalHeight();
			}
	});

	new Swiper(".sEvents__slider--js", {
		slidesPerView: 1,
		spaceBetween: 0,
		breakpoints: {
			768: {
				slidesPerView: 2,
				spaceBetween: 20,
			},
		},
		pagination: {
			el: ".sEvents .swiper-pagination",
			type: "bullets",
			clickable: true,
			// renderBullet: function (index, className) {
			// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
			// }
		},
	});

	const sliderWrap = document.querySelectorAll(".content-slider-wrap");

	if (sliderWrap.length) {
		sliderWrap.forEach(el => {
			new Swiper(el.querySelector(".content-slider--js"), {
				slidesPerView: 1,
				spaceBetween: 0,
				navigation: {
					nextEl: el.querySelector(".swiper-button-next"),
					prevEl: el.querySelector(".swiper-button-prev"),
				},
				pagination: {
					el: el.querySelector(".swiper-pagination"),
					type: "bullets",
					clickable: true,
				},
			});
		});
	}

	$(".sAbout__toggle--js").on("click", function () {
		$(this).toggleClass("active");
		$(".sAbout__inner").toggleClass("active");
	});

	$(".property-item__toggle--js").on("click", function () {
		$(this).toggleClass("active");
		$(this).next().fadeToggle();
	});

	$(".sCategories__head").on("click", function () {
		$(".sCategories__item.active")
			.removeClass("active")
			.find(".sCategories__head")
			.next()
			.slideUp();
		$(this).next().fadeToggle();
		$(this).parent().toggleClass("active");
	});

	$(".sCategories__caption").on("click", function (e) {
		const innerEl = e.target.closest("a");
		if (!this.parentElement.classList.contains("active") || innerEl) return;
		$(this).next().fadeToggle();
		$(this).parent().toggleClass("active");
		$(this).slideUp();
	});
}

if (document.readyState !== "loading") {
	eventHandler();
} else {
	document.addEventListener("DOMContentLoaded", eventHandler);
}

// window.onload = function () {
// 	document.body.classList.add('loaded_hiding');
// 	window.setTimeout(function () {
// 		document.body.classList.add('loaded');
// 		document.body.classList.remove('loaded_hiding');
// 	}, 500);
// }
