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
- [Architecture and Strategies](#architecture-and-strategies)
- [Project History and Status](#project-history-and-status)
- [Improvements for next project](#improvements-for-next-project)
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

To use the application the user has to register at [Zitadel](https://zitadel.cloud/).

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

### Prettier

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

The application uses the default settings of next-pwa lib.

## Deploy on Vercel

To deploy the NextJS application the [Vercel Platform](https://vercel.com/new?filter=next.js) is used.

## Architecture and Strategies

Besides the achievement of the MVP, we decided on some architectural and features along the way during development.

### Architecture

The decisions:

- Each member of the project decides which knowledge she or he wants to acquire during thw development of the app
- Implemented rest calls to [qwacker API](https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/rest/#/) with [Axios](https://axios-http.com/)
- Used [TanStack Query](https://tanstack.com/query/latest) for fetch. Only for the mutation of data
  - Here only the mutation of the write card is build with TanStack Query and the other post in the comments detail is with Axios fetch. This was on purpose mention before.
- Every page or component which needs a state has its own hooks
  - The [useReducer](https://react.dev/reference/react/useReducer) was preferred, even it has only one action. The decision is made for the future development
- Emphasis was placed on the mobile & desktop view
- NextJS [Middleware](https://nextjs.org/docs/advanced-features/middleware) is used to redirect to certain page, when the response is not as excepted or session is expired
- Disabled button is used if the click generates a asynchronous rest post call

### Rendering Strategies

#### Static Site Generation

Login page.

#### Server-Side Rendering (SSR)

Main page with timeline, profile page and detail page, when redirected to the page.

#### CLient-Side Rendering

Timeline for the automated scrolling and for a new created post. The redirection to the profile page over the navbar.

## Testing
### e2e-testing
The goal of our e2e test is to ensure that the most important functionalities can be executed in the UI of the application. This includes writing a new mumble, liking a picture, and commenting on an existing mumble. As we are already testing the Mumble and Index pages, we would add tests for the profile page in a further step.

The e2e tests were implemented using Playwright as test framework.

### Unit testing
In this application, unit tests are used to test individual code sections that either contain important logic, are reused or are complex. Specifically, we have therefore decided that tests for the utils and the API calls are required.

#### Notes on the utils:
- creator-to.ts: As addCreatorToMumbles is already being tested, we would also add tests for the other functions.
- convert-to.ts: The tests were omitted here, since these functions would be refactored again.

#### Notes on the services:

Some tests for liking mumbles and for loading and creating a mumble have already been created. So we would also test the other services. It would also be important for us to ensure that the application can deal with a missing access token and any error from the API. (However, error handling has not yet been implemented in the application.)

## Project History and Status

Our projects follow the conventions of the [Semantic Versioning 2.0.0](https://semver.org/). The tickets are tracked with [Trello](https://trello.com/b/f3ETlXfM/app).

## Improvements for next project

- The error handling for api calls has to be implemented
- Clean up tailwind classes
- Add reload button for new mumbles
- Add unit and integration tests
- Refactor some componenets in storybook

## Authors

[Mehmet Ali Bekooglu](https://github.com/malib)

[Carole Hug](https://github.com/CaroleHug)
