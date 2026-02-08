
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
    },
   
    {
        path: '/contact',
        component: lazy(() => import('@/components/Contact/ContactPage'))
    },
    {
        path: '/about',
        component: lazy(() => import('@/components/About/About'))
    },
    {
        path: '/privacy-policy',
        component: lazy(() => import('@/components/PrivacyPolicy/PrivacyPolicy'))
    },
    {
        path: '/terms-of-service',
        component: lazy(() => import('@/components/TermsOfService/TermsOfService'))
    },
    {
        path: '/news',
        component: lazy(() => import('@/components/News/News'))
    }
];

export default routers;
