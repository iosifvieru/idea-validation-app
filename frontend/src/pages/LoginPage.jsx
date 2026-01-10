import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Login</h2>
      <LoginForm />
      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
