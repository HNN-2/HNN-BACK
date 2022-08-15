const express = require("express");
const router = express.Router();

//인덱스 라우터에서 다른 라우터로 연결시켜줌.

const signRouter = require("./sign.routes"); //이름 겹쳐서 바꿔놨어요
const postRouter = require("./post.routes");
const commentRouter = require("./comments");
const likeRouter = require("./like.routes");

router.use("/post", postRouter); //절단기능이다.
router.use("/sign", signRouter);
router.use("/likes", likeRouter);
router.use("/comment", commentRouter);

module.exports = router;
