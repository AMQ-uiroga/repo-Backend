const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, generateUniqueId } = require('../fileManager'   );

const CARTS_FILE = 'carts.json';
const PRODUCTS_FILE = 'products.json';

router.post('/', async (req, res) => {
  try {
    const carts = await readJSON(CARTS_FILE);
    const id = generateUniqueId(carts);
    const newCart = { id, products: [] };
    carts.push(newCart);
    await writeJSON(CARTS_FILE, carts);
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: 'Error creando carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const carts = await readJSON(CARTS_FILE);
    const cart = carts.find(c => String(c.id) === String(cid));
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
  } catch (err) {
    res.status(500).json({ error: 'Error leyendo carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const carts = await readJSON(CARTS_FILE);
    const cartIdx = carts.findIndex(c => String(c.id) === String(cid));
    if (cartIdx === -1) return res.status(404).json({ error: 'Carrito no encontrado' });

    const products = await readJSON(PRODUCTS_FILE);
    const productExists = products.find(p => String(p.id) === String(pid));
    if (!productExists) return res.status(404).json({ error: 'Producto no encontrado' });

    const cart = carts[cartIdx];
    const prodIdx = cart.products.findIndex(p => String(p.product) === String(pid));
    if (prodIdx === -1) {
      cart.products.push({ product: String(pid), quantity: 1 });
    } else {
      cart.products[prodIdx].quantity = Number(cart.products[prodIdx].quantity) + 1;
    }

    carts[cartIdx] = cart;
    await writeJSON(CARTS_FILE, carts);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error agregando producto al carrito' });
  }
});

module.exports = router;
