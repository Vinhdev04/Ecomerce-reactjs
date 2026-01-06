import React,{useState} from 'react'
import styles from './InputForm.module.scss';
import { Checkbox, Form } from 'antd'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import classNames from 'classnames'




function InputForm({label,type,name,isRequired=false}) {

  const{ formControl,passwordIcon } = styles
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const showTextPassword = type === "password"&& showPassword ? "text" : type;
  const handleShowPassword = ()=>{
    setShowPassword(!showPassword)
  }
  return (
    <>
      <div className={classNames(formControl, 'input-group')}>
                    <label className="form-label">
                        {label} {isRequired && '*'}
                        <input
                        type={showTextPassword}
                        className="mt-2 mb-2 form-control"
                        required={isRequired}
                        name={name}
                        />
                        {isPassword && 
                          <div onClick={handleShowPassword}>
                            {
                              showPassword ? <AiFillEyeInvisible className={passwordIcon}/> : <AiFillEye className={passwordIcon} />
                            }
                         </div>
                        }

                    </label>
                </div>

    </>
  )
}

export default InputForm
