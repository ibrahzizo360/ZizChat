

import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import {Routes, Route} from "react-router-dom";

import './App.css';


function App() {
  return (
    <div className="min-h-screen text-black flex bg-cover bg-center bg-[url('./background.png')]">
     <Routes> 
      <Route path='/' index element ={<HomePage/>} />
      <Route path='/chats' element ={<ChatPage/>} />
    </Routes>
    </div>
  );
} 

export default App;
