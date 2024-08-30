const express = require('express');
const xlsx = require('xlsx');
const multer = require('multer');
const excelToJson = require("convert-excel-to-json")
const fs = require('fs-extra'); 
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { getStudent,addStudent,deleteStudentById,exportExcel,importData , updateStudent,searchStudentByName,sortStudentByDate,searchStudentByPrice,searchStudentByPaymentDate } = require('../service/studentService.js');
const { getFee,addFee, deleteFee , updateFee} = require('../service/feeService.js');
const { getPaymentDeadline, addPaymentDeadline,deletePaymentDeadlineById,updatePaymentDeadline } = require('../service/paymentDeadline.js');
const { getAllPaymentDeadline_student, addPaymentDeadline_student } = require('../service/paymentDeadline_student.js');

const app = express();
const PORT = 3000;
const upload = multer({ dest: path.join(__dirname, 'uploads') });

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    try {
        const students = await getStudent(); 
        res.json(students);
    } catch (error) {
        res.status(500).send('Lỗi khi đọc dữ liệu JSON');
    }
});

app.delete('/deleteStudentById/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        await deleteStudentById(studentId);
        res.status(200).send('Xóa thành công!');
    } catch (error) {
        res.status(404).send('Không tìm thấy id học phí.');
    }
});

app.post('/addStudent', async (req, res) => {
    try {
        const student = req.body;
        await addStudent(student);
        res.status(200).send('Sinh viên đã được thêm thành công!');
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).send('Có lỗi xảy ra khi thêm sinh viên.');
    }
});
app.put('/updateStudent', async (req, res) => {
    try {
        const student = req.body;
        await updateStudent(student);
        res.status(200).send('Cập nhật thành công!');
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).send('Có lỗi xảy ra khi cập nhật sinh viên.');
    }
});

app.get('/export-students', async (req, res) => {
    try {
        const filePath = await exportExcel(); 
        res.download(filePath, 'students_list.xlsx', (err) => {
            if (err) {
                res.status(500).send('Lỗi tải file');
            }
        });
    } catch (error) {
        res.status(500).send('Lỗi xuất file Excel.');
    }
});

app.post('/read', upload.single('file'), async (req, res) => {
    try {
        if (!req.file || !req.file.filename) {
            return res.status(400).json('khong có file upload');
        }
        const filePath = path.join(__dirname, 'uploads', req.file.filename);
        await fs.access(filePath);
        
        await importData(filePath);
        await fs.unlink(filePath);
        res.status(200).json('import thành công');
    } catch (error) {
        console.error('Error:', error);
    }
});
app.get('/findByPaymentDate/:paymentDate', async (req, res) => {
    try {
        const paymentDate = req.params.paymentDate;
        const listStudent = await searchStudentByPaymentDate(paymentDate);

        if (listStudent.length > 0) {
            res.status(200).json(listStudent);
        } else {
            res.status(404).send('Không tìm thấy sinh viên có tên này.');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).send('Lỗi khi tìm kiếm sinh viên.');
    }
});
app.get('/findByName/:name', async (req, res) => {
    try {
        const studentName = req.params.name;
        const listStudent = await searchStudentByName(studentName);

        if (listStudent.length > 0) {
            res.status(200).json(listStudent);
        } else {
            res.status(404).send('Không tìm thấy sinh viên có tên này.');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).send('Lỗi khi tìm kiếm sinh viên.');
    }
});

app.get('/sortByPrice', async (req, res) => {
    try {
        const listStudent = await searchStudentByPrice();

        if (listStudent.length > 0) {
            res.status(200).json(listStudent);
        } else {
            res.status(404).send('Không tìm thấy sinh viên.');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).send('Lỗi khi tìm kiếm sinh viên.');
    }
});

app.get('/sortByDate', async (req, res) => {
    try {
        const listStudent = await sortStudentByDate();

        if (listStudent.length > 0) {
            res.status(200).json(listStudent);
        } else {
            res.status(404).send('Không tìm thấy sinh viên có ngày nộp tiền này.');
        }
    } catch (error) {
        res.status(500).send('Có lỗi xảy ra khi tìm kiếm.');
    }
});

//Fee
app.get('/getAllFee', async (req, res) => {
    try {
        const message = await getFee();
        res.json(message);
    } catch (error) {
        res.status(500).send('Error reading JSON data');
    }
});
app.post('/addFee', async (req, res) => {
    try {
        const fee = req.body;
        await addFee(fee);
        res.status(200).send('Học phí đã được thêm thành công!');
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).send('Có lỗi xảy ra khi thêm .');
    }
});
app.delete('/deleteFeeById/:id', async (req, res) => {
    try {
        const feeId = req.params.id;
        await deleteFee(feeId);
        res.status(200).send('Xóa thành công!');
    } catch (error) {
        res.status(404).send('Không tìm thấy id học phí.');
    }
});

//paymentDeadlain
app.get('/getAllPaymentDeadlain/:feeId', async (req, res) => {
    try {
        const fee_id = req.params.feeId;
        const message = await getPaymentDeadline(fee_id);
        res.json(message);
    } catch (error) {
        res.status(500).send('Error reading JSON data');
    }
});
app.post('/addPaymentDeadlain', async (req, res) => {
    try {
        const fee = req.body;
        await addPaymentDeadline(fee);
        res.status(200).send('Học phí đã được thêm thành công!');
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).send('Có lỗi xảy ra khi thêm .');
    }
});
app.delete('/deletePaymentDeadlainById/:id', async (req, res) => {
    try {
        const feeId = req.params.id;
        await deletePaymentDeadlineById(feeId);
        res.status(200).send('Xóa thành công!');
    } catch (error) {
        res.status(404).send('Không tìm thấy id học phí.');
    }
});
app.put('/updatePaymentDeadline', async (req, res) => {
    try {
        const student = req.body;
        await updatePaymentDeadline(student);
        res.status(200).send('Cập nhật thành công!');
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).send('Có lỗi xảy ra khi cập nhật.');
    }
});

//PaymentDeadline_student
app.get('/getAllPaymentDeadline_student/:student_id', async (req, res) => {
    try {
        const student_id = req.params.student_id;

        const message = await getAllPaymentDeadline_student(student_id);
        res.json(message);
    } catch (error) {
        res.status(500).send('Error reading JSON data');
    }
});
app.post('/addPaymentDeadline_student', async (req, res) => {
    try {
        const paymentDeadline_student = req.body;
        await addPaymentDeadline_student(paymentDeadline_student);
        res.status(200).send('Thêm thành công!');
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).send('Có lỗi xảy ra khi thêm .');
    }
});

// app.use((req, res) => {
//     res.status(404).send('404: Not Found');
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
