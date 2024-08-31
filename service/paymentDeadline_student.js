
const fs = require('fs').promises;
const { get } = require('https');
const path = require('path');
let pathJson = "../dao/paymentDeadline_student.json"

async function findAll() {
    const jsonFilePath = path.join(__dirname, pathJson);

    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        if(data !== ''){
            const jsonData = JSON.parse(data)
            return jsonData;
        }
        return null
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
async function findByStudentId(student_id) {
    const jsonFilePath = path.join(__dirname, pathJson);

    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(data);

        const filterDetail = jsonData.filter(obj => obj.student_id === parseInt(student_id)); 
        return filterDetail;
    } catch (err) {
        console.error('Error reading or parsing file:', err);
        throw err;
    }
}
async function addPaymentDeadline_student(paymentDeadline_student){
    const arrPaymentDeadline = await getPaymentDeadline(paymentDeadline_student.fee_id)
 
    let arrayPaymentDeadline_student = []
    if(await findAll() !== null){
        arrayPaymentDeadline_student = await findAll()
    }
    let paymentDeadline_id = null;

    for(let i=0; i< arrPaymentDeadline.length;i++){
        let data = arrPaymentDeadline[i]
        let obj = {
            student_id: paymentDeadline_student.student_id,
            paymentDeadline_id : data.id,
            status: "Chưa hoàn thành"
        }
        arrayPaymentDeadline_student.push(obj);
        paymentDeadline_id = data.id
    }

    await fs.writeFile(
        pathJson,
        JSON.stringify(arrayPaymentDeadline_student,null, 2),
        err => {
            if (err) throw err;
            console.log("Done writing");
        }
    );
    return  updateStatusStudent(paymentDeadline_student.student_id,paymentDeadline_id,null)
}

async function updateStatusStudent(student_id,paymentDeadline_id,price) {
    let  arrayPaymentDeadline_student = await findAll()
    let filterArrPaymentDeadline_student = arrayPaymentDeadline_student.filter(obj => obj.student_id === student_id && obj.paymentDeadline_id === paymentDeadline_id)
 
    let arrayStudent = await getStudent(); 
    const index = arrayStudent.findIndex(obj => obj.id === student_id);
   
    if (index !== -1) {
        if(price != null){
            arrayStudent[index].price = arrayStudent[index].price + price;
        }  
        await fs.writeFile(
            "../dao/student.json",
            JSON.stringify(arrayStudent, null, 2) 
        );
        
        let  arrayPaymentDeadline_student1 = await findAll()
        let filterArrPaymentDeadline_student1 = arrayPaymentDeadline_student1.filter(obj => obj.student_id === student_id && obj.paymentDeadline_id === paymentDeadline_id)
     
        const checkStatusFees1 = filterArrPaymentDeadline_student1.find(obj => obj === "Chưa hoàn thành")
        let statusStudent = "Đã hoàn thành"
        if(checkStatusFees1 !== undefined){
            statusStudent = "Chưa hoàn thành"
        }
    
        arrayStudent[index].status = statusStudent;
        let a =  arrayStudent[index]
        await fs.writeFile(
            "../dao/student.json",
            JSON.stringify(arrayStudent, null, 2) 
        );
        
        return arrayStudent[index];
    } else {
        console.error('Sinh viên không tồn tại');
        throw new Error('Sinh viên không tồn tại');
    }
    return null;
}   
async function getStudent() {
    const jsonFilePath = path.join(__dirname, "../dao/student.json");

    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (err) {
        console.error('Error reading or parsing file:', err);
        throw err;
    }
}
async function updatePaymentDeadline_student(newValue) {
    let arrayFee = await findByStudentId(newValue.student_id); 
    const index = arrayFee.findIndex(obj => obj.paymentDeadline_id === newValue.paymentDeadline_id );

    if (index !== -1) {
        arrayFee[index].status = newValue.status;
        let a=  arrayFee[index]
        await fs.writeFile(
            pathJson,
            JSON.stringify(arrayFee, null, 2) 
        );
        console.log("Đã cập nhật thành công");
    } else {
        console.error('Hoc phi không tồn tại');
        throw new Error('Hoc phi không tồn tại');
    }
    return updateStatusStudent(newValue.student_id,newValue.paymentDeadline_id,newValue.price)
}   
 
module.exports = { getAllPaymentDeadline_student,addPaymentDeadline_student,updatePaymentDeadline_student};
