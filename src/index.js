require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = process.env.BASE_JSON_PATH;

//Read todos from todos.json into variable
let todos = require(__dirname + todoFilePath);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname });

  // res.status(501).end();
});

// GET list of todos
app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(todoFilePath, { root: __dirname });

  // res.status(501).end();
});

// GET todo by id
app.get("/todos/:id", (req, res) => {
  const returnTodoById = todos.find((todo) => todo.id === req.params.id);
  res.send(returnTodoById);
});

//Add GET request with path '/todos/overdue'
// if due date is before the current date-time and is not completed
// CHANGE TO GET AND RES.SEND
app.post("/todos/overdue", (req, res) => {
  const currentDate = new Date().toISOString();
  const overdueTodos = todos
    .filter((todo) => todo.due < currentDate && todo.completed === false)
    .map(({ name }) => ({ name }));
  res.send(overdueTodos);
});

//Add GET request with path '/todos/completed'
// if "completed" is true
// CHANGE TO GET AND RES.SEND
app.post("/todos/completed", (req, res) => {
  const completedTodos = todos
    .filter((todo) => todo.completed === true)
    .map(({ name }) => ({ name }));
  res.send(completedTodos);
});

//Add POST request with path '/todos'
// create a new todo - add error functions
app.post("/todos", (req, res) => {
  const currentDate = new Date().toISOString();
  todos.push({
    id: uuidv4(),
    name: req.body.name,
    created: currentDate,
    due: req.body.due,
    completed: false,
  });
  res.send(todos);
});

//Add PATCH request with path '/todos/:id
// Edit the name and/or due date attributes of a todo
app.patch("/todos/:id", (req, res) => {
  const { id, name, created, due, complete } = req.body;
  const updateTodoById = todos.find((todo) => todo.id === req.params.id);

  if (id) updateTodoById.id = id;
  if (name) updateTodoById.name = name;
  if (created) updateTodoById.created = created;
  if (due) updateTodoById.due = due;
  if (complete) updateTodoById.complete = complete;

  res.send(updateTodoById);
});

//Add POST request with path '/todos/:id/complete

//Add POST request with path '/todos/:id/undo

//Add DELETE request with path '/todos/:id
app.delete("/todos/:id", (req, res) => {
  todos = todos.filter((todo) => todo.id !== req.params.id);
  res.send(todos);
});

app.listen(port, function () {
  console.log(`Node server is running... http://localhost:${port}`);
});

module.exports = app;
