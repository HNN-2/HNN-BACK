const { Like, Post, User, Comment } = require("../models");
const PostService = require("../services/posts.service");
const SignRepository = require("../repositories/sign.repository");

class PostRepository {
    findAllPost = async () => {
        const posts = await Post.findAll();
        const Locals = [];

        for (let i = 0; i < posts.length; i++) {
            const locals = await User.findOne({
                where: { userId: posts[i].userId },
            }); //locals에는 posts.userId로 찾은 user 데이터가 담겨있다.
            Locals.push(locals);
        }
        return { posts, Locals };
    };

    // const like = [];
    // for (let i = 0; i < posts.length; i++) {
    //     const temp = await Like.findAll({
    //         where: { postId: posts[i].postId },
    //     });
    //     like.push(temp.length);
    // }
    // return { posts, like };
    // };

    findOnePost = async (postId) => {
        //join 사용해서
        const detailPostUser = await Post.findOne({
            where: { postId },
            include: [
                {
                    model: User,
                    attributes: ["MBTI", "profilePicture", "nickname"],
                },
            ],
            attributes: [
                "title",
                "content",
                "userId",
                "songTitle",
                "singer",
                "createdAt",
                "imageUrl",
            ],
            raw: true,
        });
        const detailCommentUser = await Comment.findOne({
            where: { postId },
            include: [
                {
                    model: User,
                    attributes: ["MBTI", "nickname"],
                },
            ],
            attributes: ["content", "userId", "createdAt"],
            raw: true,
        });

        // await Post.userId.findOne(
        //     { MBTI, profilePicture, nickname },
        //     { where: userId }
        // );

        return { detailPostUser, detailCommentUser };
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

    //포스트 아이디로 포스트를 뒤져 비밀번호가 같으면 true
    //아니면 false
    // checkPw = async (postId, pw) => {
    //     const checkPostPwData = await Post.findOne({
    //         where: { postId },
    //     });
    //     if (pw === checkPostPwData.pw) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // };

    deletePost = async (postId) => {
        await Post.destroy({
            where: { postId },
        });
    };
}

module.exports = PostRepository;
