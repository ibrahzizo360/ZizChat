
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast} from "@chakra-ui/react";
import { useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";


export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showpassword, setShowpassword] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () => setShowpassword(!showpassword);
    const submitHandler = async () => {
        setLoading(true);
        if ( !email || !password){
            toast({
                title: 'Please input all fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              })
            setLoading(false);
            return;
        }
        try{
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            }
            const {data} = await axios.post('http://localhost:5000/api/user/login', {email, password}, config)
            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              })
            
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');

        } catch(error){
            toast({
                title: 'Login Failed',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              })
              setLoading(false);
              
        }
    
    };

    return(
        <VStack spacing='5px'>

            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                placeholder ="Enter Your Email"
                value={email}
                onChange={(e)=>{
                    setEmail(e.target.value)
                }}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input
                type={showpassword ? 'text' : 'password'}
                placeholder ="Enter Password"
                value={password}
                onChange={(e)=>{
                    setPassword(e.target.value)
                }}
                />
                <InputRightElement width = '4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {showpassword ? 'Hide': 'Show'}
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
    
            <Button colorScheme="teal"
            width='100%'
            style={{marginTop: 15}}
            onClick={submitHandler}
            isloading={loading}
            >
            Login
            </Button>
            <Button colorScheme="red"
            variant='solid'
            width='100%'
            style={{marginTop: 15}}
            onClick={() => {
                setEmail('guest@example.com');
                setPassword('1234');
            }}
            >
            Get Guest UserCredentials
            </Button>
        </VStack>
    )}