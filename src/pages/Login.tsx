import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { login } from '../services/authService';

const Login = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        const response = await login(email, password);

        setLoading(false);

        if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            alert('Login successful!');
            window.location.href = '/dashboard'; // Redirect to dashboard
        } else {
            setError(response.message || 'Login failed. Please try again.');
        }
    };

    return <LoginForm onLogin={handleLogin} loading={loading} error={error} />;
};

export default Login;
