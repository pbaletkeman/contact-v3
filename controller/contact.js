import Router from "express-promise-router";
import bodyParser from "body-parser";

// import * as db from "../db/index.js";
import Address from "../models/address.js";
import Contact from "../models/contact.js";
import JSONTools from "../models/jsonTools.js";

const router = new Router();

// export our router to be mounted by the parent application
export default router;

// create application/json parser
var jsonParser = bodyParser.json();

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
  const row = await getRecord(req.params["id"]);
  res.end(JSON.stringify(row));
});

router.post("/", jsonParser, async function (req, res) {
  console.log("POST request received");
  // console.log("Req");
  // console.log(req.body);
  const contact = JSONTools().JSONToModel(req.body);
  console.log("contact");
  console.log(contact.toJSON());
  // const inserted = await insertRecord(contact);
  res.writeHead(200, { "Content-Type": "application/json" });
  // res.end(JSON.stringify(inserted));
  res.end();
});

router.put("/", jsonParser, async function (req, res) {
  console.log("PUT request received");
  const contact = new Contact().createFromJSON(req.body);
  const updated = await updateRecord(contact);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(updated));
});

router.delete("/:ids", async function (req, res) {
  console.log("DELETE request received");
  res.writeHead(200, { "Content-Type": "application/json" });
  const row = await deleteRecords(req.params["ids"]);
  res.end(JSON.stringify(row));
});

async function deleteRecords(ids) {}

async function getRecord(id) {
  return await getRecords(id, null, null);
}

async function getRecords(ids, sortField, sortDirection) {
  let sqlString = `SELECT 
    ${TABLE_NAME}."contactid", 
    ${TABLE_NAME}."firstname", 
    ${TABLE_NAME}."lastname", 
    ${TABLE_NAME}."middlename", 
    ${TABLE_NAME}."birthdate", 
    ${addressTable}."addressid",
    ${addressTable}."contactid",
    ${addressTable}."province",
    ${addressTable}."country",
    ${addressTable}."phone",
    ${addressTable}."postalcode",
    ${addressTable}."street1",
    ${addressTable}."street2",
    ${addressTable}."city",
    ${addressTable}."email"
  FROM ${TABLE_NAME}, ${addressTable} WHERE ${TABLE_NAME}."contactid" = ${addressTable}."contactid" `;
  if (ids) {
    sqlString += ` AND ${TABLE_NAME}."contactid" in (` + ids + ") ";
  }
  if (sortField) {
    sqlString += ` ORDER BY "` + sortField + `" `;
  }
  if (sortDirection) {
    sqlString += sortDirection;
  }
  const res = await db.query(sqlString);
  let results = [];
  let contactId = null;
  let adds = [];
  let contact = new Contact();
  let ad = new Address();
  for (let i = 0; i < res.rows.length; i++) {
    if (contactId == res.rows[i].contactid) {
      ad = new Address();
      ad.addressId = res.rows[i].addressid;
      ad.city = res.rows[i].city;
      ad.contactId = contactId;
      ad.country = res.rows[i].country;
      ad.email = res.rows[i].email;
      ad.phone = res.rows[i].phone;
      ad.postalCode = res.rows[i].postalcode;
      ad.province = res.rows[i].province;
      ad.street1 = res.rows[i].street1;
      ad.street2 = res.rows[i].street2;
      adds.push(ad.pretty());
    } else {
      ad = new Address();
      if (contactId != null) {
        let tempContact = JSON.parse(contact.pretty());
        tempContact.contact.addresses = adds;
        results.push(tempContact);
      }
      contactId = res.rows[i].contactid;
      contact.contactId = contactId;
      contact.firstName = res.rows[i].firstname;
      contact.lastName = res.rows[i].lastname;
      contact.middleName = res.rows[i].middlename;
      contact.contactId = res.rows[i].contactid;
      contact.birthDate = res.rows[i].birthdate;
      adds = [];

      ad.addressId = res.rows[i].addressid;
      ad.city = res.rows[i].city;
      ad.contactId = contactId;
      ad.country = res.rows[i].country;
      ad.email = res.rows[i].email;
      ad.phone = res.rows[i].phone;
      ad.postalCode = res.rows[i].postalcode;
      ad.province = res.rows[i].province;
      ad.street1 = res.rows[i].street1;
      ad.street2 = res.rows[i].street2;
      adds.push(ad.pretty());
    }
  }
  let tempContact = JSON.parse(contact.pretty());
  tempContact.contact.addresses = adds;

  results.push(tempContact);
  return results;
}

async function updateRecord(contact) {
  let sqlString = `UPDATE ${TABLE_NAME} set `;
  let sqlValues = [];
  let i = 0;
  if (contact.firstName) {
    i++;
    sqlString += `"firstname" = $` + i + `,`;
    sqlValues.push(contact.firstName.trim());
  }
  if (contact.lastName) {
    i++;
    sqlString += `"lastname" = $` + i + `,`;
    sqlValues.push(contact.lastName.trim());
  }
  if (contact.middleName) {
    i++;
    sqlString += `"middlename" = $` + i + `,`;
    sqlValues.push(contact.middleName.trim());
  }
  if (contact.title) {
    i++;
    sqlString += `"title" = $` + i + `,`;
    sqlValues.push(contact.title.trim());
  }
  if (contact.birthDate) {
    i++;
    sqlString += `"birthdate" = $` + i + `,`;
    sqlValues.push(new Date(contact.birthDate.trim()));
  }
  i++;
  sqlString =
    sqlString.substring(0, sqlString.length - 1) +
    ` WHERE contactid = $` +
    i +
    ` RETURNING * `;
  sqlValues.push(contact.contactId);
  let res = await db.query(sqlString, sqlValues, contact.contactId);
  let updateAdds = [];
  if (contact.addresses && Array.isArray(contact.addresses)) {
    for (let i = 0; i < contact.addresses.length; i++) {
      updateAdds.push(await addressUpdate(contact.addresses[i]));
    }
  }
  res.rows[0].addresses = updateAdds;
  return res.rows;
}

async function insertRecord(contact) {
  let sqlString = [];
  let sqlValues = [];
  if (contact.contactId) {
    sqlString.push("contactId");
    sqlValues.push(contact.contactId);
  }
  if (contact.firstName) {
    sqlString.push("firstname");
    sqlValues.push(contact.firstName.trim());
  }
  if (contact.lastName) {
    sqlString.push("lastname");
    sqlValues.push(contact.lastName.trim());
  }
  if (contact.middleName) {
    sqlString.push("middlename");
    sqlValues.push(contact.middleName.trim());
  }
  if (contact.title) {
    sqlString.push("title");
    sqlValues.push(contact.title.trim());
  }
  if (contact.birthDate) {
    sqlString.push("birthdate");
    sqlValues.push(contact.birthDate.trim());
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
  let insertedAdds = [];
  const newContactId = res.rows[0].contactid;
  for (let i = 0; i < contact.addresses.length; i++) {
    contact.addresses[i].contactId = newContactId;
    insertedAdds.push(await addressInsert(contact.addresses[i]));
  }
  res.rows[0].addresses = insertedAdds;
  return res.rows[0];
}

function parseAddressJSON(addresses) {
  let adds = [];
  if (addresses && Array.isArray(addresses) && addresses.length > 0) {
    addresses.forEach((a) => {
      const address = JSONToAddress(a);
      adds.push(address);
    });
  }
  return adds;
}
