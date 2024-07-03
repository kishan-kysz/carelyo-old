# Monolitic SpringBoot Main Api (aka monoapi)

## Steps to take to set up for dev
- Copy the env.example to .env
- In the .env enter values for the list below, depending on the task, specify others

  - ### CORS Profile for "dev" or "prod" Uncomment the desired variables for your need 
  - ### Email
  - ### MYSQL
  - ### Login URL
  - ### To use PROFILES_DEV_ALLOWED_ORIGINS=http://carelyo.com, http://carelyo.io, http://carelyo.top, http://carelyo.in, http://carelyo.in:3122, http://carelyo.in:3123, http://carelyo.in:3121, http://carelyo.in:3126
  - - Add carelyo.in to your hosts file
  - - For windows the hosts file -> "C:\Windows\System32\drivers\etc\hosts.ics"
  - - If you are on Mac or Linux -> /etc/hosts 

- Go to [devsetup](https://github.com/Carelyo/devsetup/tree/develop) and clone the project.


## Before Pushing Code
- Run unit test [![run unit tests](https://github.com/Carelyo/carelyo-api/actions/workflows/test.yml/badge.svg)](https://github.com/Carelyo/carelyo-api/actions/workflows/test.yml)


## Link to backend TODO file
- [TODO file](BACKEND-TODO.md)




