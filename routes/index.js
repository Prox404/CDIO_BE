const productsRoutes = require('./product');
const cartRoutes = require('./cart');
const authRoutes = require('./auth');
const orderRoutes = require('./order');
const userRoutes = require('./user');

function route(app) {
    app.use('/products', productsRoutes);
    app.use('/cart', cartRoutes);
    app.use('/auth', authRoutes);
    app.use('/order', orderRoutes);
    app.use('/users', userRoutes);
}

module.exports = route