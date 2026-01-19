import React, { useState } from 'react';
import styles from './Login.module.scss';
import InputForm from '@components/InputForm/InputForm.jsx';
import useAuthForm from '@hooks/useAuthForm';

function Login() {
  const { formContainer, formTitle, forgotPass, checkBoxItem, fade } = styles;
  const [isRegister, setIsRegister] = useState(false);
  const { formik } = useAuthForm(isRegister);

  const toggleMode = () => {
    setIsRegister(!isRegister);
    formik.resetForm();
  };


  return (
    <form 
      className={`${formContainer} ${fade}`} 
      onSubmit={formik.handleSubmit} 
      key={isRegister ? 'Sign Up' : 'Sign In'}
    >
      <h2 className={formTitle}>
        {isRegister ? 'Sign Up' : 'Sign In'}
      </h2>

      <InputForm 
        label="Email" 
        name="email" 
        id="email" 
        type="email"
        placeholder="example@gmail.com"
        isRequired 
        formik={formik} 
      />
      
      <InputForm 
        label="Password" 
        type="password" 
        name="password" 
        id="password" 
        placeholder="••••••••"
        isRequired 
        formik={formik} 
      />

      {isRegister && (
        <InputForm
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="••••••••"
          isRequired
          formik={formik}
        />
      )}

      {!isRegister && (
        <label className={checkBoxItem}>
          <input
            type="checkbox"
            name="remember"
            className="me-2"
            checked={formik.values.remember}
            onChange={formik.handleChange}
          />
          Remember me
        </label>
      )}

      <button 
        type="submit" 
        className="mt-3 btn btn-primary w-100"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting 
          ? 'Loading...' 
          : (isRegister ? 'Sign Up' : 'Sign In')
        }
      </button>

      <button 
        type="button" 
        className="mt-2 btn btn-dark w-100" 
        onClick={toggleMode}
        disabled={formik.isSubmitting}
      >
        {isRegister ? 'Already have an account?' : "Don't have an account?"}
      </button>

      {!isRegister && (
        <div className="mt-2 d-flex justify-content-center">
          <a href="#" className={forgotPass}>Forgot password?</a>
        </div>
      )}
    </form>
  );
}

export default Login;