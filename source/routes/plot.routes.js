const express = require('express')
const authMiddleware = require('../middleware/auth.middleware.js')
const plotController = require('../controllers/plot.controller.js')

const router = express.Router()

router.post('/createPlot/:_idProject', authMiddleware.authenticateAdmin, plotController.createPlot)
router.patch('/updatePlot/:_idProject/:_idPlot', authMiddleware.authenticateAdmin, plotController.updatePlot)
router.get('/search', authMiddleware.authenticate, plotController.search)
router.get('/getPlots/:_idProject', authMiddleware.authenticate, plotController.getPlots)
router.get('/getPlot/:_idProject/:_idPlot', authMiddleware.authenticate, plotController.getPlotById)
router.get('/getPlots/:_idProject/priceRange', authMiddleware.authenticate, plotController.getPlotsByPriceRange)
router.get('/getPlots/:_idProject/areaRange', authMiddleware.authenticate, plotController.getPlotsByAreaRange)
router.get('/getPlots/:_idProject/:status', authMiddleware.authenticate, plotController.getPlotsByStatus)
router.delete('/deletePlot/:_idProject/:_idPlot', authMiddleware.authenticateAdmin, plotController.deletePlot)

module.exports = router