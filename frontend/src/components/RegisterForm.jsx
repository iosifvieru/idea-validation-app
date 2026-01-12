import { useState } from "react";
import { register } from "../auth/auth"
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
            const {data, error} = await register(email, password);
            if (error) throw error;
    
            console.log(data);
            setStatus("Registered sucessfully!");
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
                placeholder="Enter password.."
                className="form-auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button
                className="form-auth-button"
                disabled={busy}
            >Register</button>
        </form>
        {status && <p>{status}</p>}
        </>
    )
}