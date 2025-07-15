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

// Zod schema for the "last_name"

import { z } from "zod";

  const lastNameZodSchema = z.string({
    required_error: "Last name is required", // This is triggered if field is completely missing (e.g. undefined)
    invalid_type_error: "Last name must be a string"
  })

  .trim()
  
  .min(1, { message: "Last name must be at least 1 character." })
  
  .max(50, { message: "Last name must not exceed 50 characters." })
  
  // Must start with a letter and only contain allowed characters
  .regex(/^[A-Za-z][A-Za-z\s'-]*$/, {
    message: "Last name must start with a letter and only contain letters, spaces, apostrophes, or hyphens."
  })
  
  // Disallow repeating the same character 3 or more times
  .refine(val => !/(.)\1{2,}/.test(val), {
    message: "Last name cannot have the same character repeated more than twice in a row."
  })
  
  // Disallow repeated non-letter characters (like --, '', or multiple spaces)
  .refine(val => !/[\s'-]{2,}/.test(val), {
    message: "Last name cannot contain repeating non-letter characters like --, '', or multiple spaces."
  })
  
  // Disallow digits explicitly for clarity and future safety
  .refine(val => !/\d/.test(val), {
    message: "Last name cannot contain numbers."
  });

export { lastNameZodSchema };
export type lastNameTypeFromZod = z.infer<typeof lastNameZodSchema>;