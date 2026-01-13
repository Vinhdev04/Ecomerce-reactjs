import React from 'react'
import styles from './Login.module.scss'
import InputForm from '@components/InputForm/InputForm.jsx'
import useLogin from '@hooks/useLogin.js'

function Login() {
  const { formContainer, formTitle, forgotPass, checkBoxItem } = styles
    const { formik } = useLogin()
  

  return (
    <form
      autoComplete="off"
      className={formContainer}
      onSubmit={formik.handleSubmit}
    >
      <h2 className={formTitle}>SIGN IN</h2>

      <InputForm
        label="Username or Email"
        type="text"
        name="email"
        id="email"
        isRequired
        formik={formik}
      />

      <InputForm
        label="Password"
        type="password"
        name="password"
        id="password"
        isRequired
        formik={formik}
      />

      <label className={checkBoxItem}>
        <input
          type="checkbox"
          name="remember"
          checked={formik.values.remember}
          onChange={formik.handleChange}
          className="me-2"
        />
        Remember me
      </label>

      <button
        type="submit"
        className="mt-3 mb-2 btn btn-dark w-100"
      >
        Login
      </button>

      <div className="d-flex justify-content-center">
        <a href="#" className={forgotPass}>Forgot password?</a>
      </div>
    </form>
  )
}

export default Login
