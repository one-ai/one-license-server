# One Licensing Server

- [One Licensing Server](#one-licensing-server)
  - [Introduction](#introduction)
  - [Getting Started](#getting-started)
    - [Pre-requisites](#pre-requisites)
    - [Running for development](#running-for-development)
    - [Building for production](#building-for-production)
    - [Running on Heroku Dyno](#running-on-heroku-dyno)
  - [Key Concepts](#key-concepts)
    - [Type](#type)
    - [Sync Strategy](#sync-strategy)
    - [Sync Interval](#sync-interval)
    - [Activation Delay](#activation-delay)
    - [Max Retries](#max-retries)
  - [Limitations](#limitations)
  - [Future scope](#future-scope)
  - [Built with](#built-with)
  - [License](#license)

## Introduction

One License is solution for developers who want to distribute their offline solutions with an online licensing system. One Licensing Server is the online part of the solution that is responsible for creation, management and syncing of licenses. One License comprises of four modules:

| Module                                                                         | Description                                                          |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| [One License Server (this repo)](https://github.com/one-ai/one-license-server) | The online server for storing and validating licenses                |
| [One License Dashboard](https://github.com/one-ai/one-license-dashboard)       | A dashboard for interacting with the server                          |
| [One License Client](https://github.com/one-ai/one-license-client)             | Script for integrating this licensing system into your own softwares |
| [One License Thin Client](https://github.com/one-ai/one-license-thin-client)   | Intermediate client for preventing virtual machine frauds            |

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Pre-requisites

-   node (v12+)
-   npm (v6+)

### Running for development

-   Clone this repo
-   Create `development.env` based on `sample.env`
-   `npm i`
-   `cd frontend && npm i`
-   `npm run start:app-dev`

### Building for production

-   `npm run build`

### Running on Heroku Dyno

For MongoDB instance, [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) is suggested.

-   Create new app
-   Under deployment method select `GitHub`
-   Connect your github account and select the forked repo.
-   Under settings, in Config Vars section, add the all the variables from `sample.env` file after modifying it according to your use case.
-   Under settings, in Buildpacks section, add:
    -   heroku/nodejs
    -   https://buildpack-registry.s3.amazonaws.com/buildpacks/zidizei/typescript.tgz

## Key Concepts

### Type

1. Limited API calls: Can be used when you want your solution to be limited to number of API calls.
2. Time bound: Can be used when you want your solution to expire after some time.
3. Limited API calls + Time bound: Can be used when you want your solution to be both limited to number of API calls as well as to expire after some time.

### Sync Strategy

1. HTTP: When you want the One License Client to contact the One License Service via HTTP.

### Sync Interval

1. At fixed interval: When you want One License Client to sync with One License server at regular intervals.

```
This method can be prone to frauds by making use of Virtual Machines. Therefore is is recommended that you use One License Thin Client with combination on One License Client and One License Server.
```

2. After every API call: When you want One License Client to sync with One License server at every API call made to your solution.

### Activation Delay

It is a fraud reducing strategy that delays the start of the application by defined seconds. Users can restart the application just before the sync which will prevent API counter from being updated on the online server. To tackle this problem, activation delay can be added to discourage the user from doing so.

For example: Assume the sync interval is set to 5 mins so the local API usage will be sent to the online server for storage every 5 mins. If the user restarts the application on the 4th minute then this syncing will never happen, allowing unrestricted API usage. Here, activation delay of 3 mins can be added that will delay the activation by 3 mins. Now if the user restarts his application, he'll have to wait for 3 mins. In production solution, user will be discouraged to do so in order to reduce solution down time.

### Max Retries

When sync at interval is used, there may be times when internet is not available during the sync. If the sync fails, the application will be scheduled to crash. Here max retries can be used to allow some number of retries before the application crashes.

For example: Assume sync interval is set to 10 and max retries is set to 5. Then the sync will happen every 10/5 = 2 minutes and it can fail up to 5 times, i.e until the final sync time. If it fails more than 5 time, the application will crash.

## Limitations

-   Currently the API counter is stored only in memory. If the application crashes, this API usage will never be updated on the online server. So prevent this, API counter needs to be stored in local persistent memory but local storage cannot be trusted. Thus, a trusted way of local storage is needed.

## Future scope

-   Add secure local storage
-   Add SFTP sync strategy

## Built with

-   [Node](https://nodejs.org/) - JS runtime for backend and development
-   [ReactJS](https://reactjs.org/) - Frontend library
-   [TypeScript](https://www.typescriptlang.org/) - The language we speak

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
