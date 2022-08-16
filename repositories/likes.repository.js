const { Like, post } = require("../models");

class LikeRepository {
    findLikeId = async (userId) => {
        const findById = await Like.findOne({
            where: { userId },
        });
        return findById;
    };

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

    findLike = async (postId, userId) => {
        const post = await Like.findOne({ where: { postId, userId } });
        return post;
    };

    deleteLike = async (postId, userId) => {
        // this.postLikeUpDown(postId, -1);
        await Like.destroy({
            where: { postId: Number(postId), userId },
        });
        return;
    };

    createLike = async (postId, userId) => {
        await Like.create({ postId, userId });
        // this.postLikeUpDown(postId, +1);
        return;
    };
}

module.exports = LikeRepository;
