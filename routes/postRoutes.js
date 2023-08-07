const postController = require("../controllers/postController");
const upload = require("../middlewares/uploadMiddleware");

module.exports = (router) => {
  router
    .route("/user/post")
    .post(upload, postController.createPost)
    .put(upload, postController.updatePost)
    .get(postController.getPost);

  router
    .route("/user/post/:id")
    .delete(postController.deletePostById)
    .get(postController.getPostById);
};
