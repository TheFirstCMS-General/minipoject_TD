const fs = require('fs').promises; 
const xlsx = require('xlsx');
const { get } = require('https');
const path = require('path');
const { updateFeeNumber } = require('./feeService.js');
let pathJson = "../dao/paymentDeadline.json"

async function getPaymentDeadline(fee_id) {
    const jsonFilePath = path.join(__dirname, pathJson);
    
    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        if(data != ""){
        const jsonData = JSON.parse(data);
        const filterData = jsonData.filter(obj => obj.fee_id === parseInt(fee_id));
        return filterData;
        }
        return null;
    } catch (err) {
        console.error('Error reading or parsing file:', err);
        throw err;
    }
}
async function addPaymentDeadline(paymentDeadline, fee_id) {
    const jsonFilePath = path.join(__dirname, pathJson);
    let arrayPaymentDeadline;
    const existingData = await getAll();
    if (existingData !== null) {
        arrayPaymentDeadline = existingData;
    } else {
        arrayPaymentDeadline = [];
    }
    arrayPaymentDeadline.push(paymentDeadline);

    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(arrayPaymentDeadline, null, 2), 'utf8');
        console.log("Done writing");
    } catch (err) {
        console.error('Error writing file:', err);
        throw err;
    }
}
async function deletePaymentDeadlineById(id) {
    try {
        const jsonFilePath = path.join(__dirname, pathJson);
        let arraypaymentDeadline = await getPaymentDeadline();
        const updatedpaymentDeadlines = arraypaymentDeadline.filter(paymentDeadline => paymentDeadline.id !== parseInt(id));
        await fs.writeFile(
            jsonFilePath,
            JSON.stringify(updatedpaymentDeadlines, null, 2),
            'utf8'
        );
        console.log('Xóa thành công');
    } catch (err) {
        console.error('Lỗi:', err);
    }
}

async function updatePaymentDeadline(newpaymentDeadline) {
    let arraypaymentDeadline = await getAll(); 
    const index = arraypaymentDeadline.findIndex(obj => obj.id === newpaymentDeadline.id);

    if (index !== -1) {
        arraypaymentDeadline[index].deadline = newpaymentDeadline.newDeadline
        arraypaymentDeadline[index].price = parseInt(newpaymentDeadline.newPrice)

        await fs.writeFile(
            pathJson,
            JSON.stringify(arraypaymentDeadline, null, 2) 
        );
        console.log("Đã cập nhật thành công");
    } else {
        console.error('Sinh viên không tồn tại');
        throw new Error('Sinh viên không tồn tại');
    }
}   
async function getAll() {
    const jsonFilePath = path.join(__dirname, pathJson);

    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        if(data != ""){
        const jsonData = JSON.parse(data);
        return jsonData;
        }
        return null;
    } catch (err) {
        console.error('Error reading or parsing file:', err);
        throw err;
    }
}
module.exports = { getPaymentDeadline, addPaymentDeadline,deletePaymentDeadlineById,updatePaymentDeadline};
