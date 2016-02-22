# Seed project for odata-mongodb server


## Install and build

`npm install -g gulp  typings typescript`

`npm install`

`gulp`

## Initialize demo database

### Edit config.json

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

### Initialize demo database

Open Terminal (for Mac and Linux users) or the command prompt (for Windows users):

```
$ node ./server/import/import sms ./data/init/sms
```

## Start odata server
 
```
$ node ./server/import/import sms ./data/init/sms
```
In browser :

```
// meta entities 
http://localhost:3000/odata/$applications   //list of applications
http://localhost:3000/odata/sms/$entities   //list of entities

//Requesting Entity Collections

//$top, $skip, $count
http://localhost:3000/odata/sms/SPO_COMMUNE?$top=10&$skip=5&$count=true

//$filter
http://localhost:3000/odata/sms/SPO_COMMUNE?$filter=commune eq 'SAINTE-PAZANNE'
http://localhost:3000/odata/sms/SPO_COMMUNE?$filter=contains(commune, 'sur')

//$select
http://localhost:3000/odata/sms/SPO_COMMUNE?$select=commune&$top=10

//$orderby
http://localhost:3000/odata/sms/SPO_COMMUNE?$orderby=commune desc

//$search
http://localhost:3000/odata/sms/SPO_COMMUNE?$search=sur&$filter=contains(commune,'PIR')

//Aggregation (see below)
http://localhost:3000/odata/sms/SPO_OPERATION?aggregate=$count() as count&groupby=commune&having=count gt 5


// Requesting an Individual Entity by ID
http://localhost:3000/odata/sms/SPO_COMMUNE('CHAUVE')
http://localhost:3000/odata/sms/SPO_COMMUNE(idcommune='CHAUVE')

// Requesting an Individual Property
http://localhost:3000/odata/sms/SPO_COMMUNE('CHAUVE')/commune

```

## Applications and model 
See folder `./src/server/model` 

## Aggregations `aggregate`,  `groupby`, `having`    
```
// select count(*) as count from TABLE 
?aggregate=$count() as count 

// select year_part(date), sum(Amount) as total, count(id) as count from TABLE group by year_part(date)  
?aggregate=$count() as count, $sum(Amount) as total&groupby=$year(date) as year   

// SELECT COUNT(Id), Country  FROM Customer GROUP BY Country
?aggregate=$count() as count&groupby=Country

// SELECT COUNT(Id) as count , Country  FROM Customer GROUP BY Country HAVING COUNT(Id) > 3 
?aggregate=$count() as count&groupby=Country&having=count gt 3

```
## Binary data (images/videos/files)  


### Upload
```
$ curl -v -F file=@image.jpg -X POST "http://localhost:3000/odata/sms/SPO_IMAGES('xxxx')/photo"
```

### Download

```
http://localhost:3000/odata/sms/SPO_IMAGES('xxxx')/photo
```

# Import data

```
$ curl -v -F file=@SPO_COMMUNE.json -X POST "http://localhost:3000/upload/sms/SPO_COMMUNE?truncate=true"
```


## Mode Insert

```
$ curl -v -F file=@SPO_COMMUNE.json -X POST "http://localhost:3000/upload/sms/SPO_COMMUNE?truncate=true"
```

## Mode Upset

```
$ curl -v -F file=@SPO_COMMUNE.json -X POST "http://localhost:3000/upload/sms/SPO_COMMUNE?truncate=false"
```


## Format

```
$ curl -v -F file=@SPO_COMMUNE.json -X POST "http://localhost:3000/upload/sms/SPO_COMMUNE?truncate=false&format=csv"
```
Default `format=json`.


 

 