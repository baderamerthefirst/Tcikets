const { oracledb, dbConfig } = require("../db/dbConfig"); // Adjust the path as needed

const jwt = require("jsonwebtoken");
const { jwtsk } = require("../data"); // Adjust the path as needed

const verify = (req, res, next) => {
  const authH = req.headers.authorization;

  if (authH) {
    const token = authH.split(" ")[1];
    jwt.verify(token, jwtsk, (err, data) => {
      if (err) {
        // req.user = {...data}; // Attach the decoded token data to the request object
        // next(); // Proceed to the next middleware or route handler
        return res.status(401).json(err);
      } else {
        req.user = data;
        next();
      }
    });
  } else {
    res.send({ loggedIn: false });
  }
};

const checkUserStatus = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT user_id, username, role, status FROM c_users WHERE username = :username`,
      { username: req.user.username },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    //console.log(user.STATUS, req.user.username);
    // //console.log({
    //   user_id: user.USER_ID,
    //   username: user.USERNAME,
    //   role: user.ROLE,
    //   status: user.STATUS,
    // });

    // if (user.STATUS !== "active") {
    //   return     res.status(500).json({ error: "not active " });

    // }

    // Attach the full user info to the request object
    req.userInfo = user;
    next();
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing database connection:", error);
      }
    }
  }
};

module.exports = { verify, checkUserStatus };
