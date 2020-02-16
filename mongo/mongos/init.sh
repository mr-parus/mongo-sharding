#!/bin/bash

# Wait until mongos can return a connection
until /usr/bin/mongo --quiet --eval 'db.getMongo()'; do
    sleep 1
done

# Split set of shard URLs text by ';' separator
IFS=';' read -r -a array <<< "$SHARD_LIST"

# Add each shard definition to the cluster
for shard in "${array[@]}"; do
    /usr/bin/mongo --port 27017 <<EOF
        sh.addShard("${shard}");
EOF
done


#create a user for accessing DB
/usr/bin/mongo --port 27017 <<EOF
use admin;
db.createUser({user: 'admin', pwd: 'admin', roles: [{role: 'clusterAdmin', db: 'admin'}, "readWrite"]})
EOF
