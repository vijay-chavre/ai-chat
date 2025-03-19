import { create } from 'zustand';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateLastMessage: (text: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (text) =>
    set((state) => {
      const updatedMessages = [...state.messages];
      if (updatedMessages.length > 0) {
        updatedMessages[updatedMessages.length - 1].text = text;
      }
      return { messages: updatedMessages };
    }),
  clearChat: () => set({ messages: [] }),
}));
