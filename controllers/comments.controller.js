const CommentService = require("../services/comments.service");

class CommnetsController {
    commentService = new CommentService();

    // 유저 정보 찾기
    findById = async (req, res, next) => {
        const { userId } = res.locals;

        const findById = await this.commentService.findById(userId);

        return res.json({ findById });
    };
    // 댓글 작성
    createComment = async (req, res, next) => {
        const { userId } = res.locals;
        const { postId } = req.params;
        const { content } = req.body;

        const createdComment = await this.commentService.createComment(
            userId,
            postId,
            content
        );
        return res.json({ data: createdComment });
    };
    // 댓글 수정
    updateComment = async (req, res, next) => {
        const { userId } = res.locals;
        const { commentId } = req.params;
        const { content } = req.body;

        const updateComment = await this.commentService.updateComment(
            userId,
            commentId,
            content
        );
        return res.json({ data: updateComment });
    };
    // 댓글 삭제
    deleteComment = async (req, res, next) => {
        const { userId } = res.locals;
        const { commentId } = req.params;

        const deleteComment = await this.commentService.deleteComment(
            userId,
            commentId
        );
        return res.json({ data: deleteComment });
    };
}

module.exports = CommnetsController;
