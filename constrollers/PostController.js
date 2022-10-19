import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec()
    res.json(posts)
    // {
    //     "_id": "633c274f32b76695bd10415d",
    //     "title": "Title title title2",
    //     "body": "body body body2",
    //     "tags": [
    //         "hi"
    //     ],
    //     "viewerCount": 0,
    //     "user": "633b2144ad263568ee0fff69",
    //     "createdAt": "2022-10-04T12:30:07.435Z",
    //     "updatedAt": "2022-10-04T12:30:07.435Z",
    //     "__v": 0
    // },
    // {
    //     "_id": "633c63256e0976b7ba3b17e9",
    //     "title": "Title title title3",
    //     "body": "body body body3",
    //     "tags": [
    //         "hi",
    //         "boo"
    //     ],
    //     "viewerCount": 0,
    //     "user": "633b2144ad263568ee0fff69",
    //     "createdAt": "2022-10-04T16:45:25.271Z",
    //     "updatedAt": "2022-10-04T16:45:25.271Z",
    //     "__v": 0
    // }
    // ]
  } catch (error) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to load all posts'
    })
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id // from dynamic url /:id

    PostModel.findOneAndUpdate(
      {
        _id: postId // ?
      },
      {
        // increment view count
        $inc: {
          viewsCount: 1
        }
      },
      {
        returnDocument: 'after' // return document after update / all done
      },
      (err, doc) => {
        // actions to take:

        // if error
        if (err) {
          console.log(err)
          // add 'return' to stop future code
          return res.status(500).json({
            message: 'Failed to get post'
          })
        }

        // check for undefined? -> return error
        if (!doc) {
          return res.status(404).json({
            message: 'Post not found'
          })
        }

        // if all ok:
        res.json(doc)
      }
      // {
      // 	"_id": "633c63256e0976b7ba3b17e9",
      // 	"title": "Title title title3",
      // 	"body": "body body body3",
      // 	"tags": [
      // 		"hi",
      // 		"boo"
      // 	],
      // 	"viewerCount": 0,
      // 	"user": "633b2144ad263568ee0fff69",
      // 	"createdAt": "2022-10-04T16:45:25.271Z",
      // 	"updatedAt": "2022-10-04T19:53:57.666Z",
      // 	"__v": 0,
      // 	"viewsCount": 4
      // }
    ).populate('user') // show user name when open post page?
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Failed to get post'
    })
  }
}

export const create = async (req, res) => {
  try {
    console.log(req.body)

    const doc = new PostModel({
      user: req.userId, // ! user not from body
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl
    })

    // save post / document to mongoDB
    const post = await doc.save()

    // if all ok:
    res.json({
      success: true,
      post
    })
    // {
    //   "success": true,
    //   "post": {
    //     "title": "Title title title3",
    //     "body": "body body body3",
    //     "tags": [
    //       "hi",
    //       "boo"
    //     ],
    //     "viewerCount": 0,
    //     "user": "633b2144ad263568ee0fff69",
    //     "_id": "633c63256e0976b7ba3b17e9",
    //     "createdAt": "2022-10-04T16:45:25.271Z",
    //     "updatedAt": "2022-10-04T16:45:25.271Z",
    //     "__v": 0
    // }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'unable to create post'
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id // get id from dynamic url /:id (id of which one want to update)

    await PostModel.updateOne(
      {
        _id: postId // ?
      },
      {
        // what want to update:
        title: req.body.title,
        body: req.body.body,
        user: req.userId,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags
      }
    )
    // if all ok:
    res.json({
      success: true,
      message: 'post updated'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Failed to update post'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndDelete(
      {
        _id: postId // ?
      },
      (err, doc) => {
        // actions to take:

        // if error
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Failed to delete'
          })
        }

        // check for undefined? -> return error
        if (!doc) {
          console.log(err)
          return res.status(500).json({
            message: 'Post not found'
          })
        }

        // if all ok:
        res.json({
          success: true,
          message: 'post deleted',
          id: postId
        })
        // {
        //   "success": true,
        //   "message": "post deleted",
        //   "id": "633c0d15fc3ad36ed70368dd"
        // }
      }
    )
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Failed to delete post'
    })
  }
}
