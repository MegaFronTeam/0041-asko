"use strict";

// import Swiper from '../libs/swiper/swiper-bundle.min.mjs';
// import JSCCommon from "./JSCCommon.js";

function eventHandler() {
	// const $ = jQuery;
	JSCCommon.init();

	function whenResize() {
		JSCCommon.setFixedNav();
	}

	window.addEventListener(
		"scroll",
		() => {
			JSCCommon.setFixedNav();
		},
		{passive: true}
	);
	window.addEventListener("resize", whenResize, {passive: true});

	whenResize();

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

	new Swiper(".sCatalog__slider--js", {
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
			nextEl: ".sCatalog .swiper-button-next",
			prevEl: ".sCatalog .swiper-button-prev",
		},
		pagination: {
			el: " .sCatalog .swiper-pagination",
			type: "bullets",
			clickable: true,
			// renderBullet: function (index, className) {
			// 	return '<span class="' + className + '">' + (index + 1) + '</span>';
			// }
		},
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
			hide: true,
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
			.querySelector(".cat-btn-toggle")
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
