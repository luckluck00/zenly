const publicRoutes = require('./PublicRoutes');
const routes = (app) => {
  app.use('/public', publicRoutes);
  app.use((req, res, next) => {
    res.status(404).json({message: 'Not Found!'});
  });
};
module.exports = routes;