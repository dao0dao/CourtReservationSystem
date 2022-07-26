# Jest to frontendowa część projektu "Systemu rezerwacyjnego kortu".
Dla kompletności należy pobrać jeszcze część backendową.

## Wymagania
1. Angular CLI: 13.0.4
2. NodeJS  16.13.1
3. NPM 8.1.2

## Struktura plików
Folder projektu
.
├─ frontend
│      └── dist
│          └── front (Angular build)
└ backend     

### Uruchomienie
1. Pobranie i wykonanie komendy `npm ci` w terminalu `<project name>/frontend` a następnie komendy `ng build`
2. Uruchomienie serwera backendowego
3. W przypadku korzystania z wersji produkcyjne wpisujemy w przeglądarce `localhost:3000`
4. W przypadku korzystania z wersji deweloperskiej w terminalu `<project name>/frontend` wpisujemy `ng serve`. Po skompilowaniu w przeglądarce wpisujemy `localhost:4200`

---------------

# It is a frontend part of project: 'Tennis court reservation system'
For the whole system you should download backend part

## Requirements
1. Angular CLI: 13.0.4
2. NodeJS  16.13.1
3. NPM 8.1.2

## Project structure
Project name
. <br/>
├─ frontend<br/>
│ ____└── dist<br/>
│ _________└── front (Angular production build)<br/>
└ backend<br/>

### Running
1. Download and run `npm ci` in `<project name>/frontend` terminal after that run `ng build`
2. Start backend server
3. If you want use production version type `localhost:3000` in the browser
4. If you want use develop version type `ng serve` in `<project name>/frontend` terminal. After compiling type `localhost:4200` in the browser