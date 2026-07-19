const plotModel = require('../models/plot.model.js')

async function createPlot(request, response) {
    try {
        const { _idProject } = request.params
        const { plotNumber, description, area, unit, status, price } = request.body
        if (!_idProject) {
            return response.status(400).json({ message: `Project Id is required` })
        }
        if (!plotNumber) {
            return response.status(400).json({ message: `Plot number is required` })
        }
        if (!area) {
            return response.status(400).json({ message: `Area is required` })
        }
        if (!price) {
            return response.status(400).json({ message: `Price is required` })
        }
        if (plotNumber.length < 1 || plotNumber.length > 20) {
            return response.status(400).json({ message: `Plot number must be between 1 and 20 characters` })
        }
        if (description && description.length > 1000) {
            return response.status(400).json({ message: `Description cannot exceed 1000 words` })
        }
        if (area < 0) {
            return response.status(400).json({ message: `Area cannot be negative` })
        }
        if (unit && !['SQFT', 'SQM', 'BIGHA', 'ACRE'].includes(unit)) {
            return response.status(400).json({ message: `Unit must be either SQFT, SQM, BIGHA or ACRE` })
        }
        if (status && !['AVAILABLE', 'BOOKED', 'SOLD'].includes(status)) {
            return response.status(400).json({ message: `Status must be either AVAILABLE, BOOKED, SOLD` })
        }
        if (price < 0) {
            return response.status(400).json({ message: `Price cannot be negative` })
        }
        const isExists = await plotModel.findOne({ project: _idProject, plotNumber: plotNumber })
        if (isExists) {
            return response.status(422).json({ message: `Plot name already exists` })
        }
        const plot = await plotModel.create({ project: _idProject, plotNumber: plotNumber, description: description, area: area, unit: unit, price: price, status: status })
        return response.status(200).json({ plot: plot })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function updatePlot(request, response) {
    try {
        const { plotNumber, description, area, unit, status, price } = request.body
        const plot = await plotModel.findOne({ _id: request.params._idPlot, project: request.params._idProject })
        if (!plot) {
            return response.status(404).json({ message: `Plot not found` })
        }
        if (plotNumber !== undefined) {
            if (!plotNumber) {
                return response.status(400).json({ message: `Plot number is required` })
            }
            if (plotNumber.length < 1 || plotNumber.length > 20) {
                return response.status(400).json({ message: `Plot number must be between 1 and 20 characters` })
            }
            const exists = await plotModel.findOne({ project: plot.project, plotNumber, _id: { $ne: plot._id } })
            if (exists) {
                return response.status(422).json({ message: `Plot number already exists in this project` })
            }
            plot.plotNumber = plotNumber
        }
        if (description !== undefined) {
            if (description.length > 1000) {
                return response.status(400).json({ message: `Description cannot exceed 1000 characters` })
            }
            plot.description = description
        }
        if (area !== undefined) {
            if (area < 0) {
                return response.status(400).json({ message: `Area cannot be negative` })
            }
            plot.area = area
        }
        if (unit !== undefined) {
            const allowedUnits = ['SQFT', 'SQM', 'BIGHA', 'ACRE']
            if (!allowedUnits.includes(unit)) {
                return response.status(400).json({ message: `Invalid area unit` })
            }
            plot.unit = unit
        }
        if (status !== undefined) {
            const allowedStatus = ['AVAILABLE', 'BOOKED', 'SOLD']
            if (!allowedStatus.includes(status)) {
                return response.status(400).json({ message: `Invalid plot status` })
            }
            plot.status = status
        }
        if (price !== undefined) {
            if (price < 0) {
                return response.status(400).json({ message: `Price cannot be negative` })
            }
            plot.price = price
        }
        await plot.save()
        return response.status(200).json({ message: `Plot updated successfully`, plot: plot })
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
        const plots = await plotModel.find({
            $or: [
                { plotNumber: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        })
        if (plots.length === 0) {
            return response.status(404).json({ message: `Plots not found` })
        }
        return response.status(200).json({ plots: plots })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function getPlots(request, response) {
    try {
        const plots = await plotModel.find({ project: request.params._idProject })
        if (plots.length === 0) {
            return response.status(404).json({ message: `Plots not found` })
        }
        return response.status(200).json({ plots: plots })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function getPlotById(request, response) {
    try {
        const { _idPlot, _idProject } = request.params
        const plot = await plotModel.findOne({ _id: _idPlot, project: _idProject })
        if (!plot) {
            return response.status(404).json({ message: `Plot not found` })
        }
        return response.status(200).json({ plot: plot })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function getPlotsByStatus(request, response) {
    try {
        const { _idProject, status } = request.params
        const plots = await plotModel.find({ project: _idProject, status: status })
        if (plots.length === 0) {
            return response.status(404).json({ message: `Plots not found` })
        }
        return response.status(200).json({ plots: plots })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function getPlotsByPriceRange(request, response) {
    try {
        const { _idProject } = request.params
        const { minPrice, maxPrice } = request.query
        const filter = { project: _idProject }
        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) {
                filter.price.$gte = Number(minPrice)
            }
            if (maxPrice) {
                filter.price.$lte = Number(maxPrice)
            }
        }
        const plots = await plotModel.find(filter)
        if (plots.length === 0) {
            return response.status(404).json({ message: `Plots not found` })
        }
        return response.status(200).json({ plots: plots })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function getPlotsByAreaRange(request, response) {
    try {
        const { _idProject } = request.params
        const { minArea, maxArea } = request.query
        const filter = { project: _idProject }
        if (minArea || maxArea) {
            filter.area = {}
            if (minArea) {
                filter.area.$gte = Number(minArea)
            }
            if (maxArea) {
                filter.area.$lte = Number(maxArea)
            }
        }
        const plots = await plotModel.find(filter)
        if (plots.length === 0) {
            return response.status(404).json({ message: `Plots not found` })
        }
        return response.status(200).json({ plots: plots })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

async function deletePlot(request, response) {
    try {
        const plot = await plotModel.findOneAndDelete({ project: request.params._idProject, _id: request.params._idPlot })
        if (!plot) {
            return response.status(404).json({ message: `Plot not found` })
        }
        return response.status(200).json({ message: `Plot Delected Successfully` })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

module.exports = { createPlot, updatePlot, search, getPlots, getPlotById, getPlotsByStatus, getPlotsByPriceRange, getPlotsByAreaRange, deletePlot }