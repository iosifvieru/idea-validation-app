import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Register</h2>
      <RegisterForm />
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
