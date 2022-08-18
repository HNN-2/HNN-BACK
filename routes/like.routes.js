const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const LikesController = require("../controllers/likes.controller");
const likesController = new LikesController();

// 게시물 좋아요
router.patch("/:postId", authMiddleware, likesController.postLike);
router.get("/my", authMiddleware, likesController.findLikeId);

// 자기가 좋아요 한 게시물 조회
// router.get("/my", authMiddleware, likesController.getMyLike);

module.exports = router;
