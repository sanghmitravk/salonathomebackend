const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /order.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the orders.
recordRoutes.route("/order").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  db_connect
    .collection("orders")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single order by id
recordRoutes.route("/order/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("orders").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new order.
recordRoutes.route("/order/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  console.log("req", req.body);
  const data = req.body;
  let myobj = {
    id: data.id,
    status: data.status,
    date_created: data.date_created,
    total: data.total,
    order_key: data.order_key,
    billing: {
      first_name: data.billing.first_name,
      last_name: data.billing.last_name,
      address_1: data.billing.address_1,
      address_2: data.billing.address_2,
      city: data.billing.city,
      state: data.billing.state,
      postcode: data.billing.postcode,
      email: data.billing.email,
      phone: data.billing.phone,
    },
    line_items: {
      display_value: data.line_items.display_value,
      quantity: data.line_items.quantity,
      name: data.line_items.name,
    },
    iconic_delivery_meta: {
      date: data.iconic_delivery_meta.date,
      timeslot: data.iconic_delivery_meta.timeslot,
    },
  };
  db_connect.collection("orders").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a order by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let data = req.body;
  let newvalues = {
    $set: {
      id: data.id,
      status: data.status,
      date_created: data.date_created,
      total: data.total,
      order_key: data.order_key,
      billing: {
        first_name: data.billing.first_name,
        last_name: data.billing.last_name,
        address_1: data.billing.address_1,
        address_2: data.billing.address_2,
        city: data.billing.city,
        state: data.billing.state,
        postcode: data.billing.postcode,
        email: data.billing.email,
        phone: data.billing.phone,
      },
      line_items: {
        display_value: data.line_items.display_value,
        quantity: data.line_items.quantity,
        name: data.line_items.name,
      },
      iconic_delivery_meta: {
        date: data.iconic_delivery_meta.date,
        timeslot: data.iconic_delivery_meta.timeslot,
      },
    },
  };
  console.log("newvalues", newvalues);
  db_connect
    .collection("orders")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a order
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("orders").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.status(obj);
  });
});

module.exports = recordRoutes;
