import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import coursesRoutes from "./routes/courses.routes";
import lessonsRoutes from "./routes/lessons.routes";
import prisma from "./config/prisma";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/lessons", lessonsRoutes);

app.get("/health", async (req, res) => {
    try {
        // Check DB connection
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            status: "ok",
            service: "rede-nave-backend",
            uptime: process.uptime(),
            timestamp: new Date(),
            database: "connected"
        });
    } catch (error) {
        console.error("Health check failed:", error);
        res.status(503).json({
            status: "error",
            service: "rede-nave-backend",
            uptime: process.uptime(),
            timestamp: new Date(),
            database: "disconnected",
            error: "Database connection failed"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Rede Nave Backend is running! 🚀");
});

export default app;
