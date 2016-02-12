#Seed project for odata-mongodb server


## Install and build

`npm install -g gulp  typings typescript`

`npm install`

`gulp`

## Initialize demo database

##Edit config.json

Modify `connect` entry for the application `sms`.

```
{
    "http": {
        "port": 3000  //serveur http port
    },
    "odata": {
        // list of applications
        "applications": {
            // application "sms"
            "sms": { 
                "storage": {
                    "type": "mongodb",
                    "connect": {
                        // Mongodb server
                        "port": 45882,
                        "host": "ds045882.mongolab.com",
                        "database": "salvia",
                        "user": "salvia",
                        "password": "salvia"
                    }
                }
            }
        }
    }
}
```

###Initialize demo database

Open Terminal (for Mac and Linux users) or the command prompt (for Windows users):

```
$ node ./server/import/import sms ./data/init/sms
```

##Start odata server
 
```
$ node ./server/import/import sms ./data/init/sms
```
In browser :

```
http://localhost:3000/odata/$applications   //list of applications
http://localhost:3000/odata/sms/$entities   //list of entities
http://localhost:3000/odata/sms/SPO_COMMUNE?$top=10&$count=true
http://localhost:3000/odata/sms/SPO_COMMUNE?$filter=commune eq 'SAINTE-PAZANNE'
```

##Applications and model 
See folder `./src/server/model` 

