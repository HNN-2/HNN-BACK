const LikesService = require("../services/likes.service");
class LikesController {
    likeService = new LikesService();

    postLike = async (req, res, next) => {
        const { postId } = req.params;
        const { userId } = res.locals;

        const postLikeData = await this.likeService.postLike(postId, userId);
        res.json(postLikeData.msg);
    };

    getMyLike = async (req, res) => {
        const { userId } = req.locals;
        const getMyLike = await this.likeService.getMyLike(userId);

        res.json(getMyLike);
    };
}

module.exports = LikesController;
