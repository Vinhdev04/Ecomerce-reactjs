import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css';
import '@styles/app.module.scss';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routers from '@routes/index';
import { initVisibilityHandler } from '@utils/changeFavicon';
import { Suspense } from 'react';
import { SideBarProvider } from '@contexts/SideBarProvider.jsx';
import Sidebar from '@components/SideBar/SideBar.jsx';



function App() {
    return (
        <SideBarProvider>
            <Sidebar/>
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
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
    );
}

export default App;
initVisibilityHandler();