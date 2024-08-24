const express = require("express");
const router = express.Router();
const { oracledb, dbConfig } = require("../db/dbConfig");
const path = require("path");
const fs = require("fs");
const { decode64 } = require('../Encoder/Enc');
const { verify } = require("../middleware/auth");

router.post("/newt", verify,async (req, res) => {
  try {
    const {
      requestId,
      testerId,
      testResults,
      testingGroup,
      testDetails,
      testDate,
    } = req.body;
    var file = null;
    if (req.files) {
      file = req.files.file;
    }
    console.log(
      requestId,
      testerId,
      testResults,
      testingGroup,
      testDetails,
      testDate
    );

    // Insert data into the C_Test table
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `INSERT INTO C_Test 
            (request_id, tester_id, test_date, test_results, testing_group, test_details)
            VALUES (:requestId, :testerId, TO_TIMESTAMP(:testDate, 'YYYY-MM-DD"T"HH24:MI'), :testResults, :testingGroup, :testDetails)`,
      { requestId, testerId, testDate, testResults, testingGroup, testDetails }
    );

    // Retrieve the ID of the newly inserted test
    const resultTest = await connection.execute(
      `SELECT NVL(MAX(TEST_ID), 0)   FROM C_Test `
    );

    const testId = resultTest.rows[0][0];
    if (file) {
      // Define the file path
      const filePath = path.join(
        "C:/",
        "spool",
        "c_uploads",
        "t" + testId.toString(),
        decode64(file.name)
      );

      // Create the directory if it doesn't exist
      fs.mkdirSync(
        path.join("C:/", "spool", "c_uploads", "t" + testId.toString()),
        { recursive: true }
      );

      // Move the file to the specified path
      await file.mv(filePath);

      // Insert data into the c_documents table
      await connection.execute(
        `INSERT INTO c_documents 
            (REQUEST_ID,test_id, file_path, date_uploaded, uploaded_by, upload_stage)
            VALUES (:requestId,:testId, :filePath, SYSDATE, :testerId, 'stage1')`,
        { requestId, testId, filePath, testerId }
      );
    }

    await connection.close();

    res.status(200).send("Test added and file uploaded successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Import necessary modules and configurations

router.get("/all/:requestId", verify,async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log(requestId, "asdasd");
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT t.test_id, u.USERNAME,
      TO_CHAR(t.TEST_DATE, 'MM/DD/YYYY hh:mi AM'),
      --TO_CHAR(t.LAST_MODIFIED_DATE, 'MM/DD/YYYY hh:mi AM'),
       t.TEST_RESULTS, t.TESTING_GROUP, t.TEST_DETAILS
             FROM c_test t
             LEFT JOIN c_users u ON u.user_id = t.tester_id
             WHERE t.request_id = :requestId order by t.test_id`,
      [requestId]
    );

    await connection.close();

    const tests = result.rows.map((row) => ({
      testId: row[0],
      testername: row[1],
      testDate: row[2],
      testResults: row[3],
      testingGroup: row[4],
      testDetails: row[5],
    }));

    res.json({ tests });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Export the router
module.exports = router;
