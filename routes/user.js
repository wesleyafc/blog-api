const router = require('express').Router();
const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')


//update account
router.put("/:id", async (request, response) => {
    //check if user is the same as id
    if (request.body.userId === request.params.id) {

        //hash password
        if (request.body.password) {
            const salt = await bcrypt.genSalt(12)
            request.body.password = await bcrypt.hash(request.body.password, salt)
        }

        try {
            const user = await User.findByIdAndUpdate(request.params.id, {
                $set: request.body
            },
                //return new user
                { new: true }
            )
            response.status(200).json(user)
        } catch (error) {
            console.error(error)
            response.status(500).json(error)
        }
    } else {
        response.status(401).json("you are not allowed to change this account")
    }
})


//delete account
router.delete("/:id", async (request, response) => {
    //check if user is the same as id
    if (request.body.userId === request.params.id) {

        try {
            const user = await User.findById(request.params.id)
            try {
                //delete posts from this user account
                await Post.deleteMany({ username: user.username })
                //delete account
                await User.findByIdAndDelete(request.params.id)
                response.status(200).json("account deleted")
            } catch (error) {
                console.error(error)
                response.status(500).json(error)
            }
        } catch (error) {
            response.status(404).json("user not found")
        }
    } else {
        response.status(401).json("you are not allowed to delete this account")
    }
})


router.get("/:id", async (request, response) => {
    try {
        const user = await User.findById(request.params.id)

        //dont show the password from user
        const { password, ...others } = user._doc

        response.status(200).json(others)
    } catch (error) {
        response.status(404).json("user not found")

    }
})



module.exports = router