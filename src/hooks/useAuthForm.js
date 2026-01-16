import { useFormik } from 'formik'
import * as Yup from 'yup'
import {register,login} from '@/api/authServices.js'
import {useContext} from 'react';
import { ToastContext } from '@contexts/ToastContext.js';
import saveDataToLocalStorage from "@helpers/saveDataToLocalStorage.js"
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
      // 1. Lấy dữ liệu
      const { email: username, password } = values;
      
      try {
        let res;
        // 2. Gọi API
        if (isRegister) {
          res = await register({ username, password });
        } else {
          res = await login({ username, password });
        }

        // 3. Xử lý kết quả
        if (res.success) {
          toast.success(isRegister ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');
          
          if (!isRegister) {
             saveDataToLocalStorage('users', res.data);
             if (values.remember) saveDataToLocalStorage('rememberMe', true);
          } else {
             resetForm(); // Chỉ reset form khi đăng ký thành công
          }
        } else {
          toast.error(res.message || 'Thao tác thất bại!');
        }

      } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'An error occurred';
        toast.error(`${errorMessage}`);
        console.error(isRegister ? 'Đăng ký thất bại:' : 'Đăng nhập thất bại:', error);
        setSubmitting(false);
      } finally {
        setSubmitting(false);
      }
    },
  });
 

  return { formik }
}

export default useAuthForm
