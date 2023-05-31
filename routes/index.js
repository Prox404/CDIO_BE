const productsRoutes = require('./product');
const cartRoutes = require('./cart');
const authRoutes = require('./auth');
const orderRoutes = require('./order');

function route(app) {
    app.use('/products', productsRoutes);
    app.use('/cart', cartRoutes);
    app.use('/auth', authRoutes);
    app.use('/order', orderRoutes);
}

module.exports = route