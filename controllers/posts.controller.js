const PostService = require("../services/posts.service");
// const requireLogin = require("../middlewares/auth-middleware");

class PostsController {
    postService = new PostService();

    //전체 게시물 조회
    getAllPosts = async (req, res, next) => {
        const { userId } = res.locals;

        const postsData = await this.postService.findAllPost(userId);
        res.json({ data: postsData });
        // res.json({ data: postsData.Posts });
    };

    //상세 게시물 조회
    getOnePost = async (req, res, next) => {
        const { postId } = req.params;
        const postData = await this.postService.getPost(postId);

        res.json({
            data: postData,
        });
    };

    //게시글 생성
    createPost = async (req, res, next) => {
        const { title, content, imageUrl, songTitle, singer } = req.body;
        const { userId, MBTI } = res.locals;

        const createPostData = await this.postService.createPost(
            title,
            content,
            imageUrl,
            songTitle,
            singer,
            userId,
            MBTI
        );
        res.json({ data: createPostData.msg });
    };
    
    //게시글 수정
    updatePost = async (req, res, next) => {
        const { postId } = req.params;
        const { title, content, imageUrl, songTitle, singer } = req.body;
        const updatePostData = await this.postService.updatePost(
            postId,
            title,
            content,
            imageUrl,
            songTitle,
            singer
        );

        // res.status(updatePostData.status).json({ data: updatePostData });
        res.json({ data: updatePostData, msg: "게시물 수정에 성공했습니다." });
    };

    //게시글 삭제
    deletePost = async (req, res, next) => {
        const { postId } = req.params;
        const deletPostData = await this.postService.deletePost(postId);
        res.json({
            data: deletPostData,
            msg: "게시물 삭제에 성공했습니다.",
        });
    };
}
module.exports = PostsController;
