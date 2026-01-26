import React,{useContext} from 'react'
import { Select, Space } from 'antd';
import { CiGrid42 } from "react-icons/ci";
import { CiCircleList } from "react-icons/ci";
import { OurShopContext } from '@contexts/OurShopContext.js';
import styles from "./FilterProduct.module.scss"

function FilterProduct() {
  const {softOptions,showOptions} = useContext(OurShopContext);
  return (
     <div className="mb-3 d-flex justify-content-between align-items-center">
          
        <div className="d-flex justify-content-between align-items-center g-3">
          <Space>
        
          <Select
            defaultValue="Default"
            style={{ width: 120 }}
            onChange={(value) => console.log(value)}
                options={softOptions}
            />
          </Space>
          
          
           <div className='ms-2 '>
              <button className=" btn fw-bold" id=""><CiGrid42/></button>
              <button className="btn ms-2 fw-bold" id=""><CiCircleList/></button>
            </div>
        </div>
        
        
         <div  >
            <Space>
                  Show
              <Select
                defaultValue="12"
                style={{ width: 120 }}
                onChange={(value) => console.log(value)}
                    options={showOptions}
                />
            </Space>      
          </div>
    </div>
  )
}

export default FilterProduct
