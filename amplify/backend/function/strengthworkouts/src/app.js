/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	AUTH_STRENGTHHUB3E97CB7B_USERPOOLID
	ENV
	REGION
	STORAGE_WORKOUTSDB_ARN
	STORAGE_WORKOUTSDB_NAME
	STORAGE_WORKOUTSDB_STREAMARN
Amplify Params - DO NOT EDIT */

//load aws dynamodb library

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
// declare a new express app
var app = express();
var cors = require("cors"); // ADDED - for avoiding CORS in local dev
var calculateIncrements = require("./helpers/calculateIncrements");
app.use(cors()); // ADDED - for avoiding CORS in local dev
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/* 1. Import the AWS SDK and create an instance of the DynamoDB Document Client */
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

/**********************
 * Get all items in DB *
 **********************/

/* app.get("/api/strengthworkouts/", function (req, res) {
  var params = {
    TableName: process.env.STORAGE_WORKOUTSDB_NAME,
  };
  docClient.scan(params, function (err, data) {
    if (err) res.json({ err });
    else res.json({ data });
  });
}); */

/**********************
 * Get a single item *
 **********************/

//app.get request to get a single item from the database
//if returned data is null, then return 404

app.get("/api/strengthworkouts/*", function (req, res) {
  var params = {
    TableName: process.env.STORAGE_WORKOUTSDB_NAME,
    Key: {
      id: req.query.id,
      name: req.query.name,
    },
  };

  //query DynamoDB for the document
  docClient.get(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      res.status(500).json(err);
    }
    if (!data.Item) {
      res.status(200).json(null);
    } else {
      res.status(200).json(data.Item);
    }
  });
});

/****************************
 * Example post method *
 ****************************/

app.post("/api/strengthworkouts", function (req, res) {
  var params = {
    TableName: process.env.STORAGE_WORKOUTSDB_NAME,
    Item: {
      id: req.body.id,
      name: req.body.name,
      oneRepMax: req.body.oneRepMax,
      fiveThreeOne: calculateIncrements.mapLifts(
        req.body.oneRepMax,
        req.body.oneRepMax["Current Week"]
      ),
    },
  };

  //validate the input
  if (!params.Item.id || !params.Item.name || !params.Item.oneRepMax) {
    res.json({ err: "Invalid input" });
    return;
  }
  docClient.put(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      res.json({
        msg: "post call failed!",
        url: req.url,
        body: req.body,
        error: err,
      });
    } else {
      console.log("post call succeed!", data);
      res.json({
        success: "post call succeed!",
        updated: params.Item,
      });
    }
  });
});

app.post("/api/strengthworkouts/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/api/strengthworkouts", function (req, res) {
  //check if user is authorized to update resource
  //if not, return error
  // if yes, update resource
  var params = {
    TableName: process.env.STORAGE_WORKOUTSDB_NAME,
    Key: {
      id: req.body.id,
      name: req.body.name,
    },
    UpdateExpression: "SET #n = :name",
    //if expression is not provided return error
    ExpressionAttributeValues: {
      ":name": req.body.name,
    },
    ExpressionAttributeNames: {
      "#n": "name",
    },
  };

  docClient.update(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      res.json({
        success: "put call failed!",
        url: req.url,
        body: req.body,
        error: err,
      });
    } else {
      console.log("put call succeed!", data);
      res.json({ success: "put call succeed!", url: req.url, body: req.body });
    }
  });
});

app.put("/api/strengthworkouts/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/api/strengthworkouts", function (req, res) {
  //delete db item
  var params = {
    TableName: process.env.STORAGE_WORKOUTSDB_NAME,
    Key: {
      id: req.body.id,
      name: req.body.name,
    },
  };
  docClient.delete(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      res.json({
        success: "delete call failed!",
        url: req.url,
        error: err,
      });
    } else {
      console.log("delete call succeed!", data);
      res.json({ success: "delete call succeed!", url: req.url });
    }
  });
});

app.delete("/api/strengthworkouts/*", function (req, res) {
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
