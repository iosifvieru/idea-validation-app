import { useState } from "react";
import { login } from "../auth/auth"
import './AuthCss.css'

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [busy, setBusy] = useState(false)

    async function onSubmit(e) {
        e.preventDefault();
        setBusy(true);

        try {
            const {data, error} = await login(email, password);
            if (error) throw error;
    
            console.log(data);
            setStatus("Login successfully.")
        } catch (err){
            const message = err?.message || "Something went wrong.";

            setStatus(message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <>
        <form className="form-auth" onSubmit={onSubmit}>
            <input
                className="form-auth-input"
                placeholder="Enter email.."
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <input
                className="form-auth-input"
                placeholder="Enter password.."
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button
                className="form-auth-button"
                disabled={busy}
            >Login</button>
        </form>
        {status && <p>{status}</p>}
        </>
    )
}