const jwt = require("jsonwebtoken");
require("dotenv").config();
const env = process.env;
const SignRepository = require("../repositories/sign.repository");
const signRepository = new SignRepository();

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [Type, token] = (authorization || "").split(" "); //토큰 정상 출력

        if (!token || Type !== "Bearer") {
            res.send({
                errorMessage: "로그인 후 사용하세요",
            });
            return;
        }

        const tokenvoll = jwt.verify(token, env.secretKey);
        res.locals.userId = tokenvoll.userId;
        const userData = await signRepository.returnUserStatus(
            tokenvoll.userId
        );
        res.locals.nickname = userData.nickname;
        res.locals.MBTI = userData.MBTI;
        res.locals.profilePicture = userData.profilePicture;
        next();
    } catch (err) {
        next(err);
        return;
    }
};
