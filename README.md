# :bulb: Keener

[![Build Status](https://travis-ci.com/rmcreyes/keener-backend.svg?branch=master)](https://travis-ci.com/rmcreyes/keener-backend)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/02aeb3bb35034af78fc84d89e6e69700)](https://www.codacy.com/manual/rmcreyes/keener-backend?utm_source=github.com&utm_medium=referral&utm_content=rmcreyes/keener-backend&utm_campaign=Badge_Grade)
[![codecov](https://codecov.io/gh/rmcreyes/keener-backend/branch/master/graph/badge.svg)](https://codecov.io/gh/rmcreyes/keener-backend)

The backend of an application that lets helps students make the most out of their study groups.

## Getting started

We use `npm` for dependency management.

```bash
npm install
npm install --only=dev
```

To run the application, you need to first compile the TypeScript source code into JavaScript, then run the JavaScript. We have a few scripts to help with this.

```bash
npm run build
npm run start
```

After running the application, you should be able to view activity on `localhost:5000`.

For development purposes, you can run our `dev` script to have `nodemon` watch the `src` directory and restart the application whenever any changes are saved.

```bash
npm run dev
```
