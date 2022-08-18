const multer = require('multer');

const AWS = require('aws-sdk')
const multerS3 = require('multer-s3')
require("dotenv").config();
const env = process.env;

AWS.config.update({
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
 });

const s3 = new AWS.S3();

    const upload =multer({
       
    storage: multerS3({ // 저장한공간 정보 : 하드디스크에 저장
        s3 : s3,
        bucket : "gwonyeong",
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key : function (req, file, cb){
                       
            cb(null, `${Date.now()}__${file.originalname}.jpg`)
        }
        
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
},     
);

module.exports = upload;
// => 이렇게 설정한 upload라는 객체를 뒤에 라우터에 장착하면 된다