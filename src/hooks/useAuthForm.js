import { useFormik } from 'formik'
import * as Yup from 'yup'
import {register,login} from '@/api/authServices.js'
import {useContext} from 'react';
import { ToastContext } from '@contexts/ToastContext.js';
function useAuthForm(isRegister) {
  const { toast } = useContext(ToastContext);
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email không hợp lệ!')
      .required('Email là bắt buộc!'),

    password: Yup.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!')
      .max(20, 'Mật khẩu không được quá 20 ký tự!')
      .required('Mật khẩu là bắt buộc!'),
      

    confirmPassword: isRegister
      ? Yup.string()
          .oneOf([Yup.ref('password')], 'Mật khẩu không trùng khớp!')
          .required('Mật khẩu xác nhận là bắt buộc!')
  
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
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log(isRegister ? '📝 Sign Up' : '🔐 Sign In', values);
      
      try {
        const { email: username, password } = values;

        if (isRegister) {
          
          const res = await register({ username, password });
          
          if (res.success) {
            toast.success('Đăng ký thành công! ');
            resetForm();
          
          } else {
            toast.error(res.message || 'Đăng ký thất bại!');
          }
        } else {
         
          const res = await login({ username, password });
          
          if (res.success) {
            toast.success('Đăng nhập thành công!');
            
           
            localStorage.setItem('user', JSON.stringify(res.data));
            
            // Optional: Store remember me
            if (values.remember) {
              localStorage.setItem('rememberMe', 'true');
            }
            
        
          } else {
            toast.error(res.message || 'Đăng nhập thất bại!');
          }
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'An error occurred';
        toast.error(`${errorMessage}`);
        console.error(isRegister ? 'Đăng ký thất bại:' : 'Đăng nhập thất bại:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });
 

  return { formik }
}

export default useAuthForm
