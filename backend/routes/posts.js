const express = require('express');
const router = express.Router();

let Post = require('../models/post');

router.post('/new', function(req, res){
  req.assert('author', 'Post author must be set').notEmpty();
  req.assert('content', 'Post must have content').notEmpty();

  let errors = req.validationErrors();
  
  if(errors){
    console.log(errors);
  } else {
    let post = new Post();
    post.author = req.body.author;
    post.content = req.body.content;

    post.save(function(err){
      if(err){
        console.log(err);
      } else {
        res.status(200).json({ msg: 'Post created', post });
      }
    })
  }
});

router.get('/', function(req, res){
  Post.find({}, function(err, posts){
    if (err){
      console.log(err);
    } else {
      // Send all posts.
      res.json({posts:posts});
    }
  });
});

router.post('/edit/:id', function(req, res){
  let post = {};
  post.author = req.body.author;
  post.content = req.body.content;

  let query = {_id:req.params.id}

  Post.update(query, post, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.status(200).json({msg: 'Post successfully updated', post:post});
    }
  });
});

router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  Post.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.status(200).json({msg:'Post deleted successfully!'});
  });
});

module.exports = router;