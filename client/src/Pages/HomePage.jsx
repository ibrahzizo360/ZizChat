import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Login from '../Components/Authentication/Login';
import Register from '../Components/Authentication/Register';



export default function HomePage(){
    return(
        <Container maxW='xl' centerContent>
             <Box
             d='flex'
             justifyContent='center'
             p={3}
             bg={"white"}
             w='100%'
             m='40px 0 15px 0'
             borderRadius={"lg"}
             borderWidth={"1px"}
             >
                <Text
                fontSize='4xl'
                fontFamily='Work sans'
                color = 'black'
                textAlign={'center'}
                >Ziz_Chat
                </Text>
             </Box>
             <Box bg='white' w='100%' p={4} 
             borderRadius='lg' borderWidth='1px'>
                <Tabs variant='soft-rounded'>
                    <TabList mb='1rem'>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Register</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                        <Login/>
                        </TabPanel>
                        <TabPanel>
                        <Register/>
                        </TabPanel>
                    </TabPanels>
                    </Tabs>
             </Box>
        </Container>  
    )
};