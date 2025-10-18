import { useState } from 'react';
import type { FormEvent } from 'react';

interface LoginFormProps {
    onLogin: (email: string, password: string) => void;
    loading: boolean;
    error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Login</h2>

                <label style={styles.label}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />

                <label style={styles.label}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />

                {error && <p style={styles.error}>{error}</p>}

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Logging in..." : "Login"}
                </button>            
            </form>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", backgroundColor: "#f5f5f5" },
    form: { display: "flex", flexDirection: "column", width: "400px", border: "1px solid #ccc", padding: "30px", borderRadius: "8px" },
    label: { marginBottom: "5px", marginTop: "10px" },
    input: { padding: "8px", marginBottom: "10px" },
    button: { padding: "10px", backgroundColor: "darkgray", color: "#fff", border: "none", cursor: "pointer" },  
    error: { color: "red", marginBottom: "10px" }
};


export default LoginForm;
