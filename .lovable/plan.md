
## Cilj

Kreirati detaljan, gotov-za-paste prompt koji korisnik može ubaciti u novi Lovable projekt da rekreira identičan admin panel (vijesti + galerije + kategorije) s istim backend mehanizmom (deterministički token, 2 edge funkcije, 3 tablice/buckets) i istom crno-žutom estetikom.

## Što ću napraviti

1. Sastaviti markdown prompt na hrvatskom, strukturiran u 9 sekcija:
   - Cilj i tehnološki stack
   - Lovable Cloud secrets (`ADMIN_USERNAME=admin`, `ADMIN_PASSWORD=ljubuski`)
   - SQL migracija (tablice `news` + `galleries`, RLS public-read, 2 storage bucketa)
   - Edge funkcija `admin-news` (login + list + create + update + update-category + delete + upload-url) s deterministički hash tokenom
   - Edge funkcija `admin-galleries` (list-public + list + create + update + delete)
   - Frontend `/admin` stranica: login forma, sticky top bar, 2 taba (Vijesti/Galerije), modali za uređivanje, bulk upload (5 paralelno) s progress prikazom, paginacija slika (30 po stranici), modal za upravljanje kategorijama
   - Forme: format datuma `DD.MM.YYYY`, image position picker, pinned toggle, gallery_images niz, cover_image
   - Dizajn tokeni (crno-žuta paleta, sticky header `hsl(0,0%,7%)`, gumbi crna+žuti border → hover žuta, toast donji-desni žuti)
   - Sigurnosna napomena (vjerodajnice samo u Cloud secretima, nikad u kodu) i checklist za testiranje

2. Spremiti u `/mnt/documents/admin-panel-prompt.md`.
3. Ispisati cijeli prompt u chatu i priložiti `<lov-artifact>` za download.

## Napomena

Token mehanizam je stateless deterministički hash `username:password:YYYY-MM-DD` što znači token vrijedi 1 dan i preživljava cold-start edge funkcija — to ću izričito istaknuti u promptu da AI u novom projektu ne pokuša implementirati JWT/sessions tablice.

Spreman za izradu — odobri pa idem.
