const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')


//create a new account
router.post("/register", async (request, response) => {
    try {
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(request.body.password, salt)

        const newUser = new User({
            username: request.body.username,
            email: request.body.email,
            password: hashedPassword
        })

        const user = await newUser.save()
        response.status(200).json(user)
    } catch (error) {
        console.error(error)
        response.status(500).json(error)
    }
})

//login the user
router.post("/login", async (request, response) => {
    try {
        const user = await User.findOne({ username: request.body.username })
        if (!user) {
            response.status(400).json("wrong credentials")
        }

        const validateUser = await bcrypt.compare(request.body.password, user.password)
        if (!validateUser) {
            response.status(400).json("wrong credentials")
        }

        //dont show the password from user
        const { password, ...others } = user._doc

        response.status(200).json(others)


        response.status(200).json()
    } catch (error) {
        console.error(error)
        response.status(500).json(error)
    }
})


module.exports = router