import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import websiteRouter from "./routes/website.routes.js"
import billingRouter from "./routes/billing.routes.js"
import { stripeWebhook } from "./controllers/stripeWebhook.controller.js"

const app=express()

app.post("/api/stripe/webhook",express.raw({type:"application/json"}),stripeWebhook)
const port=process.env.PORT || 5000
app.use(express.json())
app.use(cookieParser())
// Allowed web + native (Capacitor) origins. Array form keeps credentialed CORS working per-origin.
const allowedOrigins = [
    "https://koda-ai-builder.onrender.com",
    process.env.FRONTEND_URL,
    "https://localhost",         // Capacitor Android (bundled app)
    "capacitor://localhost",     // Capacitor iOS
    "http://localhost:5173",     // Vite dev
    "http://localhost:4173",     // Vite preview
].filter(Boolean)
app.use(cors({
    origin: allowedOrigins,
    credentials:true
}))
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/website",websiteRouter)
app.use("/api/billing",billingRouter)

// CONSLE LOG TO KNOW WHEN SERVER PORT IS BEING ACTIVE
app.listen(port,()=>{
    console.log("server started")
    connectDb()
})
