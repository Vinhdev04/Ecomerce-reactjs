import { useFormik } from 'formik'
import * as Yup from 'yup'
import {register} from '@/api/authServices.js'
function useAuthForm(isRegister) {
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email!')
      .required('Email is Required!'),

    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long!')
      .max(20, 'Password must be less than 20 characters long!')
      .required('Password is Required!'),

    confirmPassword: isRegister
      ? Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match!')
          .required('Confirm Password is Required!')
      : Yup.string().notRequired(),

    remember: Yup.boolean(),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      remember: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async(values) => {
      console.log(isRegister ? 'Sign Up' : 'Sign In', values)
      // if(isRegister){
      //   try {
      //     const {email: username, password} = values
      //     const res = await register({
      //       username,
      //       password,
      //     });
      //     console.log('Registration successful:', res);
      //   } catch (error) {
      //     console.error('Registration failed:', error);
      //   }
      // }
    },
  })

  return { formik }
}

export default useAuthForm
