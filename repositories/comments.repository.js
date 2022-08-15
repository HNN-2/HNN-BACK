const { Comment } = require("../models");

class CommentRepository {
    findById = async (userId) => {
        const findById = await Comment.findOne({
            where: { userId },
        });
        return findById;
    };
    createComment = async (userId, postId, content) => {
        const createdComment = await Comment.create({
            userId,
            postId,
            content,
        });
        return createdComment;
    };
    updateComment = async (userId, commentId, content) => {
        const updateComment = await Comment.update(
            { content },
            { where: { commentId } }
        );
        return updateComment;
    };
    deleteComment = async (userId, commentId) => {
        const deleteComment = await Comment.destroy({ where: { commentId } });
        return deleteComment;
    };
}

module.exports = CommentRepository;
