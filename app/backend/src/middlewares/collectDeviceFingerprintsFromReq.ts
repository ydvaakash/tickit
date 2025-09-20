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

// Middleware to collect device fingerprints from the 'req'

import { NextFunction, Request, Response } from "express";
import { extractUserIpFromReq } from "../utils/extractUserIpFromReq";
import type { typeForUserAgentDetailsFromReq } from "../types/userAgentDetailsFromReq";
import { extractUserAgentDetailsFromReq } from "../utils/extractUserAgentDetailsFromReq";
import { extractUserLanguage } from "../utils/extractUserLanguage";
import { extractUserTimeZone } from "../utils/extractUserTimeZone";
import type { userGeolocationDetailsType } from "../types/userGeolocationAndIspDetailsType";
import { extractGeolocationFromIPAddress } from "../api/extractGeolocationFromIPAddress";
import { reqObjectWithDeviceFingerprintDetails } from "../types/reqObjectWithDeviceFingerprintDetails";

const collectDeviceFingerprintsFromReq = async (req: reqObjectWithDeviceFingerprintDetails, res: Response, next: NextFunction): Promise<void> => {
  // gather device fingerprint details from 'req'
  const userIp: string | null = extractUserIpFromReq(req);
  const userAgentDetails: typeForUserAgentDetailsFromReq = extractUserAgentDetailsFromReq(req);
  const userAcceptLanguage: string = extractUserLanguage(req);
  const userTimeZone: string = extractUserTimeZone(req);

  if(userIp === null || userIp === "" || userAcceptLanguage === "" || userTimeZone === "" || userAgentDetails.userBrowser === "" || userAgentDetails.userBrowserVersion === "" || userAgentDetails.userOperatingSystem === "" || userAgentDetails.userSystemArchitecture === "") {
    // reject the request and revert back with denial to signup
    res.status(400).json({
      msg: "Bad request. Missing required client device information."
    });
    return ;
  }

  const userGeolocationDetails: userGeolocationDetailsType = await extractGeolocationFromIPAddress(userIp);

  if(!userGeolocationDetails.successFlag) {
    if(userGeolocationDetails.statusCode === 500) {
      res.status(500).json({
        msg: "Internal server error contacting the geolocation api."
      });
      return ;
    } else {
      res.status(503).json({
        msg: "Geolocation lookup failed."
      });
      return ;
    }
  }

  if(userGeolocationDetails.data.userCountryName === "" || userGeolocationDetails.data.userLatitude === "" || userGeolocationDetails.data.userLongitude === "") {
    res.status(422).json({
      msg: "Missing mandatory device information in api response."
    });
    return ;
  }

  if(userAgentDetails.userBrowser === "" || userAgentDetails.userBrowserVersion === "" || userAgentDetails.userOperatingSystem === "" || userAgentDetails.userSystemArchitecture === "") {
    res.status(422).json({
      msg: "Missing mandatory browser information in api response."
    });
    return ;
  }

  if(userAcceptLanguage === "") {
    res.status(422).json({
      msg: "Missing language specific details from client system."
    });
    return ;
  }

  if(userTimeZone === "") {
    res.status(422).json({
      msg: "Missing time zone details of the client."
    });
    return ;
  }

  req.userDeviceFingerprintDetails = {
    userCountryName: userGeolocationDetails.data.userCountryName,
    userLatitude: userGeolocationDetails.data.userLatitude,
    userLongitude: userGeolocationDetails.data.userLongitude,
    userBrowser: userAgentDetails.userBrowser,
    userBrowserVersion: userAgentDetails.userBrowserVersion,
    userOperatingSystem: userAgentDetails.userOperatingSystem,
    userSystemArchitecture: userAgentDetails.userSystemArchitecture,
    userAcceptLanguage: userAcceptLanguage,
    userTimeZone: userTimeZone
  };

  next();
}

export { collectDeviceFingerprintsFromReq };