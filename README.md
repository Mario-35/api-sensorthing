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
 ┃ ┃ ┃ ┣ odata "Odata Enhanced parser"
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
  PGPASSWORD=mario "postgres user password"
  PGADMIN=mario "postgres admin password"
  PGDATABASE=test "postgres database name"
```

## Tech Stack

-   [Node.js](https://nodejs.org/) `v14.15.1`
-   [PostgreSQL](https://www.postgresql.org/)
-   [Knex.js](https://knexjs.org/)
-   [pg](https://node-postgres.com/)
-   [odata-v4-pg](https://github.com/jaystack/odata-v4-pg)
-   [json2csv](https://mircozeiss.com/json2csv/)

---

-   [koa](https://koajs.com/)
-   [koa-bodyparser](https://github.com/koajs/bodyparser)
-   [koa-json](https://github.com/koajs/json)
-   [koa-logger](https://github.com/koajs/logger)
-   [koa-router](https://github.com/koajs/router)
-   [koa-session](https://github.com/koajs/session)
-   [koa-passport](https://github.com/rkusa/koa-passport)
-   [passport-local](https://github.com/jaredhanson/passport-local)

---

-   [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
-   [chalk](https://github.com/chalk/chalk)
-   [dotenv](https://github.com/motdotla/dotenv)
