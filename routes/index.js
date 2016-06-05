var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var passport = require('passport');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
    console.log('I am home now');
});

router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }
    console.log('I am get method now');
    res.json(posts);
  });
});

router.post('/posts',auth, function(req, res, next) {
  var post = new Post(req.body);
  post.author = req.payload.username;
  post.save(function(err, post){
    if(err){ return next(err); }
      console.log("I am post'/posts' method now");
    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }
      console.log("I am param'post' now");
    req.post = post;
    return next();
  });
});
router.param('post/:comment', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post){
        if (err) { return next(err); }
        if (!post) { return next(new Error('can\'t find post')); }
        console.log("I am param'post/:comment' now");
        req.post = post;
        return next();
    });
});

/*router.get('/posts/:post', function(req, res) {

    console.log("I am get'/posts/:post' now");
  res.json(req.post);
});
*/
router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
});
router.put('/posts/:post/upvote',auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }
      console.log("I am put'/posts/:post/upvote' now");
    res.json(post);
  });
});
router.put('/posts/:post/comments/:comment/upvote',auth, function(req, res, next) {
    req.post.upvote(function(err, post){
        if (err) { return next(err); }
        console.log("I am put'/posts/:post/comments/:comment/upvote' now");
        res.json(post);
    });
});
router.post('/posts/:post/comments',auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;
  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if(err){ return next(err); }
        console.log("I am post'/posts/:post/comments' now");
      res.json(comment);
    });
  });
});
router.post('/posts/:post/comments/:comment/upvote', function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.save(function(err, comment){
        if(err){ return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if(err){ return next(err); }
            console.log("I am post'/posts/:post/comments/:comment/upvote' now");
            res.json(comment);
        });
    });
});

router.get('/posts/:post', function(req, res, next) {
  req.post.populate('comments', function(err, post) {
    if (err) { return next(err); }
      console.log("I am get'/posts/:post' now");
    res.json(post);
  });
});
router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function (err){
        if(err){ return next(err); }
        console.log("I am post'/register' now");
        return res.json({token: user.generateJWT()})
    });
});
router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    console.log("I am post'/login' now");
    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;
