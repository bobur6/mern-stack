import { useState, useEffect, useMemo } from 'react';
import { Card, Text, Button, Grid, TextInput, NumberInput } from '@mantine/core';
import axios from 'axios';
import useComponentLogger from '../hooks/useComponentLogger';
import { useTheme } from '../contexts/ThemeContext';

const API_URL = import.meta.env.VITE_API_URL;

const Products = () => {
  useComponentLogger('Products');
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, description: '' });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [stats, setStats] = useState({ avgPrice: 0, total: 0 });

  useEffect(() => {
    axios.get(`${API_URL}/api/products/stats`).then((res) => setStats(res.data));
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data.data || []);
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
      setShowForm(false);
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

  // useMemo для фильтрации товаров
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) => p.name.toLowerCase().includes(search.toLowerCase()) && p.price >= minPrice
    );
  }, [products, search, minPrice]);

  // useMemo для средней цены
  const averagePrice = useMemo(() => {
    if (filteredProducts.length === 0) return 0;
    return filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length;
  }, [filteredProducts]);

  return (
    <div className="space-y-8">
      <div
        className={`p-6 rounded-lg shadow ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-200'}`}
      >
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        {showForm ? (
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
            <div className="flex gap-2">
              <Button type="submit">Add Product</Button>
              <Button
                variant="outline"
                color="gray"
                onClick={() => setShowForm(false)}
                type="button"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button onClick={() => setShowForm(true)}>Add Product</Button>
        )}
      </div>

      {/* Агрегированные статистики */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
        <Text className="font-semibold">
          Total products: {stats.total} | Average price (MongoDB): ${stats.avgPrice?.toFixed(2)}
        </Text>
      </div>

      {/* Фильтр и поиск */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <TextInput
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
          classNames={inputStyles}
        />
        <NumberInput
          placeholder="Min price"
          value={minPrice}
          onChange={setMinPrice}
          min={0}
          className="w-full sm:w-40"
          classNames={inputStyles}
        />
        <Text className="ml-auto font-semibold">
          Average price (filtered):{' '}
          {filteredProducts.length > 0 ? `$${averagePrice.toFixed(2)}` : '-'}
        </Text>
      </div>

      <Grid>
        {filteredProducts.map((product) => (
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
