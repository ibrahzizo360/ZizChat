import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { useSelector } from "react-redux";
import { selectChatState } from "../store/chatSlice";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const chat = useSelector(selectChatState);
  const {selectedChat } = chat;

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;