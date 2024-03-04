#!/bin/bash
set -e

curl https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/7.2.0/openapi-generator-cli-7.2.0.jar -o openapi-generator-cli.jar
java -jar openapi-generator-cli.jar generate -g typescript-fetch -i dp-api-server-v2.yaml --remove-operation-id-prefix --additional-properties=supportsES6=true
rm -rf openapi-generator-cli.jar
