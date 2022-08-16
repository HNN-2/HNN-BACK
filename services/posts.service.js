const PostRepository = require("../repositories/posts.repository");

class PostService {
    postRepository = new PostRepository();

    findAllPost = async () => {
        const allPost = await this.postRepository.findAllPost();

        const Posts = allPost.posts.map((post, i) => {
            const Locals = allPost.Locals;

            for (let i = 2; i < Locals.length; i++) {
                return {
                    title: post.title,
                    content: post.content,
                    createdAt: post.createdAt,
                    songTitle: post.songTitle,
                    singer: post.singer,

                    nickname: allPost.Locals[i].dataValues.nickname,
                    MBTI: allPost.Locals[i].dataValues.MBTI,
                    profilePicture: allPost.Locals[i].dataValues.profilePicture,

                    // like: allPost.like[index],
                };
            }
        });

        Posts.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        return {
            Posts,
        };
    };

    getPost = async (postId) => {
        const getPostData = await this.postRepository.findOnePost(postId);

        const Poster = {
            poster: {
                nickname: getPostData.detailPostUser["User.nickname"],
                title: getPostData.detailPostUser.title,
                content: getPostData.detailPostUser.content,
                MTBI: getPostData.detailPostUser["User.MBTI"],
                profilePicture:
                    getPostData.detailPostUser["User.profilePicture"],
                createdAt: getPostData.detailPostUser.createdAt,
                like: getPostData.like,
                imageUrl: getPostData.imageUrl,
            },
            info: {
                songTitle: getPostData.detailPostUser.songTitle,
                singer: getPostData.detailPostUser.singer,
            },

            commenter: {
                nickname: getPostData.detailCommentUser["User.nickname"],
                content: getPostData.detailCommentUser.content,
                profilePicture:
                    getPostData.detailCommentUser["User.profilePicture"],
                MTBI: getPostData.detailCommentUser["User.MBTI"],
                createdAt: getPostData.detailCommentUser.createdAt,
            },
        };

        console.log(Poster);

        // const commenter = {
        //     nickname,
        //     content,
        //     profilePicture,
        //     MBTI,
        //     createdAt,
        // };

        // console.log("service", Poster);
        return {
            Poster,
        };
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
        await this.postRepository.createPost(
            title,
            content,
            imageUrl,
            songTitle,
            singer,
            userId,
            MBTI
        );

        return {
            status: 200,
            msg: "게시물이 생성되었습니다!",
        };
    };

    updatePost = async (postId, title, content, imageUrl) => {
        await this.postRepository.updatePost(postId, title, content, imageUrl);
        return {
            msg: "게시물이 수정되었습니다.",
        };
    };

    deletePost = async (postId) => {
        await this.postRepository.deletePost(postId);
        return { msg: "게시물 삭제에 성공했습니다." };
    };
}

module.exports = PostService;
