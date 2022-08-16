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
                    nickname: allPost.Locals[i].dataValues.nickname,
                    profilePicture: allPost.Locals[i].dataValues.profilePicture,
                    MBTI: allPost.Locals[i].dataValues.MBTI,
                    createdAt: post.createdAt,
                    // like: allPost.like[index],
                    //commentNum:
                    info: {
                        songTitle: post.songTitle,
                        singer: post.singer,
                    },
                };
            }
        });

        Posts.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        if (Posts) {
            return { Posts, success: true };
        } else return { success: false };
    };

    getPost = async (postId) => {
        const getPostData = await this.postRepository.findOnePost(postId);
        const getCommentData = await this.postRepository.findComments(postId);

        console.log(
            "서비스",
            getPostData.detailPostUser,
            getCommentData.detailCommentUser
        );

        return { poster: getPostData, commenter: getCommentData };
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
            success: true,
            msg: "게시물이 생성되었습니다!",
        };
    };

    updatePost = async (postId, title, content, imageUrl) => {
        await this.postRepository.updatePost(postId, title, content, imageUrl);
        return {
            success: true,
            msg: "게시물이 수정되었습니다.",
        };
    };

    deletePost = async (postId) => {
        await this.postRepository.deletePost(postId);
        return { success: true, msg: "게시물 삭제에 성공했습니다." };
    };
}

module.exports = PostService;