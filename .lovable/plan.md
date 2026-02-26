

## Plan: Popup za preuzimanje statistike na stranici Statistika

### Pristup
Dodati gumb "Preuzmi statistiku" ispod eFG%/TS% badge-ova koji otvara Dialog (modal) sa pregledom dostupnih podataka i gumbom za preuzimanje XLSX datoteke.

### Koraci

1. **Instalirati `xlsx` paket** za generiranje Excel datoteka client-side.

2. **Dodati Dialog komponentu** u `src/pages/Statistics.tsx`:
   - Importati `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` iz postojećeg UI-ja.
   - Dodati state `showDownloadDialog`.
   - Gumb za otvaranje dialoga smjestiti ispod eFG%/TS% badge-ova (linija ~829), stiliziran sa `Download` ikonom.

3. **Sadržaj popup-a**:
   - Naslov: "Preuzmi kompletnu statistiku"
   - Kratki opis što sadrži datoteka (individualna statistika, timski prosjeci, rezultati utakmica).
   - Lista sheet-ova sa ikonama (CheckCircle ili FileSpreadsheet).
   - Gumb "Preuzmi XLSX" koji pokreće generiranje i download.

4. **Implementirati `handleDownloadStats()`**:
   - Sheet 1 "Igrači": mapirati sve igrače iz `rosterPlayers` + prosjeke iz `topScorers`, `topRebounders`, `topAssists`, itd.
   - Sheet 2 "Timska statistika": eFG%, TS%, timski prosjeci.
   - Sheet 3 "Utakmice": sve utakmice s datumima, protivnicima i rezultatima.
   - Preuzeti kao `HKK_Posusje_Statistika.xlsx`.

