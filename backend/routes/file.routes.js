import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем один файл
router.get('/read-file', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'sample.txt'), 'utf8');
    res.json({ content: data });
  } catch (error) {
    res.status(500).json({
      message: 'Error reading file',
      error: error.message,
    });
  }
});

// Читаем несколько файлов одновременно
router.get('/multiple-files', async (req, res) => {
  try {
    const filenames = ['sample1.txt', 'sample2.txt', 'sample3.txt'];
    const filePromises = filenames.map((file) => fs.readFile(path.join(__dirname, file), 'utf8'));
    const results = await Promise.all(filePromises);

    res.json({
      files: results.map((content, index) => ({
        filename: filenames[index],
        content,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error reading files',
      error: error.message,
    });
  }
});

export default router;
