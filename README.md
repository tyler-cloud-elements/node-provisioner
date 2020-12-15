# Callback Handler App
Small app for handling element initiation and callback

## Setup

### Setup Configuration (config.js)
1. Update with user information, (`authHeader`)
2. Add element specific configs to the JSON with form, `[elementKey]: { ...configs }`

     a. _Currently, this just handles OAuth elements_
     
     b. The app's default callback URL takes the form: `http://localhost:3000/provision/{elementKey}/callback`. The `{elementKey}` parameter is dynamic with the element you're using.


### Typical Setup
1. `npm install`
2. `npm start`
    
     a. Can navigate to `http://localhost:3000/ping` to confirm readiness
    
     b. Can initiate provisioning with `http://localhost:3000/provision/quickbooks`

### Docker
```
$ docker-compose -f deploy/compose/docker-compose.yaml up --build
```
