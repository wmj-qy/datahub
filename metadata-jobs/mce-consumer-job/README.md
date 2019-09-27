# MetadataChangeEvent (MAE) Consumer Job
MCE Consumer is a [Kafka Streams](https://kafka.apache.org/documentation/streams/) job. Its main function is to listen
`MetadataChangeEvent` Kafka topic for messages and process those messages and writes new metadata to `Data Hub GMS`.
After every successful update of metadata, GMS fires a `MetadataAuditEvent` and this is consumed by 
[MAE Consumer Job](../elasticsearch-index-job).

## Pre-requisites
* You need to have [JDK8](https://www.oracle.com/java/technologies/jdk8-downloads.html) 
installed on your machine to be able to build `Data Hub GMS`.

## Build
`MCE Consumer Job` is already built as part of top level build:
```
./gradlew build
```
However, if you only want to build `MCE Consumer Job` specifically:
```
./gradlew :metadata-jobs:mce-consumer-job:build
```

## Dependencies
Before starting `MCE Consumer Job`, you need to make sure that [Kafka, Schema Registry & Zookeeper](../../docker/kafka) and  
[Data Hub GMS](../../docker/gms) Docker containers are up and running.

## Start via Docker image
Quickest way to try out `MCE Consumer Job` is running the [Docker image](../../docker/mce-consumer).

## Start via command line
If you do modify things and want to try it out quickly without building the Docker image, you can also run
the application directly from command line after a successful [build](#build):
```
./gradlew :metadata-jobs:mce-consumer-job:run
```