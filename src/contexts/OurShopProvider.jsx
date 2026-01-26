/* ==============================
     Context: SideBarProvider
 ============================== */
import { OurShopContext } from '@contexts/OurShopContext.js';
import { useState } from 'react';




export const OurShopProvider = ({children}) => {
    const [viewMode, setViewMode] = useState('grid');
    const softOptions = [
        {
           label : 'Default',
           value : '0'
        },
        {
            label : 'Popularity',
            value : '1'
        },
        {
            label : 'High to Low',
            value : '2'
        },
        {
            label : 'Low to High',
            value : '3'
        },
        {
            label : 'Newest',
            value : '4'
        }
        ,{
            label : 'Oldest',
            value : '5'
        }
        
        
    ]

    const showOptions = [
        { label: '8', value: '8' },
        { label: '12', value: '12' },
        { label: '16', value: '16' },
        { label: '24', value: '24' }
    ]

    const value = {
        softOptions,showOptions,viewMode,setViewMode
    }


    return (
        <OurShopContext.Provider value={value}>
            {children}
        </OurShopContext.Provider>
    )
}