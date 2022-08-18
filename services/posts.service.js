const PostRepository = require("../repositories/posts.repository");

class PostService {
    postRepository = new PostRepository();

    //게시글 전체 보기
    findAllPost = async (userId) => {
        const allPost = await this.postRepository.findAllPost(userId);

        const Posts = allPost.posts.map((post, i) => {
            const Locals = allPost.Locals;
            const like = allPost.like;
            // const arr = allPost.arr;
            const ProfilePic = allPost.ProfilePic;

            return {
                postId: post.postId,
                title: post.title,
                content: post.content,
                nickname: allPost.ProfilePic[i].nickname,
                // profilePicture: allPost.Locals[i].dataValues.profilePicture,
                profilePicture: allPost.ProfilePic[i].profilePicture, //추가
                // MBTI: allPost.Locals[i].dataValues.MBTI,
                MBTI: post.MBTI,
                createdAt: post.createdAt,
                like: allPost.like[i],
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
        // if (!postId) {
        //     return { success: false };
        // } else {
        const getPostData = await this.postRepository.findOnePost(postId);
        const getCommentData = await this.postRepository.findComments(postId);
        const postLikeData = getPostData.dataValues.Likes;
        const commentUserDate = getPostData.dataValues.Users;

        delete getPostData.dataValues.Likes; //배열 지우는 방법

        return {
            success: true,
            poster: getPostData,
            like: postLikeData.length,
            commenter: getCommentData,
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
        //입력 유무 확인
        // if (title || content || imageUrl || songTitle || singer == undefined) {
        //     return { success: false };
        // }

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
    //이미지 수정
    updateImage = async (postId,imageLocation) => {
        console.log(postId, imageLocation)
        await this.postRepository.updatePostImage(postId, imageLocation)
        return {
            msg : "이미지 등록",
            success : "true"
        }
    }
    //게시글 수정
    updatePost = async (postId, content, imageUrl, songTitle, singer) => {
        await this.postRepository.updatePost(
            postId,
            content,
            imageUrl,
            songTitle,
            singer
        );
        return true;
    };

    //게시글 삭제
    deletePost = async (postId) => {
        // if (!postId) {
        //     return { success: false, msg };
        // }
        await this.postRepository.deletePost(postId);
        return true;
    };
}
module.exports = PostService;
