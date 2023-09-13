import express from 'express';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middlewares/errorMiddleware';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes'; 
import chatRoutes from './routes/chatRoutes'; 
import messageRoutes from './routes/messageRoutes'
import cors from 'cors';
import { Server } from "socket.io";
import { createServer } from 'http';

const app = express();
dotenv.config();
connectDB();

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
  
      socket.on("disconnect", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    });
  
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user: any) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        io.to(user._id).emit("message recieved", newMessageRecieved);
      });
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
