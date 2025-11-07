# Frontend

The Frontend is an Angular App written in TypeScript that (at the time of writing) uses [NodeJS](https://nodejs.org) v14.

## Preparations
Using [nvm](https://github.com/nvm-sh/nvm) (on Windows: [nvm-windows](https://github.com/coreybutler/nvm-windows)):
```bash
rm -r node_modules
nvm install 14.21.3
nvm use 14.21.3
npm install
```

## Building
```bash
npm run webpack:build:main
```

## Run the dev server
```bash
npm run webpack:dev
```
The dev server runs on http://localhost:9000 and automatically recompiles and reloads the application on changes.

### Note on Node > 16
If the error ERR_OSSL_EVP_UNSUPPORTED occurs, Node (in case of a version > 16) has to be started with the option `--openssl-legacy-provider`, i.e. in powershell using `$env:NODE_OPTIONS="--openssl-legacy-provider"`, in CMD using `set NODE_OPTIONS="--openssl-legacy-provider"` and on Linux/MacOS accordingly using `export NODE_OPTIONS="--openssl-legacy-provider"`.