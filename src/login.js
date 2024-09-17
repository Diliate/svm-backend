import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send GraphQL login mutation to the backend
      const response = await axios.post("http://localhost:8000/graphql", {
        query: `
          mutation {
            login(email: "${email}", password: "${password}") {
              token
              user {
                id
                email
              }
            }
          }
        `
      });

      // Extract the JWT token from the response
      const { data } = response.data;
      if (data && data.login && data.login.token) {
        setToken(data.login.token);
        setError(null);
        console.log("Login successful. Token:", data.login.token);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      {token && <p>JWT Token: {token}</p>}
    </div>
  );
};

export default Login;
