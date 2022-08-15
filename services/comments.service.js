const CommentRepository = require("../repositories/comments.repository");

class CommentService {
    commentRepository = new CommentRepository();

    findById = async (userId) => {
        const findById = await this.commentRepository.findById(userId);

        return { findById };
    };

    createComment = async (userId, postId, content) => {
        const createdComment = await this.commentRepository.createComment(
            userId,

            postId,
            content
        );
        return { createdComment };
    };

    updateComment = async (userId, commentId, content) => {
        const updateComment = await this.commentRepository.findById(userId);

        if (userId !== updateComment.userId) {
            return "자신이 쓴글이 아닐때 에러메세지";
        }

        const commentUpdate = await this.commentRepository.updateComment(
            userId,
            commentId,
            content
        );
        return { commentUpdate };
    };

    deleteComment = async (userId, commentId) => {
        const deleteComment = await this.commentRepository.findById(userId);

        if (userId !== deleteComment.userId) {
            return "자신이 쓴글이 아닐때";
        }

        const commentDelete = await this.commentRepository.deleteComment(
            userId,
            commentId
        );
        return { commentDelete };
    };
}

module.exports = CommentService;
