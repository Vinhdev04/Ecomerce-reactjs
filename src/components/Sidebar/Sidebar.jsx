import { useContext } from "react";
import styles from "./Sidebar.module.scss";
import { SideBarContext } from "@/contexts/SideBarContext.js";
import { AiFillCloseCircle } from "react-icons/ai";
import classNames from "classnames";
import Login from '@components/ContentSidebar/Login/Login.jsx';
import Compare from '@components/ContentSidebar/Compare/Compare.jsx';
import Favorites from '@components/ContentSidebar/Favorites/Favorites.jsx';
import Cart from '@components/ContentSidebar/Cart/Cart.jsx';
const Sidebar = () => {
    const { container, overlay, sideBar, slideSideBar, showOverlay,btnClose,wrapIcon} = styles;
    
  
    const { isOpen, setIsOpen,type } = useContext(SideBarContext);

   
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };
    console.log(type);

    const handleRenderSidebarTab = ()=> {
        switch(type){
            case "compare":
                return <Compare/>
            case "favorites":
                return <Favorites/>
            case "cart":
                return <Cart/>
            case "login":
                return <Login/>
            default:
                 return <Login/>
        }
    }
    
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

               {handleRenderSidebarTab()}
            </div>
        </div>
    );
}

export default Sidebar;