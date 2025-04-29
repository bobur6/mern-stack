import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Paper, Title, Text, Button, TextInput, Group, Loader, Avatar } from '@mantine/core';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';

const Profile = () => {
  const { theme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchProfile();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/auth/profile');
      const data = res.data;
      setProfile(data);
      setFormData({ username: data.username, email: data.email });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.put('/api/auth/profile', formData);
      await fetchProfile();
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Paper
        shadow="md"
        p="xl"
        className={`w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
      >
        <Group position="center" mb="md">
          <Avatar color="blue" radius="xl" size="lg">
            {profile?.username?.[0]?.toUpperCase()}
          </Avatar>
        </Group>
        <Title order={2} className="text-center mb-4">
          Profile
        </Title>
        {error && (
          <Text color="red" className="mb-4 text-center">
            {error}
          </Text>
        )}
        {!editMode ? (
          <>
            <Text size="lg" className="mb-2">
              <b>Username:</b> {profile?.username}
            </Text>
            <Text size="lg" className="mb-2">
              <b>Email:</b> {profile?.email}
            </Text>
            <Group position="apart" mt="md">
              <Button onClick={() => setEditMode(true)} fullWidth>
                Edit
              </Button>
              <Button onClick={logout} color="red" fullWidth>
                Logout
              </Button>
            </Group>
          </>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <TextInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              classNames={{
                input:
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-black border-gray-300',
                label: theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
              }}
            />
            <TextInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              classNames={{
                input:
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-black border-gray-300',
                label: theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
              }}
            />
            <Group position="apart" mt="md">
              <Button type="submit" loading={loading} fullWidth>
                Save
              </Button>
              <Button type="button" onClick={() => setEditMode(false)} color="gray" fullWidth>
                Cancel
              </Button>
            </Group>
          </form>
        )}
      </Paper>
    </div>
  );
};

export default Profile;
