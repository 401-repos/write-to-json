'use strict';

class MetaData {
    constructor(name, size, type) {
        this.name = name;
        this.size = size;
        this.type = type;
    }
}
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
exports.handler = async function (event) {
    let srcBucket = event.Records[0].s3.bucket.name;
    // Object key may have spaces or unicode non-ASCII characters.
    let srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    let typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Not an image");
    }
    let imageType = typeMatch[1].toLowerCase();
    if (imageType != 'jpg' && imageType != 'png') {
        console.log('Unsupported Image Type');
    }

    let newItem = new MetaData(event.Records[0].s3.object.key.split('.')[0], event.Records[0].s3.object.size, imageType);

    try {
        s3.getObject({
            Bucket: srcBucket,
            Key: 'images.json',
            ResponseContentType: 'application/json'
        }, (err, data) => {
            if (err) {
                console.log("Error when read");
            }
            let parsed = JSON.parse(data);
            let found = parsed.findIndex(elem => {
                return elem.name == newItem.name
            });
            if (found != -1) {
                parsed[found] = newItem;
                console.log("Updated Existing item");
            } else {
                parsed.push(newItem);
                console.log("Added new Item");
            }
            s3.putObject({
                    Bucket: srcBucket,
                    Key: 'images.json',
                    Body: JSON.stringify(parsed),
                    ContentType: 'application/json',
                },
                (err) => {
                    if (err) {
                        console.log('Error when put');
                    }
                });
        });
    } catch (err) {
        let obj = [newItem];
         s3.putObject({
                Bucket: srcBucket,
                Key: 'images.json',
                Body: JSON.stringify(obj),
                ContentType: 'application/json',
            },
            (err) => {
                if (err) {
                    console.log('Error when put');
                }
            });
    }
}