const Inventory = require('../model/inventory.model');

module.exports.generateRandomString = (length)=>{
    const characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result="";
    for(let i=0;i<=length;i++){
        result+=characters.charAt(Math.floor(Math.random()*characters.length))
    }
    return result
}
module.exports.generateRandomNumber = (length)=>{
    const characters="0123456789"
    let result="";
    for(let i=0;i<length;i++){
        result+=characters.charAt(Math.floor(Math.random()*characters.length))
    }
    return result
}
module.exports.generateCreatment = async()=>{
    try {
        const lastInventory = await Inventory.findOne().sort({ code: -1 });
        let newNumber;

        if (lastInventory) {
            const lastCode = lastInventory.code;

            // Kiểm tra xem lastCode có bắt đầu bằng 'RI' và có đủ độ dài sau 'RI'
            if (lastCode.startsWith('RI') && lastCode.length > 2) {
                const lastNumber = parseInt(lastCode.replace('RI', '')); // Lấy số sau 'RI'

                // Kiểm tra xem lastNumber có phải là số hợp lệ không
                if (!isNaN(lastNumber)) {
                    newNumber = lastNumber + 1; 
                } else {
                    throw new Error('Last number is not a valid number');
                }
            } else {
                throw new Error('Last code format is invalid');
            }
        } else {
            newNumber = 1;
        }

        return `RI${String(newNumber).padStart(6, '0')}`;
    } catch (error) {
        console.error('Error generating code:', error);
        throw error; // Ném lỗi nếu có
    }
}