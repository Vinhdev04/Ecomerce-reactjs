import { useContext } from "react";
import styles from "./Sidebar.module.scss";
import { SideBarContext } from "@/contexts/SideBarContext.js";
import { AiFillCloseCircle } from "react-icons/ai";
import classNames from "classnames";
import Login from '@components/ContentSidebar/Login/Login.jsx';
const Sidebar = () => {
    const { container, overlay, sideBar, slideSideBar, showOverlay,btnClose,wrapIcon} = styles;
    
  
    const { isOpen, setIsOpen } = useContext(SideBarContext);

   
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={container}>
     
            <div 
                className={classNames(overlay, { [showOverlay]: isOpen })}
                onClick={handleToggle}
            ></div>

            <div className={classNames(sideBar, { [slideSideBar]: isOpen })}>
               
       
             
               {isOpen &&  <div className={wrapIcon} onClick={handleToggle} >
                    <AiFillCloseCircle className={btnClose} width={30} height={30}/>
                </div>}

                <Login/>
            </div>
        </div>
    );
}

export default Sidebar;