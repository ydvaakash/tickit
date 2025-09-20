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

// Test file for extractUserIpFromReq.ts

import { Request } from "express";
import { extractUserIpFromReq } from "../extractUserIpFromReq";

describe("Testing 'extractUserIpFromReq' utility", () => {
  test("Passing undefined IP in the 'req' object should return 'null'.", () => {
    const mockReq = {
      ip: undefined
    } as unknown as Request;

    expect(extractUserIpFromReq(mockReq)).toBe(null);
  });

  test("Passing valid IPv4 address that is mapped to an IPv6 address and starts with '::ffff:' returns the trimmed IPv4 address.", () => {
    const mockReq = {
      ip: "::ffff:192.168.0.1"
    } as unknown as Request;

    expect(extractUserIpFromReq(mockReq)).toBe("192.168.0.1");
  });

  test("Passing valid IPv4 address returns the trimmed IPv4 address.", () => {
    const mockReq = {
      ip: "192.168.0.1"
    } as unknown as Request;

    expect(extractUserIpFromReq(mockReq)).toBe("192.168.0.1");
  });

  test("Passing valid IPv6 address returns the trimmed IPv6 address.", () => {
    const ipv6_addresses = [
      "2001:0db8:0000:0000:0000:ff00:0042:8329",
      "2001:db8::ff00:42:8329",
      "::1",
      "fe80::1ff:fe23:4567:890a"
    ];

    ipv6_addresses.forEach(element => {
      let mockReq = {
        ip: element
      } as unknown as Request;
      expect(extractUserIpFromReq(mockReq)).toBe(element);
    });
  });

  test("Passing a string that is neither an IPv4 nor an IPv6 address returns null.", () => {
    const mockReq = {
      ip: "random string"
    } as unknown as Request;

    expect(extractUserIpFromReq(mockReq)).toBe(null);
  });

  test("Passing a valid IPv4 and IPv6 address with extra spaces at beginning and end should return the trimmed address.", () => {
    const ip_addresses = [
      "  2001:0db8:0000:0000:0000:ff00:0042:8329            ",
      "  2001:db8::ff00:42:8329           ",
      "  ::1",
      "fe80::1ff:fe23:4567:890a              ",
      "  ::ffff:192.168.0.1        "
    ];

    ip_addresses.forEach(element => {
      const mockReq = {
        ip: element
      } as unknown as Request;
      expect(extractUserIpFromReq(mockReq)).toBe(element.trim());
    });
  });

  test("Passing an empty string as the value of IP in 'req' object should return null", () => {
    const mockReq = {
      ip: "      "
    } as unknown as Request;

    expect(extractUserIpFromReq(mockReq)).toBe(null);
  });
});