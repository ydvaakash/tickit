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

// Test file for 'generateRefreshToken.ts' utility

// jest.mock("uuid");

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("AnotherRandomString12345!@#$%")
}));

// jest.mock("jsonwebtoken", () => ({
//   sign: jest.fn().mockReturnValue("MockedFinalRefreshTokenString")
// }));

jest.mock("jsonwebtoken");

import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

import { generateRefreshToken } from "../generateRefreshToken";
import 'dotenv/config';

describe("Testing 'generateRefreshToken' utility", () => {
  const originalEnvVariables = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {...originalEnvVariables};
  });

  afterEach(() => {
    process.env = originalEnvVariables;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenSecretKey' is not available.", () => {
    const userPublicUid = "Some random string";

    delete process.env.REFRESHTOKENSECRETKEY;
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAUdienceString";
    process.env.REFRESHTOKENVALIDITY = "refreshTokenValidityString";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenSecretKey' is undefined", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = undefined;
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAUdienceString";
    process.env.REFRESHTOKENVALIDITY = "refreshTokenValidityString";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenSecretKey' is empty string", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "";
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAUdienceString";
    process.env.REFRESHTOKENVALIDITY = "refreshTokenValidityString";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenIssuer' is not available.", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    delete process.env.REFRESHTOKENISSUER;
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAUdienceString";
    process.env.REFRESHTOKENVALIDITY = "refreshTokenValidityString";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenIssuer' is undefined", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = undefined;
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAUdienceString";
    process.env.REFRESHTOKENVALIDITY = "refreshTokenValidityString";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenIssuer' is empty string", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = "";
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAUdienceString";
    process.env.REFRESHTOKENVALIDITY = "refreshTokenValidityString";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenAudience' is not available.", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    delete process.env.REFRESHTOKENAUDIENCE;
    process.env.REFRESHTOKENVALIDITY = "refreshTokenValidityString";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenAudience' is undefined", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = undefined;
    process.env.REFRESHTOKENVALIDITY = "refreshTokenValidityString";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenAudience' is empty string", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = "";
    process.env.REFRESHTOKENVALIDITY = "refreshTokenValidityString";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenValidity' is not available.", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAudienceString";
    delete process.env.REFRESHTOKENVALIDITY;

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenValidity' is undefined", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAudienceString";
    process.env.REFRESHTOKENVALIDITY = undefined;

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return empty string as 'finalRefreshToken' if 'refreshTokenValidity' is empty string", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAudienceString";
    process.env.REFRESHTOKENVALIDITY = "";

    expect(generateRefreshToken(userPublicUid)).toBe("");
  });

  test("Return a valid 'finalRefreshToken' string if all required env variables are available.", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAudienceString";
    process.env.REFRESHTOKENVALIDITY = "5d";

    jest.useFakeTimers().setSystemTime(new Date("2025-08-18T12:00:00Z"));

    mockedJwt.sign.mockImplementation(() => {
      return "MockedFinalRefreshTokenString";
    });
    
    const result = generateRefreshToken(userPublicUid);

    expect(mockedJwt.sign).toHaveBeenCalledWith(
      {
        uid: userPublicUid
      },
      process.env.REFRESHTOKENSECRETKEY.trim(),
      {
        expiresIn: process.env.REFRESHTOKENVALIDITY.trim(),
        issuer: process.env.REFRESHTOKENISSUER.trim(),
        audience: process.env.REFRESHTOKENAUDIENCE.trim(),
        jwtid: uuidv4()
      }
    );

    expect(result).toBe("MockedFinalRefreshTokenString");
  });

  test("Return an empty string as 'finalRefreshToken' if an error occurs while signing 'refreshAccessToken'.", () => {
    const userPublicUid = "Some random string";

    process.env.REFRESHTOKENSECRETKEY = "refreshTokenSecretKeyString";
    process.env.REFRESHTOKENISSUER = "refreshTokenIssuerString";
    process.env.REFRESHTOKENAUDIENCE = "refreshTokenAudienceString";
    process.env.REFRESHTOKENVALIDITY = "5d";

    jest.useFakeTimers().setSystemTime(new Date("2025-08-18T12:00:00Z"));

    mockedJwt.sign.mockImplementation(() => {
      throw new Error("Error thrown by mockedJwt.sign() function.");
    });

    const result = generateRefreshToken(userPublicUid);

    expect(mockedJwt.sign).toHaveBeenCalledWith(
      {
        uid: userPublicUid,
      },
      process.env.REFRESHTOKENSECRETKEY.trim(),
      {
        expiresIn: process.env.REFRESHTOKENVALIDITY.trim(),
        issuer: process.env.REFRESHTOKENISSUER.trim(),
        audience: process.env.REFRESHTOKENAUDIENCE.trim(),
        jwtid: uuidv4(),
      }
    );

    expect(result).toBe("");
  });
});