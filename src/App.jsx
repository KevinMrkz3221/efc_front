import Documents from './pages/Documents';
import Vucem from './pages/Vucem';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Login from './pages/Login';
import Admin from './pages/Admin';
import RequireAuth from './components/RequireAuth';
import LandingAnimated from './pages/LandingAnimated';
import Expedientes from './pages/Expedientes';
import Organization from './pages/Organization';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Importers from './pages/Importers';
import PedimentoDetail from './pages/PedimentoDetail';
import Procesos from './pages/Procesos';
import TableroAlmacenamiento from './pages/TableroAlmacenamiento';
import Notificaciones from './pages/Notificaciones';
import ForgotPassword from './pages/ForgotPassword';
import PasswordResetConfirm from './pages/PasswordResetConfirm';

// Componente para manejar el layout condicional
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/' || location.pathname === '/forgot-password' || location.pathname.startsWith('/user/password-reset-confirm/');
  
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user/password-reset-confirm/:uid/:token/" element={<PasswordResetConfirm />} />
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
        <Route path="/expedientes" element={
          <RequireAuth>
            <Expedientes />
          </RequireAuth>
        } />
        <Route path="/documents" element={
          <RequireAuth>
            <Documents />
          </RequireAuth>
        } />
        
        <Route path="/expedientes/pedimento/:id" element={
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
        <Route path="/notificaciones" element={<Notificaciones />} />
        {/* Ruta para importadores */}
        <Route path="/importers" element={
          <RequireAuth>
            <Importers />
          </RequireAuth>
        } />
        {/* Ruta para procesos */}
        <Route path="/procesos" element={
          <RequireAuth>
            <Procesos />
          </RequireAuth>
        } />
        {/* Ruta para Uso de Almacenamiento */}
        <Route path="/tablero/almacenamiento" element={
          <RequireAuth>
            <TableroAlmacenamiento />
          </RequireAuth>
        } />
        {/* Ruta para Vucem */}
        <Route path="/vucem" element={
          <RequireAuth>
            <Vucem />
          </RequireAuth>
        } />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;