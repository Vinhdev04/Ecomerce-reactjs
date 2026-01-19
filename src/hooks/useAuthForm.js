import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register, login } from '@/api/authServices.js';
import { useContext } from 'react';
import { ToastContext } from '@contexts/ToastContext.js';
import saveDataToLocalStorage from "@helpers/saveDataToLocalStorage.js";
import setCookies from "@helpers/setCookies.js";
import { SideBarContext } from "@contexts/SideBarContext.js";
import { UserInfoContext } from '@/contexts/userInfoContext';

function useAuthForm(isRegister) {
  const { toast } = useContext(ToastContext);
  const { setIsOpen } = useContext(SideBarContext);
  const { setUserId } = useContext(UserInfoContext);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email không hợp lệ!')
      .required('Email là bắt buộc!'),

    password: Yup.string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự!')
      .max(20, 'Mật khẩu không được quá 20 ký tự!')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Mật khẩu phải chứa ít nhất: 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)!'
      )
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
                // ============================================
                // ĐĂNG KÝ
                // ============================================
                res = await register({ username, password });
                
                if (res.success) {
                    const userId = res.data.id;
                    
                    //  Set userId vào Context
                    setUserId(userId);
                    
                    toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                    resetForm();
                    setIsOpen(false);
                }
                
            } else {
                // ============================================
                // ĐĂNG NHẬP
                // ============================================
                res = await login({ username, password });
                
                if (res.success && res.data) {
                    //  LẤY userId TỪ RESPONSE
                    const userId = res.data.user?.id;
                    
                    console.log('✅ Login response:', res.data);
                    console.log('✅ User ID:', userId);

                    //  LƯU ACCESS TOKEN vào cookie
                    setCookies("token", res.data.token, {
                        expires: 1/96, // 15 phút
                        sameSite: 'strict'
                    });

                    //  LƯU USER ID vào cookie với TÊN ĐÚNG: "userId"
                    if (userId) {
                        setCookies("userId", userId, { // ← ĐỔI TỪ "id" THÀNH "userId"
                            expires: 7, // 7 ngày (giống refreshToken)
                            sameSite: 'strict'
                        });
                        
                        //  Set userId vào Context để trigger useEffect
                        setUserId(userId);
                    }

                    //  LƯU THÔNG TIN USER vào localStorage
                    const { token, ...userInfo } = res.data;
                    saveDataToLocalStorage('users', userInfo);

                    //  LƯU TRẠNG THÁI "REMEMBER ME"
                    if (values.remember) {
                        saveDataToLocalStorage('rememberMe', true);
                    }

                    toast.success('Đăng nhập thành công!');
                    
                    //  Đóng sidebar login
                    setIsOpen(false);
                }
            }

            // Xử lý response thất bại
            if (!res.success) {
                toast.error(res.message || 'Thao tác thất bại!');
            }

        } catch (error) {
            console.error('❌ Error:', error);
            
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