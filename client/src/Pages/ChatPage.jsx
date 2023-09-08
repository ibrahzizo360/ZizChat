
import { Box } from '@chakra-ui/react';
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../store/authSlice';
import { useState } from 'react';
import SideDrawer from '../Components/miscellaneous/SideDrawer';

export default function ChatPage(){
    const authState = useSelector(selectAuthState);
    const { user } = authState;
    const [fetchAgain, setFetchAgain] = useState(false);
    
    return (
        <div className='w-full'>
          {user && <SideDrawer />}
          <Box display="flex" justifyContent="space-between" h="90.5vh" p="10px">
            {user && <MyChats fetchAgain={fetchAgain} />}
            {user && (
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </Box>
        </div>
      );
    };