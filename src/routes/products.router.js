const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, generateUniqueId } = require('../fileManager');


const PRODUCTS_FILE = 'products.json';

router.get('/', async (req, res) => {
  try {
    const products = await readJSON(PRODUCTS_FILE);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error leyendo productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await readJSON(PRODUCTS_FILE);
    const product = products.find(p => String(p.id) === String(pid));
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error leyendo producto' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || price == null || status == null || stock == null || !category) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const products = await readJSON(PRODUCTS_FILE);
    const id = generateUniqueId(products);
    const newProduct = { id, title, description, code, price, status, stock, category, thumbnails: Array.isArray(thumbnails) ? thumbnails : [] };
    products.push(newProduct);
    await writeJSON(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error creando producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = { ...req.body };
    delete updates.id;
    const products = await readJSON(PRODUCTS_FILE);
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    products[idx] = { ...products[idx], ...updates };
    await writeJSON(PRODUCTS_FILE, products);
    res.json(products[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const products = await readJSON(PRODUCTS_FILE);
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
    const removed = products.splice(idx, 1)[0];
    await writeJSON(PRODUCTS_FILE, products);
    res.json({ message: 'Producto eliminado', product: removed });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando producto' });
  }
});

module.exports = router;
