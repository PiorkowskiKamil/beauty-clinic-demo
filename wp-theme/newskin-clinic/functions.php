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

		// Treść STRON to natywne bloki — WP sam ładuje style bloków rdzenia (wp-block-library +
		// per-block inline CSS) i regeneruje per-instance layout z atrybutów. Dlatego core-blocks.css
		// USUNIĘTY (był nie tylko duplikatem — redefiniował :root{--wp--preset--font-size--huge:42px},
		// bijąc fluid-typografię z theme.json → h1 42px zamiast 60px).

		// Bloki navigation/cover miały w statyku własne, dostrojone reguły (nav: hamburger tylko < 600px).
		wp_enqueue_style( 'newskin-block-navigation', $dir . '/assets/blocks/navigation.css', array(), $ver );
		wp_enqueue_style( 'newskin-block-cover', $dir . '/assets/blocks/cover.css', array(), $ver );

		// wp-layout.css ZOSTAJE: header.html i footer.html to wciąż surowy HTML (blok wp:html) używający
		// ORYGINALNYCH hashy eksportu (aa50a3a3/c24ceac7/0caefaff…). WP nie regeneruje dla nich
		// per-instance layoutu (brak wykrytych bloków), więc bez tego pliku flex-row nagłówka traci
		// justify-content:space-between + flex-wrap:nowrap (logo|menu|przycisk zlewają się). Reguły
		// dla starych hashy treści stron są martwe (natywne bloki dostają nowe hashe) — nieszkodliwe.
		// NIE zawiera nadpisań font-size (czysty per-instance layout + outline) — fix typografii trzyma.
		wp_enqueue_style( 'newskin-layout', $dir . '/assets/css/wp-layout.css', array(), $ver );

		// Komponentowy CSS na końcu — nadpisuje style bloków (radius przycisku, kolory nav itd.).
		wp_enqueue_style( 'newskin-custom', $dir . '/assets/css/custom.css', array( 'newskin-fonts', 'newskin-block-navigation', 'newskin-block-cover', 'newskin-layout' ), $ver );

		// FAB + modal + reveal-on-scroll + animowane <details> (w stopce).
		wp_enqueue_script( 'newskin-reveal', $dir . '/assets/js/reveal.js', array(), $ver, true );
	}
);

// Menu nawigacyjne (gdyby motyw używał klasycznego menu zamiast bloku Navigation).
add_action(
	'after_setup_theme',
	function () {
		register_nav_menus( array( 'primary' => __( 'Menu główne', 'newskin-clinic' ) ) );

		// Płótno edytora (Wygląd → Edytor / edytor stron) ładuje TYLKO arkusze zgłoszone tutaj —
		// front-endowe enqueue (wp_enqueue_scripts) tam nie docierają. Bez tego blok Navigation
		// renderuje się w edytorze „nago" (lista z kropkami + hamburger i X naraz). Zgłaszamy te
		// same arkusze co front, w tej samej kolejności, by podgląd w edytorze pasował do żywej
		// strony. Czysto kosmetyczne dla edytora — front bez zmian (osobny hook).
		add_theme_support( 'editor-styles' );
		add_editor_style(
			array(
				'assets/css/fonts.css',
				'assets/blocks/navigation.css',
				'assets/blocks/cover.css',
				'assets/css/wp-layout.css',
				'assets/css/custom.css',
			)
		);
	}
);
