const { Like, Post } = require("../models");

class LikeRepository {
    //Like 테이블에 params로 받아온 postId 있는지 확인
    // checkPost = async (postId) => {
    //     const checkPostDate = await Like.findOne({
    //         where: { postId },
    //     });
    //     if (!checkPostDate) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // };

    //좋아요 확인, 있으면 좋아요 숫자 +1 (혹은 likeNum)
    postLikeUpDown = async (postId) => {
        const checkPostDate = await Like.findOne({
            where: { postId },
        });
        if (!checkPostDate) {
            try {
                const existLike = await Post.findOne({
                    where: { postId },
                });

                await Post.update(
                    // { like: existLike.like + likeNum },
                    { like: existLike.like + 1 },
                    { where: { postId } }
                );
            } catch (err) {
                return;
            }
        }

        //좋아요 취소, 좋아요가 있을 때 취소하면 좋아요 숫자 -1
        checkExistLikeAndDelete = async (postId, userId) => {
            const checkExistLikeAndDeleteData = await Like.findOne({
                where: { postId: Number(postId), userId },
            });

            if (!checkExistLikeAndDeleteData === true) {
                return false;
            } else {
                this.postLikeUpDown(postId, -1);
                await Like.destroy({
                    where: { postId: Number(postId), userId },
                });
                return true;
            }
        };

        getMyLike = async (userId) => {
            let likes = [];
            let posts = [];

            // 내가 좋아요 한 값 찾기
            const myLikeData = await Like.findAll({ where: { userId } });
            // 내가 종아요 한 게시물 좋아요 횟수 찾기
            for (let i = 0; i < myLikeData.length; i++) {
                const likeArray = await Like.findAll({
                    where: { postId: myLikeData[i].postId },
                });
                likes.push(likeArray.length);
            }

            // 게시글 정보 가져오기
            for (let i = 0; i < myLikeData.length; i++) {
                const postInfo = await Post.findOne({
                    where: { postId: myLikeData[i].postId },
                });
                posts.push(postInfo);
            }

            return { likes, posts };
        };
    };
}

module.exports = LikeRepository;
