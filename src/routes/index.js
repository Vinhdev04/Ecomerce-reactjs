import Home from '@/pages/Home/HomePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';
import { lazy } from 'react';
const routers = [
    {
        path: '/',
        component: lazy(() => import('@/pages/Home/HomePage'))
    },
    {
        path: '*',
        component: lazy(() => import('@/pages/NotFoundPage/NotFoundPage'))
    }
];

export default routers;
