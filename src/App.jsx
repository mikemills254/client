import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Home from './Pages/Home';
import Inbox from './Pages/Inbox';
import Urgent from './Pages/Urgent';
import ForgotPass from './Pages/ForgotPass';

export default function App() {
    const { isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            const currentPath = window.location.pathname;
            if (
                !['/dashboard', '/your_inbox', '/urgent_messages'].includes(currentPath)
            ) {
                navigate('/dashboard', { replace: true });
            }
        } else {
            const currentPath = window.location.pathname;
            if (
                !['/signin', '/signup', '/forgotpass'].includes(currentPath)
            ) {
                navigate('/signin', { replace: true });
            }
        }
    }, [isAuthenticated, navigate]);
    
    
    return (
        <Routes>
            {isAuthenticated ? (
                <>
                    <Route path="/dashboard" element={<Home />} />
                    <Route path="/your_inbox" element={<Inbox />} />
                    <Route path="/urgent_messages" element={<Urgent />} />
                    <Route path='/' element={<Navigate to={'/dashboard'} />} />
                </>
            ) : (
                <>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgotpass" element={<ForgotPass />} />
                    <Route path='*' element={<Navigate to={'/signin'} />} />
                </>
            )}
        </Routes>
    );
}
