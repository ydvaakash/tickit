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

// Extract geolocation and ISP details of client from IPV4 or IPV6 address

import { AxiosError } from "axios";
import type { userGeolocationDetailsType } from "../types/userGeolocationAndIspDetailsType";
import { axiosInstance } from "./axiosInstance";
import 'dotenv/config';

const extractGeolocationFromIPAddress = async (ipAddress: string | null): Promise<userGeolocationDetailsType> => {
  const geolocationApiSecretKey = process.env["GEOLOCATIONAPISECRETKEY"];
  try {
    const userGeolocationDetailsFromApi = await axiosInstance.get('/', {
      params: {
        apiKey: geolocationApiSecretKey,
        ip: ipAddress
      }
    });

    if(!userGeolocationDetailsFromApi.data.location) {
      return {
        successFlag: true,
        statusCode: 204,
        message: "No location details received in API .",
        errorDetails: "",
        data: {
          userCountryName: "",
          userLatitude: "",
          userLongitude: "",
        }
      }
    }

    if(!userGeolocationDetailsFromApi.data.location.country_name || !userGeolocationDetailsFromApi.data.location.latitude || !userGeolocationDetailsFromApi.data.location.longitude) {
      return {
        successFlag: true,
        statusCode: 204,
        message: "API response missing either country name, or latitude, or longitude fields.",
        errorDetails: "",
        data: {
          userCountryName: userGeolocationDetailsFromApi.data.location?.country_name ?? "",
          userLatitude: userGeolocationDetailsFromApi.data.location?.latitude ?? "",
          userLongitude: userGeolocationDetailsFromApi.data.location?.longitude ?? "",
        }
      }
    }

    return {
      successFlag: true,
      statusCode: 200,
      message: "API response received successfully",
      errorDetails: "",
      data: {
        userCountryName: userGeolocationDetailsFromApi.data.location.country_name,
        userLatitude: userGeolocationDetailsFromApi.data.location.latitude,
        userLongitude: userGeolocationDetailsFromApi.data.location.longitude,
      }
    }
  } catch (error: unknown) {
    if(error instanceof AxiosError) {
      if(error.response) {
        // The request was made and the server responded with a status code that falls out of the range of 2xx
        return {
          successFlag: false,
          statusCode: error.response.status,
          message: "API response received with status code beyond 2xx",
          errorDetails: "",
          data: {
            userCountryName: "",
            userLatitude: "",
            userLongitude: "",
          }
        }
      } else if(error.request) {
        // The request was made but no response was received
        return {
          successFlag: false,
          statusCode: 504,
          message: "Request was made but no response received from API.",
          errorDetails: "",
          data: {
            userCountryName: "",
            userLatitude: "",
            userLongitude: "",
          }
        }
      } else {
        return {
          successFlag: false,
          statusCode: 500,
          message: "Something went wrong before contacting the API.",
          errorDetails: "",
          data: {
            userCountryName: "",
            userLatitude: "",
            userLongitude: "",
          }          
        }
      }
    } else if(error instanceof Error) {
      return {
        successFlag: false,
        statusCode: 500,
        message: "Internal server error.",
        errorDetails: `${error.name}: ${error.message}\n${error.stack}`,
        data: {
          userCountryName: "",
          userLatitude: "",
          userLongitude: ""
        }
      }
    } else {
      return {
        successFlag: false,
        statusCode: 500,
        message: "Internal server error.",
        errorDetails: String(error),
        data: {
          userCountryName: "",
          userLatitude: "",
          userLongitude: "",
        }        
      }
    }
  }
};

export { extractGeolocationFromIPAddress };