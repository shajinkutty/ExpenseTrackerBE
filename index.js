const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const redis = require("redis");
const cookieParser = require("cookie-parser");
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

app.use(express.json());
app.use(cookieParser());
app.get("/dashboard", requireAuth, dashboardEndPoint);
app.use("/closeExpense", requireAuth, approvalRoutes);
app.use(userRoutes);
app.use("/expense", requireAuth, checkUserActive, expenseRoutes);
app.use("/reminder", requireAuth, reminderRoutes);

// connecting mongoose database and create server
mongoose
  .connect(process.env.MONGO_URI, connectionParams)
  .then(() => {
    app.listen(PORT, () => {
      console.log("server running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
