import React, { useState } from "react";
import './ABC.css'; // Import the CSS file
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [author, setAuthor] = useState("HOD");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setError(""); // Clear any previous errors

        // Submit data to the server or handle login logic
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Author:", author);

        if (email === "test@test.com" && password === "password") {
            console.log("Login successful");

            // Redirect to Form.jsx after successful login, passing the author in state
            navigate("/form", { state: { author } });
        } else {
            setError("Invalid credentials");
        }
        // Add your login logic here
    };




    return (
        <div classname="loginform">
            <div className="logincontainer">
                <h2>Login Page</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="classlabel">Email:</label>
                        <input
                            className="logininput"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            className="logininput"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Author:</label>
                        <select
                            className="logininput"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        >
                            <option value="HOD">HOD</option>
                            <option value="Department">Department</option>
                            <option value="Event Organizer">Event Organizer</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button className="loginbtn" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
