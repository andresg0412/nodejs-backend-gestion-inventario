const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const sequelize = require('./config/database');
const User = require('./models/user');
const errorHandler = require('./middleware/errorMiddleware');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para analizar JSON
app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(require('helmet')());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenido, API de prueba para MagicLog');
});

app.use(errorHandler);
app.use(helmet());
const allowedOrigins = [
    ////'https://magiclog-front.onrender.com',
    'http://localhost:3000',
];
//app.use(cors({
    //origin: 'https://magiclog-front.onrender.com',
    //credentials: true,
//));
//app.use((req, res, next) => {
//    res.setHeader(
//        "Access-Control-Allow-Origin",
//        "https://magiclog-front.onrender.com"
//    );
//    res.setHeader(
//        "Access-Control-Allow-Methods",
//        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
//    );
//    res.setHeader(
//        "Access-Control-Allow-Headers",
//        "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
//    );
//    res.setHeader("Access-Control-Allow-Credentials", true);
//    res.setHeader("Access-Control-Allow-Private-Network", true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
//    res.setHeader("Access-Control-Max-Age", 7200);

//    next();
//})

app.listen(port, () => {
});
