import React, { useState } from "react";
import api from "../../Services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("/account/login", { username, PasswordHash: password }) 
      .then((res) => {
        console.log("Response:", res.data); 
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Error:", err.response); 
        alert("Login failed!");
      });
  };
  
  

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow">
        <h1 className="text-2xl mb-4">Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
