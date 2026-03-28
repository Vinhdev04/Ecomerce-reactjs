
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
        path: '/cart',
        component: lazy(() => import('@/pages/Cart/CartPage'))
    },
    {
        path: '/admin',
        component: lazy(() => import('@/pages/Admin/AdminPage'))
    },
    {
        path: '/admin/analytics',
        component: lazy(() => import('@/pages/Admin/AdminPage'))
    },
    {
        path: '/admin/history',
        component: lazy(() => import('@/pages/Admin/AdminPage'))
    },
    {
        path: '/admin/users',
        component: lazy(() => import('@/pages/Admin/AdminPage'))
    },
    {
        path: '/admin/products',
        component: lazy(() => import('@/pages/Admin/AdminPage'))
    },
    {
        path: '/admin/payments',
        component: lazy(() => import('@/pages/Admin/AdminPage'))
    },
    {
        path: '/admin/news',
        component: lazy(() => import('@/pages/Admin/AdminPage'))
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
    },
    {
        path: '/news/:id',
        component: lazy(() => import('@/components/News/NewsDetail'))
    },
    {
        path: '/products/:id',
        component: lazy(() => import('@/pages/ProductDetail/ProductDetailPage'))
    },
    {
        path: '/profile',
        component: lazy(() => import('@/pages/Profile/ProfilePage'))
    }
];

export default routers;
