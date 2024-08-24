// In your routes file (e.g., routes/details.js)

const express = require("express");
const router = express.Router();
const { oracledb, dbConfig } = require("../db/dbConfig"); // Import the configuration
const path = require("path");
const fs = require("fs");
const { decode64 } = require('../Encoder/Enc');
const { verify } = require("../middleware/auth");

router.get("/new/:reqId",verify, async (req, res) => {
  requestId = req.params.reqId;
  res.render("newContact", { requestId });
});

// routes/submitContact.js
router.post("/newc",verify, async (req, res) => {
  try {
    const { requestId, contactDate, contactDetails, userId } = req.body;
    const connection = await oracledb.getConnection(dbConfig);
    // const userId = req.session.user.user_id; // Assuming user_Id is stored in the session
    const file = req.files.file;
    if (file) {

      const contactIdResult = await connection.execute(
        `SELECT NVL(MAX(contact_id), 0) + 1 AS new_contact_id FROM c_contacts`
      );
      const contactId = contactIdResult.rows[0][0];
      const result = await connection.execute(
        `INSERT INTO c_contacts (CONTACT_ID,request_id, employee_id, contact_date,last_modified_date, contact_details, status)
                  VALUES (:contactId,:requestId, :userId, TO_TIMESTAMP(:contactDate, 'YYYY-MM-DD"T"HH24:MI'),SYSDATE, :contactDetails, 'In Progress')`,
        { contactId, requestId, userId, contactDate, contactDetails }
      );

      console.log(contactId);
      const filePath = path.join(
        "C:/",
        "spool",
        "c_uploads",
        requestId.toString(),
        contactId.toString(),
        decode64(file.name)

      );

      fs.mkdirSync(path.join("C:/", "spool", "c_uploads", requestId.toString(), contactId.toString()), {
        recursive: true,
      });

      // Move the file to the specified path
      await file.mv(filePath);
      console.log(contactId);

      const resultDocuments = await connection.execute(
        `INSERT INTO c_documents 
        (request_id, file_path, date_uploaded, uploaded_by, upload_stage,CONTACT_ID)
        VALUES (:requestId, :filePath, SYSDATE, :userId, 'stage2',:contactId)`,
        { requestId, filePath, userId, contactId }
      );

      console.log("Contact added with ID " + result.lastRowid);
    }




    await connection.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }

  res.send("Contact added successfully!");
  // res.redirect(`/details/${requestId}`);
  // res.redirect('/home');
});




router.get('/all/:REQUEST_ID',verify, async (req, res) => {
  try {
    const { REQUEST_ID } = req.params;

    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT cc.CONTACT_ID, u.USERNAME,
          TO_CHAR(cc.CONTACT_DATE, 'MM/DD/YYYY hh:mi AM')
          , 
          TO_CHAR(cc.LAST_MODIFIED_DATE, 'MM/DD/YYYY hh:mi AM')
          , cc.CONTACT_DETAILS, cc.STATUS 
           FROM c_contacts cc
           LEFT JOIN c_users u ON u.user_id = cc.employee_id
           WHERE cc.REQUEST_ID = :requestId  order by cc.CONTACT_ID desc `,
      [REQUEST_ID]
    );

    await connection.close();

    const contacts = result.rows.map(row => ({
      contactId: row[0],
      username: row[1],
      contactDate: row[2],
      lastModifiedDate: row[3],
      contactDetails: row[4],
      status: row[5]
    }));

    res.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




module.exports = router;
