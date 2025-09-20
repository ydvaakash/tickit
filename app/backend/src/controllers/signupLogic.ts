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
import { firstNameTypeFromZod } from '../zodSchemas/firstNameZodSchema';
import { lastNameTypeFromZod } from '../zodSchemas/lastNameZodSchema';
import { emailTypeFromZod } from '../zodSchemas/emailZodSchema';
import { userPasswordTypeFromZod } from '../zodSchemas/userPasswordZodSchema';
import pgdbpool from '../database/databasePool';
import { QueryResult } from 'pg';
import { getStringEnvVar } from '../utils/getStringEnvironmentVariable';
import bcrypt from 'bcrypt';
import { generateUserPublicUid } from '../utils/generateUserPublicUid';
import { generateRefreshToken } from '../utils/generateRefreshToken';
import { generateAccessToken } from '../utils/generateAccessToken';
import { extractUserIpFromReq } from '../utils/extractUserIpFromReq';
import { extractUserAgentDetailsFromReq } from '../utils/extractUserAgentDetailsFromReq';
import type { typeForUserAgentDetailsFromReq } from '../types/userAgentDetailsFromReq';
import { extractUserLanguage } from '../utils/extractUserLanguage';
import { extractUserTimeZone } from '../utils/extractUserTimeZone';
import { extractGeolocationFromIPAddress } from '../api/extractGeolocationFromIPAddress';
import type { userGeolocationDetailsType } from '../types/userGeolocationAndIspDetailsType';
import { addUserDeviceFingerprintsToRedisCache } from '../redis/addUserDeviceFingerprintsToRedisCache';
import { reqObjectWithDeviceFingerprintDetails } from '../types/reqObjectWithDeviceFingerprintDetails';

const signupLogic = async (req: reqObjectWithDeviceFingerprintDetails, res: Response): Promise<void> => {
  const userSuppliedFirstName: firstNameTypeFromZod = req.body.first_name;
  const userSuppliedLastName: lastNameTypeFromZod = req.body.last_name;
  const userSuppliedEmail: emailTypeFromZod = req.body.email;
  const userSuppliedUserPassword: userPasswordTypeFromZod = req.body.user_password;

  // // gather device fingerprint details from 'req'
  // const userIp: string | null = extractUserIpFromReq(req);
  // const userAgentDetails: typeForUserAgentDetailsFromReq = extractUserAgentDetailsFromReq(req);
  // const userAcceptLanguage: string = extractUserLanguage(req);
  // const userTimeZone: string = extractUserTimeZone(req);

  // if(userIp === null || userIp === "" || userAcceptLanguage === "" || userTimeZone === "" || userAgentDetails.userBrowser === "" || userAgentDetails.userBrowserVersion === "" || userAgentDetails.userOperatingSystem === "" || userAgentDetails.userSystemArchitecture === "") {
  //   // reject the request and revert back with denial to signup
  //   res.status(400).json({
  //     msg: "Bad request. Missing required client device information."
  //   });
  // }

  // const userGeolocationDetails: userGeolocationDetailsType = await extractGeolocationFromIPAddress(userIp);

  // if(!userGeolocationDetails.successFlag) {
  //   if(userGeolocationDetails.statusCode === 500) {
  //     res.status(500).json({
  //       msg: "Internal server error contacting the geolocation api."
  //     });
  //     return ;
  //   } else {
  //     res.status(503).json({
  //       msg: "Geolocation lookup failed."
  //     });
  //     return ;
  //   }
  // }

  // if(userGeolocationDetails.data.userCountryName === "" || userGeolocationDetails.data.userLatitude === "" || userGeolocationDetails.data.userLongitude === "") {
  //   res.status(422).json({
  //     msg: "Missing mandatory device information in api response."
  //   });
  //   return ;
  // }

  // if(userAgentDetails.userBrowser === "" || userAgentDetails.userBrowserVersion === "" || userAgentDetails.userOperatingSystem === "" || userAgentDetails.userSystemArchitecture === "") {
  //   res.status(422).json({
  //     msg: "Missing mandatory browser information in api response."
  //   });
  //   return ;
  // }

  // if(userAcceptLanguage === "") {
  //   res.status(422).json({
  //     msg: "Missing language specific details from client system."
  //   });
  //   return ;
  // }

  // if(userTimeZone === "") {
  //   res.status(422).json({
  //     msg: "Missing time zone details of the client."
  //   });
  //   return ;
  // }

  // check if device fingerprints of user are available in 'req'
  if(!req.userDeviceFingerprintDetails) {
    res.status(500).json({
      msg: "Internal server error. Middleware failed to collect device fingerprint details of user."
    });
    return ;
  }

  // check if user supplied email is already registered
  try {
    let countOfAlreadyExistingEmail: QueryResult<{count: string}> = await pgdbpool.query("SELECT COUNT(user_email) FROM user_details.user_profile_details WHERE user_email = $1", [userSuppliedEmail]);

    let countOfAlreadyExistingEmailAsNumber: number = parseInt(countOfAlreadyExistingEmail.rows[0].count, 10);

    if(countOfAlreadyExistingEmailAsNumber !== 0) {
      res.status(409).json({
        msg: "Email already registered. Please use a different email ID, or visit login page to access your account."
      });
      return ;
    }
  } catch(err) {
    res.status(503).json({
      msg: "Service unavailable. Couldn't get details from database."
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
    res.status(503).json({
      msg: "Service unavailable. Couldn't fetch value from database."
    });
    return ;
  }

  let generatedUserPlatformUid: string = 'ti'+((totalRegisteredUserCountValueForUsing+1).toString());

  // hash the user provided password
  let hashedPassword: string = '';
  const bcryptSaltRounds: string = getStringEnvVar('BCRYPTSALTROUNDS');
  if(bcryptSaltRounds === '') {
    res.status(500).json({
      msg: 'Server error. Missing value for \'salt rounds\' to hash user password.'
    });
    return ;
  }
  const bcryptSaltRoundsAsNumber: number = parseInt(bcryptSaltRounds);
  try {
    hashedPassword = await bcrypt.hash(userSuppliedUserPassword, bcryptSaltRoundsAsNumber);
  } catch(err) {
    res.status(500).json({
      msg: 'Server error. Password hashing failed.'
    });
    return ;
  }

  let beginTransactionQuery: string = "BEGIN";
  let insertUserProfileDetailsInDb: string = "INSERT INTO user_details.user_profile_details (user_platform_uid, first_name, last_name, user_email) VALUES ($1, $2, $3, $4)";
  let insertUserPlatformUidInDb: string = "INSERT INTO user_platformuid_publicuid_mapping.user_platformuid_publicuid_mapping_details (user_platform_uid) VALUES ($1)";
  let insertUserPasswordInDb: string = "INSERT INTO user_secret_credentials.user_passwords (user_platform_uid, user_password) VALUES ($1, $2)";
  let updateTotalRegisteredUserCountInDb: string = "UPDATE total_metrics.total_metrics_data SET total_registered_users_count=$1 WHERE total_metrics_data_id = 1";
  let endTransactionQuery: string = 'COMMIT';

  try {
    await pgdbpool.query(beginTransactionQuery);
    await pgdbpool.query(insertUserProfileDetailsInDb, [generatedUserPlatformUid, userSuppliedFirstName, userSuppliedLastName, userSuppliedEmail]);
    await pgdbpool.query(insertUserPlatformUidInDb, [generatedUserPlatformUid]);
    await pgdbpool.query(insertUserPasswordInDb, [generatedUserPlatformUid, hashedPassword]);
    await pgdbpool.query(updateTotalRegisteredUserCountInDb, [totalRegisteredUserCountValueForUsing+1]);
    await pgdbpool.query(endTransactionQuery);
  } catch(err) {
    await pgdbpool.query('ROLLBACK');
    res.status(503).json({
      msg: 'Service unavailable. Database entries failed.'
    });
    return ;
  }

  // generate user_public_uid
  const hashedUserPublicUid: string = await generateUserPublicUid(bcryptSaltRoundsAsNumber);
  if(hashedUserPublicUid === '') {
    res.status(500).json({
      msg: 'Server error. Couldn\'t generate hashed user public uid.'
    });
    return ;
  }

  let insertUserPublicUidInDb: string = "UPDATE user_platformuid_publicuid_mapping.user_platformuid_publicuid_mapping_details SET user_public_uid=$1 WHERE user_platform_uid=$2";

  try {
    await pgdbpool.query(beginTransactionQuery);
    await pgdbpool.query(insertUserPublicUidInDb, [hashedUserPublicUid, generatedUserPlatformUid]);
    await pgdbpool.query(endTransactionQuery);
  } catch(err) {
    await pgdbpool.query("ROLLBACK");
    res.status(508).json({
      msg: "Server error. Signup completed successfully. But server error happened while trying to generate public UID for the user."
    });
    return ;
  }

  const refreshTokenForUser: string = generateRefreshToken(hashedUserPublicUid);
  const refreshTokenValidity: string | undefined = process.env['REFRESHTOKENVALIDITY'];

  if(!refreshTokenValidity || (refreshTokenForUser === '')) {
    res.status(508).json({
      msg: 'Server error. Missing refresh token expiry value.'
    });
    return ;
  }

  const accessTokenForUser: string = generateAccessToken(hashedUserPublicUid);
  const accessTokenValidity: string | undefined = process.env['ACCESSTOKENVALIIDITY'];

  if(!accessTokenValidity || (accessTokenValidity === '')) {
    res.status(500).json({
      msg: "Server error. Missing access token expiry value."
    });
    return ;
  }

  if(accessTokenForUser === '') {
    res.status(508).json({
      msg: 'Server error. Couldn\'t generate access token for user.'
    });
    return ;
  }

  // const userDeviceFingerprintsSuccessfullyAddedToRedis: boolean = await addUserDeviceFingerprintsToRedisCache(
  //   hashedUserPublicUid,
  //   userGeolocationDetails.data.userCountryName,
  //   userGeolocationDetails.data.userLatitude,
  //   userGeolocationDetails.data.userLongitude,
  //   userAgentDetails.userBrowser,
  //   userAgentDetails.userBrowserVersion,
  //   userAgentDetails.userOperatingSystem,
  //   userAgentDetails.userSystemArchitecture,
  //   userAcceptLanguage,
  //   userTimeZone
  // );

  const userDeviceFingerprintsSuccessfullyAddedToRedis: boolean = await addUserDeviceFingerprintsToRedisCache(
    hashedUserPublicUid,
    req.userDeviceFingerprintDetails?.userCountryName,
    req.userDeviceFingerprintDetails?.userLatitude,
    req.userDeviceFingerprintDetails?.userLongitude,
    req.userDeviceFingerprintDetails?.userBrowser,
    req.userDeviceFingerprintDetails?.userBrowserVersion,
    req.userDeviceFingerprintDetails?.userOperatingSystem,
    req.userDeviceFingerprintDetails?.userSystemArchitecture,
    req.userDeviceFingerprintDetails?.userAcceptLanguage,
    req.userDeviceFingerprintDetails?.userTimeZone
  );

  if(userDeviceFingerprintsSuccessfullyAddedToRedis) {
    res.cookie('tickitRefreshToken', refreshTokenForUser, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: parseInt(refreshTokenValidity) * 24 * 60 * 60 * 1000,
    });

    res.cookie('tickitAccessToken', accessTokenForUser, {
      httpOnly: true,
      // secure: true,
      sameSite: 'strict',
      maxAge: parseInt(accessTokenValidity) * 60 * 1000,
    });

    res.status(200).json({
      // accessToken: accessTokenForUser,
      msg: 'Signup successful'
    });
    console.log("Signup completed successfully.");
  } else {
    res.status(500).json({
      msg: "Signup completed successfully, but failed to login the user."
    });
  }

  // res.cookie('tickitRefreshToken', refreshTokenForUser, {
  //   httpOnly: true,
  //   // secure: true,
  //   sameSite: 'strict',
  //   maxAge: parseInt(refreshTokenValidity) * 24 * 60 * 60 * 1000
  // });

  return ;
};

export { signupLogic };