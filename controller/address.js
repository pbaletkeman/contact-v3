import Router from "express-promise-router";
import bodyParser from "body-parser";

// import * as db from "../db/index.js";
import Address from "../models/address.js";

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

// export our router to be mounted by the parent application
export default router;

// create application/json parser
var jsonParser = bodyParser.json();

// const result = await db.query("SELECT $1::text as message", ["Hello world!"]);
// console.log(result.rows[0]);

const TABLE_NAME = "address";

// await seedTable();

router.get("/sorted/:sortField?/:direction?", async function (req, res) {
  console.log("GET request received");
  res.writeHead(200, { "Content-Type": "application/json" });
  const rows = await getRecords(
    null,
    req.params["sortField"],
    req.params["direction"]
  );
  res.end(JSON.stringify(rows));
});

router.get("/:ids?/:sortField?/:direction?", async function (req, res) {
  console.log("GET request received");
  res.writeHead(200, { "Content-Type": "application/json" });
  const rows = await getRecords(
    req.params["ids"],
    req.params["sortField"],
    req.params["direction"]
  );
  res.end(JSON.stringify(rows));
});

router.get("/:id", async function (req, res) {
  console.log("GET /:id request received");
  res.writeHead(200, { "Content-Type": "application/json" });
  // res.end(req.params);
  const row = await getRecord(req.params["id"]);
  res.end(JSON.stringify(row));
});

router.post("/", jsonParser, async function (req, res) {
  console.log("POST request received");
  // console.log("Req");
  // console.log(req.body);
  const address = new Address().createFromJSON(req.body);
  const inserted = await insertRecord(address);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(inserted));
});

router.put("/", jsonParser, async function (req, res) {
  console.log("PUT request received");
  const address = new Address().createFromJSON(req.body);
  const updated = await updateRecord(address);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(updated));
});

router.delete("/:ids", async function (req, res) {
  console.log("DELETE request received");
  res.writeHead(200, { "Content-Type": "application/json" });
  const row = await deleteRecords(req.params["ids"]);
  res.end(JSON.stringify(row));
});

async function deleteRecords(ids) {
  const sqlString =
    `DELETE FROM ${TABLE_NAME} WHERE "addressid" in (` + ids + `)`;
  const res = await db.query(sqlString);
  return res.rows;
}

async function getRecord(id) {
  return await getRecords(id, null, null);
}

async function getRecords(ids, sortField, sortDirection) {
  let sqlString = `SELECT "contactid", "addressid", "street1", "street2", "city", "province", "postalcode", "country", "phone", "email" FROM ${TABLE_NAME} WHERE 1=1 `;
  if (ids) {
    sqlString += ` AND "addressid" in (` + ids + ") ";
  }
  if (sortField) {
    sqlString += ` ORDER BY "` + sortField + `" `;
  }
  if (sortDirection) {
    sqlString += sortDirection;
  }
  const res = await db.query(sqlString);
  return res.rows;
}

async function updateRecord(address) {
  let sqlString = `UPDATE ${TABLE_NAME} set `;
  let sqlValues = [];
  let i = 0;
  if (address.contactId) {
    i++;
    sqlString += `"contactid" = $` + i + `,`;
    sqlValues.push(address.contactId);
  }
  if (address.street1) {
    i++;
    sqlString += `"street1" = $` + i + `,`;
    sqlValues.push(address.street1.trim());
  }
  if (address.street2) {
    i++;
    sqlString += `"street2" = $` + i + `,`;
    sqlValues.push(address.street2.trim());
  }
  if (address.city) {
    i++;
    sqlString += `"city" = $` + i + `,`;
    sqlValues.push(address.city.trim());
  }
  if (address.province) {
    i++;
    sqlString += `"province" = $` + i + `,`;
    sqlValues.push(address.province.trim());
  }
  if (address.postalCode) {
    i++;
    sqlString += `"postalcode" = $` + i + `,`;
    sqlValues.push(address.postalCode.trim());
  }
  if (address.country) {
    i++;
    sqlString += `"country" = $` + i + `,`;
    sqlValues.push(address.country.trim());
  }
  if (address.phone) {
    i++;
    sqlString += `"phone" = $` + i + `,`;
    sqlValues.push(address.phone.trim());
  }
  if (address.email) {
    i++;
    sqlString += `"email" = $` + i + `,`;
    sqlValues.push(address.email.trim());
  }

  i++;
  sqlString =
    sqlString.substring(0, sqlString.length - 1) +
    ` WHERE addressId = $` +
    i +
    ` RETURNING * `;
  // console.log(address);
  sqlValues.push(address.addressId);
  const res = await db.query(sqlString, sqlValues, address.addressId);
  return res.rows[0];
}

async function insertRecord(address) {
  let sqlString = [];
  let sqlValues = [];
  if (address.contactId) {
    sqlString.push("contactid");
    sqlValues.push(address.contactId);
  }
  if (address.addressId) {
    sqlString.push("addressid");
    sqlValues.push(address.addressId);
  }
  if (address.street1) {
    sqlString.push("street1");
    sqlValues.push(address.street1.trim());
  }
  if (address.street2) {
    sqlString.push("street2");
    sqlValues.push(address.street2.trim());
  }
  if (address.city) {
    sqlString.push("city");
    sqlValues.push(address.city.trim());
  }
  if (address.province) {
    sqlString.push("province");
    sqlValues.push(address.province.trim());
  }
  if (address.postalCode) {
    sqlString.push("postalcode");
    sqlValues.push(address.postalCode.trim());
  }
  if (address.country) {
    sqlString.push("country");
    sqlValues.push(address.country.trim());
  }
  if (address.phone) {
    sqlString.push("phone");
    sqlValues.push(address.phone.trim());
  }
  if (address.email) {
    sqlString.push("email");
    sqlValues.push(address.email.trim());
  }
  let values = "";
  for (let i = 1; i <= sqlValues.length; i++) {
    values += "$" + i + ", ";
  }
  values = values.substring(0, values.length - 2);
  const sqlFields =
    `INSERT INTO ${TABLE_NAME} (` +
    `"` +
    sqlString.join('","') +
    `") VALUES (` +
    values +
    `) RETURNING * `;
  const res = await db.query(sqlFields, sqlValues);
  return res.rows;
}

// async function seedTable() {
//   for (let i = 0; i < 10; i++) {
//     const sqlString = `INSERT INTO ${TABLE_NAME} ("firstname", "lastname", "middlename", "street1", "street2", "city", "province", "postalcode", "country", "title", "phone", "birthdate", "email")
//     VALUES ('firstName${i}', 'lastName${i}', 'middleName${i}', 'street1${i}', 'street2${i}', 'city${i}', 'pr${i}', 'postalCode${i}', 'count${i}', 'mr${i}', 'phone${i}', '2024-12-01', 'email${i}');`;
//     // console.log(sqlString);
//     const res = await db.query(sqlString);
//   }
// }
