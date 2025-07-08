import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Login from './pages/Login';
import Admin from './pages/Admin';
import RequireAuth from './components/RequireAuth';
import LandingAnimated from './pages/LandingAnimated';
import Documents from './pages/Documents';
import Organization from './pages/Organization';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Importers from './pages/Importers';
import PedimentoDetail from './pages/PedimentoDetail';

// Componente para manejar el layout condicional
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/';
  
  console.log('🚀 AppContent renderizado');
  console.log('📍 Ubicación actual:', location.pathname);
  console.log('🔐 Es página de auth:', isAuthPage);
  console.log('🎫 Token en localStorage:', !!localStorage.getItem('access'));

  if (isAuthPage) {
    return (
      <>
        <Routes>
          <Route path="/" element={<LandingAnimated />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/admin" element={
          <RequireAuth>
            <Admin />
          </RequireAuth>
        } />
        <Route path="/documents" element={
          <RequireAuth>
            <Documents />
          </RequireAuth>
        } />
        <Route path="/documents/pedimento/:id" element={
          <RequireAuth>
            <PedimentoDetail />
          </RequireAuth>
        } />
        <Route path="/organization" element={
          <RequireAuth>
            <Organization />
          </RequireAuth>
        } />
        <Route path="/users" element={
          <RequireAuth>
            <Users />
          </RequireAuth>
        } />
        <Route path="/reports" element={
          <RequireAuth>
            <Reports />
          </RequireAuth>
        } />
        <Route path="/settings" element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        } />
        {/* Ruta para importadores */}
        <Route path="/importers" element={
          <RequireAuth>
            <Importers />
          </RequireAuth>
        } />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;