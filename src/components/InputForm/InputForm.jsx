import React, { useState } from 'react'
import styles from './InputForm.module.scss'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import classNames from 'classnames'

function InputForm({
  label,
  type,
  name,
  id,
  isRequired = false,
  formik,
  ...rest
}) {
  const { formControl, passwordIcon, errorMessage } = styles
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  const isError = formik.touched[id] && formik.errors[id]
  

  return (
    <div className={classNames(formControl)}>
      <label htmlFor={id} className="form-label">
        {label} {isRequired && '*'}
      </label>

      <div className="position-relative">
        <input
          id={id}
          name={name}
          type={inputType}
          className="mt-2 mb-2 form-control"
        
          value={formik.values[id]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={passwordIcon}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        )}
      </div>

      {isError && (
        <span className={errorMessage}>{formik.errors[id]}</span>
      )}
    </div>
  )
}

export default InputForm
