
import {useEffect,useState} from 'react';
import axios from 'axios';

export default function ChatPage(){
    const fetchChats = async () =>{
        const data = await axios.get('/api/chat');

        console.log(data)
    }
    
    return(
        <div>
            CHat
        </div>    
    )
};