const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// require models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// require validator
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  // if (req.body.type) {
  //   Post.find({ 'post.type': req.body.type })
  //     .sort({ date: -1 })
  //     .then(posts => res.json(posts))
  //     .catch(err => res.status(400).json({ nopostsfound: 'No posts found' }));
  // } else {

  // let params;

  // if (req.query['type']) {
  //   params = {
  //     type: req.query['type']
  //   };
  // }

  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json({ nopostsfound: 'No posts found' }));
  // }
});

router.get('/search', (req, res) => {
  // if (req.body.type) {

  // let searchQuery = {};
  // if (req.params.type) {
  //   searchQuery = { type: req.params.type };
  // }

  // var query = {
  //   player: 'player'
  // };

  // if (obj.action) {
  //   query.action = obj.action;
  // }

  let params = {};

  if (req.query['type']) {
    // params = {
    //   type: req.query['type']
    // };

    params.type = req.query['type'];
  }

  if (req.query['user']) {
    // params = {
    //   type: req.query['type']
    // };

    params.user = req.query['user'];
  }

  Post.find(params)
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json({ nopostsfound: 'No posts found' }));
  // } else {
  //   Post.find()
  //     .sort({ date: -1 })
  //     .then(posts => res.json(posts))
  //     .catch(err => res.status(400).json({ nopostsfound: 'No posts found' }));
  // }
});

// @route   GET api/posts/
// @desc    Get posts with search params
// @access  Public
// router.get('/', (req, res) => {
//   Post.find()
//     .sort({ date: -1 })
//     .then(posts => res.json(posts))
//     .catch(err => res.status(400).json({ nopostsfound: 'No posts found' }));
// });

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json({ nopostfound: 'No post found' }));
});

// @route   POST api/posts
// @desc    Post a post route
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      subject: req.body.subject,
      body: req.body.body,
      type: req.body.type,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'user not authorized' });
          }
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post found' }));
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post by id
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'You have already liked this post' });
          }

          // Add user id to the likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post found' }));
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Like post by id
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'You have not yet liked this post' });
          }

          //get the remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Add user id to the likes array
          post.likes.splice(removeIndex, 1);

          //save
          post.save().then(post => {
            res.json(post);
          });
        })
        .catch(err => res.status(404).json({ postnotfound: 'no post found' }));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post by id
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.name,
          user: req.user.id
        };

        // add to comments array
        post.comments.unshift(newComment);

        // save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'no post found' }));
  }
);

// @route   POST api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check to see if the comment exsits
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment doesnt exist' });
        }

        //get the remove index
        const removeIndex = post.comments
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        // Add user id to the likes array
        post.comments.splice(removeIndex, 1);

        //save
        post.save().then(post => {
          res.json(post);
        });
      })
      .catch(err => res.status(404).json({ postnotfound: 'no post found' }));
  }
);

module.exports = router;
