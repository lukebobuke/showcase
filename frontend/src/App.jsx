/** @format */

import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
	const [status, setStatus] = useState("Loading...");
	const [error, setError] = useState(null);

	useEffect(() => {
		const checkBackend = async () => {
			try {
				const response = await axios.get("http://localhost:5000/api/health");
				setStatus(`Backend Connected: ${JSON.stringify(response.data)}`);
				setError(null);
			} catch (err) {
				setError(`Error: ${err.message}`);
				setStatus("Backend Connection Failed");
			}
		};

		checkBackend();
	}, []);

	return (
		<div className="app">
			<h1>Frontend Working</h1>
			<div>
				<h2>Backend Status:</h2>
				<p>{status}</p>
				{error && <p style={{ color: "red" }}>{error}</p>}
			</div>
		</div>
	);
}

export default App;
