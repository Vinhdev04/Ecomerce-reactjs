/* ==============================
     Context: SideBarProvider
 ============================== */
import { OurShopContext } from '@contexts/OurShopContext.js';
import { useEffect, useState } from 'react';
import {getAllProducts} from '@api/productsService.js';



export const OurShopProvider = ({children}) => {
    
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

    const [sortedID,setSortedID] = useState('0');
    const [viewMode, setViewMode] = useState('grid');
    const [showID,setShowID] = useState('8');

    const value = {
        softOptions,showOptions,setViewMode,setShowID,setSortedID
    }


    useEffect(()=>{
        const query = {
            sortedType: sortedID,
            pages:1,
            limit: showID
        };

        // getAllProducts(query);
        console.log(query);
    },[sortedID,showID])


    return (
        <OurShopContext.Provider value={value}>
            {children}
        </OurShopContext.Provider>
    )
}