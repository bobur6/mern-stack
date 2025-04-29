import { useState, useEffect } from 'react';
import { Card, Text, Button, Grid, TextInput, NumberInput } from '@mantine/core';
import axios from 'axios';
import useComponentLogger from '../hooks/useComponentLogger';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  useComponentLogger('Products');
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/products`, newProduct);
      setNewProduct({ name: '', price: 0, description: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const inputStyles = {
    input:
      theme === 'dark'
        ? 'bg-gray-700 text-white border-gray-600'
        : 'bg-white text-black border-gray-300',
    label: theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
  };

  return (
    <div className="space-y-8">
      <div
        className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-200'}`}
      >
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            required
            label="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            classNames={inputStyles}
          />
          <NumberInput
            required
            label="Price"
            value={newProduct.price}
            onChange={(value) => setNewProduct({ ...newProduct, price: value })}
            min={0}
            classNames={inputStyles}
          />
          <TextInput
            required
            label="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            classNames={inputStyles}
          />
          <Button type="submit">Add Product</Button>
        </form>
      </div>

      <Grid>
        {products.map((product) => (
          <Grid.Col key={product._id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card
              shadow="sm"
              padding="lg"
              className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
            >
              <Text weight={500} size="lg" mb="md" className={theme === 'dark' ? 'text-white' : ''}>
                {product.name}
              </Text>
              <Text
                size="sm"
                className={`mb-md ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {product.description}
              </Text>
              <Text weight={700} size="xl" mb="md" className={theme === 'dark' ? 'text-white' : ''}>
                ${product.price}
              </Text>
              <Button color="red" onClick={() => handleDelete(product._id)} fullWidth>
                Delete
              </Button>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};

export default Products;
