/* ==============================
     Context: SideBarProvider
 ============================== */


import { ToastContext } from '@contexts/ToastContext';
import { ToastContainer, toast } from 'react-toastify';


export const ToastProvider = ({children}) => {
   
    const value = {toast}
    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastContainer/>
        </ToastContext.Provider>
    )
}