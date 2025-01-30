import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
const app = express()

app.use(cors({ origin: 'https://intx.vercel.app' }));

//Midlewares
app.use(express.json({limit: "16kb"}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

//Routes
import testRoute from "./routes/test.route.js"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import blogRouter from "./routes/blog.route.js"
import commentRouter from "./routes/comment.route.js"
import homeRouter from "./routes/home.route.js"

app.use("/api/test", testRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);
app.use("/api/home", homeRouter);

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