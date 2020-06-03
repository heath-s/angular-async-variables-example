#!/bin/sh
BUCKET_NAME=BUCKET_NAME
DISTRIBUTION_ID=DISTRIBUTION_ID

npm run build -- --aot --prod

aws s3 rm s3://$BUCKET_NAME --recursive
aws s3 cp ./dist/angular-async-variables-example/ s3://$BUCKET_NAME/ --recursive

aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
