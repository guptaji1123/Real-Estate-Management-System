const projectModel = require('../models/project.model.js')

async function createProject(request, response) {
    try {
        const { name, description, location, status } = request.body
        if (!name) {
            return response.status(400).json({ message: `Project name is required` })
        }
        if (!location) {
            return response.status(400).json({ message: `Location is required` })
        }
        if (name.length < 3 || name.length > 100) {
            return response.status(400).json({ message: `Project name must be between 3 and 100 characters` })
        }
        if (description && description.length > 1000) {
            return response.status(400).json({ message: `Description cannot exceed 1000 words` })
        }
        if (location.length > 200) {
            return response.status(400).json({ message: `Location cannot exceed 200 words` })
        }
        if (status && !['PLANNING', 'ONGOING', 'COMPLETED', 'ON_HOLD'].includes(status)) {
            return response.status(400).json({ message: `Status must be either PLANNING, ONGOING, COMPLETED or ON_HOLD` })
        }
        const isExists = await projectModel.findOne({ name: name })
        if (isExists) {
            return response.status(422).json({ message: `Project name already exists` })
        }
        const project = await projectModel.create({ name: name, description: description, location: location, status: status })
        return response.status(200).json({ project: project })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function updateProject(request, response) {
    try {
        const { name, description, location, status } = request.body
        const project = await projectModel.findById(request.params._idProject)
        if (!project) {
            return response.status(404).json({ message: `Project not found` })
        }
        if (name !== undefined) {
            if (!name) {
                return response.status(400).json({ message: `Project name is required` })
            }
            if (name.length < 3 || name.length > 100) {
                return response.status(400).json({ message: `Project name must be between 3 and 100 characters` })
            }
            const isExists = await projectModel.findOne({ name: name, _id: { $ne: project._id } })
            if (isExists) {
                return response.status(422).json({ message: `Project name already exists` })
            }
            project.name = name
        }
        if (description !== undefined) {
            if (description.length > 1000) {
                return response.status(400).json({ message: `Description cannot exceed 1000 words` })
            }
            project.description = description
        }
        if (location !== undefined) {
            if (!location) {
                return response.status(400).json({ message: `Location is required` })
            }
            if (location.length > 200) {
                return response.status(400).json({ message: `Location cannot exceed 200 words` })
            }
            project.location = location
        }
        if (status !== undefined) {
            const allowedStatus = ['PLANNING', 'ONGOING', 'COMPLETED', 'ON_HOLD']
            if (!allowedStatus.includes(status)) {
                return response.status(400).json({ message: `Status must be either PLANNING, ONGOING, COMPLETED or ON_HOLD` })
            }
            project.status = status
        }
        await project.save()
        return response.status(200).json({ message: `Project updated successfully`, project: project })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function search(request, response) {
    try {
        const keyword = request.query.keyword
        if (!keyword || !keyword.trim()) {
            return response.status(400).json({ message: `Keyword is required` })
        }
        const projects = await projectModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { location: { $regex: keyword, $options: 'i' } }
            ]
        })
        if (projects.length === 0) {
            return response.status(404).json({ message: `Projects not found` })
        }
        return response.status(200).json({ projects: projects })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function getProjects(request, response) {
    try {
        const projects = await projectModel.find()
        if (projects.length === 0) {
            return response.status(404).json({ message: `Projects not found` })
        }
        return response.status(200).json({ projects: projects })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function getProjectById(request, response) {
    try {
        const project = await projectModel.findById(request.params._idProject)
        if (!project) {
            return response.status(404).json({ message: `Project not found` })
        }
        return response.status(200).json({ project: project })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function getProjectsByStatus(request, response) {
    try {
        const projects = await projectModel.find({ status: request.params.status })
        if (projects.length === 0) {
            return response.status(404).json({ message: `Projects not found` })
        }
        return response.status(200).json({ projects: projects })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function deleteProject(request, response) {
    try {
        const project = await projectModel.findByIdAndDelete(request.params._idProject)
        if (!project) {
            return response.status(404).json({ message: `Project not found` })
        }
        return response.status(200).json({ message: `Project Delected Successfully` })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

module.exports = { createProject, updateProject, search, getProjects, getProjectById, getProjectsByStatus, deleteProject }