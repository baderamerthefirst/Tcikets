const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { jwtsk } = require('../data');
const { oracledb, dbConfig } = require('../db/dbConfig');
const jwt = require('jsonwebtoken');
const { verify, checkUserStatus } = require('../middleware/auth');

router.get('/', (req, res) => {
  res.status(200);
  res.write("What are you looking for in here ??");
  res.send();
});



router.get("/logi", verify,checkUserStatus, (req, res) => {
  if (req.user) {
    //console.log(req.user,req.userInfo);
    res.send({ loggedIn: true, data: {
      user_id: req.user.user_id,
      username: req.user.username,
      role: req.user.role,
      status: req.userInfo.STATUS ,
      iat: req.user.iat,
      exp: req.user.exp,
      test:"asdasd"
    } });
  } else {
    res.send({ loggedIn: false });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT user_id, username, password, role, status FROM c_users WHERE username = :username`,
      { username },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length > 0) {
      const { USER_ID, USERNAME, PASSWORD, ROLE, STATUS } = result.rows[0];
    
      const passwordMatch = await bcrypt.compare(password, PASSWORD);
      if (passwordMatch && STATUS === 'active'  ) {
        // if (STATUS != 'active'){

        //   res.status(401).send('User Inactive.');
        // }
        const accessToken = jwt.sign({ user_id: USER_ID, username: USERNAME, role: ROLE, status: STATUS }, jwtsk, { expiresIn: "1d" });
        res.json({
          accessToken: accessToken,
          expiresIn: "1-day"
        });
      } else {
        res.status(401).send('Invalid username or password.');
      }
    } else {
      res.status(401).send('Invalid username or password.');
    }

    await connection.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/register',verify, async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const connection = await oracledb.getConnection(dbConfig);
    const checkUsername = await connection.execute(
      `SELECT COUNT(*) FROM c_users WHERE username = :username`,
      [username]
    );

    if (checkUsername.rows[0][0] > 0) {
      return res.status(400).json('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connection.execute(
      `INSERT INTO c_users (username, password, role, status) VALUES (:username, :password, :role, 'active')`,
      [username, hashedPassword, role]
    );

    res.status(201).json('User created successfully');
    await connection.close();
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

router.get('/users',verify, async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT user_id, username, role, status FROM c_users`
    );

    const users = result.rows.map(row => ({
      user_id: row[0],
      username: row[1],
      role: row[2],
      status: row[3]
    }));

    res.status(200).json(users);
    await connection.close();
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

router.post('/users/status',verify, checkUserStatus,async (req, res) => {
  try {
    if (req.userInfo.STATUS==='active' ){
    const connection = await oracledb.getConnection(dbConfig);
    const { userId, status } = req.body;
    await connection.execute(
      `UPDATE c_users SET status = :status WHERE user_id = :userId`,
      { status, userId }
    );

    res.status(200).json('success');
    await connection.close();
  }
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

router.post('/users/rpsw', verify,async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const { userId } = req.body;
    const newPassword = 'password';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await connection.execute(
      `UPDATE c_users SET password = :password WHERE user_id = :userId`,
      { password: hashedPassword, userId }
    );

    res.status(200).json('success');
    await connection.close();
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

router.post('/users/cpsw',verify, async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const { userId, oldPassword, newPassword } = req.body;

    const fetchResult = await connection.execute(
      `SELECT password FROM c_users WHERE user_id = :userId`,
      { userId }
    );

    if (fetchResult.rows.length === 0) {
      res.status(404).json('User not found');
      return;
    }

    const currentPassword = fetchResult.rows[0][0];
    const passwordMatch = await bcrypt.compare(oldPassword, currentPassword);

    if (!passwordMatch) {
      res.status(401).json('Old password does not match');
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await connection.execute(
      `UPDATE c_users SET password = :newPassword WHERE user_id = :userId`,
      { newPassword: hashedNewPassword, userId }
    );

    await connection.commit();
    await connection.close();

    res.status(200).json('Password updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

module.exports = router;



