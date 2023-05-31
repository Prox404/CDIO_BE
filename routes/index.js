const productsRoutes = require('./product');
const cartRoutes = require('./cart');
const authRoutes = require('./auth');

function route(app) {
    app.use('/products', productsRoutes);
    app.use('/cart', cartRoutes);
    app.use('/auth', authRoutes);
}

module.exports = route