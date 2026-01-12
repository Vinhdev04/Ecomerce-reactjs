import React  from 'react'
import styles from './Login.module.scss'
import { Checkbox, Form } from 'antd'
import InputForm from '@components/InputForm/InputForm.jsx'
import { useFormik
 } from 'formik'
 import * as Yup from 'yup'
function Login() {
    const { formContainer, formTitle,forgotPass,checkBoxItem } = styles
 
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },

    })
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Form data');
    }
    
    return (
        <div>
            <Form autoComplete="off" className={formContainer} onSubmit={handleSubmit}>
                <h2 className={formTitle}>SIGN IN</h2>

                
                
                <InputForm label="Username or Email" type="text" isRequired name="email" id="email" formik={formik}/>
                <InputForm label="Password" type="password" isRequired name="password" id="password" formik={formik}/>

                <Checkbox className={checkBoxItem}>Remember me</Checkbox>

                <button className="mt-3 mb-2 btn btn-dark w-100">
                    Login
                </button>

                <div className="d-flex justify-content-center align-items-center">
                    <a href="#" className={forgotPass}>Forgot password?</a>
                </div>
            </Form>
        </div>
    )
}

export default Login
