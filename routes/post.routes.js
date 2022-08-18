const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const upload = require("../middlewares/postImageUploadMiddleware")

const PostsController = require("../controllers/posts.controller");
const postsController = new PostsController();

// 게시물 조회, 로그인 필요 없음
//http://localhost:8000/post/allpost
router.get("/", postsController.getAllPosts); //내가 좋아요한 게시글 보려면 로그인해야함 -> 미들웨어 새로 필요

// 게시물 상세보기, 로그인 필요 없음
//http://localhost:8000/post/postId
router.get("/:postId", postsController.getOnePost);

// 게시물 작성
router.post("/", authMiddleware, postsController.createPost);
// router.post("/", postsController.createPost);

// 이미지 업로드
router.post("/image", upload.single("userfile") , postsController.createImageLocation)


// 이미지 수정
router.patch("/image/:postId" , upload.single("userfile") , postsController.updateImageLocation)
// 게시물 수정
router.patch("/:postId",postsController.updatePost);
// router.patch("/:postId", postsController.updatePost);

// 게시물 삭제
router.delete("/:postId", authMiddleware, postsController.deletePost);
// router.delete("/:postId", postsController.deletePost);

module.exports = router;
