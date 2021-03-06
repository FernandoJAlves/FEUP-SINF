# SNIF
The project developed in SINF course from the Integrated Masters in Informatics Engeneering and Computation.

Made by:
* Antero Santos
* Diogo Yaguas
* Duarte Oliveira
* Fernando Alves
* João Carlos Maduro

## Pre-requisites

* Install NodeJS 
* Install [NVM](https://github.com/nvm-sh/nvm)
* Change node version
    - `nvm install 10.16.0`
    - `nvm use 10.16.0`
* Install [NPM](https://www.npmjs.com/get-npm)

Note: if you get the following error:
```
nvm: command not found
```
check this [link](https://stackoverflow.com/questions/16904658/node-version-manager-install-nvm-command-not-found)

## Usage

### Build the app
Build the containers:
```
docker-compose build
```

If any new packages are added to the any of modules, you must run this command again for them to take effect.

### How to run
Run the containers:
```
docker-compose up
```
This will create a development server with hot reloading which will listen on `http://localhost:3000`.

### Contributing to the front-end
Run `npm install` in the front-end directory for the git hooks to work. This way, the linter will run before every commit, preventing possible errors in the code. 


### How to run the SAF-T reader
```
cd snif-be
npm install
npm run saft <filename>
```
Nota: Se não for especificado um filename, o programa usa o 2º ficheiro SAF-T de exemplo fornecido

### After running
Depois de correr, tem-se acesso aos dados gerais financeiros na rota /api/financial, aos dados financeiros de stocks em /api/stocks/financial, e aos dados financeiros do overview na rota /api/financial/overview
