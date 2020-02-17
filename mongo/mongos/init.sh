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

# 1) Create a user for accessing to claster
# 2) Create a sharded collection
# 3) Config sharded collection
# https://docs.mongodb.com/manual/tutorial/sharding-segmenting-data-by-location/
/usr/bin/mongo --port 27017 <<EOF
use $MONGO_DB_NAME;

db.createUser({user: '$MONGO_USER', pwd: '$MONGO_PASSWORD', roles: [{role: 'clusterAdmin', db: 'admin'}, "readWrite"]});


sh.enableSharding("$MONGO_DB_NAME");
db.createCollection("$SHARDED_COLLECTION_NAME");
db.adminCommand( { shardCollection: "$SHARDED_COLLECTION_NAMESPACE", key: $SHARD_KEY } );


sh.disableBalancing("$SHARDED_COLLECTION_NAMESPACE");

$SHARD_TAGS.forEach(([shardName, tag]) => sh.addShardTag(shardName, tag))
$SHARD_ZONES.forEach(([collection, min, max, tag]) => sh.addTagRange(collection, min, max, tag))

sh.enableBalancing("$SHARDED_COLLECTION_NAMESPACE");
EOF
