# LAB - Class 17

## Project: write-to-json

### Author: Omar Ramadan

### Links and Resources

- [Pull Request](https://github.com/401-repos/write-to-json/pull/1)

### Setup

#### How to initialize/run your application (where applicable)

- `npm start`

1. This function works when you upload a new photo to the AWS S3 Bucker.
2. It will download a file from the cloud, if the file does not exist it will create a new one.
3. When the file is downloaded, it will search the records in the .json file if the image info is already there.
4. If the information is not there it will push a new record with the MetaData Object.
5. If it exist alreadt, It will update the data of the previous record.
6. After this finised, The new information will be writen in the image.json file and uploaded again to the cloud.
