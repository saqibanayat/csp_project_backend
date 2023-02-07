
const express=require('express');
const cors = require('cors');
const usersRouter = require('./routes/users-routes.js');
const authRouter = require('./routes/auth-routes.js');
const dotenv = require('dotenv');
const cookieParser =require('cookie-parser');
const packageRoute = require('./routes/PackagesRoutes.js');
const userProfile = require('./routes/ProfileEdit.js');
dotenv.config();



const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {credentials:true, origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',authRouter);
app.use('/api/register', usersRouter);
app.use('/api/',usersRouter);
app.use('/api/', packageRoute);
app.use('/api/',userProfile)


app.listen(PORT, ()=> {
  console.log(`Server is listening on port:${PORT}`);
})