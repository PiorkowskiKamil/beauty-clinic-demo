# NEW SKIN clinic — instalacja na WordPressie

Dwa pliki, które wgrywasz:
- **motyw-newskin-clinic.zip** — motyw (wygląd strony). **Nie rozpakowuj** — WordPress przyjmuje motyw jako .zip.
- **tresc-newskin-clinic.wxr** — treść podstron (O nas, Oferta, Cennik, Kontakt, Produkty + 3 produkty + Polityka).

## Zanim zaczniesz — potrzebujesz działającego WordPressa

Ta paczka to **motyw + treść**, wgrywa się je do GOTOWEGO WordPressa. Panel (dashboard) i logowanie pochodzą z Twojej instalacji WordPressa — nie ma ich w tej paczce. Potrzebujesz:
- Hostingu z **PHP + MySQL** i domeny.
- **Zainstalowanego WordPressa** na tej domenie. Jeśli jeszcze go nie ma — większość hostingów ma „WordPress jednym kliknięciem" (Softaculous / panel hostingu) albo pobierasz go z wordpress.org. Przy instalacji ustawiasz **login i hasło administratora** — tym logujesz się do panelu.

## Kroki (~5 min w panelu `twojadomena.pl/wp-admin`)

1. **Motyw:** Wygląd → Motywy → *Dodaj nowy* → *Wyślij motyw* → wybierz `motyw-newskin-clinic.zip` → *Zainstaluj* → **Włącz**.

2. **Wtyczka formularza:** Wtyczki → *Dodaj nową* → wyszukaj **Contact Form 7** → *Zainstaluj* → **Włącz**.
   (Potrzebna do działania formularza na stronie Kontakt — bez niej formularz się nie wyśle.)

3. **Treść:** Narzędzia → *Import* → **WordPress** → (jeśli poprosi, najpierw *Zainstaluj* importer) → *Wybierz plik* → `tresc-newskin-clinic.wxr` → *Wyślij plik i zaimportuj* → przy autorze zostaw/wybierz istniejącego → *Wyślij*.
   (Zaimportuje 9 podstron jako edytowalne **Strony**.)

4. **Ładne adresy:** Ustawienia → *Bezpośrednie odnośniki* → zaznacz **Nazwa wpisu** (`/%postname%/`) → *Zapisz zmiany*.
   (Dzięki temu działają adresy typu `twojadomena.pl/o-nas/`. Ten krok jest konieczny — inaczej podstrony zwrócą 404.)

Gotowe. Strona główna działa od razu (jest wbudowana w motyw). Reszta jest w menu i w *Strony*.

## Logowanie i edycja treści

- **Logowanie:** `twojadomena.pl/wp-admin`, loginem administratora ustawionym przy instalacji WordPressa.
- **Edycja podstrony:** *Strony* → otwórz stronę → edytujesz **wizualnie, blokami** (klikasz nagłówek/akapit i piszesz, przesuwasz sekcje) → *Aktualizuj*.

**Jak działa edycja:**
- Treść każdej podstrony to **natywne bloki Gutenberga** (grupy, nagłówki, akapity, kolumny, zdjęcia, akordeony) — pełna wizualna edycja jak na zwykłej stronie WordPress.
- Zmiana **tekstu, cen, opisów** — kliknij blok i pisz.
- Zmiana **układu** — przeciągaj/dodawaj bloki w edytorze albo w *Widoku listy* (ikona drzewka w lewym górnym pasku — pokazuje całą strukturę strony).
- **Zdjęcia:** kliknij blok obrazka → *Zastąp* → wgraj nowe lub wybierz z *Mediów*.
- **Strona główna** edytuje się w: Wygląd → *Edytor* → Szablony → *Strona główna* (też natywne bloki).
- **Nagłówek i stopka** (logo, menu, „Umów wizytę", dane kontaktowe, godziny): Wygląd → *Edytor* → *Wzorce* → *Części szablonu* → *Nagłówek* / *Stopka*. Menu to blok **Nawigacja** — dodajesz/usuwasz pozycje klikając „+". Logo i dane edytujesz jak zwykłe bloki.

> **Dwa wyjątki** (zostały jako pojedynczy blok „HTML własny", bo to niestandardowe komponenty): **cennik** (lista cen — edytujesz ceny w tym jednym bloku jako HTML) i **formularz na Kontakcie**. Formularz docelowo wstaw natywnie wtyczką Contact Form 7 (shortcode) — patrz krok 2 instalacji; obecny to placeholder wyglądu.

## Ważne uwagi

- **Instalacja w katalogu głównym domeny** (`twojadomena.pl/`), nie w podkatalogu (`twojadomena.pl/blog/`). Przy podkatalogu ścieżki do zdjęć/podstron trzeba poprawić — daj znać, jeśli tak jest.
- **Zdjęcia i część opisów to placeholdery** z makiety — do podmiany na materiały salonu.
- Paleta (złoto `#daa520` + mięta) i czcionki (Playfair + Lato) są w motywie; zmiana globalna: Wygląd → *Edytor* → *Style*.

## Test lokalny (opcjonalnie, bez hostingu)

Mając Node/bun, w katalogu z rozpakowanym motywem:
```
bunx @wp-playground/cli@latest start --path=./newskin-clinic
```
Otworzy lokalnego WordPressa z motywem do podglądu (PHP w przeglądarce, nic nie instaluje).
