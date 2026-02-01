import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css';
import '@styles/app.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routers from '@routes/index';
import { initVisibilityHandler } from '@utils/changeFavicon';
import { Suspense } from 'react';
import { SideBarProvider } from '@contexts/SideBarProvider.jsx';
import Sidebar from '@components/Sidebar/Sidebar.jsx';
import { ToastProvider } from '@contexts/ToastProvider.jsx';
import Loading from '@components/Loading/Loading.jsx';
import UserInfoProvider from "@contexts/UserInfoProvider.jsx";

function App() {
    return (
        <UserInfoProvider>
            <ToastProvider>
                <SideBarProvider>
                    <Sidebar/>
                    <BrowserRouter>
                        <Suspense fallback={<Loading/>}>
                            <Routes>
                                {routers?.map((item, idx) => (
                                    <Route
                                        key={idx}
                                        path={item.path}
                                        element={<item.component />}
                                    />
                                ))}
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </SideBarProvider>
            </ToastProvider>
        </UserInfoProvider>
    );
}

export default App;
initVisibilityHandler();