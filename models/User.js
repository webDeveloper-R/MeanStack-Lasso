
router.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;
});
router.put('/posts/:post/upvote', auth, function(req, res, next) {

});
router.post('/posts/:post/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;
});
router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {

});