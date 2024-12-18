import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
const app = express()

app.use(cors())

//Midlewares
app.use(express.json({limit: "16kb"}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

//Routes
import testRoute from "./routes/test.route.js"
import authRoute from "./routes/auth.route.js"

app.use("/api/test", testRoute);
app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.log((err.message), "hellooaskn");
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
export { app }