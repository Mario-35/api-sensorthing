![alt text](doc\assets\inrae.png/ "Logo Title Text 1")

## Want to use this project?

1. Fork/Clone
2. Install dependencies - npm install
3. Fire up Postgres on the default ports
4. Make .env file (see .env.example) .env is for prod
5. npm run dev for dev, npm run build (vs script package.json)
6. If database not exists the program create it.

## Directory Structure

```js
 Root
 ┣ src
 ┃ ┣ server
 ┃ ┃ ┣ db
 ┃ ┃ ┃ ┣ dataAccess "Access datas"
 ┃ ┃ ┃ ┣ entities "Sensorthings entities class"
 ┃ ┃ ┃ ┗ interfaces "Interfaces"
 ┃ ┃ ┣ query "Query Tool"
 ┃ ┃ ┣ routes "Router routes"
 ┃ ┃ ┃ ┣ views "logins html views"
 ┃ ┃ ┣ utils "Utils for app"
 ┃ ┃ ┃ ┣ odata "Odata parser"
 ┃ ┃ ┣ constant.ts "All datas"
 ┃ ┃ ┣ db.ts "DB connection"
 ┃ ┃ ┗ index.ts "Server start"
 ┃ ┣ template "Apidoc Home template"
 ┃ ┗ test  "TDD tests"
 ┣ doc "MD documentation"
 ┗ .env "Environment variables"
```

## Environment variables

.env

```js
  APP_ORIGIN=https://dev.example.com
  DATEFORMAT=DD/MM/YYYY hh:mm:ss "Date format"
  PORT=XXXX "Port of th api"
  APILIMIT=200 (number of max line result)
  APIVERSION=v1.0 "Version use"
  NODE_ENV=dev "/ prod / test (nono is dev)"
  KEY=secret "Secret word or sentence for encoding session key"

  PGHOST=localhost "postgres host"
  PGPORT=5432 "postgres port"
  PGUSER=sensorapi "postgres user"
  PGPASSWORD=mario29 "postgres user password"
  PGADMIN=mario29 "postgres admin password"
  PGDATABASE=test "postgres database name"
```
