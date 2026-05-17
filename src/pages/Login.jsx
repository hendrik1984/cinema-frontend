import { useState } from "react";
import { apiFetch } from "../api/client";
import { setToken } from "../utils/auth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await apiFetch("/users/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            // ⚠️ depends on your backend response
            const token = res.data?.access_token || res.access_token;

            setToken(token);

            window.location.href = "/movies"; // redirect
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
            
        </div>
    );
}

export default Login;