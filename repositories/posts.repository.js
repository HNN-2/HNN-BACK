const { Like, Post, User, Comment } = require("../models");
const PostService = require("../services/posts.service");
const SignRepository = require("../repositories/sign.repository");

class PostRepository {
    //게시글 전체 보기
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
            Locals.push(locals);
        }
        return { posts, Locals, like };
    };

    //댓글 없는 게시글 상세 조회
    //Post 와 User, Like 테이블 병합
    findOnePost = async (postId) => {
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
                "postId",
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

    //댓글 상세 조회
    // Comment 와 User 테이블 병합하여
    findComments = async (postId) => {
        const detailCommentUser = await Comment.findAll({
            where: { postId },
            include: [
                {
                    model: User,
                    attributes: ["MBTI", "nickname", "profilePicture"],
                },
            ],
            attributes: ["commentId", "content", "userId", "createdAt"],
            raw: true,
        });

        return detailCommentUser;
    };

    //게시글 생성
    createPost = async (
        title,
        content,
        imageUrl,
        songTitle,
        singer,
        userId,
        MBTI
    ) => {
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

    //게시글 수정
    updatePost = async (postId, title, content, imageUrl) => {
        const updatePostData = await Post.update(
            { title, content, imageUrl },
            {
                where: { postId },
            }
        );

        return updatePostData;
    };

    //게시글 삭제
    deletePost = async (postId) => {
        await Post.destroy({
            where: { postId },
        });
    };
}

module.exports = PostRepository;
