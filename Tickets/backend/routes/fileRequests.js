const express = require("express");
const router = express.Router();
const { oracledb, dbConfig } = require("../db/dbConfig"); // Import the configuration

const fs = require("fs");
const path = require("path");
const { decode64 } = require('../Encoder/Enc');
const { verify } = require("../middleware/auth");

router.get("/all", verify,async (req, res) => {
  // console.log("sss");
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `select cc.request_id,cc.request_name,cu.username,
      TO_CHAR(cc.date_created, 'MM/DD/YYYY hh:mi AM')

      ,cc.type_of_request,cc.status,
      TO_CHAR(cc.last_modified_date, 'MM/DD/YYYY hh:mi AM')
      ,cc.request_details,cc.file_path from c_file_request cc left join c_users cu on cc.user_id=cu.user_id    order by cc.request_id desc`
    );

    const cFileRequests = result.rows;
    // console.log(cRequests);

    await connection.close();

    res.json({ cFileRequests });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/newr",verify, async (req, res) => {
  try {
    console.log(req.body);
    // return
    const requestName = req.body.requestName;
    const requestType = req.body.requestType;
    const userId = req.body.user_id;
    const requestDetails = req.body.requestDetails;
    // console.log(req.body.requestDetails);
    var file ;
    if (req.files){

       file = req.files.file;
    }

    const connection = await oracledb.getConnection(dbConfig);

    const resultSuggestion = await connection.execute(
      `INSERT INTO c_file_request (request_name, user_id, type_of_request, request_details,status )
      VALUES (:requestName, :userId, :requestType, :requestDetails ,'Pending')`,
      { requestName, userId, requestType, requestDetails }
    );

    if (file) {
      const resultrequestId = await connection.execute(
        `SELECT MAX(request_id) as max_request_id FROM c_file_request`
      );
      console.log('sssssssssssssssssssss');
      let requestId;
      if (resultrequestId.rows[0][0]) {
        requestId = resultrequestId.rows[0][0];
      }
      console.log(requestId);

      const encodedFileName = decode64(file.name); // Encode the filename
      console.log(encodedFileName);
      console.log(decode64(file.name));
      console.log(file);
      const filePath = path.join(
        "C:/",
        "spool",
        "c_file_uploads",
        requestId.toString(),
        encodedFileName
      );

      const resultDocuments = await connection.execute(
        `update c_file_request set file_path = :filePath  where request_id =:requestId `,
        { filePath,requestId }
      );

      await connection.close();

      fs.mkdirSync(
        path.join("C:/", "spool", "c_file_uploads", requestId.toString()),
        { recursive: true }
      );

      await file.mv(filePath); // Move the file to the specified path
    }
    res.status(200).send("sucess !");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});







router.post("/update",verify, async (req, res) => {
  try {
    console.log(req.body);
    // return
    const requestName = req.body.requestName;
    const requestType = req.body.requestType;
    const requestId = req.body.requestId;
    const requestDetails = req.body.requestDetails;
    const status = req.body.status;
    // console.log(req.body.requestDetails);
    var file ;
    if (req.files){

       file = req.files.file;
    }

    const connection = await oracledb.getConnection(dbConfig);

    const resultSuggestion = await connection.execute(
      `update c_file_request  set request_name=:requestName, type_of_request=:requestType, request_details=:requestDetails,status=:status ,last_modified_date = sysdate
      where request_id=:requestId`,
      { requestName,  requestType, requestDetails,status ,requestId}
    );

    if (file) {
     

      const encodedFileName = decode64(file.name); // Encode the filename
      console.log(encodedFileName);
      console.log(decode64(file.name));
      console.log(file);
      const filePath = path.join(
        "C:/",
        "spool",
        "c_file_uploads",
        requestId.toString(),
        encodedFileName
      );

      const resultDocuments = await connection.execute(
        `update c_file_request set file_path = :filePath  where request_id =:requestId `,
        { filePath,requestId }
      );

      await connection.close();

      fs.mkdirSync(
        path.join("C:/", "spool", "c_file_uploads", requestId.toString()),
        { recursive: true }
      );

      await file.mv(filePath); // Move the file to the specified path
    }
    res.status(200).send("sucess !");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

















module.exports = router;






