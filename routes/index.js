const productsRoutes = require('./product');

function route(app) {
    app.use('/products', productsRoutes);
}

module.exports = route