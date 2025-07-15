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

// Middleware to validate if 'body' inside 'req' object has credentials required for 'signup' route functionality

import { Request, Response, NextFunction } from 'express';

const validateAvailabilityOfSignupCredentials = (req: Request, res: Response, next: NextFunction): void => {
  // check if 'body' contains 'first_name'
  if(req.body.first_name === undefined || req.body.first_name === null || req.body.first_name === '') {
    res.status(422).json({
      msg: "Missing signup credentials. Empty or missing first_name in signup request."
    });
    return ;
  }

  // check if 'body' contains 'last_name'
  if(req.body.last_name === undefined || req.body.last_name === null || req.body.last_name === '') {
    res.status(422).json({
      msg: "Missing signup credentials. Empty or missing last_name in signup request."
    });
    return ;
  }

  // check if 'body' contains 'email'
  if(req.body.email === undefined || req.body.email === null || req.body.email === '') {
    res.status(422).json({
      msg: "Missing signup credentials. Empty or missing email in signup request."
    });
    return ;
  }

  // check if 'body' contains 'password'
  if(req.body.user_password === undefined || req.body.user_password === null || req.body.user_password === '') {
    res.status(422).json({
      msg: "Missing signup credentials. Empty or missing password in signup request."
    });
    return ;
  }

  // call 'next' if every check mentioned above has passed
  return next();
}

export default validateAvailabilityOfSignupCredentials;