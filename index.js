// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('uuid');
var fs = require('fs');

//var credentials = new AWS.SharedIniFileCredentials({profile: 'zzz'});
//AWS.config.credentials = credentials;
//console.log(credentials);


AWS.config.update({accessKeyId: 'xxxxx', secretAccessKey: 'yyyyy'});

var bucket = "aam-outbound";
var import_path = "import/import.json";
var s3 = new AWS.S3();


var files = [];

var params = {
  Bucket: "aam-outbound",
  Prefix: 'mtv3',
  MaxKeys: 2000
 };
 s3.listObjects(params, function(err, data) {

  if (err) console.log(err, err.stack); // an error occurred
  else {

    // order by lastModified timestamp
    files = data.Contents
    files.sort(function(a, b){
      return b.LastModified - a.LastModified;
    });

    // filter out not sync files
    files = files.filter(function(file){
        return (file.Key.indexOf('.sync') > 0);
    });
    console.log(files);

    // latest file
    var file = files[0];

    // download and save a file
    var params = {
      Bucket: bucket,
      Key: file.Key
     };
    s3.getObject(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {

        // save file
        fs.writeFile(import_path, data.Body, function(err) {
          if(err)  return console.log(err);
        });
      }
    });



    }
 });
