
/* ==============================
     Hook: UseLogin
 ============================== */
import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
function useLogin() {
   
    const LoginSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email!')
      .required('Email is Required!'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long!')
      .max(20, 'Password must be less than 20 characters long!')
      .required('Password is Required!'),
    remember: Yup.boolean(),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log('Login data:', values)
      // gọi API login ở đây
    },
  })

  return {
    formik,
    LoginSchema,
    
    
  }
}

export default useLogin
