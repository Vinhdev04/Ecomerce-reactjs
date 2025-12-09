import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'normalize.css';
import '@styles/app.module.scss';
import { initVisibilityHandler } from '@utils/changeFavicon';
import Layout from '@/components/Layout/Layout';

initVisibilityHandler();
function App() {
    return (
        <>
            <Layout />
        </>
    );
}

export default App;
