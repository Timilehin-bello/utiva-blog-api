const userController = require("../controllers/userController");

module.exports = (router) => {
  router.route("/register").post(userController.register);
  router.route("/login").post(userController.login);
  router.route("/user/profile").get(userController.profile);
  router.route("/user/logout").post(userController.logout);
};
