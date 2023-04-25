# Team Hello World - Frontend Engineering Advanced

## Deployed Application
You find the deployed application here: https://app-helloworld-1.vercel.app/

## Installation Guide
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
NEXT_PUBLIC_QWACKER_API_URL=[insert URL of Qwacker API]

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[insert nextauth secret]

ZITADEL_ISSUER=[insert zitadel issuer URL]
ZITADEL_CLIENT_ID=[insert zitadel client id]
```

### Start the developement server
Now, you can run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authors

[Mehmet Ali Bekooglu](https://github.com/malib)

[Carole Hug](https://github.com/CaroleHug)
