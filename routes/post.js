const router = require('express').Router();
const Post = require('../models/Post')


//create a new post
router.post("/", async (request, response) => {
    const newPost = new Post(request.body)

    try {
        const savedPost = await newPost.save()

        response.status(200).json(savedPost)
    } catch (error) {
        console.error(error)
        response.status(500).json(error)
    }
})

//update a post
router.put("/:id", async (request, response) => {
    try {
        const post = await Post.findById(request.params.id)
        if (post.username === request.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    request.params.id,
                    {
                        $set: request.body
                    },
                    {
                        //return the updated post
                        new: true,
                    }
                );
                response.status(200).json(updatedPost)
            } catch (error) {
                response.status(401).json("you can update only your posts")
            }
        }
    } catch (error) {
        response.stus(500).json(error)
    }
})

//get one post by id
router.get("/:id", async (request, response) => {
    try {
        const post = await Post.findById(request.params.id)
        response.status(200).json(post)

    } catch (error) {
        console.error(error)
        response.status(500).json(error)
    }

})

//show all posts
router.get("/", async (request, response) => {
    const username = request.query.user;
    const catName = request.query.cat;
    try {
        let posts;
        if (username) {
            posts = await Post.find({ username });
        } else if (catName) {
            posts = await Post.find({
                categories: {
                    $in: [catName],
                },
            });
        } else {
            posts = await Post.find();
        }
        response.status(200).json(posts);
    } catch (err) {
        response.status(500).json(err);
    }
});

//delete post
router.delete("/:id", async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);
        if (post.username === request.body.username) {
            try {
                await post.delete();
                response.status(200).json("Post has been deleted...");
            } catch (err) {
                response.status(500).json(err);
            }
        } else {
            response.status(401).json("You can delete only your post!");
        }
    } catch (err) {
        response.status(500).json(err);
    }
});

module.exports = router