import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from '@chakra-ui/react'
import axios from "axios";




export default function Register(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [pic, setPic] = useState("");
    const [showpassword, setShowpassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    

    const handleClick = () => setShowpassword(!showpassword);
    const postDetails = (pics) =>{
        setLoading(true);
        if (pics === undefined) {
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
              })
            setLoading(false)  
            return;
        }
        if (pics.type === 'image/jpeg' || pics.type === 'image/png'){
            const data = new FormData();
            data.append('file', pics);
            data.append('upload_preset', 'chatApp');
            data.append('cloud_name', 'dkvsefuxx');
            fetch('https://api.cloudinary.com/v1_1/dkvsefuxx/image/upload',{
                method : 'POST',
                body : data
            })
            .then((res) => res.json())
            .then((data) => {
                setPic(data.url.toString());
                setLoading(false);
            })
            .catch((err)=> {
                console.log(err)
                setLoading(false)
            })
        }
        else{
            toast({
                title: 'Please select an image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
              })
        }
    };
    const submitHandler = async() => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword){
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
        if (password !== confirmpassword){
            toast({
                title: 'Passwords do not match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              })
            return;
        }
        try{
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            }
            const payload = {
                name,
                email,
                password,
                ...(pic && { pic }) // Include pic field only if it is defined
              };
            const {data} = await axios.post('http://localhost:5000/api/user', payload, config)
            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              })
            
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            setTimeout(() => {
                window.location.reload();
              }, 2000);

        } catch(error){
            toast({
                title: 'Registration Failed',
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
            <FormControl id='first-name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                placeholder ="Enter Your Name"
                onChange={(e)=>{
                    setName(e.target.value)
                }}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                placeholder ="Enter Your Email"
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
            <FormControl id='confirmpassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                <Input
                type={showpassword ? 'text' : 'password'}
                placeholder ="Confirm your password"
                onChange={(e)=>{
                    setConfirmpassword(e.target.value)
                }}
                />
                <InputRightElement width = '4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {showpassword ? 'Hide': 'Show'}
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic'>
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                type ="file"
                p={1.5}
                accept = 'image/*'
                onChange={(e)=>
                    postDetails(e.target.files[0])
                }
                />
            </FormControl>
            <Button colorScheme="teal"
            width='100%'
            style={{marginTop: 15}}
            onClick={submitHandler}
            isLoading={loading}
            >
            Sign Up
            </Button>
        </VStack>
    )}