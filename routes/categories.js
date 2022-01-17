const router = require('express').Router()
const Category = require('../models/Category')



router.post("/", async (request, response) => {
    const newCat = new Category(request.body)

    try {
        const saveCat = await newCat.save()

        response.status(200).json(saveCat)
    } catch (error) {
        response.status(500).json(error)
    }
})


router.get("/", async (request, response) => {

    try {
        const allCat = await Category.find()

        response.status(200).json(allCat)
    } catch (error) {
        response.status(500).json(error)
    }
})

module.exports = router