import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from '../pages/Auth/Auth';
import Recovery from '../pages/Recovery/Recovery';
import Dashboard from '../pages/Dashboard/Dashboard';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial: Login/Cadastro */}
        <Route path="/" element={<Auth />} />

        {/* Rota de Recuperação de Senha */}
        <Route path="/recuperar-senha" element={<Recovery />} />

        {/* Rota da Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rota de segurança: se o usuário digitar qualquer coisa errada, volta pro login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}