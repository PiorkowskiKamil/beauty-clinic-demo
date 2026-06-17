# NEW SKIN clinic — instalacja na WordPressie

Dwa pliki, które wgrywasz:
- **newskin-clinic.zip** — motyw (wygląd strony). **Nie rozpakowuj** — WordPress przyjmuje motyw jako .zip.
- **newskin-content.wxr** — treść podstron (O nas, Oferta, Cennik, Kontakt, Produkty + 3 produkty + Polityka).

## Zanim zaczniesz — potrzebujesz działającego WordPressa

Ta paczka to **motyw + treść**, wgrywa się je do GOTOWEGO WordPressa. Panel (dashboard) i logowanie pochodzą z Twojej instalacji WordPressa — nie ma ich w tej paczce. Potrzebujesz:
- Hostingu z **PHP + MySQL** i domeny.
- **Zainstalowanego WordPressa** na tej domenie. Jeśli jeszcze go nie ma — większość hostingów ma „WordPress jednym kliknięciem" (Softaculous / panel hostingu) albo pobierasz go z wordpress.org. Przy instalacji ustawiasz **login i hasło administratora** — tym logujesz się do panelu.

## Kroki (~5 min w panelu `twojadomena.pl/wp-admin`)

1. **Motyw:** Wygląd → Motywy → *Dodaj nowy* → *Wyślij motyw* → wybierz `newskin-clinic.zip` → *Zainstaluj* → **Włącz**.

2. **Wtyczka formularza:** Wtyczki → *Dodaj nową* → wyszukaj **Contact Form 7** → *Zainstaluj* → **Włącz**.
   (Potrzebna do działania formularza na stronie Kontakt — bez niej formularz się nie wyśle.)

3. **Treść:** Narzędzia → *Import* → **WordPress** → (jeśli poprosi, najpierw *Zainstaluj* importer) → *Wybierz plik* → `newskin-content.wxr` → *Wyślij plik i zaimportuj* → przy autorze zostaw/wybierz istniejącego → *Wyślij*.
   (Zaimportuje 9 podstron jako edytowalne **Strony**.)

4. **Ładne adresy:** Ustawienia → *Bezpośrednie odnośniki* → zaznacz **Nazwa wpisu** (`/%postname%/`) → *Zapisz zmiany*.
   (Dzięki temu działają adresy typu `twojadomena.pl/o-nas/`. Ten krok jest konieczny — inaczej podstrony zwrócą 404.)

Gotowe. Strona główna działa od razu (jest wbudowana w motyw). Reszta jest w menu i w *Strony*.

## Logowanie i edycja treści

- **Logowanie:** `twojadomena.pl/wp-admin`, loginem administratora ustawionym przy instalacji WordPressa.
- **Edycja podstrony:** *Strony* → otwórz stronę → zobaczysz blok **„HTML własny"** → *Edytuj jako HTML* → zmień tekst/ceny → *Aktualizuj*.

**Jak realnie działa edycja (ważne, żeby wiedzieć z góry):**
- Treść pochodzi z eksportu statycznego, więc każda strona to JEDEN blok „HTML własny" (surowy HTML), a nie osobne klocki Gutenberga.
- Zmiana **tekstu, cen, opisów** — prosta: znajdź tekst w HTML i popraw.
- Zmiana **układu / przeciąganie sekcji** — wymaga znajomości HTML (to nie jest wizualna edycja klockami).
- **Zdjęcia:** podmień adres w `<img src="...">` albo wgraj nowe w *Media* i wstaw ścieżkę.
- **Strona główna** jest w motywie: Wygląd → *Edytor* → Szablony → *Strona główna* (też jako „HTML własny").

> Chcesz pełną, **wizualną** edycję klockami (przeciąganie sekcji jak w zwykłym WordPressie)? To osobny, większy etap — przepisanie sekcji na natywne bloki. Daj znać Kamilowi, jeśli to potrzebne.

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
