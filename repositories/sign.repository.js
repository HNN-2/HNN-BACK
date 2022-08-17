const { User, Post, Comment, Like } = require("../models");

class UserRepository {
    //새로운 유저테이블 생성, 생성한 유저의 정보 반환.
    createUser = async (email, nickname, password, MBTI) => {
        const createUserData = await User.create({
            email,
            password,
            nickname,
            MBTI,
        });
        return createUserData;
    };
    //유저 아이디로 해당 유저의 row 반환.
    returnUserStatus = async (userId) => {
        const userStatusData = await User.findOne({
            where: { userId },
        });
        return userStatusData;
    };
    //email을 인자로 받아 중복된 이메일이 있다면 그 row 반환
    checkDupEmail = async (email) => {
        const dupEmailData = await User.findOne({
            where: { email },
        });

        return dupEmailData;
    };
    //nickname 인자로 받아 중복된 닉네임이 있다면 그 row 반환
    checkDupNickname = async (nickname) => {
        const dupNicknameData = await User.findOne({
            where: { nickname },
        });
        return dupNicknameData;
    };
    //email을 인자로 받아 해당되는 패스워드 반환
    findEmailToPassword = async (email) => {
        const hashPassword = await User.findOne({
            where: { email },
        });
        return hashPassword;
    };
    //userId로 유저를 찾아 그 유저의 정보 변경.
    updateUserProfile = async (
        userId,
        password,
        nickname,
        MBTI,
        profilePicture
    ) => {
        const updataUserProfileData = await User.update(
            {
                password,
                nickname,
                MBTI,
                profilePicture,
            },
            { where: { userId } }
        );
        return updataUserProfileData;
    };
    //userId 로 유저를 찾아 그 유저가 작성한 게시물을 반환
    returnPostOfLoginUser = async (userId) => {
        const PostsOfLoginUserData = await User.findOne({
            include: [
                {
                    model: Post,
                },
            ],
            where: { userId },
        });

        return PostsOfLoginUserData.Posts;
    };
    //postId 로 해당 포스트의 댓글 숫자 반환
    returnCommentsNumOfLoginUserPosts = async (postId) => {
        const commentNum = await Comment.findAll({
            where: { postId },
        });
        return commentNum.length;
    };
    //postId를 넣으면 그 포스트의 좋아요 숫자를 반환
    returnLikeOfLoginUserPosts = async (postId) => {
        const LikeNum = await Like.findAll({
            where: { postId },
        });
        return LikeNum.length;
    };
    
    updateRefreshToken = async (refreshToken, userId) => {
        await User.update(
            {
                refreshToken,
            },
            {
                where: { userId },
            }
        );
        return { success: true };
    };
    //userId로 해당 유저를 삭제.
    deleteUser = async (userId) => {
        await User.delete({
            where: { userId },
        });
        return { success: true };
    };
    returnUserLikeOrNot = async (userId, postId) => {
        const data = await Like.findOne({
            where : {userId,postId}
        })
        return data
    }
}

module.exports = UserRepository;
