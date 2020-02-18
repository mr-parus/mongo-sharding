# advanced-ppi-storing
Demonstration of a distributed Personally Identifiable Information  (PPI) storing using MongoDB sharding

#### Table of Contents
- [Problem](#Problem)
    * [Requirements](#Requirements)
    * [Features](#Features)
    * [Task](#Task)
- [Solution](#Solution)
    * [Theory](#Theory)
    * [Implementation](#Implementation)
    * [API](#API)
    * [How-to-run](#How-to-run)
    * [Info](#Info)

# Problem
All end-user data is stored in the booking. Booking belongs to a distributor and the separation is
made by the ID of the distributor. All bookings and related PII are stored in the EU. 
There are a lot of problems with this approach:
* A simple typo in code may expose PII to other distributors (by leaving out the ID of the distributor from queries)
* Data is not actually separated between distributors.
* US customer data is stored in the EU which is not allowed.

## Requirements
* PII is not stored in the booking
* The location of PII storage can be defined by customer residence country
* Customer data is separated by a distributor
* Customer data lookup is fast

## Features
* As a distributor, I am able to store, modify, retrieve, delete customer data
* As a distributor, I am able to search customer data by knowing the name or e-mail address of the customer

## Task
How to solve the problem?
What would be the architecture of such a solution? What technologies would be suitable? \
Create a proof of concept

# Solution
### Theory
* First of all, it’s an architecture disaster to store PII inside the Booking table/doc. PII should be stored separately 
from the Bookings. Bookings should have only refs(foreign keys) to related PPI.
* Horizontal [sharding](https://www.digitalocean.com/community/tutorials/understanding-database-sharding) can be used for
 storing PPI physically at the permitted location. The residence country of the user will define to which shard his PPI will belong.
* It's possible to encrypt PPI (to make it not identified) and store in forbidden regions for more optimal aggregation and statistics queries.
* It's possible to separate all PPI by a particular distributor on each shard using separated collections/tables on each shard, but it has its own cons.

### Implementation 
![Cluster architecture](info/cluster.jpg "Cluster architecture")
Imagine, we have several MongoDB shards located in different continents. Then PPI will be stored at sharded collection 
`db.profiles`. Let's separate PPI by two shards:

- shard1\
ZONE NA (North America) \
country: "US", distributorId: from 1   to 100\
country: "CA", distributorId: from 101 to 200

- shard2 \
ZONE EU (European Union)\
country: "EE", distributorId: from 201 to 300\
country: "FI", distributorId: from 301 to 400

#### API
- Create a new profile:

```
    POST /api/profiles/  {country, distributorId, email, fullName}
    Code: 201
    Response: {
                  "data": {
                      "type": "profile",
                      "profile": {
                          "country": "EE",
                          "distributorId": 224,
                          "email": "Gregory82@gmail.com",
                          "fullName": "Gregory Shields",
                          "id": "5e4b4dd7f45aac001ed3718e"
                      }
                  },
                  "status": "OK"
              }
```

- Get profile by Id:

```
    GET /api/profiles/:id
    Code: 200
    Response: {
                  "data": {
                      "type": "profile",
                      "profile": {
                          "country": "EE",
                          "distributorId": 224,
                          "email": "Gregory82@gmail.com",
                          "fullName": "Gregory Shields",
                          "id": "5e4b4dd7f45aac001ed3718e"
                      }
                  },
                  "status": "OK"
              }
```

- Search profile by:
    - county code
    - distributor id
    - fullName (partial text match)
    - email (partial text match)  

```
    GET /api/profiles/search?country=&distributorId=&email=&fullName=&
    Code: 200
    Response: {"data":{"profiles":[],"searchArgs":{}},"status":"OK"}
```

(!) If to pass `explain` query param, instead of search results the query [explaination](https://docs.mongodb.com/manual/reference/method/cursor.explain/) will be returned.

```
    GET /api/profiles/search?explain=true&...
    Code: 200
    Response: {"data":{"explain":{"queryPlanner":{"mongosPlannerVersi.....}, "searchArgs":{}},"status":"OK"}
```

- Delete by Id:

```
    DELETE /api/profiles/:id
    Code: 200
    Response: {
                  "data": {
                      "type": "profile",
                      "result": true,
                      "message": "Instance with id = 5e4b4dd7f45aac001ed3718e is  deleted"
                  },
                  "status": "OK"
              }
```

## How-to-run
It is possible to run all inside Docker containers. All steps are introduced on the video:

[![How to run guide](http://img.youtube.com/vi/WRI-uTpFWl8/0.jpg)](http://www.youtube.com/watch?v=WRI-uTpFWl8 "How to run")

### Steps (inside containers):
1) Build and up all containers:
    ```
    docker-compose up --build -d
    ```
2) Wait until all containers get up.
3) Run tests:
   ```
   cd server
   npm run test:in_container
   ```
### Steps (local):
1) Build and up only MongoDB services:
    ```
    docker-compose up --build -d router1
    ```
2) Wait until all containers get up.
3) Install all dependencies
    ```
    cd server
    npm i
    ```
3) Start a server
    ```
    npm run dev
    ```
4) Run tests:
   ```
   npm run test
   ```
## Info

General info:
- Node.js version: `v13.6.0`. Using `ESM`
- All db data from each MongoDB instance will be mapped to `./mongo/data/` folder
- Output from `sh.status({})` command can bu found at [./info/shardStatus.txt](./info/shardStatus.txt)

Used ports:  
- `27017` - MongoDB Mongos server
- `3000`  - HTTP web server

Config files:
- [.env](.env)
- [./server/config/index.js](./server/config/index.js)

MongoDB connection URL: 

    mongodb://admin:admin@localhost:27017/db



 

