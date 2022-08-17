const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const { SignController } = require("../controllers/sign.controller");
const signController = new SignController();

const { UserController } = require("../controllers/sign.controller");
const userController = new UserController();
// 로그인
// 완료
router.post("/in", signController.login);

// 회원 가입/비밀번호 확인
// 완료
router.post("/up", signController.createUser);

// 이메일 중복 확인
// 완료
router.post("/checkEmail", signController.checkDupEmail);

// 닉네임 중복 확인
// 완료
router.post("/checkNickname", signController.checkDupNickname);

//로그아웃
//완료
router.post("/out", authMiddleware, signController.logout);

//유저 정보 수정
router.post("/user/:userId", authMiddleware, userController.updateUserProfile);

//마이페이지 자신이 작성한 게시물 데이터
router.get("/user/:userId", authMiddleware, userController.postOfLoginUser);

//회원 탈퇴
router.delete("/sign/user/:userId");
module.exports = router;
