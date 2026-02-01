import React,{useContext} from 'react'
import { Select, Space } from 'antd';
import { CiGrid42 } from "react-icons/ci";
import { CiCircleList } from "react-icons/ci";
import { OurShopContext } from '@contexts/OurShopContext.js';
import styles from "./FilterProduct.module.scss"
import SelectedBox from './SelectedBox';


function FilterProduct() {
  const {softOptions,showOptions,setViewMode,setShowID,setSortedID} = useContext(OurShopContext);
  
  const handleSetValue = (value,typed) => {
      console.log("Typed:", typed);
      (typed === "sort") ? setSortedID(value) : setShowID(value);
  };

  const handleSetViewMode = (viewMode) => {
      (viewMode === "grid") ? setViewMode("grid") : setViewMode("list");
      console.log(viewMode);
  }
  return (
     <div className="mb-3 d-flex justify-content-between align-items-center">
          
        <div className="d-flex justify-content-between align-items-center g-3">
          <Space>
            <SelectedBox options={softOptions} getSelected={handleSetValue} typed ="sorted"/>
          </Space>
          
          
           <div className='ms-2 '>
              <button className=" btn fw-bold" id="" >
                <CiGrid42 onClick={()=> handleSetViewMode("grid")}/>
              </button>
              <button className="btn ms-2 fw-bold" id="" >
                <CiCircleList onClick={()=> handleSetViewMode("list")}/>
              </button>
            </div>
        </div>
        
        
         <div  >
            <Space>
              Show
              <SelectedBox
                options={showOptions}
                getSelected={handleSetValue}
                typed ="show"
              />
            </Space>
          </div>
    </div>
  )
}

export default FilterProduct
