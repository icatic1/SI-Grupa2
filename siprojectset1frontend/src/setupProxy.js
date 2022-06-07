const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/api/User",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7005',
        secure: false
    });

    app.use(appProxy);
};
