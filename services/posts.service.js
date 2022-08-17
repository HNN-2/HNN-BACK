const PostRepository = require("../repositories/posts.repository");

class PostService {
    postRepository = new PostRepository();

    //게시글 전체 보기
    findAllPost = async (userId) => {
        const allPost = await this.postRepository.findAllPost(userId);

        // console.log(allPost.Locals);

        const Posts = allPost.posts.map((post, i) => {
            const Locals = allPost.Locals;
            const like = allPost.like;
            const arr = allPost.arr;

            return {
                postId: post.postId,
                title: post.title,
                content: post.content,
                // nickname: allPost.Locals[i].dataValues.nickname,
                nickname: post.nickname,
                // profilePicture: allPost.Locals[i].dataValues.profilePicture,
                profilePicture: post.profilePicture,
                // MBTI: allPost.Locals[i].dataValues.MBTI,
                MBTI: post.MBTI,
                createdAt: post.createdAt,
                like: allPost.like[i],
                likepost: allPost.arr[i],
                commentNum: allPost.CommentNum[i],
                info: {
                    songTitle: post.songTitle,
                    singer: post.singer,
                },
            };
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
        if (!postId) {
            return { success: false };
        } else {
            const getPostData = await this.postRepository.findOnePost(postId);
            const getCommentData = await this.postRepository.findComments(
                postId
            );
            const postLikeData = getPostData.dataValues.Likes;
            const commentUserDate = getPostData.dataValues.Users;

            delete getPostData.dataValues.Likes; //배열 지우는 방법

            return {
                success: true,
                poster: getPostData,
                like: postLikeData.length,
                commenter: getCommentData,
            };
        }
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
        //입력 유무 확인
        if (title || content || imageUrl || songTitle || singer == undefined) {
            return { success: false };
        }

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
    updatePost = async (
        postId,
        title,
        content,
        imageUrl,
        songTitle,
        singer
    ) => {
        if (
            !postId ||
            title ||
            content ||
            imageUrl ||
            songTitle ||
            singer == undefined
        ) {
            return {
                success: false,
                msg,
            };
        } else {
            await this.postRepository.updatePost(
                postId,
                title,
                content,
                imageUrl
            );
            return {
                success: true,
                msg,
                // msg: "게시물이 수정되었습니다.",
            };
        }
    };

    //게시글 삭제
    deletePost = async (postId) => {
        if (!postId) {
            return { success: false, msg };
        }
        await this.postRepository.deletePost(postId);
        return { success: true, msg };
    };
}

module.exports = PostService;
