const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("DB and Sever Connection is Successful");
    });
  } catch (e) {
    console.log(`The Error is ${e.message}`);
  }
};
initializeDbAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
  if (
    requestQuery.priority !== undefined &&
    requestQuery.status !== undefined
  ) {
    return true;
  }
};
const hasCategoryAndStatusProperties = (requestQuery) => {
  if (
    requestQuery.category !== undefined &&
    requestQuery.status !== undefined
  ) {
    return true;
  }
};
const hasCategoryAndPriorityProperties = (requestQuery) => {
  if (
    requestQuery.category !== undefined &&
    requestQuery.priority !== undefined
  ) {
    return true;
  }
};

const hasPriorityProperty = (requestQuery) => {
  if (requestQuery.priority !== undefined) {
    return true;
  }
};

const hasStatusProperty = (requestQuery) => {
  if (requestQuery.status !== undefined) {
    return true;
  }
};
const hasCategoryProperty = (requestQuery) => {
  if (requestQuery.category !== undefined) {
    return true;
  }
};

const convertToCamelCase = (eachTodo) => {
  return {
    id: eachTodo.id,
    todo: eachTodo.todo,
    priority: eachTodo.priority,
    status: eachTodo.status,
    category: eachTodo.category,
    dueDate: eachTodo.due_date,
  };
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", category, priority, status, date } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query): //if this is true then below query is taken in the code
      /*if (
        priority in ["HIGH", "MEDIUM", "LOW"] &&
        status in ["TO DO", "IN PROGRESS", "DONE"]
      ) {*/
      getTodosQuery = `
            SELECT
                *
            FROM
                todo 
            WHERE
                todo LIKE '%${search_q}%'
                AND status = '${status}'
                AND priority = '${priority}';`;
      data = await db.all(getTodosQuery);
      response.send(data);
      /*} else {
        if (!(status in ["TO DO", "IN PROGRESS", "DONE"])) {
          response.status(400);
          response.send("Invalid Todo Status");
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      }*/
      break;
    case hasCategoryAndStatusProperties(request.query):
      /*if (
        category in ["WORK", "HOME", "LEARNING"] &&
        status in ["TO DO", "IN PROGRESS", "DONE"]
      ) {*/
      getTodosQuery = `
            SELECT
                *
            FROM
                todo 
            WHERE
                todo LIKE '%${search_q}%'
                 AND status = '${status}'
                 AND category = '${category}';`;
      data = await db.all(getTodosQuery);
      response.send(data);
      /*} else {
        if (!(status in ["TO DO", "IN PROGRESS", "DONE"])) {
          response.status(400);
          response.send("Invalid Todo Status");
        } else {
          response.status(400);
          response.send("Invalid Todo Category");
        }
      }*/
      break;
    case hasCategoryAndPriorityProperties(request.query):
      /*if (
        priority in ["HIGH", "MEDIUM", "LOW"] &&
        category in ["WORK", "HOME", "LEARNING"]
      ) {*/
      getTodosQuery = `
        SELECT
            *
        FROM
            todo 
        WHERE
            todo LIKE '%${search_q}%'
            AND priority = '${priority}'
            AND category = '${category}';`;
      data = await db.all(getTodosQuery);
      response.send(data);
      /* } else {
        if (!(priority in ["HIGH", "MEDIUM", "LOW"])) {
          response.status(400);
          response.send("Invalid Todo Priority");
        } else {
          response.status(400);
          response.send("Invalid Todo Category");
        }
      }*/
      break;
    case hasStatusProperty(request.query):
      /*if (status in ["TO DO", "IN PROGRESS", "DONE"]) {*/
      getTodosQuery = `
        SELECT
            *
        FROM
            todo 
        WHERE
            todo LIKE '%${search_q}%'
            AND status = '${status}';`;
      data = await db.all(getTodosQuery);
      response.send(data);
      /*} else {
        response.status(400);
        response.send("Invalid Todo Status");
      }*/
      break;

    case hasPriorityProperty(request.query):
      /*if (priority in ["HIGH", "MEDIUM", "LOW"]) {*/
      getTodosQuery = `
        SELECT
            *
        FROM
            todo 
        WHERE
            todo LIKE '%${search_q}%'
            AND priority = '${priority}';`;
      data = await db.all(getTodosQuery);
      response.send(data);
      /*} else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }*/
      break;
    case hasCategoryProperty(request.query, response):
      /*if (category in ["WORK", "HOME", "LEARNING"]) {*/
      getTodosQuery = `
        SELECT
            *
        FROM
            todo 
        WHERE
            todo LIKE '%${search_q}%'
            AND category = '${category}';`;
      data = await db.all(getTodosQuery);
      response.send(data);
      /* } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }*/
      break;
    default:
      getTodosQuery = `
        SELECT
            *
        FROM
            todo 
        WHERE
            todo LIKE '%${search_q}%';`;
      data = await db.all(getTodosQuery);
      response.send(data);
  }
});

app.get("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  let sqlQuery = `
        SELECT * FROM todo
        WHERE id = ${todoId};
    `;
  let dbResponse = await db.all(sqlQuery);
  response.send(dbResponse.map(convertToCamelCase)[0]);
});

app.get("/todos/");

module.exports = app;
