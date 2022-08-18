const { Like, Post, User, Comment } = require("../models");
const PostService = require("../services/posts.service");
const SignRepository = require("../repositories/sign.repository");
// const { connect } = require("mongoose");

class PostRepository {
    //게시글 전체 보기
    //17일 밤 유저가 좋아요한 포스트 true/false로 구현
    findAllPost = async (userId) => {
        const posts = await Post.findAll();
        const Locals = [];
        const like = [];
        const CommentNum = [];
        // const arr = [];
        const ProfilePic = [];

        for (let i = 0; i < posts.length; i++) {
            const locals = await User.findOne({
                where: { userId: posts[i].userId },
                raw: true,
            }); //해당 게시물의 유저 정보 출력

            const temp = await Like.findAll({
                where: { postId: posts[i].postId },
                raw: true,
            }); //해당 게시물의 좋아요 개수 출력

            const commentNum = await Comment.findAll({
                where: { postId: posts[i].postId },
                raw: true,
            }); //해당 게시물의 댓글 개수 출력

            //user가 좋아요한 게시글 보여주기

            // const FindUserLikeId = await Like.findOne({
            //     where: { userId: userId, postId: posts[i].postId }, //userId, postId 조합?이 Like에 있는지
            //     raw: true,
            // });

            const profilePic = await User.findOne({
                where: { userId: posts[i].userId },
                raw: true,
            });

            // if (FindUserLikeId) {
            //     //Like에 있는 조합이 로그인된 userid와 post 테이블에 있다면 true,
            //     arr.push(true);
            // } else {
            //     arr.push(false);
            // }

            ProfilePic.push(profilePic);
            like.push(temp.length);
            Locals.push(locals);
            CommentNum.push(commentNum.length);
        }

        return { posts, Locals, like, CommentNum, ProfilePic };
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
            // raw: true,
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
    updatePost = async (postId, content, imageUrl, songTitle, singer) => {
        const updatePostData = await Post.update(
            { content, imageUrl, songTitle, singer },
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
