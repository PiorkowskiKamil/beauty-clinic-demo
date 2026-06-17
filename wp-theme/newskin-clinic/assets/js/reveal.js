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

	// Podstrony owijają treść w .wp-block-post-content; strona główna (front-page.html) w
	// <main class="wp-block-group"> — łapiemy oba, inaczej hero/sekcje na home nie dostają reveal.
	var sections = document.querySelectorAll(
		'.wp-block-post-content > .wp-block-group, .wp-block-post-content > .wp-block-cover, ' +
		'main.wp-block-group > .wp-block-group, main.wp-block-group > .wp-block-cover'
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
 * Aktywna pozycja nawigacji wg bieżącego adresu. Nagłówek to WSPÓŁDZIELONY
 * template part (jeden dla wszystkich podstron), więc klasa current-menu-item
 * jest zapieczona na jednej pozycji (Strona główna). Tu przenosimy ją na pozycję
 * pasującą do bieżącej ścieżki — jak w statycznym eksporcie, gdzie była per-strona.
 * Strona spoza menu (np. Kontakt) → żadna pozycja nie jest aktywna (zgodnie z referencją).
 */
( function () {
	'use strict';

	var norm = function ( p ) {
		return p.replace( /\/+$/, '' ) || '/';
	};
	var here = norm( location.pathname );
	var items = [].slice.call( document.querySelectorAll( '.bc-site-header .wp-block-navigation-item' ) );

	var linkPath = function ( li ) {
		var a = li.querySelector( 'a[href]' );
		return a ? norm( a.pathname ) : null;
	};

	// Aktywna pozycja: najpierw dokładne dopasowanie ścieżki.
	var activeLi = items.filter( function ( li ) {
		return linkPath( li ) === here;
	} )[ 0 ] || null;

	// Podstrony produktów (/produkt-*/) należą do sekcji „Produkty" — tak oznaczał je eksport.
	if ( ! activeLi && /^\/produkt-/.test( here ) ) {
		activeLi = items.filter( function ( li ) {
			return linkPath( li ) === '/produkty';
		} )[ 0 ] || null;
	}

	// Kolor aktywnej pozycji niesie [aria-current] (nie .current-menu-item) — ustawiamy oba.
	items.forEach( function ( li ) {
		var a = li.querySelector( 'a[href]' );

		if ( ! a ) {
			return;
		}

		var match = li === activeLi;
		li.classList.toggle( 'current-menu-item', match );

		if ( match ) {
			a.setAttribute( 'aria-current', 'page' );
		} else {
			a.removeAttribute( 'aria-current' );
		}
	} );
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

/**
 * Płynne rozwijanie akordeonów <details> (zasady na "O nas", listy zabiegów).
 * Animowana jest wysokość elementu; bez JS lub przy preferencji ograniczonego
 * ruchu akordeon działa natywnie (skokowo).
 */
( function () {
	'use strict';

	if ( window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
		return;
	}

	var items = document.querySelectorAll( 'details.bc-zasada, details.bc-offer-details' );

	items.forEach( function ( el ) {
		var summary = el.querySelector( 'summary' );

		if ( ! summary || ! el.animate ) {
			return;
		}

		var anim = null;
		var isOpen = el.open;

		summary.addEventListener( 'click', function ( event ) {
			event.preventDefault();

			// Wysokość startowa mierzona PRZED anulowaniem animacji,
			// żeby szybkie klikanie nie powodowało skoków.
			var startHeight = el.offsetHeight;

			if ( anim ) {
				anim.cancel();
				anim = null;
			}

			isOpen = ! isOpen;
			el.open = true;

			var endHeight;

			if ( isOpen ) {
				endHeight = el.offsetHeight;
			} else {
				// Pomiar wysokości zwiniętej w tej samej klatce — bez mrugnięcia.
				el.open = false;
				endHeight = el.offsetHeight;
				el.open = true;
			}

			el.style.overflow = 'hidden';

			anim = el.animate(
				{ height: [ startHeight + 'px', endHeight + 'px' ] },
				{ duration: 300, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' }
			);

			anim.onfinish = function () {
				el.open = isOpen;
				el.style.overflow = '';
				anim = null;
			};

			anim.oncancel = function () {
				el.style.overflow = '';
			};
		} );
	} );
} )();

/**
 * Widget "Oddzwonimy do Ciebie": pływający przycisk + modal z formularzem.
 * Markup wstrzykiwany z JS, więc działa na każdej stronie bez zmian w HTML.
 * Demo statyczne — wysłanie pokazuje potwierdzenie, bez backendu.
 */
( function () {
	'use strict';

	if ( ! ( 'HTMLDialogElement' in window ) ) {
		return;
	}

	var footerPhone = document.querySelector( '.bc-site-footer a[href^="tel:"]' );
	var phoneHref = footerPhone ? footerPhone.getAttribute( 'href' ) : 'tel:+48123456789';
	var phoneText = footerPhone ? footerPhone.textContent.trim() : '+48 123 456 789';

	var iconChat =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

	var fab = document.createElement( 'button' );
	fab.type = 'button';
	fab.className = 'bc-cb-fab';
	fab.setAttribute( 'aria-haspopup', 'dialog' );
	fab.innerHTML = iconChat + '<span>Oddzwonimy do Ciebie</span>';

	var dialog = document.createElement( 'dialog' );
	dialog.className = 'bc-cb-modal';
	dialog.setAttribute( 'aria-labelledby', 'bc-cb-title' );
	dialog.innerHTML =
		'<div class="bc-cb-inner">' +
			'<button type="button" class="bc-cb-close" aria-label="Zamknij okno">' +
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
			'</button>' +
			'<h2 id="bc-cb-title">Zostaw numer — oddzwonimy</h2>' +
			'<p class="bc-cb-sub">Bezpłatna rozmowa z naszym specjalistą. Pomożemy dobrać zabieg dopasowany do Twoich potrzeb.</p>' +
			'<form class="bc-cb-form" novalidate>' +
				'<label>Imię *<input type="text" name="cb-name" autocomplete="given-name" placeholder="Anna" required></label>' +
				'<label>Telefon *<input type="tel" name="cb-phone" autocomplete="tel" placeholder="+48 XXX XXX XXX" required></label>' +
				'<label>Wiadomość (opcjonalnie)<textarea name="cb-message" rows="3" placeholder="Czego dotyczy zapytanie?"></textarea></label>' +
				'<p class="bc-cb-error" hidden>Uzupełnij imię i poprawny numer telefonu.</p>' +
				'<button type="submit" class="wp-element-button bc-cb-submit">Poproś o kontakt</button>' +
			'</form>' +
			'<div class="bc-cb-success" hidden tabindex="-1">' +
				'<div class="bc-cb-success-ico">' +
					'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' +
				'</div>' +
				'<h3>Dziękujemy!</h3>' +
				'<p>Oddzwonimy najszybciej, jak to możliwe — w godzinach otwarcia salonu.</p>' +
			'</div>' +
			'<p class="bc-cb-alt">Lub zadzwoń od razu: <a href="' + phoneHref + '">' + phoneText + '</a></p>' +
			'<p class="bc-cb-note">Twoje dane wykorzystamy wyłącznie do kontaktu w sprawie zapytania.</p>' +
		'</div>';

	document.body.appendChild( fab );
	document.body.appendChild( dialog );

	var form = dialog.querySelector( '.bc-cb-form' );
	var success = dialog.querySelector( '.bc-cb-success' );
	var errorMsg = dialog.querySelector( '.bc-cb-error' );
	var nameInput = form.querySelector( 'input[name="cb-name"]' );
	var phoneInput = form.querySelector( 'input[name="cb-phone"]' );
	var closing = false;

	var open = function () {
		dialog.showModal();
		document.body.classList.add( 'bc-cb-lock' );
		nameInput.focus();
	};

	var close = function () {
		if ( closing ) {
			return;
		}

		closing = true;
		dialog.classList.add( 'bc-cb-closing' );

		window.setTimeout( function () {
			dialog.close();
			dialog.classList.remove( 'bc-cb-closing' );
			document.body.classList.remove( 'bc-cb-lock' );
			closing = false;

			// Po wysłaniu kolejne otwarcie pokazuje świeży formularz.
			if ( ! success.hidden ) {
				success.hidden = true;
				form.hidden = false;
				form.reset();
			}
		}, 220 );
	};

	fab.addEventListener( 'click', open );
	dialog.querySelector( '.bc-cb-close' ).addEventListener( 'click', close );

	// ESC: przejmujemy natywne zamknięcie, żeby też było animowane.
	dialog.addEventListener( 'cancel', function ( event ) {
		event.preventDefault();
		close();
	} );

	// Klik w przyciemnione tło zamyka modal.
	dialog.addEventListener( 'click', function ( event ) {
		if ( event.target === dialog ) {
			close();
		}
	} );

	form.addEventListener( 'submit', function ( event ) {
		event.preventDefault();

		var phoneDigits = phoneInput.value.replace( /\D/g, '' );
		var nameOk = nameInput.value.trim().length > 1;
		var phoneOk = phoneDigits.length >= 7;

		nameInput.classList.toggle( 'bc-invalid', ! nameOk );
		phoneInput.classList.toggle( 'bc-invalid', ! phoneOk );
		errorMsg.hidden = nameOk && phoneOk;

		if ( ! nameOk || ! phoneOk ) {
			( nameOk ? phoneInput : nameInput ).focus();
			return;
		}

		form.hidden = true;
		success.hidden = false;
		success.focus();
	} );
} )();

/**
 * Formularz Kontakt (Contact Form 7) w demie statycznym: bez backendu wysyłka
 * skończyłaby się błędem sieci, więc przejmujemy submit i pokazujemy
 * potwierdzenie. Nasłuch w fazie capture wyprzedza skrypt CF7.
 */
( function () {
	'use strict';

	// CF7 blokuje przycisk wysyłki do czasu inicjalizacji przez REST API,
	// którego statyczne demo nie ma — bez tego przycisk zostałby wyłączony
	// na zawsze. Kilka prób, bo skrypt CF7 wyłącza go asynchronicznie.
	var enableSubmits = function () {
		document
			.querySelectorAll( '.wpcf7-form input[type="submit"]' )
			.forEach( function ( btn ) {
				btn.disabled = false;
			} );
	};

	[ 300, 1000, 3000 ].forEach( function ( delay ) {
		window.setTimeout( enableSubmits, delay );
	} );

	document.addEventListener(
		'submit',
		function ( event ) {
			var form = event.target;

			if ( ! form.classList || ! form.classList.contains( 'wpcf7-form' ) ) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			var output = form.querySelector( '.wpcf7-response-output' );
			var required = form.querySelectorAll( '[aria-required="true"]' );
			var allFilled = true;

			required.forEach( function ( field ) {
				var filled = field.value.trim().length > 0;
				field.classList.toggle( 'bc-invalid', ! filled );

				if ( ! filled ) {
					allFilled = false;
				}
			} );

			if ( ! output ) {
				return;
			}

			output.setAttribute( 'aria-hidden', 'false' );
			output.setAttribute( 'role', 'status' );

			// CSS CF7 pokazuje komunikat tylko w stanach sent/invalid —
			// bez podmiany klasy "init" tekst zostaje na display:none.
			form.classList.remove( 'init', 'sent', 'invalid', 'failed' );
			form.classList.add( allFilled ? 'sent' : 'invalid' );
			form.setAttribute( 'data-status', allFilled ? 'sent' : 'invalid' );

			if ( allFilled ) {
				output.textContent = 'Dziękujemy za wiadomość! Odpowiemy najpóźniej następnego dnia roboczego.';

				// Nie form.reset(): event "reset" przejmuje skrypt CF7,
				// który czyści komunikat i zawiesza formularz na fetchu
				// do nieistniejącego REST API. Pola czyścimy ręcznie.
				form
					.querySelectorAll( 'input[type="text"], input[type="email"], input[type="tel"], textarea' )
					.forEach( function ( field ) {
						field.value = '';
					} );
				form
					.querySelectorAll( 'input[type="checkbox"]' )
					.forEach( function ( field ) {
						field.checked = false;
					} );
			} else {
				output.textContent = 'Uzupełnij wymagane pola formularza.';
			}
		},
		true
	);
} )();
