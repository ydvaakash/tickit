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

// New user signup logic

import { Request, Response } from 'express';
import pgdbpool from '../database/databasePool';
import bcrypt from 'bcrypt';
import { QueryResult } from 'pg';
import generateRandomString from '../utils/generateRandomString';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { getStringEnvVar } from '../utils/getStringEnvironmentVariable';
import { firstNameTypeFromZod } from '../zodSchemas/firstNameZodSchema';
import { lastNameTypeFromZod } from '../zodSchemas/lastNameZodSchema';
import { emailTypeFromZod } from '../zodSchemas/emailZodSchema';
import { userPasswordTypeFromZod } from '../zodSchemas/userPasswordZodSchema';

const signupLogic = async (req: Request, res: Response): Promise<void> => {
  let userSuppliedFirstName: firstNameTypeFromZod = req.body.first_name;
  let userSuppliedLastName: lastNameTypeFromZod = req.body.last_name;
  let userSuppliedEmail: emailTypeFromZod = req.body.email;
  let userSuppliedUserPassword: userPasswordTypeFromZod = req.body.user_password;

  // check if user supplied email is already registered
  try {
    let countOfAlreadyExistingEmail: QueryResult<{count: string}> = await pgdbpool.query("SELECT COUNT(email) FROM user_details.user_profile_details WHERE email = $1", [userSuppliedEmail]);

    let countOfAlreadyExistingEmailAsNumber: number = parseInt(countOfAlreadyExistingEmail.rows[0].count, 10);

    if(countOfAlreadyExistingEmailAsNumber !== 0) {
      res.status(200).json({
        msg: "Email already registered. Please use a different email ID, or visit login page to access your account."
      });
      return ;
    }
  } catch(err) {
    res.status(500).json({
      msg: "Server error. Couldn't get details from database."
    });
    return ;
  }

  type TotalMetricsRow = {
    total_registered_users_count: number;
  }

  let totalRegisteredUserCountValueForUsing: number;

  // receive value of total_registered_users_count from database
  try {
    let totalRegisteredUserCountFromDb: QueryResult<TotalMetricsRow> = await pgdbpool.query('SELECT total_registered_users_count FROM total_metrics.total_metrics_data WHERE total_metrics_data_id = 1');

    totalRegisteredUserCountValueForUsing = totalRegisteredUserCountFromDb.rows[0].total_registered_users_count;
  } catch(err) {
    res.status(500).json({
      msg: "Server error. Couldn't fetch value from database."
    });
    return ;
  }

  let generatedUserPlatformUid: string = 'ti'+((totalRegisteredUserCountValueForUsing+1).toString());

  // hash the user provided password
  let hashedPassword: string = '';
  const bcryptSaltRounds = 10;
  try {
    hashedPassword = await bcrypt.hash(userSuppliedUserPassword, bcryptSaltRounds);
  } catch(err) {
    res.status(500).json({
      msg: 'Server error. Password hashing failed.'
    });
    return ;
  }

  let beginTransactionQuery: string = "BEGIN";
  let insertUserPlatformUidInDb: string = "INSERT INTO user_identification.user_identification_uids (user_platform_uid) VALUES ($1)";
  let insertUserProfileDetailsInDb: string = "INSERT INTO user_details.user_profile_details (user_platform_uid, first_name, last_name, email) VALUES ($1, $2, $3, $4)";
  let insertUserPasswordInDb: string = "INSERT INTO user_secrets_credentials.user_passwords (user_platform_uid, user_password) VALUES ($1, $2)";
  let updateTotalRegisteredUserCountInDb: string = "UPDATE total_metrics.total_metrics_data SET total_registered_users_count=$1 WHERE total_metrics_data_id = 1";
  let endTransactionQuery: string = 'COMMIT';

  try {
    await pgdbpool.query(beginTransactionQuery);
    await pgdbpool.query(insertUserPlatformUidInDb, [generatedUserPlatformUid]);
    await pgdbpool.query(insertUserProfileDetailsInDb, [generatedUserPlatformUid, userSuppliedFirstName, userSuppliedLastName, userSuppliedEmail]);
    await pgdbpool.query(insertUserPasswordInDb, [generatedUserPlatformUid, hashedPassword]);
    await pgdbpool.query(updateTotalRegisteredUserCountInDb, [totalRegisteredUserCountValueForUsing+1]);
    await pgdbpool.query(endTransactionQuery);
  } catch(err) {
    await pgdbpool.query('ROLLBACK');
    res.status(500).json({
      msg: 'Server error. Database entries failed.'
    });
    return ;
  }

  // generate user_public_uid
  const currentDate: Date = new Date();
  const currentTimeStampInMillisecondsInUTC: number = currentDate.getTime();
  let randomString: string = generateRandomString(5);
  let stringToHashToGenerateUserPublicUid: string = currentTimeStampInMillisecondsInUTC.toString()+randomString;
  let hashedUserPublicUid: string = '';
  try {
    hashedUserPublicUid = await bcrypt.hash(stringToHashToGenerateUserPublicUid, bcryptSaltRounds);
  } catch(err) {
    res.status(500).json({
      msg: 'Server error. Password hashing failed.'
    });
    return ;
  }

  let insertUserPublicUidInDb: string = "UPDATE user_identification.user_identification_uids SET user_public_uid=$1 WHERE user_platform_uid=$2";
  let updateUserPublicUidValidityFlagInDb: string = "UPDATE user_identification.user_identification_uids SET user_public_uid_validity_flag=$1 WHERE user_public_uid=$2";

  try {
    await pgdbpool.query(beginTransactionQuery);
    await pgdbpool.query(insertUserPublicUidInDb, [hashedUserPublicUid, generatedUserPlatformUid]);
    await pgdbpool.query(updateUserPublicUidValidityFlagInDb, ["valid", hashedUserPublicUid]);
    await pgdbpool.query(endTransactionQuery);
  } catch(err) {
    await pgdbpool.query("ROLLBACK");
    res.status(500).json({
      msg: "Signup completed successfully. But server error happened while trying to generate public UID for the user."
    });
    return ;
  }

  // generate JWT
  const jwtSecretKey: string = getStringEnvVar('JWTSECRETKEY');
  if(jwtSecretKey == '') {
    res.status(500).json({
      msg: "Internal server error. Missing jwt secret key in environment variables."
    });
    return ;
  }

  const jwtIssuer: string = getStringEnvVar('JWTISSUER');
  if(jwtIssuer == '') {
    res.status(500).json({
      msg: "Internal server error. Missing jwt issuer key in environment variables."
    });
    return ;
  }

  const jwtAudience: string = getStringEnvVar('JWTAUDIENCE1');
  if(jwtAudience == '') {
    res.status(500).json({
      msg: "Internal server error. Missing jwt audience key in environment variables."
    });
    return ;
  }

  let jwtToken: string;

  try {
    jwtToken = jwt.sign({uid: hashedUserPublicUid}, jwtSecretKey, {
      issuer: jwtIssuer,
      audience: jwtAudience
    });
  } catch(err) {
    res.status(500).json({
      msg: 'Internal server error. Couldn\'t generate jwt token for the user.'
    });
    return ;
  }

  // response from route if everything worked well
  res.status(200).json({
    jwtToken: jwtToken
  });

  return ;  
}

export default signupLogic;