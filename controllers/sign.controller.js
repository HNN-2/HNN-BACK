const { SignService } = require("../services/sign.service");
const { UserService } = require("../services/sign.service");

class SignController {
    signService = new SignService();

    //회원가입
    //email,nickname,password,confirmPw,MBTI
    createUser = async (req, res, next) => {
        try {
            const { email, nickname, password, confirmPw, MBTI } = req.body;
            const checkPasswordData = await this.signService.checkPassword(
                password,
                confirmPw
            );

            //비밀번호가 같지 않다면 false 반환
            if (!checkPasswordData.success) {
                return res.send({
                    msg: checkPasswordData.msg,
                    success: false,
                });
            }
            // 비밀번호 유효성 검사
            // 1. 비밀번호는 영소대문자 + 숫자 + 특수문자 조합
            // 2. email에 비밀번호가 포함되면 안됨.
            const checkPasswordEffectivenessData =
                await this.signService.checkPasswordEffectiveness(
                    password,
                    email
                );

            if (!checkPasswordEffectivenessData.success) {
                return res.send({
                    msg: checkPasswordEffectivenessData.msg,
                    success: checkPasswordEffectivenessData.success,
                });
            }

            const signUpResult = await this.signService.createUser(
                email,
                nickname,
                password,
                MBTI
            );

            return res.send({
                msg: signUpResult.msg,
                success: signUpResult.success,
            });
        } catch (err) {
            next(err);
        }
    };

    //중복된 이메일 확인, 유효성 검사
    checkDupEmail = async (req, res, next) => {
        try {
            const { email } = req.body;

            const checkEmailEffectivenessData =
                await this.signService.checkEmailEffectiveness(email);

            if (!checkEmailEffectivenessData.success) {
                return res.send({
                    msg: checkEmailEffectivenessData.msg,
                    success: checkEmailEffectivenessData.success,
                });
            }

            //이메일이 중복인지 확인
            const checkDupEmailData = await this.signService.checkDupEmail(
                email
            );

            return res.send({
                msg: checkDupEmailData.msg,
                success: checkDupEmailData.success,
            });
        } catch (err) {
            next(err);
        }
    };

    //중복된 닉네임 확인, 유효성 검사
    checkDupNickname = async (req, res, next) => {
        try {
            const { nickname } = req.body;
            const checkNicknameEffectivenessData =
                await this.signService.checkNicknameEffectiveness(nickname);

            return res.send({
                msg: checkNicknameEffectivenessData.msg,
                success: checkNicknameEffectivenessData.success,
                err: checkNicknameEffectivenessData.err,
            });
        } catch (err) {
            next(err);
        }
    };

    //로그인
    //로그인이 성공한다면 acess, refresh 두개 발급.
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const loginData = await this.signService.login(email, password);
            if (loginData.success) {
                res.cookie("token", loginData.token, {
                    maxAge: 1000 * 60 * 60,
                });
                res.cookie("refreshToken", "refresh", {
                    maxAge: 1000 * 60 * 60 * 24 * 7, //1주일 유지
                });
                return res.send({
                    success: loginData.success,
                });
            } else
                return res.send({
                    success: loginData.success,
                    msg: loginData.msg,
                });
        } catch (err) {
            next(err);
        }
    };

    //로그아웃
    logout = async (req, res, next) => {
        await res.clearCookie("token");
        res.send({ success: true });
    };
}

class UserController {
    userService = new UserService();
    //아직 테스트 해봐야 함.
    updateUserProfile = async (req, res, next) => {
        const { userId } = req.params;
        const {
            password,
            newPassword,
            confirmNewPassword,
            newNickname,
            newMBTI,
            newProfilePicture,
        } = req.body;
        //입력한 비밀번호가 다른 경우
        const checkDupPasswordData = await this.userService.checkPassword(
            userId,
            password
        );
        if (
            !checkDupPasswordData.success ||
            newPassword !== confirmNewPassword
        ) {
            return res.send({
                msg: "비밀번호가 일치하지 않습니다.",
                success: false,
            });
        }
        //입력한 비밀번호가 현재의 비밀번호와 같은 경우
        const checkDupNewPasswordData = await this.userService.checkPassword(
            userId,
            newPassword
        );
        if (checkDupNewPasswordData.success) {
            return res.send({
                msg: "기본 비밀번호와 다르게 설정해주세요.",
                success: false,
            });
        }
        //입력한 비밀번호의 유효성 검사
        const checkEffectivenessNewPassword =
            await this.signService.checkPasswordEffectiveness(newPassword);
        if (!checkEffectivenessNewPassword.success) {
            return res.send({
                success: checkDupNewPasswordData.success,
                msg: checkDupNewPasswordData.msg,
            });
        }
        //닉네임의 유효성, 중복 확인
        const checkNicknameData =
            await this.signService.checkNicknameEffectiveness(newNickname);
        if (!checkNicknameData.success) {
            return res.send({
                success: checkNicknameData.success,
                msg: checkNicknameData.msg,
            });
        }
        //위의 모든 조건들을 만족한다면 회원정보 업데이트
        const updateUserProfileData = await this.userService.updateUserProfile(
            userId,
            newPassword,
            newNickname,
            newMBTI,
            newProfilePicture
        );
        if (updateUserProfileData.success) {
            return res.send({
                success: updateUserProfileData.success,
            });
        }
    };

    //내가 쓴 글 보기
    postOfLoginUser = async (req, res, next) => {
        const { userId } = req.params;
    };
}
module.exports = {
    SignController,
    UserController,
};
