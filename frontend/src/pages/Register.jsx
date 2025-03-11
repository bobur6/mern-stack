import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Text } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';
import useComponentLogger from '../hooks/useComponentLogger';
import { useTheme } from '../contexts/ThemeContext';

const Register = () => {
  useComponentLogger('Register');
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const success = await register(username, email, password);
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
        className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
      >
        <Title order={2} className="text-center mb-6">
          Create an Account
        </Title>

        {error && (
          <Text color="red" className="mb-4 text-center">
            {error}
          </Text>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            required
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            classNames={{
              input: theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : '',
              label: theme === 'dark' ? 'text-gray-200' : '',
            }}
          />

          <TextInput
            required
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            classNames={{
              input: theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : '',
              label: theme === 'dark' ? 'text-gray-200' : '',
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
              input: theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : '',
              label: theme === 'dark' ? 'text-gray-200' : '',
            }}
          />

          <PasswordInput
            required
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            classNames={{
              input: theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : '',
              label: theme === 'dark' ? 'text-gray-200' : '',
            }}
          />

          <Button type="submit" fullWidth loading={isLoading}>
            Register
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Register;
