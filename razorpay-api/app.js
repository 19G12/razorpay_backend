// key_id - rzp_test_Dc6srvy7yHvxnq
// key_secret - VZc9JsrY0coqC1YbAEkOTgQi

import express from 'express';
import cors from 'cors';
import router from './routes/payments.js';

// Initialize app
const app = express();
app.use(express.json());
app.use(cors({origin: '*'}));

// Router
app.use("/api/payments", router);

// Listen on server load
app.listen(5000, ()=> {
    console.log('App is running on port 5000');
})