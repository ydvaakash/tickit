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

// LoginForm component

import { useForm } from "react-hook-form";
import type { emailTypeFromZod, userPasswordTypeFromZod } from "@ydvaakash/tickit-zod-schemas";
import { emailZodSchema, userPasswordZodSchema } from "@ydvaakash/tickit-zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormInputFieldErrorMessage } from "../common/FormInputFieldErrorMessage";
import { endUserFriendlyLoginZodErrorMessages } from "../../utils/endUserFriendlyLoginZodErrorMessages";
import { existingUserLoginApi } from "../../api/existingUserLoginApi";
import type { existingUserLoginApiAxiosResponseType } from "../../types/existingUserLoginApiAxiosResponseType";
import axios from "axios";
import { ServerErrorMessage } from "../common/ServerErrorMessage";
import { setServerError } from "../../store/slices/serverErrorSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";

function LoginForm() {
  const loginFormInputFieldsCombinedSchema = z.object({
    email: emailZodSchema,
    user_password: userPasswordZodSchema
  });

  interface LoginFormInput {
    email: emailTypeFromZod;
    user_password: userPasswordTypeFromZod;
  }

  const { register, handleSubmit, setValue, formState: { errors }} = useForm<LoginFormInput>({
    resolver: zodResolver(loginFormInputFieldsCombinedSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const dispatch = useDispatch();

  const submitLoginForm = async (formData: LoginFormInput): Promise<void> => {
    console.log('Login form submitted.');

    try {
      const loginRequestResponseFromBackend: existingUserLoginApiAxiosResponseType = await existingUserLoginApi(formData.email, formData.user_password);
      if(loginRequestResponseFromBackend.status === 200) {
        console.log('Login successful');
        console.log(loginRequestResponseFromBackend);
        setValue("email", "");
        setValue("user_password", "");
      }
    } catch(err: unknown) {
      if(axios.isAxiosError(err)) {
        if(err.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          const errorStatusCode: number = err.response.status;

          if(errorStatusCode === 403) {
            dispatch(setServerError("Something went wrong. Please refresh the page and try again."));
          } else if(errorStatusCode === 422) {
            dispatch(setServerError("Missing credentials!"));
          } else if(errorStatusCode === 400) {
            dispatch(setServerError("Invalid Input"));
          } else if(errorStatusCode === 401) {
            dispatch(setServerError("Invalid login credentials"));
          } else if(errorStatusCode === 503) {
            dispatch(setServerError("Oops! Something went wrong on server. Please try again later."));
          } else if(errorStatusCode === 500) {
            dispatch(setServerError("Oops! Something went wrong on server. Please try again later."));
          }
        } else if(err.request) {
          // The request was made but no response was received
          dispatch(setServerError("Oops! Something unexpected happened. Please try again."));
        } else {
          // Something happened in setting up the request that triggered an Error
          dispatch(setServerError("Couldn't send request to server. Please try again."));
        }
      } else {
        // Handle non-Axios error.
        dispatch(setServerError("Oops! Something unexpected happened. Please try again."));
      }
    }
  }

  const serverErrorText: string = useSelector((state: RootState) => state.serverError.serverErrorMessage);

  return (
    <div className='flex flex-col'>
      <form className='flex flex-col' onSubmit={(e) => {
        e.preventDefault();
        dispatch(setServerError(""));
        handleSubmit(submitLoginForm)(e);
        setValue("user_password", "");
      }}>
        <input type="text" {...register('email')} placeholder="Your email (ex., username@domain.com)" autoComplete="on" autoFocus />
        <FormInputFieldErrorMessage errorMessage={errors.email ? endUserFriendlyLoginZodErrorMessages('email', errors.email.message) : ''}/>
        <input type="password" {...register('user_password')} placeholder="Password" autoComplete="off" />
        <FormInputFieldErrorMessage errorMessage={errors.user_password ? endUserFriendlyLoginZodErrorMessages('user_password', errors.user_password.message) : ''} />
        <input type="submit" value="Login"/>
      </form>
      {serverErrorText ? <ServerErrorMessage /> : null}
    </div>
  )
}

export { LoginForm };