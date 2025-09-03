const services = {
  trackingService: new (require('../services/tracking-service'))(),
  imageService: new (require('../services/image-service'))(),
  priceManagementService: new (require('../services/price-management-service'))(),
  discountManagementService: new (require('../services/discount-management-service'))(),
  commissionManagementService: new (require('../services/commission-management-service'))(),
  productManagementService: new (require('../services/product-management-service'))(),
  localeSeoService: new (require('../services/locale-seo-service'))(),
  pageService: new (require('../services/page-service'))(),
  componentService: new (require('../services/component-service'))(),
  authorizationService: new (require('../services/authorization-service'))()
}

function createServiceMiddleware (serviceName) {
  return (req, res, next) => {
    req[serviceName] = services[serviceName]
    next()
  }
}

module.exports = Object.keys(services).reduce((middlewares, serviceName) => {
  middlewares[`${serviceName}Middleware`] = createServiceMiddleware(serviceName)
  return middlewares
}, {})
