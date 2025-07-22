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

// SignupForm component

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { firstNameZodSchema, lastNameZodSchema, emailZodSchema, userPasswordZodSchema } from '@ydvaakash/tickit-zod-schemas';
import type { firstNameTypeFromZod, lastNameTypeFromZod, emailTypeFromZod, userPasswordTypeFromZod} from '@ydvaakash/tickit-zod-schemas';
import { enduserFriendlySignupZodErrorMessages } from '../../utils/enduserFriendlySignupZodErrorMessages';
import { newUserSignupApi } from '../../api/newUserSignupApi';
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import { setServerError } from '../../store/slices/serverErrorSlice';
import type { RootState } from '../../store/store';

import { ServerErrorMessage } from '../common/ServerErrorMessage';
import type { newUserSignupApiAxiosResponseType } from '../../types/newUserSignupApiAxiosResponseType';
import { FormInputFieldErrorMessage } from '../common/FormInputFieldErrorMessage';

// import '../../styles/SignupForm.css';

type signupFormFieldsType = {
  first_name: firstNameTypeFromZod;
  last_name: lastNameTypeFromZod;
  email: emailTypeFromZod;
  user_password: userPasswordTypeFromZod;
};

const signupFormInputFieldsCombinedSchema = z.object({
  first_name: firstNameZodSchema,
  last_name: lastNameZodSchema,
  email: emailZodSchema,
  user_password: userPasswordZodSchema
});

function SignupForm() {
  const { register, handleSubmit, formState: {errors} } = useForm<signupFormFieldsType>({
    resolver: zodResolver(signupFormInputFieldsCombinedSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const dispatch = useDispatch();

  const submitSignupForm = async (formData: signupFormFieldsType) => {
    dispatch(setServerError(""));

    try {
      const resultFromBackend: newUserSignupApiAxiosResponseType = await newUserSignupApi(
        formData.first_name,
        formData.last_name,
        formData.email,
        formData.user_password
      );
      console.log('Signup form submitted successfully', resultFromBackend);
    } catch(err: unknown) {      
      if(axios.isAxiosError(err)) {
        if(err.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          const errorStatusCode = err.response.status;

          if(errorStatusCode === 403) {
            dispatch(setServerError("Something went wrong. Please refresh the page and try again."));
          } else if(errorStatusCode === 422) {
            dispatch(setServerError("Missing credentials!"));
          } else if(errorStatusCode === 400) {
            dispatch(setServerError("Invalid Input."));
          } else if(errorStatusCode === 409) {
            dispatch(setServerError("Email already registered."));
          } else if(errorStatusCode === 503) {
            dispatch(setServerError("Oops! Something went wrong on server. Please try again later."));
          } else if(errorStatusCode === 500) {
            dispatch(setServerError("Oops! Something went wrong on server. Please try again later."));
          } else if(errorStatusCode === 508) {
            dispatch(setServerError("Signup successful!"));
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
  };

  const serverErrorText: string = useSelector((state: RootState) => state.serverError.serverErrorMessage);

  return (
    <div className='flex flex-col'>
      <form className='flex flex-col' id='signupform' onSubmit={handleSubmit(submitSignupForm)}>
        <input type='text' className='signup-form-input-field' id='firstNameInputBox' {...register("first_name")} autoComplete='on' autoFocus placeholder='First name'></input>
        {/* {errors.first_name && errors.first_name.message} */}
        {/* {errors.first_name && enduserFriendlySignupZodErrorMessages('first_name', errors.first_name.message)} */}
        {/* {errors.first_name && <FormInputFieldErrorMessage errorMessage = {enduserFriendlySignupZodErrorMessages('first_name', errors.first_name.message)} />} */}
        <FormInputFieldErrorMessage errorMessage={errors.first_name ? (enduserFriendlySignupZodErrorMessages('first_name', errors.first_name.message)) : ''} />
        {/* <input type='text' id='firstNameInputBox' name='first_name' placeholder='First name'></input> */}
        <input type='text' className='signup-form-input-field' id='lastNameInputBox' {...register("last_name")} autoComplete='on' placeholder='Last name'></input>
        {/* {errors.last_name && errors.last_name.message} */}
        {/* {errors.last_name && enduserFriendlySignupZodErrorMessages('last_name', errors.last_name.message)} */}
        {/* {errors.last_name && <FormInputFieldErrorMessage errorMessage={enduserFriendlySignupZodErrorMessages('last_name', errors.last_name.message)} />} */}
        <FormInputFieldErrorMessage errorMessage={errors.last_name ? (enduserFriendlySignupZodErrorMessages('last_name', errors.last_name.message)) : ''} />
        <input type='email' className='signup-form-input-field' id='emailInputBox' {...register("email")} autoComplete='on' placeholder='Ex. abc@xyz.com'></input>
        {/* {errors.email && errors.email.message} */}
        {/* {errors.email && enduserFriendlySignupZodErrorMessages('email', errors.email.message)} */}
        {/* {errors.email && <FormInputFieldErrorMessage errorMessage={enduserFriendlySignupZodErrorMessages('email', errors.email.message)} />} */}
        <FormInputFieldErrorMessage errorMessage={errors.email ? (enduserFriendlySignupZodErrorMessages('email', errors.email.message)) : ''} />
        <input type='password' className='signup-form-input-field' id='userPasswordInputBox' {...register("user_password")} autoComplete='on' placeholder='Password'></input>
        {/* {errors.user_password && errors.user_password.message} */}
        {/* {errors.user_password && enduserFriendlySignupZodErrorMessages('user_password', errors.user_password.message)} */}
        {/* {errors.user_password && <FormInputFieldErrorMessage errorMessage={enduserFriendlySignupZodErrorMessages('user_password', errors.user_password.message)} />} */}
        <FormInputFieldErrorMessage errorMessage={errors.user_password ? (enduserFriendlySignupZodErrorMessages('user_password', errors.user_password.message)) : ''} />
        <input type='submit' className='signup-form-input-field' id='signupFormSubmitButton' value="Sign-up"></input>
      </form>
      {serverErrorText ? <ServerErrorMessage /> : null} 
    </div>
  )
}

export { SignupForm };