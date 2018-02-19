# CryptoCalc



# Quick demo

```
npm install       #yarn install    
npm run demo
```


# Accounts

Cron-job: safecryptocalc@gmail.com


# Configuration


## Firebase
Used to store currency rates.

Account: safecryptocalc@gmail.com  (paid because firebase functions request to EXTERNAL services to for the rates)

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

https://cron-job.org/en/members/jobs/details/?jobid=913300
https://cron-job.org/en/members/jobs/details/?jobid=913384


## Openexchangerates
Used to get conventional currencies rates (called by firebase function)

Account: safecryptocalc@gmail.com (free with 1000 requests/month limit)

## CoinCap.io
Used to get crypty currencies rates (called by firebase function)

(no account needed)
