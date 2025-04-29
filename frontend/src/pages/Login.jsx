import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import useComponentLogger from '../hooks/useComponentLogger';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  useComponentLogger('Login');
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const success = await login(email, password);
    if (success) {
      navigate('/products');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Paper
        shadow="md"
        p="xl"
        className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-200'}`}
      >
        <Title order={2} className="text-center mb-6">
          Login to Your Account
        </Title>

        {error && (
          <Text color="red" className="mb-4 text-center">
            {error}
          </Text>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            required
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            classNames={{
              input:
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-black border-gray-300',
              label: theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
            }}
          />

          <PasswordInput
            required
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            classNames={{
              input:
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white text-black border-gray-300',
              label: theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
            }}
          />

          <Button type="submit" fullWidth loading={isLoading}>
            Login
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
