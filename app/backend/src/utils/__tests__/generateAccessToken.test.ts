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

// Test file for 'generateAccessToken.ts' utility

import 'dotenv/config';
jest.mock("jsonwebtoken");

import jwt from 'jsonwebtoken';
import { generateAccessToken } from "../generateAccessToken";

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe("Testing 'generateAccessToken' utility", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {...originalEnv};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenSecretKey' is not available.", () => {
    const userPublicUid = "Some random string";

    delete process.env.ACCESSTOKENSECRETKEY;
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = "accessTokenValidityString";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenSecretKey' is undefined.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = undefined;
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = "accessTokenValidityString";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenSecretKey' is empty string.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "";
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = "accessTokenValidityString";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenIssuer' is not available.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    delete process.env.ACCESSTOKENISSUER;
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = "accessTokenValidityString";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenIssuer' is undefined.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = undefined;
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = "accessTokenValidityString";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenIssuer' is empty string.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = "";
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = "accessTokenValidityString";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenAudience' is not available.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    delete process.env.ACCESSTOKENAUDIENCE;
    process.env.ACCESSTOKENVALIIDITY = "accessTokenValidityString";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenAudience' is undefined.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = undefined;
    process.env.ACCESSTOKENVALIIDITY = "accessTokenValidityString";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenAudience' is empty string.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = "";
    process.env.ACCESSTOKENVALIIDITY = "accessTokenValidityString";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenValidity' is not available.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    delete process.env.ACCESSTOKENVALIIDITY;

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenValidity' is undefined.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = undefined;

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return emptry string as 'finalAccessToken' if 'accessTokenValidity' is empty string.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = "";

    expect(generateAccessToken(userPublicUid)).toBe("");
  });

  test("Return a valid 'finalAccessToken' string if all required env variables are available.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = "1d";

    mockedJwt.sign.mockReturnValue("FinalAccessToken" as any);

    const result = generateAccessToken(userPublicUid);

    expect(mockedJwt.sign).toHaveBeenCalledWith({uid: userPublicUid},
      process.env.ACCESSTOKENSECRETKEY?.trim(),
      {
        expiresIn: process.env.ACCESSTOKENVALIIDITY?.trim(),
        issuer: process.env.ACCESSTOKENISSUER?.trim(),
        audience: process.env.ACCESSTOKENAUDIENCE?.trim()
      }
    );

    expect(result).toBe("FinalAccessToken");
  });

  test("Return an empty string as 'finalAccessToken' if an error occurs while signing 'finalAccessToken'.", () => {
    const userPublicUid = "Some random string";

    process.env.ACCESSTOKENSECRETKEY = "accessTokenSecretKeyString";
    process.env.ACCESSTOKENISSUER = "accessTokenIssuerString";
    process.env.ACCESSTOKENAUDIENCE = "accessTokenAudienceString";
    process.env.ACCESSTOKENVALIIDITY = "1d";

    mockedJwt.sign.mockImplementation(() => {
      throw new Error("JWT.SIGN() FAILED.");
    });

    const result = generateAccessToken(userPublicUid);

    expect(result).toBe("");

    expect(mockedJwt.sign).toHaveBeenCalledWith({uid: userPublicUid},
      process.env.ACCESSTOKENSECRETKEY?.trim(),
      {
        expiresIn: process.env.ACCESSTOKENVALIIDITY?.trim(),
        issuer: process.env.ACCESSTOKENISSUER?.trim(),
        audience: process.env.ACCESSTOKENAUDIENCE?.trim()
      }
    );

    expect(mockedJwt.sign).toHaveBeenCalled();
  });
});