import SideBarContext from './SideBarContext.js';
import { useState } from 'react';

export const SideBarProvider = ({children}) => {
    const [isOpen,setIsOpen] = useState(false);
    return (
        <SideBarContext.Provider value={{isOpen,setIsOpen}}>
            {children}
        </SideBarContext.Provider>
    )
}