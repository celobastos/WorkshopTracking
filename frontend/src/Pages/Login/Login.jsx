import React, { useState } from "react";
import api from "../../Services/api";
import { useNavigate } from "react-router-dom";
import fotoMulherAsset from "../../Assets/fotoMulherOrganização.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showTooltip, setShowTooltip] = useState(false); 
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
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 relative">
      {showTooltip && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm py-2 px-4 rounded shadow-lg animate-fade">
          Login falhou! Verifique suas credenciais.
        </div>
      )}

      <div className="flex w-full max-w-5xl items-center gap-x-4">
        {/* Left Section: Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={fotoMulherAsset}
            alt="Organizational woman"
            className="object-contain"
          />
        </div>
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Olá, bem-vindo ao Schedule.Up
          </h1>
          <p className="text-gray-600 text-center pt-4 mb-6">
            Digite seus dados de acesso para continuar.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <input
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-4">
            Não tem uma conta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Cadastre-se!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
