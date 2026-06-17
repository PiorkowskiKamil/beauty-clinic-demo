<?php
/**
 * NEW SKIN clinic — motyw blokowy.
 *
 * theme.json niesie paletę / typografię / spacing.
 * Tutaj ładujemy: fonty (@font-face), komponentowy custom.css oraz reveal.js
 * (wstrzykuje FAB „Oddzwonimy do Ciebie" + modal, animacje wejścia i akordeony WAAPI).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * Treść stron to surowy HTML z klasami wp-block-* (eksport statyczny bez delimiterów
 * `<!-- wp: -->`), więc WP nie wykryje „użytych" bloków i pominąłby ich CSS.
 * Ładujemy PEŁNY core block stylesheet globalnie — nav (responsive), cover (hero),
 * columns itd. muszą być ostylowane jak w statycznym snapshocie.
 */
add_filter( 'should_load_separate_core_block_assets', '__return_false' );

add_action(
	'wp_enqueue_scripts',
	function () {
		$dir = get_stylesheet_directory_uri();
		$ver = wp_get_theme()->get( 'Version' );

		// Self-hostowane fonty Lato + Playfair Display (subset latin + latin-ext).
		wp_enqueue_style( 'newskin-fonts', $dir . '/assets/css/fonts.css', array(), $ver );

		// Style bloków rdzenia (columns flex-basis, image, button base, group, table, separator...).
		// Motyw blokowy NIE ładuje ich dla surowego HTML (brak delimiterów `<!-- wp: -->` => zero
		// wykrytych bloków). wp_enqueue_style('wp-block-library') NIE działa (optymalizacja motywu
		// blokowego pomija arkusz). Pakujemy WSZYSTKIE inline-CSS bloków ze statyku w jeden plik —
		// to samo, co robił eksport, tylko jako jeden <link>. Bez tego np. kolumny gubią szerokości.
		wp_enqueue_style( 'newskin-core-blocks', $dir . '/assets/blocks/core-blocks.css', array(), $ver );

		// Bloki navigation/cover były w statyku LINKOWANE osobno (nie inline) — nie ma ich w core-blocks.css.
		// navigation.css niesie m.in. regułę responsywną (hamburger tylko < 600px).
		wp_enqueue_style( 'newskin-block-navigation', $dir . '/assets/blocks/navigation.css', array(), $ver );
		wp_enqueue_style( 'newskin-block-cover', $dir . '/assets/blocks/cover.css', array(), $ver );

		// Tier-3: per-instance layout-support (.wp-container-*, justification, outline) — WP nie regeneruje
		// tego dla surowego HTML (brak delimiterów bloków), więc dostarczamy wyekstrahowane reguły ze statyku.
		// Po core-blocks, by reguły instancyjne i outline (przezroczyste tło) wygrywały z generycznymi.
		wp_enqueue_style( 'newskin-layout', $dir . '/assets/css/wp-layout.css', array( 'newskin-core-blocks' ), $ver );

		// Komponentowy CSS na końcu — nadpisuje style bloków (radius przycisku, kolory nav itd.).
		wp_enqueue_style( 'newskin-custom', $dir . '/assets/css/custom.css', array( 'newskin-core-blocks', 'newskin-fonts', 'newskin-block-navigation', 'newskin-block-cover', 'newskin-layout' ), $ver );

		// FAB + modal + reveal-on-scroll + animowane <details> (w stopce).
		wp_enqueue_script( 'newskin-reveal', $dir . '/assets/js/reveal.js', array(), $ver, true );
	}
);

// Menu nawigacyjne (gdyby motyw używał klasycznego menu zamiast bloku Navigation).
add_action(
	'after_setup_theme',
	function () {
		register_nav_menus( array( 'primary' => __( 'Menu główne', 'newskin-clinic' ) ) );
	}
);
