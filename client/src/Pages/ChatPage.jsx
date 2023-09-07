
import { Box } from '@chakra-ui/react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import SideDrawer from '../Components/Miscellaneous/SideDrawer';
import MyChats from '../Components/Miscellaneous/MyChats';
import ChatBox from '../Components/Miscellaneous/ChatBox';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../store/authSlice';

export default function ChatPage(){
    const authState = useSelector(selectAuthState);
    const { user, isAuthenticated } = authState;
    
    return(
        <div className="w-full">
           {user && <SideDrawer/>}
           <Box
           display='flex'
           justifyContent={'space-between'}
           w="100%"
           h="91.5vh"
           p="10px"
           >
            {user && <MyChats/>}
            {user && <ChatBox/>}
           </Box>
        </div>    
    )
};