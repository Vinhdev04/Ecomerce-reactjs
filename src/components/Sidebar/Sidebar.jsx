import { useContext } from "react";
import styles from "./Sidebar.module.scss";
import { SideBarContext } from "@/contexts/SideBarContext.js";
import classNames from "classnames";

const Sidebar = () => {
    const { container, overlay, sideBar, slideSideBar, showOverlay} = styles;
    
  
    const { isOpen, setIsOpen } = useContext(SideBarContext);

   
    const handleClose = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={container}>
     
            <div 
                className={classNames(overlay, { [showOverlay]: isOpen })}
                onClick={handleClose}
            ></div>

            <div className={classNames(sideBar, { [slideSideBar]: isOpen })}>
                <h2>Sidebar Content</h2>
       
                <button onClick={handleClose}>×</button>
            </div>
        </div>
    );
}

export default Sidebar;