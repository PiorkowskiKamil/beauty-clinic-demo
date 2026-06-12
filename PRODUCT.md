# Product

## Register

brand

## Users

Klientki (i klienci) lokalnego salonu kosmetycznego — osoby szukające zabiegów pielęgnacyjnych, masaży, manicure i modelowania sylwetki. Kontekst: przeglądają ofertę i cennik na telefonie lub laptopie, porównują z innymi salonami, chcą szybko umówić wizytę lub zostawić numer do oddzwonienia. Decyzję buduje zaufanie: profesjonalizm, bezpieczeństwo, naturalne efekty.

## Product Purpose

Statyczne demo strony-wizytówki salonu beauty (snapshot WordPressa na GitHub Pages), prezentowane klientowi końcowemu jako wzór. Sukces = strona wygląda jak dopracowana witryna średniego biznesu premium i prowadzi do kontaktu (telefon, formularz, callback "Oddzwonimy do Ciebie").

## Brand Personality

Spokojna elegancja, zaufanie, naturalność. Ciepła paleta: złoto szampańskie (#c5a572 / #8a6f47), krem (#faf7f0), głęboki kontrast (#221f1a); serif Playfair Display na nagłówkach, Lato w treści.

**Wzorzec potwierdzony przez klienta: https://blclinic.pl** — zwłaszcza cennik (flat editorial: serif nagłówek kategorii + hairline, wiersze nazwa—cena, dużo światła) i wzorzec kontaktu (pływający przycisk "Oddzwonimy do Ciebie" → modal "Zostaw numer").

## Anti-references

- Tabele-spreadsheety i karty z ramkami w cenniku (odrzucone wprost przez właściciela projektu).
- Podkreślenia linków — jakiekolwiek, także animowane linie pod nawigacją; podświetlenie wyłącznie przez fade koloru.
- Przyciski-pigułki (border-radius 999px) — zamiast nich miękki prostokąt ~10px.
- Kropkowane linie prowadzące (dot leaders) w cenniku.
- Generyczny "AI look": fioletowe gradienty, glassmorphism, gradient text, hero-metric template.

## Design Principles

1. **Bazuj na blclinic.pl** — gdy decyzja designowa jest niejasna, wzorzec klienta wygrywa z ogólnymi heurystykami.
2. **Światło zamiast ramek** — hierarchię budują odstępy, hairline'y i typografia, nie boxy i obramowania.
3. **Spokojny ruch** — animacje płynne i celowe (wejścia sekcji, akordeony, modal), zawsze z wariantem prefers-reduced-motion.
4. **Wszystko prowadzi do kontaktu** — CTA "Umów wizytę" + callback FAB na każdej stronie; zero martwych przycisków.
5. **Bez nowych sekcji bez prośby** — poprawiamy istniejące, nie dokładamy.

## Accessibility & Inclusion

Cel: WCAG 2.1 AA. Kontrast tekstu ≥4.5:1 (treść) / ≥3:1 (duże nagłówki), widoczny focus klawiatury w kolorze marki, pełna obsługa prefers-reduced-motion, formularze z etykietami i walidacją opisową, natywny `<dialog>` (focus trap + ESC). Treść po polsku — znaki diakrytyczne w fontach (latin-ext).
