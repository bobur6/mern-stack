import { Link } from 'react-router-dom';
import { Button, Switch, Avatar } from '@mantine/core';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import useComponentLogger from '../hooks/useComponentLogger';
import logger from '../utils/logger';

const Navbar = () => {
  useComponentLogger('Navbar');
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLoggingToggle = () => {
    if (logger.isEnabled()) {
      logger.disable();
    } else {
      logger.enable();
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              MERN App
            </Link>
            {isAuthenticated && (
              <Link to="/products" className="text-gray-600 dark:text-gray-300">
                Products
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Switch label="Logging" checked={logger.isEnabled()} onChange={handleLoggingToggle} />

            <Switch label="Theme" checked={theme === 'dark'} onChange={toggleTheme} />

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:underline">
                  <Avatar color="blue" radius="xl" size="sm">
                    {user?.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <span>{user?.username}</span>
                </Link>
                <Button onClick={logout} color="red">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
