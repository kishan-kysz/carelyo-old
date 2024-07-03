# Login portal

## Actions

[![AutoImage](https://github.com/Carelyo/loginui/actions/workflows/createimage.yml/badge.svg)](https://github.com/Carelyo/loginui/actions/workflows/createimage.yml)
[![Create Branch Image](https://github.com/Carelyo/loginui/actions/workflows/branchimage.yml/badge.svg)](https://github.com/Carelyo/loginui/actions/workflows/branchimage.yml)

## Creating Docker Images

[Read More](https://github.com/Carelyo/loginui/blob/develop/.github/workflows/README.md)

### Create Branch Image

[Click to create an image for your branch](https://github.com/Carelyo/loginui/actions/workflows/branchimage.yml)

## Getting started

### Begin [here](https://gitlab.com/carelyo/docs/-/blob/main/docs/gettingstarted/getstarted/frontend.md)

Make sure environment variables and certificates are set.

```sh
VITE_API_URL=        # URL to backend API
VITE_PATIENT_URL=    # URL to patient page
VITE_SYSADMIN_URL=   # URL to system admin page
VITE_DOMAIN=localhost
PORT=                     # Port number for login portal
HTTPS =  true           #force https
SSL_CRT_FILE        #path to ssl file
SSL_KEY_FILE   #Path to ssl key file
```

Then run `npm install` to install dependencies.

Run `npm start` to start the app.

## Production build

Use the `.env` file in the project's root folder.

Its content should contain

```sh
VITE_API_URL=        # URL to backend API
VITE_PATIENT_URL=    # URL to patient page
VITE_SYSADMIN_URL=   # URL to system admin page
VITE_DOMAIN=         # Domain name where it's hosted.
                          # E.g. if the url is https://carelyo.in
                          # then domain should be carelyo.in
GENERATE_SOURCEMAP=false
```

Then run `npm run build` to create a production build.

If you get this error message

```
openssl Error Stack: [ 'error:03000086:digital envelope routines::initialization error' ], library: 'digital envelope routines', reason: 'unsupported', code: 'ERR_OSSL_EVP_UNSUPPORTED'
```

Use this quick fix

```
export NODE_OPTIONS=--openssl-legacy-provider
```
