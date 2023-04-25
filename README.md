# CAS FEE ADV Application: Team Hello World

This is a repository for the CAS FEE ADV application part at [Ostschweizer Fachhochschule](https://www.ost.ch/de/weiterbildung/weiterbildungsangebot/informatik/software-engineering-testing/cas-frontend-engineering-advanced).
The main goal of the CAS is to rebuild a Twitter clone called Mumble by applying all the tools and knowledge learned in the lectures to create
an application from the beginning to the end.

## Table of Content

- [General Info](#general-info)
- [Installation Guide](#installation-guide)
- [Scripts](#scripts)
- [PWA](#pwa)
- [Deploy on Vercel](#deploy-on-vercel)
- [Development](#development)
- [Authors](#authors)

## General Info

This application is the second part of the CAS based on [NextJS](https://nextjs.org/) with the component library [Helloworld](https://smartive-education.github.io/design-system-component-library-helloworld/?path=/story/design-tokens-branding-app-icon--page) from the first part.

### Live Demo

You find the deployed application [here](https://app-helloworld-1.vercel.app/).

## Installation Guide

Instructions on how to set up and install the project.

### Clone this repo
```bash
git clone https://github.com/smartive-education/app-helloworld.git
```

### Authenticating GitHub Registry

To install the UI component library package you need a personal GitHub Access Token.

- Create a GitHub [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- Create a new `.npmrc` file in the root of your repository
- Add the key and the declaration of the owner to your project. Replace TOKEN with your access token.

```console
@smartive-education:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TOKEN
```

To find more detailed information see [Working with the npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

### Install the dependencies
Then, install the dependencies:
```bash
npm ci
```

### Create Environment Variables
Insert te missing content into the .env file in the root.
```console
# Qwacker backend
NEXT_PUBLIC_QWACKER_API_URL=[insert URL of Qwacker API]

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[insert nextauth secret]

ZITADEL_ISSUER=[insert zitadel issuer URL]
ZITADEL_CLIENT_ID=[insert zitadel client id]
```

### Register a user

To use the application the user has to register at [Zitadel](https://zitadel.cloud/)

### Start the developement server
Now, you can run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build and start the application

```bash
npm run build

npm run start
```
## Scripts

### ESLint

ESLint is configured to check:
- @smartive/prettier-config

```console
npm run lint
npm run lint:fix
```

#### Prettier

Prettier configuration:

- @smartive/prettier-config

```console
npm run prettier
npm run prettier:check
```

### Dependency cruiser

```console
npm run depcruise
```

## PWA

The application uses the default settings of next-pwa lib, which provides the following main features:

## Deploy on Vercel

## Development

## Authors

[Mehmet Ali Bekooglu](https://github.com/malib)

[Carole Hug](https://github.com/CaroleHug)
