/**
 * Delikatne animacje wejścia sekcji przy scrollu.
 *
 * Klasa .bc-reveal (stan ukryty) jest dodawana DOPIERO tutaj — bez JavaScriptu
 * strona renderuje się normalnie, w pełni widoczna. Przy preferencji
 * ograniczonego ruchu (prefers-reduced-motion) animacje są wyłączone.
 */
( function () {
	'use strict';

	if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
		return;
	}

	if ( ! ( 'IntersectionObserver' in window ) ) {
		return;
	}

	var sections = document.querySelectorAll(
		'.wp-block-post-content > .wp-block-group, .wp-block-post-content > .wp-block-cover'
	);

	if ( ! sections.length ) {
		return;
	}

	var observer = new IntersectionObserver(
		function ( entries ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					entry.target.classList.add( 'bc-visible' );
					observer.unobserve( entry.target );
				}
			} );
		},
		{ threshold: 0, rootMargin: '0px 0px -10% 0px' }
	);

	sections.forEach( function ( section ) {
		section.classList.add( 'bc-reveal' );
		observer.observe( section );
	} );
} )();

/**
 * Nagłówek nad hero (tylko strona główna): styl nakładkowy nadaje CSS
 * (body.home), tutaj jedynie przełączamy stan "przewinięty" — białe tło
 * z rozmyciem zamiast przezroczystości nad zdjęciem.
 */
( function () {
	'use strict';

	var header = document.querySelector( '.bc-site-header' );

	if ( ! header || ! document.body.classList.contains( 'home' ) ) {
		return;
	}

	var update = function () {
		header.classList.toggle( 'bc-header-solid', window.scrollY > 40 );
	};

	window.addEventListener( 'scroll', update, { passive: true } );
	update();
} )();

/**
 * Licznik statystyk (np. "12+", "100%"): odlicza od zera, gdy statystyka
 * wjedzie w viewport. Przy preferencji ograniczonego ruchu liczby stoją.
 */
( function () {
	'use strict';

	if (
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ||
		! ( 'IntersectionObserver' in window )
	) {
		return;
	}

	var stats = document.querySelectorAll( '.bc-stat' );

	if ( ! stats.length ) {
		return;
	}

	var animate = function ( el ) {
		var match = el.textContent.trim().match( /^(\d+)(.*)$/ );

		if ( ! match ) {
			return;
		}

		var target = parseInt( match[ 1 ], 10 );
		var suffix = match[ 2 ];
		var duration = 1400;
		var start = null;

		var step = function ( timestamp ) {
			if ( null === start ) {
				start = timestamp;
			}

			var progress = Math.min( ( timestamp - start ) / duration, 1 );
			var eased = 1 - Math.pow( 1 - progress, 3 );

			el.textContent = Math.round( eased * target ) + suffix;

			if ( progress < 1 ) {
				window.requestAnimationFrame( step );
			}
		};

		window.requestAnimationFrame( step );
	};

	var observer = new IntersectionObserver(
		function ( entries ) {
			entries.forEach( function ( entry ) {
				if ( entry.isIntersecting ) {
					observer.unobserve( entry.target );
					animate( entry.target );
				}
			} );
		},
		{ threshold: 0.5 }
	);

	stats.forEach( function ( el ) {
		observer.observe( el );
	} );
} )();
