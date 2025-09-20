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

// Extract IP address of user from 'req'

import { Request } from "express";
import * as net from 'net';

// const extractUserIpFromReq = (headersFromReq: Request): string => {
//   const ipFromReqHeaders: string | string[] | undefined = headersFromReq.headers['x-forwarded-for'];
//   let rawIp: string = '';

//   // if(typeof ipFromReqHeaders === 'string') {
//   //   if(ipFromReqHeaders.startsWith("::ffff:")) {
//   //     rawIp = ipFromReqHeaders.replace("::ffff:", "");
//   //   }
//   // } else if(Array.isArray(ipFromReqHeaders)) {
//   //   rawIp = ipFromReqHeaders[0];
//   // }

//   // if(!rawIp) {
//   //   rawIp = headersFromReq.socket.remoteAddress || '';
//   // }

//   if(typeof ipFromReqHeaders === 'string') {
//     rawIp = ipFromReqHeaders.split(',')[0].trim();
//   } else if(Array.isArray(ipFromReqHeaders)) {
//     rawIp = ipFromReqHeaders[0];
//   }

//   if(!rawIp) {
//     rawIp = headersFromReq.socket.remoteAddress || '';
//   }

//   const normalizedIpv4Address: string = normalizeToIpv4(rawIp);

//   return normalizedIpv4Address;

// };

// const normalizeToIpv4 = (unformattedIp: string): string => {
//   const ipv4Regex: RegExp = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

//   const ipv6Regex: RegExp = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,7}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|([0-9a-fA-F]{1,4}){2,7}/;

//   let tempArray: string[] = [];
//   let fetchedIp: string = '';

//   if(unformattedIp.match(ipv4Regex)) {
//     tempArray = unformattedIp.split(".");
//   } else if(unformattedIp.match(ipv6Regex)) {
//     tempArray = unformattedIp.split(":");
//   }
  
//   fetchedIp = tempArray[4]+"."+tempArray[5]+"."+tempArray[6]+"."+tempArray[7];

//   return fetchedIp;
// };


const extractUserIpFromReq = (reqObject: Request): string | null => {
  const ipFromReq: string | undefined = reqObject.ip;
  
  if(!ipFromReq) {
    return null; // No IP found
  }
  
  const trimmedIP = ipFromReq.trim();

  if(ipFromReq.startsWith("::ffff:")) {
    const ipv4: string = trimmedIP.substring(7);

    if(net.isIPv4(ipv4)) {
      return ipv4.trim();
    }
  }

  if(net.isIPv4(trimmedIP) || net.isIPv6(trimmedIP)) {
    return trimmedIP.trim();
  }

  return null;
};

export { extractUserIpFromReq };