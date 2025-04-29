import express from 'express';

const router = express.Router();

// Уникальный ответ для каждого backend-контейнера
router.get('/ping', (req, res) => {
  // Используем переменную окружения для идентификации контейнера
  const backendId = process.env.BACKEND_ID || 'unknown';
  res.json({ message: `Hello from backend ${backendId}` });
});

export default router;
