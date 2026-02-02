
import { lazy } from 'react';
const routers = [
    {
        path: '/',
        component: lazy(() => import('@/pages/Home/HomePage'))
    },
    {
        path: '*',
        component: lazy(() => import('@/pages/NotFoundPage/NotFoundPage'))
    },
    {
        path:"/shop",
        component:lazy(()=>import("@/pages/Shop/Shop"))
    }
];

export default routers;
