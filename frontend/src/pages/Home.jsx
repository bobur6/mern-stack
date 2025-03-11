import { Title, Text, Button, Container } from '@mantine/core';
import { Link } from 'react-router-dom';
import useComponentLogger from '../hooks/useComponentLogger';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  useComponentLogger('Home');
  const { isAuthenticated } = useAuth();

  return (
    <Container size="md" className="text-center py-16">
      <Title order={1} className="mb-6">
        Welcome to MERN Stack App
      </Title>

      <Text size="lg" className="mb-8">
        This is a full-stack application built with MongoDB, Express, React, and Node.js. It
        features authentication, theme switching, and component logging.
      </Text>

      {!isAuthenticated && (
        <div className="space-x-4">
          <Link to="/login">
            <Button variant="filled" size="lg">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg">
              Register
            </Button>
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <Link to="/products">
          <Button variant="filled" size="lg">
            View Products
          </Button>
        </Link>
      )}
    </Container>
  );
};

export default Home;
