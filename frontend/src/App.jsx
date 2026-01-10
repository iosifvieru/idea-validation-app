import './App.css';
import { useEffect, useState } from 'react';
import { supabase } from './auth/supabaseClient';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser(data.user ?? null);
			setLoading(false);
		});

		// 2) Listen to login/logout changes
		const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => sub.subscription.unsubscribe();
	}, []);

	if(loading) return <div> Loading...</div>

	return (
		<Routes>
			<Route
				path="/login"
        		element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}			
			/>
			
		    <Route
				path="/register"
				element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
			/>

			<Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
		</Routes>
	)
}

export default App
