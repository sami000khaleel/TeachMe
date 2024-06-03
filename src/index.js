const express = require("express");
const app = express();
const Course = require("./models/course");
const multer = require("multer");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const student_router = require("./routes/student_router");
const teacher_router = require("./routes/teacher_router");
const executeQuery = require("./config/db");
const get_id = require("./models/get_id");
const cors = require("cors");
const bodyparser = require("body-parser");
const { Socket } = require("socket.io");

const mongoose = require("mongoose");
app.use(bodyparser.json());
const Call = require("./models/call");
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
mongoose
  .connect("mongodb://127.0.0.1:27017/teachMe")
  .then(() => console.log("connected to database"));
let connectedSockets = [];
io.on("connection", async (socket) => {
  try {
    let call
    let userId;
    let studentsIds;
    const { auth } = socket.handshake; // Accessing the query parameters
    const { role, email, password, id } = auth;

    if (!role) {
      throw new Error("A role must be sent");
    }

    if (role === "teacher") {
      const { id_teacher } = await get_id.teacher(email, password);
      console.log('connected ',role)
      if (id_teacher != id) {
        throw new Error("Error validating the teacher");
      }
      userId = id_teacher;
    } else if (role === "student") {
      const student = await get_id.student(email, password);
      userId = student.id_stu;
      let coursesIds = await Course.get_idcourse_forstudent(userId);
      console.log('connected ',role)
    } 
    else {
      throw new Error("Invalid role");
    }

    connectedSockets.push({
      socketId: socket.id,
      role,
      userId,
    });

    socket.on("teacher-offer", async ({ callId, offer }) => {
        console.log("teacher-offer");
        call = await Call.findById(callId).catch((err) => {
        socket.emit("error", { message: "call was not found" });
        throw err;
      });

      if (call.teacherId != userId) {
        throw new Error("This teacher does not give this course");
      }

      studentsIds = call.students.map((stu) => stu.studentId);

      call.offer = offer;
      call.onGoing = true;

      await call.save().catch((err) => {
        socket.emit("error", { message: "Call could not be saved" });
        throw err;
      });

      for (let connectedSocket of connectedSockets) {
        if (studentsIds.includes(connectedSocket.userId)) {
          socket
            .to(connectedSocket.socketId)
            .emit("teacher-offer", { offer, callId });
        }
      }
    });

    socket.on("teacher-candidate", async ({ offer, callId }) => {
      console.log("teacher-candidate");

       call = await Call.findById(callId).catch((err) => {
        socket.emit("error", { message: "call was not found" });
        throw err;
      });

      if (call.teacherId != userId) {
        throw new Error("Teacher is not the owner of this call");
      }

      call.teacherCandidate = candidate;

      await call.save().catch((err) => {
        socket.emit("error", { message: "Call could not be saved" });
        throw err;
      });

      for (let connectedSocket of connectedSockets) {
        if (studentsIds.includes(connectedSocket.userId)) {
          socket
            .to(connectedSocket.socketId)
            .emit("teacher-candidate", { candidate, callId,courseId:call.courseId });
        }
      }
    });
    socket.on("student-answer", async ({ callId, answer }) => {
       call = await Call.findById(callId).catch((err) => {
        socket.emit("error", { message: "call was not found" });
        throw err;
      });
      for (let student of call.students) {
        if (student.studentId == userId) {
          student.answer = answer;
          await call.save();
        }
      }
      for (let connectedSocket of connectedSockets)
        if (connectedSocket.userId == call.teacherId)
          socket
            .to(connectedSocket.socketId)
            .emit("student-answer", { answer, studentId });
    });
    socket.on("student-candidate", async ({ callId, candidate }) => {
      const call = await Call.findById(callId).catch((err) => {
        socket.emit("error", { message: "call was not found" });
        throw err;
      });
      for (let student of call.students) {
        if (student.studentId == userId) {
          student.candidate = candidate;
          await call.save();
        }
      }
      for (let connectedSocket of connectedSockets)
        if (connectedSocket.userId == call.teacherId)
          socket
            .to(connectedSocket.socketId)
            .emit("student-candidate", { answer, studentId });
    });
    socket.on("disconnect", async () => {
      if (role === "teacher" && call?._id) {
        call.onGoing = false;
        await call.save();
      }
      console.log("Disconnected");
      connectedSockets = connectedSockets.filter(
        (cs) => cs.socketId !== socket.id
      );
    });
  } catch (err) {
    console.log(err);
    socket.emit("error", { message: err.message });
  }
});
server.listen(3000, () => {
  console.log("server is runing");
});
app.use("/api/student", student_router);
app.use("/api/teacher", teacher_router);
