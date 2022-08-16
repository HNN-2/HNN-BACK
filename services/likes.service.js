const LikeRepository = require("../repositories/likes.repository");

class LikesService {
    likeRepository = new LikeRepository();

    //내 좋아요 확인
    findLikeId = async (userId) => {
        const findById = await this.likeRepository.findLikeId(userId);
        return { findById };
    };

    //좋아요 등록 및 취소
    postLike = async (postId, userId) => {
        if (!this.likeRepository.checkPost(postId)) {
            return {
                success: false,
                msg: "해당되는 포스트가 없습니다.",
            };
        }

        const likeUpDown = await this.likeRepository.findLike(postId, userId);
        if (likeUpDown) {
            await this.likeRepository.deleteLike(postId, userId);
            return {
                msg: "좋아요!를 취소했습니다.",
            };
        } else {
            await this.likeRepository.createLike(postId, userId);
            return {
                msg: "좋아요!",
            };
        }
    };

    // 내가 좋아요 한 값 찾기, 내가 종아요 한 게시물 좋아요 횟수 찾기
    getMyLike = async (userId) => {
        const myLike = await this.likeRepository.getMyLike(userId);

        // const { likes, posts } = myLike;
        // const result = posts.map((curV, curI) => {
        //     return {
        //         postId: curV.postId,
        //         title: curV.title,
        //         content: curV.content,
        //         createdAt: curV.createdAt,
        //         like: likes[curI],
        //     };
        // });

        // if (result.length === 0) {
        //     return { msg: "아직 좋아요 한 게시물이 없습니다." };
        // } else {
        //     return result.sort((a, b) => {
        //         return b.like - a.like;
        //     });
        // }
    };
}

module.exports = LikesService;
