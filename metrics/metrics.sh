#!/bin/zsh
LOGS="$(dirname "$0")/logs";
TMP="$(dirname "$0")/tmp";

echo "DOWNLOADING LOGS FROM S3"
aws s3 sync s3://brianmcconnell.me $LOGS
mv $LOGS/E1TNSK7JF24IAY*.gz $TMP/

echo "UNZIPPING LOGS"
gzip -d -k -f $TMP/E1TNSK7JF24IAY*gz
mv $TMP/E1TNSK7JF24IAY*.gz $LOGS/

echo "SCRUBBING CRAWLERS & BOTS"
cat $TMP/E1TNSK7JF24IAY.* | grep -E -v "go\-http\-client|wp\-includes|admin|sql|\.php|drupal|crawler|\.env|ads\.txt|sellers|\.git" > ./access_log

echo "ANALYZING LOGS"
goaccess ./access_log -o ../www/metrics.html --log-format=CLOUDFRONT --ignore-crawlers --unknowns-as-crawlers

rm $TMP/E1TNSK7JF24IAY*