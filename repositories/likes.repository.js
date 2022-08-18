const { Like, post } = require("../models");

class LikeRepository {
    //로그인 했을 때 유저가 좋아요 했는지 확인하기
    findLikeId = async (userId) => {
        const findById = await Like.findAll({
            where: { userId },
            // raw: true,
        });
        return findById;
    };

    // 포스트가 있는지 확인하기
    checkPost = async (postId) => {
        const checkPostData = await Like.findOne({
            where: { postId },
        });
        if (!checkPostData) {
            return false;
        } else {
            return true;
        }
    };

    //내 userId로 검색한 post 좋아요 누를때
    findLike = async (postId, userId) => {
        const post = await Like.findOne({ where: { postId, userId } });
        return post;
    };

    //내 userId로 검색한 post 좋아요 누를때 좋아요 취소
    deleteLike = async (postId, userId) => {
        // this.postLikeUpDown(postId, -1);
        await Like.destroy({
            where: { postId: Number(postId), userId },
        });
        return;
    };
    //내 userId로 검색한 post 좋아요 누를때 좋아요 등록
    createLike = async (postId, userId) => {
        await Like.create({ postId, userId });
        // this.postLikeUpDown(postId, +1);
        return;
    };
}

module.exports = LikeRepository;
