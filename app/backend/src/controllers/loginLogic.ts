/* Copyright (c) Aakash Yadav. All rights reserved.

 This file is part of **Tickit**, owned and operated by **Aakash Yadav**.
 The source code, documentation, and all associated files (collectively, the **"Software"**) are the **proprietary property** of **Aakash Yadav** and are protected by **international copyright laws**, including but not limited to:
 - **Berne Convention for the Protection of Literary and Artistic Works**
 - **Universal Copyright Convention (UCC)**
 - **Digital Millennium Copyright Act (DMCA)**
 - **Indian Copyright Act (1957)**
 - **European Union Copyright Directive**
 - **Title 17 of the United States Code**

 ❌ **Unauthorized Actions Strictly Prohibited**
 No permission is granted to:
 - Copy
 - Modify
 - Distribute
 - Sublicense
 - Reverse-engineer
 - Decompile
 - Bypass or otherwise exploit any portion of the Software
 without the **explicit written consent** of **Aakash Yadav**.

 ⚙️ **Third-Party Components**
 This Software may incorporate third-party libraries or components, which remain the sole property of their respective owners.
 The inclusion of such third-party components does **not** grant any ownership rights to users.
 All such third-party components are used in full compliance with their respective licenses.
 Users are responsible for complying with the terms and conditions of these third-party licenses.

 🎯 **Originality of Implementation**
 **Tickit** may have drawn inspiration from multiple publicly available products. However:
 - The **implementation**
 - The **execution**
 - The **code structure and logic**
 are the **original creative work** of **Aakash Yadav**.

 No **proprietary logic, exact code, or confidential architecture** of any third-party product has been copied.
 Any resemblance to existing products is purely **coincidental and unintentional**.
 If any copyright owner believes that their proprietary rights have been infringed, they are encouraged to contact **Aakash Yadav** for an **amicable resolution**.

 📄 **Reference Documents**
 For complete legal details regarding permitted use, third-party components, originality of implementation, and legal disclaimers, refer to the following documents in the project root directory:
 - [LICENSE] → **Proprietary License Terms**
 - [NOTICE.md] → **Third-Party Components & Legal Disclaimers**
 - [PRIVACY.md] → **User Data Collection & Protection**
 - [TERMS.md] → **Usage Terms & Conditions**

 ❗ **Strict Legal Action**
 Any **unauthorized** attempt to **access, modify, copy, distribute, or exploit** the Software will be considered a **direct violation of copyright laws** and will be subject to **strict legal action** under applicable **local, national, and international laws**.

 ⚠️ **All rights not expressly granted herein are reserved by Aakash Yadav.**
*/

// Existing user login logic

import { Request, Response } from 'express';
import { emailTypeFromZod } from '../zodSchemas/emailZodSchema';
import { userPasswordTypeFromZod } from '../zodSchemas/userPasswordZodSchema';
import pgdbpool from '../database/databasePool';
import { QueryResult } from 'pg';
import bcrypt from 'bcrypt';
import { generateRefreshToken } from '../utils/generateRefreshToken';
import { generateAccessToken } from '../utils/generateAccessToken';
import { generateUserPublicUid } from '../utils/generateUserPublicUid';
import { getStringEnvVar } from '../utils/getStringEnvironmentVariable';

const loginLogic = async (req: Request, res: Response): Promise<void> => {
  let userSuppliedEmail: emailTypeFromZod = req.body.email;
  let userSuppliedUserPassword: userPasswordTypeFromZod = req.body.user_password;

  let checkExistanceOfUserSuppliedEmailInDb: string = 'SELECT user_platform_uid FROM user_details.user_profile_details WHERE user_email=$1';

  type userPlatformUidType = {
    user_platform_uid: string
  }

  let userPlatformUid: string = '';

  // check if 'userSuppliedEmail' exists in the database. If yes, fetch 'user_platform_uid' for the user from database
  try {
    let userPlatformUidRow: QueryResult<userPlatformUidType> = await pgdbpool.query(checkExistanceOfUserSuppliedEmailInDb, [userSuppliedEmail]);

    if(userPlatformUidRow.rowCount === 0) {
      res.status(200).json({
        msg: 'No registered user found with provided email id.'
      });
      return ;
    }

    userPlatformUid = userPlatformUidRow.rows[0].user_platform_uid;
  } catch (err) {
    res.status(503).json({
      msg: 'Internal server error. Error occured while trying to find user email ID in database.'
    });
    return ;
  }

  let userHashedPassword: string = '';
  let fetchHashedUserPasswordFromDb: string = 'SELECT user_password FROM user_secret_credentials.user_passwords WHERE user_platform_uid=$1';

  type userHashedPasswordType = {
    user_password: string
  }

  // fetch hashed password from database for the user
  try {
    let userHashedPasswordRow: QueryResult<userHashedPasswordType> = await pgdbpool.query(fetchHashedUserPasswordFromDb, [userPlatformUid]);
    userHashedPassword = userHashedPasswordRow.rows[0].user_password;
  } catch (err) {
    res.status(503).json({
      msg: 'Internal server error. Error occured while trying to fetch user hashed password from the database.'
    });
    return ;
  }

  let loginPasswordMatchesWithHashedPasswordSavedInDb: boolean = await bcrypt.compare(userSuppliedUserPassword, userHashedPassword.toString());

  if(!loginPasswordMatchesWithHashedPasswordSavedInDb) {
    res.status(401).json({
      msg: 'Incorrect login credentials. Wrong password.'
    });
    return ;
  }

  const bcryptSaltRounds: string = getStringEnvVar('BCRYPTSALTROUNDS');
  if(bcryptSaltRounds === '') {
    res.status(500).json({
      msg: 'Internal server error. Missing value for \'salt rounds\' to hash user password.'
    });
    return ;
  }
  const bcryptSaltRoundsAsNumber: number = parseInt(bcryptSaltRounds);

  let hashedUserPublicUid: string = '';

  // generate user_public_uid
  try {
    hashedUserPublicUid = await generateUserPublicUid(bcryptSaltRoundsAsNumber);
  } catch (err) {
    res.status(500).json({
      msg: 'Internal server error. Couldn\'t generate hashed user public uid.'
    });
    return ;
  }

  if(hashedUserPublicUid === '') {
    res.status(500).json({
      msg: 'Internal server error. Couldn\'t generate hashed user public uid.'
    });
    return ;
  }

  // generate long validity 'refresh token' for the user.
  let refreshTokenForUser: string = '';

  try {
    refreshTokenForUser = generateRefreshToken(hashedUserPublicUid);
  } catch(err) {
    res.status(500).json({
      msg: 'Internal server error. Couldn\'t generate Refresh Token for the user.'
    });
    return;
  }

  // generate short validity 'access token' for the user.
  let accessTokenForUser: string = '';

  try {
    accessTokenForUser = generateAccessToken(hashedUserPublicUid);
  } catch(err) {
    res.status(500).json({
      msg: 'Internal server error. Couldn\'t generate Access Token for the user.'
    });
    return;
  }

  // check if value of refresh token validity available as environment variable
  let refreshTokenValidity: string = getStringEnvVar("REFRESHTOKENVALIDITY");
  if(refreshTokenValidity === '') {
    res.status(500).json({
      msg: 'Internal server error. Missing value of environment variable for \'refresh token validity\'.'
    });
    return ;
  }

  // update Public UID of user in database
  const beginTransactionQuery: string = 'BEGIN';
  const updatePublicUidOfUserInDb: string = 'UPDATE user_platformuid_publicuid_mapping.user_platformuid_publicuid_mapping_details SET user_public_uid=$1 WHERE user_platform_uid=$2';
  const endTransactionQuery: string = 'COMMIT';
  try {
    await pgdbpool.query(beginTransactionQuery);
    await pgdbpool.query(updatePublicUidOfUserInDb, [hashedUserPublicUid, userPlatformUid]);
    await pgdbpool.query(endTransactionQuery);
  } catch(err) {
    await pgdbpool.query("ROLLBACK");
    res.status(500).json({
      msg: 'Internal server error. Couldn\'t update user public UID in database.'
    });
    return;
  }

  // set refresh token as HTTP cookie in user browser
  res.cookie("tickitRefreshToken", refreshTokenForUser, {
    httpOnly: true,
    // secure: true,
    sameSite: 'strict',
    maxAge: parseInt(refreshTokenValidity)*24*60*60*1000 
  });

  // send access token with 'res' to the client
  res.status(200).json({
    msg: 'Login successful',
    accessToken: accessTokenForUser
  });

  return ;
};

export { loginLogic };