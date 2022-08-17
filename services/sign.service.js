const SignRepository = require("../repositories/sign.repository");
const crypto = require("crypto");
const Joi = require("Joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const env = process.env;

class SignService {
    signRepository = new SignRepository();
    //로그인
    //정확한 email, password를 입력시 return {token, success : true}
    //그렇지 않으면  return {success : false, msg : "회원 정보가 일치하지 않습니다."}
    login = async (email, password) => {
        const userData = await this.signRepository.findEmailToPassword(email);
        //email, password를 정상적으로 입력한 경우

        if (!userData) {
            return {
                msg: "회원 정보가 일치하지 않습니다.",
                success: false,
            };
        }
        
        if (userData.password === this.changePasswordToHash(password)) {
            const token = jwt.sign(
                {
                    userId: userData.userId,
                },
                env.secretKey,
                { expiresIn: "1h" }
            );
            const refreshToken = jwt.sign(
                {
                    userId: userData.userId,
                },
                env.secretKey,
                { expiresIn: "7d" }
            );
            await this.signRepository.updateRefreshToken(
                refreshToken,
                userData.userId
            );
            return {
                token,
                nickname: userData.nickname,
                MBTI: userData.MBTI,
                profilePicture: userData.profilePicture,
                success: true,
            };
        } else
            return {
                msg: "회원 정보가 일치하지 않습니다.",
                success: false,
            };
    };

    //회원가입 : email, nickname, password, MBTI를 유저 데이터베이스에 추가
    // return msg: {"회원가입을 축하드립니다!" , success : true}
    createUser = async (email, nickname, password, MBTI) => {
        password = this.changePasswordToHash(password);
        
        const createUserData = await this.signRepository.createUser(
            email,
            nickname,
            password,
            MBTI
        );
        if (createUserData.length !== 0) {
            return {
                msg: "회원가입을 축하드립니다!",
                success: true,
            };
        }
    };

    //이메일
    //이메일 확인 : 이메일로 데이터베이스를 찾아 중복된 이메일이 있으면
    // {sucess :  true , msg : "이미 존재하는 이메일입니다."} ,
    // 없으면 {success : false , msg : "사용할 수 있는 이메일입니다."}
    checkDupEmail = async (email) => {
        const checkDupEmailData = await this.signRepository.checkDupEmail(
            email
        );

        if (checkDupEmailData) {
            return {
                success: false,
                msg: "이미 존재하는 이메일입니다.",
            };
        } else
            return {
                success: true,
                msg: "사용할 수 있는 이메일입니다.",
            };
    };

    //이메일 유효성 검사
    // 유효성에 문제가 있다면 return {success : false,msg : "이메일을 확인하세요."}
    // 문제가 없다면         return {success : true}
    checkEmailEffectiveness = async (email) => {
        const schema = Joi.object().keys({
            email: Joi.string().email().max(29).required(),
        });
        try {
            // 검사시작
            await schema.validateAsync({ email });
        } catch (e) {
            // 유효성 검사 에러
            return {
                msg: "이메일을 확인하세요.",
                success: false,
            };
        }
        return { success: true };
    };

    //닉네임
    //중복 닉네임 확인 : 데이터베이스에 중복된 닉네임이 있는지 확인
    // 있으면 return {success : true}
    // 없으면 return {success : false}
    checkDupNickname = async (nickname) => {
        const checkDupNicknameData = await this.signRepository.checkDupNickname(
            nickname
        );
        if (checkDupNicknameData) {
            return { success: true };
        } else return { success: false };
    };

    //닉네임 중복,유효성 검사
    // 중복된 닉네임이 있다면 return {success : false, msg : "이미 존재하는 닉네임입니다."}
    // 유효성에 문제가 있다면 return {success : false, msg : "닉네임을 확인하세요."}
    // 문제가 없다면         return {success : false, msg : "사용할 수 있는 닉네임 입니다."}
    checkNicknameEffectiveness = async (nickname) => {
        const schema = Joi.object().keys({
            nickname: Joi.string()
                .min(2)
                .max(19)
                .pattern(new RegExp(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9]+$/))
                .required(),
        });
        try {
            // 검사시작
            
            await schema.validateAsync({ nickname });
        } catch (e) {
            // 유효성 검사 에러
            return { msg: "닉네임을 확인하세요.", err: e, success: false };
        }
        //닉네임 중복 검사
        const checkDupNicknameData = await this.checkDupNickname(nickname);

        if (!checkDupNicknameData.success) {
            return {
                msg: "사용할 수 있는 닉네임입니다.",
                success: true,
            };
        } else {
            return {
                msg: "이미 존재하는 닉네임입니다.",
                success: false,
            };
        }
    };

    //비밀번호
    //password와 confirmPw가 같은지 확인.
    //같다면   return {success : true}
    //다르다면 return {success : false}
    checkPassword = async (password, confirmPw) => {
        if (password !== confirmPw) {
            return {
                msg: "비밀번호가 일치하지 않습니다.",
                success: false,
            };
        }
        return { success: true };
    };

    //비밀번호 유효성 검사
    //비밀번호에 문제가 없다면 return  {success : true}
    //유효성에 문제가 있다면   return  {success : false, msg : "비밀번호를 확인하세요."}
    //이메일에 비번이 포함된다면return {success : false, msg : "이메일에 비밀번호가 포함됩니다."}
    checkPasswordEffectiveness = async (password, email) => {
        const schema = Joi.object().keys({
            password: Joi.string()
                .min(6)
                .max(19)
                .pattern(
                    new RegExp(
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
                    )
                )
                .required(),
        });
        try {
            // 검사시작
            await schema.validateAsync({ password: password });
        } catch (e) {
            // 유효성 검사 에러

            return {
                msg: "비밀번호를 확인하세요.",
                success: false,
            };
        }
        if (password.search(email) > -1) {
            return {
                msg: "이메일에 비밀번호가 포함됩니다.",
                success: false,
            };
        }
        return { success: true };
    };

    //password를 받아 해쉬화된 비밀번호로 반환
    changePasswordToHash = (password) => {
        return crypto
            .createHmac("sha256", Buffer.from("anystring"))
            .update(password)
            .digest("base64");
    };

    deleteUser = async (userId) => {
        await this.signRepository.deleteUser(userId);
        return{
            success : true,
            msg: "서운해요.."
        }
    };
}

class UserService extends SignService {
    signRepository = new SignRepository();

    //userId로 받아온 유저의 password 가 password와 같다면 true
    //다르면 false
    checkPassword = async (userId, password) => {
        password = super.changePasswordToHash(password);
        const userStatus = await super.returnUserStatus(userId);
        if (password === userStatus.password) {
            return { success: true };
        } else return { success: false };
    };

    //사용자에게 새로받은 4개의 정보로 업데이트
    updateUserProfile = async (
        userId,
        password,
        nickname,
        MBTI,
        profilePicture
    ) => {
        password = super.changePasswordToHash(password);
        updateUserProfileData = await this.signRepository.updateUserProfile(
            userId,
            password,
            nickname,
            MBTI,
            profilePicture
        );
        return { success: true };
    };

    getPostOfLoginUser = async (userId) => {
        const getPostOfLoginUserData =

            await this.signRepository.returnPostOfLoginUser(userId);
        // console.log(getPostOfLoginUserData)
        const commentNum = await Promise.all(
            getPostOfLoginUserData.map(
                async (post) =>
                    await this.signRepository.returnCommentsNumOfLoginUserPosts(
                        post.postId
                    )
            )
        );
        const likeNum = await Promise.all(
            getPostOfLoginUserData.map(
                async (post) =>
                    await this.signRepository.returnLikeOfLoginUserPosts(
                        post.postId
                    )
            )
        );


        const PostOfMypage = getPostOfLoginUserData.map((post, idx) => {
            return {
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                info: {
                    songTitle: post.songTitle,
                    singer: post.singer,
                },
                commentNum: commentNum[idx],
                like: likeNum[idx],
            };          

        });

        return { success: true, data: PostOfMypage };
    };
}
module.exports = {
    SignService,
    UserService,
};
