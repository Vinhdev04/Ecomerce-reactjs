import { SideBarContext } from "@/contexts/SideBarContext.js";
import { useContext } from "react";


const useSidebar = () => {
  const { isOpen, setIsOpen, type } = useContext(SideBarContext);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  return {
    isOpen,
    type,
    handleToggle,
  };
};

export default useSidebar;


