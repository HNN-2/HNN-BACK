const { Like, Post, User, Comment } = require("../models");
const PostService = require("../services/posts.service");
const SignRepository = require("../repositories/sign.repository");

class PostRepository {
    findAllPost = async () => {
        const posts = await Post.findAll();
        const Locals = [];
        const like = [];

        for (let i = 0; i < posts.length; i++) {
            const locals = await User.findOne({
                where: { userId: posts[i].userId },
            }); //locals에는 posts.userId로 찾은 user 데이터가 담겨있다.
            const temp = await Like.findAll({
                where: { postId: posts[i].postId },
            });
            like.push(temp.length);
            console.log(temp.length);
            Locals.push(locals);
        }
        return { posts, Locals, like };
    };

    findOnePost = async (postId) => {
        //게시글 상세 조회 (댓글 없을때)
        const detailPostUser = await Post.findOne({
            where: { postId },
            include: [
                {
                    model: Like,
                    attributes: ["likeId"],
                },
                {
                    model: User,
                    attributes: ["MBTI", "profilePicture", "nickname"],
                },
            ],
            attributes: [
                "title",
                "userId",
                "createdAt",
                "imageUrl",
                "content",
                "songTitle",
                "singer",
            ],
            // raw: true,
        });

        return detailPostUser;
    };

    //게시글의 댓글 찾기
    findComments = async (postId) => {
        const detailCommentUser = await Comment.findAll({
            where: { postId },
            include: [
                {
                    model: User,
                    attributes: ["MBTI", "nickname", "profilePicture"],
                },
            ],
            attributes: ["content", "userId", "createdAt"],
            raw: true,
        });

        return detailCommentUser;
    };

    createPost = async (
        title,
        content,
        imageUrl,
        songTitle,
        singer,
        userId,
        MBTI
    ) => {
        // createPost = async (title, content, imageUrl) => {
        // ORM인 Sequelize에서 Posts 모델의 create 메소드를 사용해 데이터를 요청합니다.
        const createPostData = await Post.create({
            title,
            content,
            imageUrl,
            songTitle,
            singer,
            userId,
            MBTI,
        });
        return createPostData;
    };

    updatePost = async (postId, title, content, imageUrl) => {
        const updatePostData = await Post.update(
            { title, content, imageUrl },
            {
                where: { postId },
            }
        );

        return updatePostData;
    };

    deletePost = async (postId) => {
        await Post.destroy({
            where: { postId },
        });
    };
}

module.exports = PostRepository;
