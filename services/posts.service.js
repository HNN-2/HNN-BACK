const PostRepository = require("../repositories/posts.repository");

class PostService {
    postRepository = new PostRepository();

    //게시글 전체 보기
    findAllPost = async () => {
        const allPost = await this.postRepository.findAllPost();
        const Posts = allPost.posts.map((post, i) => {
            const Locals = allPost.Locals;
            const like = allPost.like;

            //위에 map(post,i)가 있어서 굳이 for 문 돌리지 않아도 된다고 함.. 그리고 됨!
            // for (let i = 0; i <Locals.length; i++) {
            return {
                postId: post.postId,
                title: post.title,
                content: post.content,
                nickname: allPost.Locals[i].dataValues.nickname,
                profilePicture: allPost.Locals[i].dataValues.profilePicture,
                MBTI: allPost.Locals[i].dataValues.MBTI,
                createdAt: post.createdAt,
                like: allPost.like[i],
                commentNum: allPost.CommentNum[i],
                info: {
                    songTitle: post.songTitle,
                    singer: post.singer,
                },
            };
            // }
        });

        //게시글 내림 차순으로 정렬
        Posts.sort((a, b) => {
            return b.createdAt - a.createdAt;
        });

        if (Posts) {
            return { Posts, success: true };
        } else return { success: false };
    };

    //게시글 상세조회
    getPost = async (postId) => {
        const getPostData = await this.postRepository.findOnePost(postId);
        const getCommentData = await this.postRepository.findComments(postId);
        const postLikeData = getPostData.dataValues.Likes;
        const commentUserDate = getPostData.dataValues.Users;

        console.log(getPostData.dataValues.User.dataValues.MBTI);

        delete getPostData.dataValues.Likes; //배열 지우는 방법

        return {
            poster: getPostData,
            like: postLikeData.length,
            commenter: getCommentData,
            // MBTI: getPostData.dataValues.User.dataValues.MBTI,

            // commenter: {
            //     commentId: post.commentId,
            //     userId: post["User.MBTI"],
            //     nickname: post["User.nickname"],
            //     content: post.content,
            //     profilePicture: post["User.profilePicture"],
            //     MBTI: post["User.MBTI"],
            //     createdAt: post.createdAt,
        };
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

    //게시글 수정
    updatePost = async (postId, title, content, imageUrl) => {
        await this.postRepository.updatePost(postId, title, content, imageUrl);
        return {
            success: true,
            msg: "게시물이 수정되었습니다.",
        };
    };

    //게시글 삭제
    deletePost = async (postId) => {
        await this.postRepository.deletePost(postId);
        return { success: true, msg: "게시물 삭제에 성공했습니다." };
    };
}

module.exports = PostService;
