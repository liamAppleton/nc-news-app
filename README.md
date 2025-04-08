# NC News

## About this project

NC News is a fully hosted Express.js server. Users can interact with the database via the various endpoints which facilitate CRUD operations.

Check out the hosted version here: https://nc-news-app-e2hd.onrender.com/api

It may take a little longer to load initially while the server warms up.

---

## Setup instructions

Clone down this repo using the following command:

**git clone https://github.com/liamAppleton/nc-news-app.git**

Access the directory: **cd nc-news-app**

Once the repo is cloned onto your local machine, you'll need to take the following steps to get things working:

Firstly, run **npm install** to install the correct dependencies.

Next you'll need to create two .env files to store the relevant environmental variables as follows:

**Development**

- filename: .env.development
- contents: PGDATABASE=nc_news

**Test**

- filename: .env.test
- contents: PGDATABASE=nc_new_test

Once these files are created, you can run the following scripts to setup and seed the databases:

- **npm run setup-dbs**
- **npm run seed-dev**
- **npm run test-seed**

---

## Running tests

Tests can be ran using:

- **npm test** (for all tests)
- **npm test _filepath_** to run a specific test suite.

---

_note: Postgres v8.13.3 and Node.js v23.6.0 are needed to run this project_
