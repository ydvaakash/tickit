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

type ErrorMapping = Record<string, Record<string, string>>;

const userFriendlyMessages: ErrorMapping = {
  first_name: {
    "First name is required.": "First name is missing",
    "First name must be a string": "Invalid input",
    "First name must be at least 1 character.": "First name is missing",
    "First name must not exceed 50 characters.": "Invalid input",
    "First name must start with a letter and only contain letters, spaces, apostrophes, or hyphens.": "Invalid input",
    "First name cannot have the same character repeated more than twice in a row.": "Invalid input",
    "First name cannot contain repeating non-letter characters like --, '', or multiple spaces.": "Invalid input",
    "First name cannot contain numbers.": "Invalid input"
  },
  last_name: {
    "Last name is required": "Last name is missing",
    "Last name must be a string": "Invalid input",
    "Last name must be at least 1 character.": "Last name is missing",
    "Last name must not exceed 50 characters.": "Invalid input",
    "Last name must start with a letter and only contain letters, spaces, apostrophes, or hyphens.": "Invalid input",
    "Last name cannot have the same character repeated more than twice in a row.": "Invalid input",
    "Last name cannot contain repeating non-letter characters like --, '', or multiple spaces.": "Invalid input",
    "Last name cannot contain numbers.": "Invalid input"
  },
  email: {
    "Email field is required": "Email is missing",
    "Email must be a string": "Invalid input",
    "Email must be in a valid format (e.g., user@domain.com).": "Invalid email syntax",
    "Email cannot contain spaces.": "Invalid input",
    "Email must not exceed 254 characters.": "Invalid input",
    "Email username must not exceed 64 characters.": "Invalid input",
    "Email cannot contain consecutive dots, hyphens, or underscores.": "Invalid input",
    "Email username cannot start with a special character.": "Invalid input",
    "Email username cannot end with a special character.": "Invalid input"
  },
  user_password: {
    "Password is required": "Password is missing",
    "Password must be a string": "Invalid input",
    "Password must be at least 8 characters long.": "Password too short",
    "Password must not exceed 26 characters.": "Password too long",
    "Password must contain at least one number (0–9).": "Password missing atleast one digit",
    "Password must contain at least one lowercase letter (a–z).": "Password missing atleast one lowercase letter",
    "Password must contain at least one uppercase letter (A–Z).": "Password missing atleast one uppercase letter",
    "Password can only include letters, numbers, and these special characters: @ # $ % & *": "Allowed special characters: @ # $ % & *",
    "Password must not contain any whitespace characters.": "Whitespaces not allowed",
    "Password must not contain the same character repeated 3 or more times in a row.": "Invalid input"
  }
};

function enduserFriendlySignupZodErrorMessages(fieldName: string, errorMessage?: string): string | null {
  if(!errorMessage) return null;

  return userFriendlyMessages[fieldName]?.[errorMessage] || 'Invalid input';
}

export { enduserFriendlySignupZodErrorMessages };