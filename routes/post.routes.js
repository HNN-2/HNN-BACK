const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const PostsController = require("../controllers/posts.controller");
const postsController = new PostsController();

// 게시물 조회, 로그인 필요 없음
//http://localhost:8000/post/allpost
router.get("/", postsController.getAllPosts);

// 게시물 상세보기, 로그인 필요 없음
//http://localhost:8000/post/postId
router.get("/:postId", postsController.getOnePost);

// 게시물 작성
router.post("/", authMiddleware, postsController.createPost);
// router.post("/", postsController.createPost);

// 게시물 수정
router.patch("/:postId", authMiddleware, postsController.updatePost);
// router.patch("/:postId", postsController.updatePost);

// 게시물 삭제
router.delete("/:postId", authMiddleware, postsController.deletePost);
// router.delete("/:postId", postsController.deletePost);

module.exports = router;
