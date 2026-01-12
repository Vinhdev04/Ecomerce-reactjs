import React,{useState} from 'react'
import styles from './InputForm.module.scss';
import { Checkbox, Form } from 'antd'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import classNames from 'classnames'




function InputForm({label,type,name,isRequired=false,...props}) {
  const {formik} = props
  const{ formControl,passwordIcon,inputErr,error } = styles
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const showTextPassword = type === "password"&& showPassword ? "text" : type;
  const handleShowPassword = ()=>{
    setShowPassword(!showPassword)
  }
  console.log(formik);
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
                          <div onClick={handleShowPassword} className=''>
                            {
                              showPassword ? <AiFillEyeInvisible className={passwordIcon}/> : <AiFillEye className={passwordIcon} />
                            }
                         </div>
                        }


                    </label>
                </div>
                        <div className={error}>Error here!</div>

    </>
  )
}

export default InputForm
