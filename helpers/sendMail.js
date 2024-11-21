const nodemailer = require('nodemailer');

module.exports.sendMail=(email, subject,html)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Hoặc sử dụng 'SMTP' cho máy chủ email khác
        auth: {
            user: process.env.EMAIL_USER, // Địa chỉ email của bạn
            pass: process.env.EMAIL_PASSWORD // Mật khẩu ứng dụng (nếu sử dụng Gmail, bạn nên tạo mật khẩu ứng dụng)
        }
    
    });
    const mailOptions = {
        from: process.env.EMAIL_USER, // Địa chỉ email người gửi
        to: email, // Địa chỉ email người nhận
        subject: subject, // Tiêu đề email
        html: html, // Nội dung email
    
    };
    
    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error occurred: ' + error.message);
        }
        console.log('Email sent: ' + info.response);
    });
}