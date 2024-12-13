// const cloudinary= require("cloudinary").v2
// const streamifier= require("streamifier")
// require('dotenv').config();
// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.CLOUD_KEY, 
//     api_secret: process.env.CLOUD_SECRET
// });

// module.exports.upload= (req, res, next) =>{
//     if(req.file && req.files.length > 0){
//         let streamUpload = (req) => {
//             return new Promise((resolve, reject) => {
//                 let stream = cloudinary.uploader.upload_stream((error, result) => {
//                     if (result) {
//                       resolve(result.secure_url);
//                     } else {
//                       reject(error);
//                     }
//                   }
//                 );
    
//               streamifier.createReadStream(req.file.buffer).pipe(stream);
//             });
//         };
//         Promise.all(uploadPromises)
//             .then(urls => {
//                 req.body.thumbnail = urls; // Lưu mảng các URL vào req.body.thumbnail
//                 next(); // Tiếp tục với middleware tiếp theo
//             })
//             .catch(error => {
//                 console.error("Upload failed:", error);
//                 res.status(500).send("Error uploading files");
//             });
//         // async function upload(req) {
//         //     let result = await streamUpload(req);
            
//         //     req.body[req.file.fieldname]= result.secure_url
//         //     next()
        
//         // upload(req);
//     }else{
//         next()
//     }
// }
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require('dotenv').config();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_KEY, 
    api_secret: process.env.CLOUD_SECRET
});

module.exports.upload = (req, res, next) => {
    if (req.files && req.files.length > 0) { // Kiểm tra nếu có tệp
        // Tạo một mảng các Promise cho việc tải lên
        let uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result.secure_url); // Trả về URL an toàn
                    } else {
                        reject(error);
                    }
                });

                streamifier.createReadStream(file.buffer).pipe(stream); // Tải tệp lên
            });
        });

        // Chờ tất cả các upload hoàn thành
        Promise.all(uploadPromises)
            .then(urls => {
                req.body.thumbnail = urls; // Lưu mảng các URL vào req.body.thumbnail
                next(); // Tiếp tục với middleware tiếp theo
            })
            .catch(error => {
                console.error("Upload failed:", error);
                res.status(500).send("Error uploading files");
            });
    } else {
        next(); // Không có tệp nào, tiếp tục
    }
};
module.exports.uploadSingle = (req, res, next) => {
    if (req.file) { // Kiểm tra nếu có tệp
        const file = req.file; // Sử dụng req.file thay vì req.files

        const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
                req.body.thumbnail = result.secure_url; // Gán URL vào req.body.thumbnail
                next(); // Tiếp tục với middleware tiếp theo
            } else {
                reject(error);
            }
        });

        streamifier.createReadStream(file.buffer).pipe(stream); // Tải tệp lên
    } else {
        next(); // Không có tệp nào, tiếp tục
    }
};