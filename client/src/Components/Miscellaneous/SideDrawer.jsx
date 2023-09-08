import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import React, { useState } from 'react'
import ProfileModal from './ProfileModal'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuthState, setAuthState } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import Axios from '../../Utils/Axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
import { selectChatState, setChats, setSelectedChat } from '../../store/chatSlice'

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const authState = useSelector(selectAuthState);
  const { user } = authState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chat = useSelector(selectChatState);
  const {chats} = chat;


  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    dispatch(setAuthState(null))
    navigate('/')
  }

  const accessChat = async (userId) => {

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await Axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) dispatch(setChats([data, ...chats]));
      dispatch(setSelectedChat(data));
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await Axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
        <Box
        display='flex'
        justifyContent={'space-between'}
        bg={'white'}
        alignItems={'center'}
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth={'3px'}
        borderColor={'#E8E8E8'}
        >
            <Tooltip label="Search users to chat" hasArrow placement='bottom-end'>
                <Button variant="ghost" onClick={onOpen}>
                    <i className="fas fa-search "></i>
                    <Text d={{base:"none", md: "flex"}} p="4">
                        Search User
                    </Text>
                </Button>
            </Tooltip>
            
            <Text fontFamily={'Work sans'} fontSize={'2xl'}>
                Zizi-Chat
            </Text>

            <div>
            <Menu>
                <MenuButton p={1} fontSize="2xl" margin={1}>
                    <BellIcon/>
                </MenuButton>
            </Menu>

            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    {user ? (
                    <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                    ) : (
                    <Spinner />
                    )}
                </MenuButton>
                <MenuList>
                    <ProfileModal>
                    <MenuItem>My Profile</MenuItem>
                    </ProfileModal >
                    <MenuDivider></MenuDivider>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
            </div>

        </Box>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={3}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer