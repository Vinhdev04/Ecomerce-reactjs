
import styles from "./Sidebar.module.scss";
import { AiFillCloseCircle } from "react-icons/ai";
import classNames from "classnames";
import useSidebar from "@/hooks/useSidebar.js";
import Login from "@components/ContentSidebar/Login/Login.jsx";
import Compare from "@components/ContentSidebar/Compare/Compare.jsx";
import Favorites from "@components/ContentSidebar/Favorites/Favorites.jsx";
import Cart from "@components/ContentSidebar/Cart/Cart.jsx";
const Sidebar = () => {
    const { container, overlay, sideBar, slideSideBar, showOverlay,btnClose,wrapIcon} = styles;
    const { handleToggle,  isOpen,type } = useSidebar();
    const renderSidebarTab = (type) => {
  switch (type) {
    case "compare":
      return <Compare />;
    case "favorites":
      return <Favorites />;
    case "cart":
      return <Cart />;
    default:
      return <Login />;
  }
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

              {isOpen && renderSidebarTab(type)}
            </div>
        </div>
    );
}

export default Sidebar;