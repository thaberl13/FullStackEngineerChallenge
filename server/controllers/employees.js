const express = require("express");
//Express routes
const router = express.Router();
//Connection to database through knex
const db = require("../src/knex.js");

//test connection to database
router.get("/test", async (req, res) => {
  res.send("working");
});

//GET all employees in employees table
router.get("/", async (req, res) => {
  console.log("yes");
  //query to select all employees in database
  const allEmployees = await db.select("*").table("employees");

  //send all employees as response
  return res.send(allEmployees);
});

//POST a new employee to the employee table
router.post("/", async (req, res) => {
  try {
    //insert new employees info into table
    await db
      .insert({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        is_admin: req.body.is_admin,
      })
      .table("employees");
    return res.sendStatus(200);
  } catch (err) {
    //send 404 status if error
    res.sendStatus(404);
  }
});

//DELETE an employee from the database
router.delete("/", async (req, res) => {
  try {
    //if employee exists, select from database by last name and delete from employee table
    const last_name = req.body.last_name;
    const employee = await db
      .select("*")
      .table("employees")
      .where({ last_name })
      .del();
    //send 202 status if accepted
    return res.sendStatus(202);
  } catch (err) {
    //send 404 status if user is not found
    res.sendStatus(404);
  }
});

//UPDATE employees info using patch method
router.patch("/:id", async (req, res) => {
  let id = req.params.id;
  //set variables for different employee info to be updated
  const is_admin = req.body.is_admin;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const updated_last_name = req.body.updated_last_name;

  //if admin status needs to be updated, select by last name and update status
  if (is_admin !== undefined) {
    try {
      const employee = await db
        .select("*")
        .table("employees")
        .where({ id })
        .update({ is_admin: req.body.is_admin });
      return res.sendStatus(200);
    } catch (err) {
      return res.sendStatus(404);
    }
  }
  //if first_name needs to be updated, select by last name and update first_name
  if (first_name) {
    try {
      const employee = await db
        .select("*")
        .table("employees")
        .where({ id })
        .update({ first_name: req.body.first_name });
      return res.sendStatus(200);
    } catch (err) {
      return res.sendStatus(404);
    }
  }
  //if last name needs to be updated, select by last_name and then update
  if (updated_last_name) {
    try {
      const employee = await db
        .select("*")
        .table("employees")
        .where({ id })
        .update({ last_name: req.body.updated_last_name });
      return res.sendStatus(200);
    } catch (err) {
      res.sendStatus(404);
    }
  }
});

module.exports = router;