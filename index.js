
const express=require('express');
const cors = require('cors');

const authRouter = require('./routes/auth-routes.js');
const dotenv = require('dotenv');
const cookieParser =require('cookie-parser');
const packageRoute = require('./routes/PackagesRoutes.js');
const editProfile = require('./routes/editProfile_route.js');

dotenv.config();



const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {credentials:true, origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRouter);


app.use('/api/', packageRoute);
app.use('/api/',editProfile)


app.listen(PORT, ()=> {
  console.log(`Server is listening on port:${PORT}`);
})