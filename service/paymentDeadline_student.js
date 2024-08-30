
const fs = require('fs').promises;
const { get } = require('https');
const path = require('path');
let pathJson = "../dao/paymentDeadline_student.json"

async function findAll() {
    const jsonFilePath = path.join(__dirname, pathJson);

    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.stringify(data)
        return jsonData;
    } catch (err) {
        console.error('Error reading or parsing file:', err);
        throw err;
    }
}
async function getPaymentDeadline(fee_id) {
    const jsonFilePath = path.join(__dirname, "../dao/paymentDeadline.json");
    
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
async function getPaymentDeadlineById(id) {
    const jsonFilePath = path.join(__dirname, "../dao/paymentDeadline.json");
    
    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        if(data != ""){
        const jsonData = JSON.parse(data);
        const filterData = jsonData.filter(obj => obj.id === parseInt(id));
        return filterData;
        }
        return null;
    } catch (err) {
        console.error('Error reading or parsing file:', err);
        throw err;
    }
}
async function getAllPaymentDeadline_student(student_id) {
    const jsonFilePath = path.join(__dirname, pathJson);

    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(data);

        const filterDetail = jsonData.filter(obj => obj.student_id === parseInt(student_id)); 
        let arr =[]
        for(let i=0; i< filterDetail.length;i++){
            let data = filterDetail[i]
            const arrPaymentDeadline = await getPaymentDeadlineById(data.paymentDeadline_id)
            let obj = {
                paymentDeadline_id : arrPaymentDeadline[0].id,
                name: arrPaymentDeadline[0].name,
                price: arrPaymentDeadline[0].price,
                deadline: arrPaymentDeadline[0].deadline,
                status: data.status
            }
            arr.push(obj)
        }
        return arr;
    } catch (err) {
        console.error('Error reading or parsing file:', err);
        throw err;
    }
}
async function addPaymentDeadline_student(paymentDeadline_student){
    const arrPaymentDeadline = await getPaymentDeadline(paymentDeadline_student.fee_id)
 
    let arrayPaymentDeadline_student = []
    if(await findAll() !== '""'){
        arrayPaymentDeadline_student = await findAll()
    }

    for(let i=0; i< arrPaymentDeadline.length;i++){
        let data = arrPaymentDeadline[i]
        let obj = {
            student_id: paymentDeadline_student.student_id,
            paymentDeadline_id : data.id,
            status: "Chưa hoàn thành"
        }
        arrayPaymentDeadline_student.push(obj);
    }

    await fs.writeFile(
        pathJson,
        JSON.stringify(arrayPaymentDeadline_student),
        err => {
            if (err) throw err;
            console.log("Done writing");
        }
    );

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
 
module.exports = { getAllPaymentDeadline_student,addPaymentDeadline_student};
