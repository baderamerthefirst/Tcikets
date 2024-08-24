
const express = require("express");
const router = express.Router();
const fs = require("fs");
const { oracledb, dbConfig } = require("../db/dbConfig"); // Import the configuration
const { verify } = require("../middleware/auth");

router.get("/",verify, async (req, res) => {
  try {
    console.log(req);
    const { request_id, contactId, testId } = req.query;

    const connection = await oracledb.getConnection(dbConfig);
    console.log(request_id, contactId, testId);
    let result = "";
    if (testId) {
      result = await connection.execute(
        `SELECT FILE_PATH FROM c_documents WHERE REQUEST_ID = :request_id  and TEST_ID = :testId`,
        {
          request_id,
          testId,
        }
      );
    }
    else if (!contactId) {
      result = await connection.execute(
        `SELECT FILE_PATH FROM c_documents WHERE REQUEST_ID = :request_id and TEST_ID is null and contact_id is null `,
        {
          request_id,
        }
      );

    } else if (contactId) {
      result = await connection.execute(
        `SELECT FILE_PATH FROM c_documents WHERE REQUEST_ID = :request_id AND TEST_ID is null and contact_id=:contactId`,
        {
          request_id,
          contactId,
        }
      );
    }

    // Check if file path is found
    if (result.rows.length === 0) {
      return res.status(404).send("File not found");
    }

    const filePath = result.rows[0][0];

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    // Stream the file content back to the client as a response
    const fileStream = fs.createReadStream(filePath);
    // Set the Content-Disposition header to prompt download
    const fileName = filePath.split("/").pop();
    // console.log(fileName);
    res.setHeader("Content-Disposition", `attachment; filename=${encodeURI(fileName)}`);

    // Pipe the file stream to the response object
    fileStream.pipe(res);

    // Close the Oracle DB connection
    await connection.close();
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Internal Server Error");
  }
});






















router.get("/2", async (req, res) => {
  try {
    console.log("ssssssssssssssssssssssssssssssssssssssssssss");
    console.log(req);
    const { request_id } = req.query;

    const connection = await oracledb.getConnection(dbConfig);
    // console.log(request_id, contactId, testId);
    let result = "";

    result = await connection.execute(
      `select file_path  from c_file_request where request_id =  :request_id`,
      {
        request_id,
      }
    );


    // Check if file path is found
    if (result.rows.length === 0) {
      return res.status(404).send("File not found");
    }
    const filePath = result.rows[0][0];
    console.log(filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    // Stream the file content back to the client as a response
    const fileStream = fs.createReadStream(filePath);
    // Set the Content-Disposition header to prompt download
    const fileName = filePath.split("/").pop();
    // console.log(fileName);
    res.setHeader("Content-Disposition", `attachment; filename=${encodeURI(fileName)}`);

    // Pipe the file stream to the response object
    fileStream.pipe(res);

    // Close the Oracle DB connection
    await connection.close();
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;
