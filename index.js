const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: true,
  },
});
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const redis = require("redis");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

const client = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true,
});

client.on("error", (err) => {
  console.log(err);
});
const PORT = process.env.PORT || 5000;
// mongoose params
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

// auth middleware
const { requireAuth, checkUserActive } = require("./middleware/auth");

// routes
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const reminderRoutes = require("./routes/reminder");
const approvalRoutes = require("./routes/approval");

// dashboard controls
const { dashboardEndPoint } = require("./controls/dashboard");
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("server running");
});
app.get("/dashboard", requireAuth, dashboardEndPoint);
app.use("/closeExpense", requireAuth, approvalRoutes);
app.use(userRoutes);
app.use("/expense", requireAuth, checkUserActive, expenseRoutes);
app.use("/reminder", requireAuth, reminderRoutes);

// websocket

io.on("connection", (socket) => {
  socket.on("send-expense", (data) => {
    socket.broadcast.emit("receive-expense", data);
  });
  socket.on("delete-expense", (data) => {
    socket.broadcast.emit("receive-delete-expense", data);
  });
  socket.on("close-expense", (data) => {
    socket.broadcast.emit("receive-close-expense", data);
  });
  socket.on("approve-expense", (data) => {
    socket.broadcast.emit("receive-approve-expense", data);
  });
  socket.on("change-user-status", (data) => {
    socket.broadcast.emit("receive-user-status", data);
  });
  socket.on("reject-request", (data) => {
    socket.broadcast.emit("receive-reject-request", data);
  });
});

// connecting mongoose database and create server
mongoose
  .connect(process.env.MONGO_URI, connectionParams)
  .then(() => {
    server.listen(PORT, () => {
      console.log("server running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
