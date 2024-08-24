// In your routes file (e.g., routes/allRequests.js)

const express = require('express');
const router = express.Router();
const { oracledb, dbConfig } = require('../db/dbConfig'); // Import the configuration

const fs = require("fs");
const path = require("path");
const { decode64 } = require('../Encoder/Enc');

const { verify, checkUserStatus } = require('../middleware/auth');


router.get('/all', verify,async (req, res) => {
  // console.log("sss");
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `select cc.request_id,cc.request_name,cu.username,cc.requester,
            TO_CHAR(cc.date_created, 'MM/DD/YYYY hh:mi AM')

            ,cc.type_of_request,cc.status,
            TO_CHAR(cc.last_modified_date, 'MM/DD/YYYY hh:mi AM')
            ,cc.stage ,cc.request_details from c_request cc left join c_users cu on cc.user_id=cu.user_id    order by cc.request_id desc`
    );

    const cRequests = result.rows;
    // console.log(cRequests);

    await connection.close();

    res.json({ cRequests });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


router.get("/:reqId", verify,async (req, res) => {
  const reqId = req.params.reqId;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `select cc.request_id,cc.request_name,cu.username,cc.requester,
      TO_CHAR(cc.date_created, 'MM/DD/YYYY hh:mi AM')
      ,cc.type_of_request,cc.status,TO_CHAR(cc.last_modified_date, 'MM/DD/YYYY hh:mi AM')
      ,cc.stage ,cc.request_details from c_request cc left join c_users cu on cc.user_id=cu.user_id
      WHERE request_id = :reqId
            `,
      { reqId }
    );


    const details = result.rows[0];
    // const contacts  = result2.rows;
    console.log('contacts.....................');

    // console.log(contacts);
    await connection.close();

    res.json({ details })

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




router.delete("/delete/:reqId",verify, async (req, res) => {
  const reqId = req.params.reqId;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `delete from c_request where request_id = :reqId`
      ,
      { reqId }
    );

    // console.log(contacts);
    await connection.close();
    res.status(200).send("Request Was Deleted Successfully ")

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


router.post("/update", verify,async (req, res) => {

  const { id, requestedBy, category, status, requestdetails } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `UPDATE c_request 
        SET        
        requester = :requestedBy,
        type_of_request = :category,
        status = :status,
        REQUEST_DETAILS = :requestdetails,
        
        last_modified_date = SYSDATE
       WHERE request_id = :id`,
      { requestedBy, category, status, requestdetails, id }
    );

    // await connection.commit(); // Commit the transaction
    await connection.close();
    // console.log(req.body);
    res.status(200).send("Request Was Updated Successfully ");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});





router.get('/new', verify,async (req, res) => {
  // console.log("sss");
  try {
    res.render('newRequest');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/newr', verify,async (req, res) => {
  try {
    const requestName = req.body.requestName;
    const requesterName = req.body.requesterName;
    const requestType = req.body.requestType;
    const file = req.files.file;
    const userId = req.body.user_id;
    const requestDetails = req.body.requestDetails;
    console.log(req.files);

    const decodedFileName = decode64(file.name);
    console.log(decodedFileName);
    // console.log(decodedFileName);
    // console.log( encodedFileName) 
    // return
    // 
    const connection = await oracledb.getConnection(dbConfig);

    const resultSuggestion = await connection.execute(
      `INSERT INTO c_request 
      (request_name, requester, user_id, date_created, type_of_request, status, last_modified_date, stage  ,REQUEST_DETAILS)
      VALUES (:requestName, :requesterName, :userId, SYSDATE, :requestType, 'Pending', SYSDATE, 'stage1'  ,:requestDetails)`,
      { requestName, requesterName, userId, requestType, requestDetails }
    );

    const resultrequestId = await connection.execute(
      `SELECT MAX(request_id) as max_request_id FROM c_request`
    );

    let requestId;
    if (resultrequestId.rows[0][0]) {
      requestId = resultrequestId.rows[0][0];
    }

   
    const filePath = path.join('C:/', 'spool', 'c_uploads', requestId.toString(), decodedFileName);

    const resultDocuments = await connection.execute(
      `INSERT INTO c_documents 
      (request_id, file_path, date_uploaded, uploaded_by, upload_stage)
      VALUES (:requestId, :filePath, SYSDATE, :userId, 'stage1')`,
      { requestId, filePath, userId }
    );

    const lastInsertedDocumentId = resultDocuments.lastRowid;

    console.log('Data inserted into c_documents table with ID ' + lastInsertedDocumentId);

    await connection.close();

    fs.mkdirSync(path.join('C:/', 'spool', 'c_uploads', requestId.toString()), { recursive: true });

    await file.mv(filePath); // Move the file to the specified path

    res.status(200).send('File uploaded and data inserted into c_request and c_documents tables!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
