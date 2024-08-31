
const fs = require('fs').promises;
const { get } = require('https');
const path = require('path');
let pathJson = "../dao/fee.json"

async function getFee() {
    const jsonFilePath = path.join(__dirname, pathJson);

    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (err) {
        console.error('Error reading or parsing file:', err);
        throw err;
    }
}
async function addFee(fee){
    let arrayFee = await getFee();
    arrayFee.push(fee);

    await fs.writeFile(
        pathJson,
        JSON.stringify(arrayFee, null, 2),
        err => {
            if (err) throw err;
            console.log("Done writing");
        }
    );

}
async function deleteFee(feeId) {
    try {
        let arrayFee = await getFee();
        const filterFee = arrayFee.filter(fee => fee.id !== parseInt(feeId)); // Chuyển đổi feeId
        await fs.writeFile(
            pathJson,
            JSON.stringify(filterFee, null, 2),
            'utf8'
        );
        console.log('Xóa thành công');
    } catch (err) {
        console.error('Lỗi:', err);
    }
}

async function updateFee(newFee) {
    let arrayFee = await getFee(); 
    const index = arrayFee.findIndex(obj => obj.id === newFee.id);

    if (index !== -1) {
        arrayFee[index] = newFee;

        await fs.writeFile(
            pathJson,
            JSON.stringify(arrayFee, null, 2) 
        );
        console.log("Đã cập nhật thành công");
    } else {
        console.error('Sinh viên không tồn tại');
        throw new Error('Sinh viên không tồn tại');
    }
}   
 
module.exports = { getFee, addFee,deleteFee,  updateFee};
