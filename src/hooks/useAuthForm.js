import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register, login } from '@/api/authServices.js';
import { useContext } from 'react';
import { ToastContext } from '@contexts/ToastContext.js';
import saveDataToLocalStorage from "@helpers/saveDataToLocalStorage.js";
import setCookies from "@helpers/setCookies.js";


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
  });

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
        const { email: username, password } = values;
        
        try {
            let res;

            if (isRegister) {
                res = await register({ username, password });
            } else {
                res = await login({ username, password });
                
                if (res.success && res.data) {
                  
                    // CHỈ LƯU ACCESS TOKEN vào cookie
                    setCookies("token",res.data.token, {
                        expires: 1/96, // 15 phút
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict'
                    });
               
                    const { token, ...userInfo } = res.data;
                    saveDataToLocalStorage('users', userInfo);

                    if (values.remember) {
                        saveDataToLocalStorage('rememberMe', true);
                    }
                }
            }

            if (res.success) {
                toast.success(isRegister ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');
                
                if (isRegister) {
                    resetForm(); 
                }
            } else {
                toast.error(res.message || 'Thao tác thất bại!');
            }

        } catch (error) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Đã xảy ra lỗi';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    },
});

  return { formik };
}

export default useAuthForm;