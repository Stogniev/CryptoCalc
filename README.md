# CryptoCalc configuration

## Node

Tested on 8.9.4




## Firebase
Used to store currency rates.

Account: safecryptocalc@gmail.com  (paid because firebase functions request to EXTERNAL services to for the rates)

Note: use "npm run firebase-deploy-functions" (or npm run firebase-deploy-functions-node6" from node6 in case of problem) to deploy a functiouns located in firebase/functions/index.js

### Database
Location: https://console.firebase.google.com/u/1/project/cryptocalc1-76acb/database/firestore/data

### Functions
Location: https://console.firebase.google.com/u/1/project/cryptocalc1-76acb/functions/list

Sources: ```firebase/functions/index.js```

Deploy command: ```npm run firebase-deploy-functions```

Note: firebase support node v6.11 version (could conflict with globally installed node to system).

nvm works ok
npm seems yarn - not sure to work

Tested on ubuntu 16.

Note: Firebase configuration local "patch" used: ```~/dev/cryptocalc/firebase/functions/firebase.json -> "source": ""```


## Cron-job tasks
Used to call firebase functions periodically.

Account: safecryptocalc@gmail.com (free)

tasks: https://cron-job.org/en/members/jobs/

https://cron-job.org/en/members/jobs/details/?jobid=913300
https://cron-job.org/en/members/jobs/details/?jobid=913384


## Openexchangerates
Used to get conventional currencies rates (called by firebase function)

Account: safecryptocalc@gmail.com (free with 1000 requests/month limit)

## CoinCap.io
Used to get crypty currencies rates (called by firebase function)

(no account needed)

## test-web-access

sample web application with currency rates live updates


