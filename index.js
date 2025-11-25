const express = require('express'); 
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

const app = express();
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
    res.send('API Inicial.!');
});

const PORT = process.env.PORT || 8080   ;

app.listen(PORT, () => {
    console.log(`Server is running and listening  on port ${PORT}`);
});