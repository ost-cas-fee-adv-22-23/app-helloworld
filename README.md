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
- [Testing](#testing)
- [Docker](#docker)
- [Terraform](#terraform)
- [Github Actions](#github-actions)
- [Project History and Status](#project-history-and-status)
- [Improvements for next project](#improvements-for-next-project)
- [Authors](#authors)

## General Info

This application is the second part of the CAS based on [NextJS](https://nextjs.org/) with the component library [Helloworld](https://smartive-education.github.io/design-system-component-library-helloworld/?path=/story/design-tokens-branding-app-icon--page) from the first part.

### Live Demo

You find the deployed application on Vercel [here](https://app-helloworld-1.vercel.app/). The deployed application on google cloud is [here](https://app-helloworld-bdyvgt3zva-oa.a.run.app).

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

## Docker

The application can be run on a docker. Before docker can be used [install Docker Engine](https://docs.docker.com/engine/install/). To build a docker image locally, you need to ensure a local [.nmprc](#authenticating-github-registry) and [.env](#create-environment-variables) file. Additionally copy the `.npmrc` file to your user directory. After execute following code:

```console
docker build . -t app-helloworld --build-arg NEXT_PUBLIC_QWACKER_API_URL=https://qwacker-api-http-prod-4cxdci3drq-oa.a.run.app/ --secret id=npmrc_secret,src=$HOME/.npmrc
```

When the build was successfully, you can run the image with following command:

```console
docker run -p 3000:3000 --env-file ./.env --rm --name app-helloworld app-helloworld
```

You can also run the image on the docker compose, like following:

```console
docker-compose --env-file ./.env up
```

If you want to upload your docker image manually to the [google cloud](https://cloud.google.com/?hl=de), push the following code:

```console
docker push europe-west6-docker.pkg.dev/expanded-symbol-389711/helloworld/app-helloworld
```
## Terraform

Before using terraform, you need to [install terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) on your system. In this project terraform deploys the application on [google cloud](https://cloud.google.com/?hl=de), see the terraform configuration on this project under the `/terraform` folder.

First you need to login with your account to google cloud, to get access.

```console
gcloud auth login
gcloud auth application-default login
```

After the login there are permission you need to have. Most of the time these permissions are enough

```console
gcloud projects add-iam-policy-binding expanded-symbol-389711 /
--member='serviceAccount:tf-deploy-helloworld@expanded-symbol-389711.iam.gserviceaccount.com' /
--role='roles/resourcemanager.projectIamAdmin'
```

```console
gcloud projects add-iam-policy-binding expanded-symbol-389711 /
--member='serviceAccount:tf-deploy-helloworld@expanded-symbol-389711.iam.gserviceaccount.com' /
--role='roles/iam.serviceAccountUser'
```

```console
gcloud projects add-iam-policy-binding expanded-symbol-389711 /
--member='serviceAccount:tf-deploy-helloworld@expanded-symbol-389711.iam.gserviceaccount.com' /
--role='roles/iam.serviceAccountTokenCreator'
```

To deploy with terraform manually, the following commands have to be executed in order

### Terraform commands

You need to initializes a working directory containing terraform configuration files. This command is executed once after writing a new Terraform configuration or cloning an existing one.

```console
terraform init
```

To create an execution plan, that shows you the changes that terraform plans to make to your infrastructure.

```console
terraform plan
```

The last command executes the actions proposed in a terraform plan.

```console
terraform apply --auto-approve
```

## Github Actions

The project starts after every pull request and after every merge into main a workflow. On both workflow's, it starts first the quality checks for eslint, prettier and dependency cruiser. When the checks are finished successful the next pipeline with unit and e2e test are executed. Further the main merge triggers the docker image and the push to google cloud with terraform. The strategy for the github actions uses the reusable workflow technique.

## Project History and Status

Our projects follow the conventions of the [Semantic Versioning 2.0.0](https://semver.org/). The tickets are tracked with [Trello](https://trello.com/b/f3ETlXfM/app).

## Improvements for next project

- The error handling for api calls has to be implemented
- Clean up tailwind classes
- Add reload button for new mumbles
- Add more unit and integration tests
- Refactor some components in storybook
- Add further github actions workflow for web vitality checks
- Add renovate for dependency updates

## Authors

[Mehmet Ali Bekooglu](https://github.com/malib)

[Carole Hug](https://github.com/CaroleHug)
