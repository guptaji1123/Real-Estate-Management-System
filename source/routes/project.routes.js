const express = require('express')
const authMiddleware = require('../middleware/auth.middleware.js')
const projectController = require('../controllers/project.controller.js')

const router = express.Router()

router.post('/createProject', authMiddleware.authenticateAdmin, projectController.createProject)
router.patch('/updateProject/:_idProject', authMiddleware.authenticateAdmin, projectController.updateProject)
router.get('/search', authMiddleware.authenticate, projectController.search)
router.get('/getProjects', authMiddleware.authenticate, projectController.getProjects)
router.get('/getProject/:_idProject', authMiddleware.authenticate, projectController.getProjectById)
router.get('/getProjects/:status', authMiddleware.authenticate, projectController.getProjectsByStatus)
router.delete('/deleteProject/:_idProject', authMiddleware.authenticateAdmin, projectController.deleteProject)

module.exports = router