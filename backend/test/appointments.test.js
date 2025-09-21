const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');

// Define the authorization token
const authToken = 'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18ybkNIZFhoSXRmMXlxTVFKU3NaTHFvZ05YaEkiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJleHAiOjE3Mjk0MzIzOTYsImlhdCI6MTcyOTQzMjMzNiwiaXNzIjoiaHR0cHM6Ly9jYXVzYWwtYm94ZXItOTAuY2xlcmsuYWNjb3VudHMuZGV2IiwibmJmIjoxNzI5NDMyMzI2LCJzaWQiOiJzZXNzXzJuY0ZDYURVOFpCeDIybUhPRlptNVhiTlZpbCIsInN1YiI6InVzZXJfMm5OUXpFUG9ZN3BSWENRNXNVdzg4bmR1WjVkIn0.i_CXT3h4H3IXJO6zSMeUq8bw_jBcTP3PSZBs7BPzL3sCzIL4AE0Eimu4lQQdwmV9GEhloV84pjoSCHX-C4lOfKYsDUVgbQMKRouSs6pf6sqRHglH7rFo_BfA6R1-vYJMwan2H5pEHqVImD4rv8vd9er8YF6BK4pmGjllhsclqVX2XoM9P4q7ZeqHXmUSZMMyzIldIIHPg53qlGak9u_EqGmmFw3YJ1OwJBoQoyLohVezl0FsGnpoMcRhUkXd7q9c_7GHGmCBswlOasHeabm0RczcxWC6jWlr72WK1Qqa9e0yCcvFua1-lp5EGA798HmBAIaEjJytTTtWTThmImK4Fw'; // Replace with a valid token for testing

describe('POST /appointment/create-appointment', () => {
    it('should create a new appointment', async () => {
        const res = await request(app)
            .post('/appointment/create-appointment')
            .set('Authorization', authToken)
            .send({
                patient_name: 'John Doe',
                patient_email: 'johndoe@example.com',
                age: 30,
                doctor_name: 'Dr. Smith',
                doc_id: '67079a509fcf32e3b67793c4',
                day: 'Monday',
                slot: '10:00 AM',
                appointment_date: new Date().toISOString(),
                note: 'Initial consultation',
                status: 'Pending'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Appointment created successfully');
        expect(res.body.appointment).toHaveProperty('patient_name', 'John Doe');
    });

    
});

describe('GET /get-doctor-appointments', () => {
    it('should return pending appointments for the doctor', async () => {
        const res = await request(app)
            .get('/appointment/get-doctor-appointments')
            .set('Authorization', authToken);

            console.log(res.body);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', "Today's pending appointments retrieved successfully.");
        expect(res.body).toHaveProperty('appointments');
    });

});


describe('DELETE /delete-appointment/:id', () => {
    it('should delete an appointment', async () => {
        const appointmentId = '6714eec8c72aa0ee62c37561'; 

        const res = await request(app)
            .delete(`/appointment/delete-appointment/${appointmentId}`)
            .set('Authorization', authToken);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Appointment deleted successfully');
    });

});
