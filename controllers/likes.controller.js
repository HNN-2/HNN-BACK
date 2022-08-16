const LikesService = require("../services/likes.service");

class LikesController {
    likeService = new LikesService();

    findLikeId = async (req, res, next) => {
        const { userId } = res.locals;
        const findLikeId = await this.likeService.findLikeId(userId);
        res.json({ success: true, data: findLikeId });
    };

    //게시글 좋아요 확인 후 등록/취소
    postLike = async (req, res, next) => {
        const { postId } = req.params;
        const { userId } = res.locals;

        const postLikeData = await this.likeService.postLike(postId, userId);
        res.json({ success: true, msg: postLikeData.msg });
    };
}

module.exports = LikesController;
