import React  from 'react'
import styles from './Login.module.scss'
import { Checkbox, Form } from 'antd'

import InputForm from '@components/InputForm/InputForm.jsx'
function Login() {
    const { formContainer, formTitle,forgotPass,checkBoxItem } = styles
 
    
    
    return (
        <div>
            <Form autoComplete="off" className={formContainer}>
                <h2 className={formTitle}>SIGN IN</h2>

                
                
                <InputForm label="Username or Email" type="text" isRequired name="email"/>
                <InputForm label="Password" type="password" isRequired name="password"/>

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
