import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedChat:  null,
    chats: [],
  },
  reducers: {
    // Action to set the selected chat
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setChats: (state, action) => {
        state.chats = action.payload;
    },
  },
});

export const { setChats, setSelectedChat } = chatSlice.actions;

export const selectChatState = (state) => state.chat;

export default chatSlice.reducer;
