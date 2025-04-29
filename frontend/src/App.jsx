import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ThemeProvider } from './contexts/ThemeContext';
import useComponentLogger from './hooks/useComponentLogger';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
import Products from './pages/Products';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useComponentLogger('App');
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider>
      <MantineProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/products"
                    element={
                      <ProtectedRoute>
                        <Products />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </MantineProvider>
    </ThemeProvider>
  );
}

export default App;
