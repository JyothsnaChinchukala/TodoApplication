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

const hasPriorityAndStatusProperties = (requestQuery, response) => {
  if (
    requestQuery.priority !== undefined &&
    requestQuery.status !== undefined
  ) {
    if (
      requestQuery.priority in ["HIGH", "MEDIUM", "LOW"] &&
      requestQuery.status in ["TO DO", "IN PROGRESS", "DONE"]
    ) {
      return true;
    } else {
      if (!(requestQuery.priority in ["HIGH", "MEDIUM", "LOW"])) {
        response.status(400);
        response.send("Invalid Todo Priority");
      } else if (!(requestQuery.status in ["TO DO", "IN PROGRESS", "DONE"])) {
        response.status(400);
        response.send("Invalid Todo Status");
      }
    }
  }
};
const hasCategoryAndStatusProperties = (requestQuery, response) => {
  if (
    requestQuery.category !== undefined &&
    requestQuery.status !== undefined
  ) {
    if (
      requestQuery.category in ["WORK", "HOME", "LEARNING"] &&
      requestQuery.status in ["TO DO", "IN PROGRESS", "DONE"]
    ) {
      return true;
    } else {
      if (!(requestQuery.category in ["WORK", "HOME", "LEARNING"])) {
        response.status(400);
        response.send("Invalid Todo Category");
      } else if (!(requestQuery.status in ["TO DO", "IN PROGRESS", "DONE"])) {
        response.status(400);
        response.send("Invalid Todo Status");
      }
    }
  }
};
const hasCategoryAndPriorityProperties = (requestQuery, response) => {
  if (
    requestQuery.category !== undefined &&
    requestQuery.priority !== undefined
  ) {
    if (
      requestQuery.category in ["WORK", "HOME", "LEARNING"] &&
      requestQuery.priority in ["HIGH", "MEDIUM", "LOW"]
    ) {
      return true;
    } else {
      if (!(requestQuery.category in ["WORK", "HOME", "LEARNING"])) {
        response.status(400);
        response.send("Invalid Todo Category");
      } else if (!(requestQuery.priority in ["HIGH", "MEDIUM", "LOW"])) {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
    }
  }
};

const hasPriorityProperty = (requestQuery, response) => {
  if (requestQuery.priority !== undefined) {
    if (requestQuery.priority in ["HIGH", "MEDIUM", "LOW"]) {
      return true;
    } else {
      if (!(requestQuery.priority in ["HIGH", "MEDIUM", "LOW"])) {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
    }
  }
};

const hasStatusProperty = (requestQuery, response) => {
  if (requestQuery.status !== undefined) {
    if (requestQuery.status in ["TO DO", "IN PROGRESS", "DONE"] === true) {
      return true;
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
      return false;
    }
  }
};
const hasCategoryProperty = (requestQuery, response) => {
  if (requestQuery.category !== undefined) {
    if (requestQuery.category in ["WORK", "HOME", "LEARNING"]) {
      return true;
    } else {
      if (!(requestQuery.category in ["WORK", "HOME", "LEARNING"])) {
        response.status(400);
        response.send("Invalid Todo Category");
        return false;
      }
    }
  }
};
const seachQuery = (requestQuery, response) => {
  if (requestQuery.search_q !== "") {
    return true;
  }
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", category, priority, status, date } = request.query;

  switch (true) {
    case hasPriorityAndStatusProperties(request.query, response): //if this is true then below query is taken in the code
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
      break;
    case hasCategoryAndStatusProperties(request.query, response):
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
      break;
    case hasCategoryAndPriorityProperties(request.query, response):
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
      break;
    case hasStatusProperty(request.query, response):
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
      break;

    case hasPriorityProperty(request.query, response):
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
      break;
    case hasCategoryProperty(request.query, response):
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
      break;
    case seachQuery(request.query, response):
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

module.exports = app;
