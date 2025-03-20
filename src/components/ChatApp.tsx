import { ArrowUpward, AttachFile, Mic, SmartToy } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '../store/chatStore';
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";

const API_URL = 'https://test-stream-python.onrender.com/stream';
const API_KEY = '19290737-c14d-4757-90f1-f5ed89014fa4';




interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp?: Date;
}

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
      }}
      ref={(el) => {
        if (el) el.scrollTop = el.scrollHeight;
      }}
    >
      {messages.map((msg) => (
        <Box
          key={msg.id}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            mb: 2,
          }}
        >
          {msg.sender === "ai" && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "#F0F3FD", mr: 1 }}>
            
            <SmartToy sx={{ color: '#5f6ff4', backgroundColor: '#F0F3FD', borderRadius: '50%', padding: '4px' }} />
          </Avatar>
          <Box sx={{ display: "flex", alignItems: "center" }}><span >AI</span>
          <Typography variant="body2" sx={{ color: "#5F6368" ,ml:1 }}>
            {
              msg.timestamp?.toLocaleTimeString()
              }</Typography>
          </Box>
         
        </Box>
          )}

{msg.sender === "user" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar sx={{ bgcolor: "#F0F3FD", mr: 1 }}>
                <PersonIcon sx={{ color: '#5f6ff4', backgroundColor: '#F0F3FD', borderRadius: '50%', padding: '4px' }} />
              </Avatar>
              <Box sx={{ display: "flex", alignItems: "center" }}><span >You</span>
              <Typography variant="body2" sx={{ color: "#5F6368", ml:1 }}>
               {msg.timestamp?.toLocaleTimeString()
                }</Typography>
                </Box>
            </Box>
            
          )}

          <Box
            sx={{
              maxWidth: "75%",
              p: 2,
              ml:6,
              borderRadius: 2,
              backgroundColor: "#F0F3FD",
              color: "black",
              whiteSpace: "pre-wrap",
              "& p": { margin: "0 0 8px" },
              "& ul": { paddingLeft: 2 },
              "& code": {
                backgroundColor: "rgba(0,0,0,0.1)",
                padding: "2px 4px",
                borderRadius: "4px",
              },
            }}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </Box>

         
        </Box>
      ))}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
          <Box
            sx={{
              backgroundColor: "#F1F3F4",
              p: 1.5,
              borderRadius: 2,
              maxWidth: "75%",
              display: "flex",
              gap: 0.5,
              "@keyframes bounce": {
                "0%, 100%": {
                  transform: "translateY(0)",
                },
                "50%": {
                  transform: "translateY(-5px)",
                },
              },
            }}
          >
            <Typography sx={{
              animation: "bounce 1s infinite",
              animationDelay: "0s",
            }}>.</Typography>
            <Typography
              sx={{
                animation: "bounce 1s infinite",
                animationDelay: "0.2s",
              }}
            >
              .
            </Typography>
            <Typography sx={{
              animation: "bounce 1s infinite",
              animationDelay: "0.4s",
            }}>.</Typography>
          </Box>        </Box>
      )}
    </Box>
  );
};



const ChatApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { messages, addMessage, updateLastMessage } = useChatStore();

  

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: uuidv4(), text: input, sender: 'user', timestamp: new Date() };
    addMessage(userMessage);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}?prompt=${encodeURIComponent(input)}`, {
        headers: {
          'x-api-key': API_KEY,
          Accept: 'text/event-stream',
        },
      });

      if (!response.body) throw new Error('ReadableStream not supported');

      // Add initial empty AI message
      const aiMessage = { id: uuidv4(), text: '', sender: 'ai', timestamp: new Date() };
      addMessage(aiMessage);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        chunk.split('\n').forEach((line) => {
          if (line.startsWith('data:')) {
            try {
              const jsonData = JSON.parse(line.replace('data: ', ''));
              const content = jsonData.choices?.[0]?.delta?.content || '';

              if (content) {
                accumulatedText += content;
                updateLastMessage(accumulatedText); // Update AI message progressively
              }
            } catch (err) {
              console.error('Error parsing chunk:', err);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      addMessage({ id: uuidv4(), text: 'Error: AI response failed.', sender: 'ai', timestamp: new Date() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Messages */}
    
      <MessageList messages={messages} loading={loading} />
      {/* Input Section */}
      <Box
        
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderTop: '1px solid #ddd',
          
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          zIndex: 1000, // Ensure it stays on top
        }}
      >
       
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "lg",
            margin: "0 auto",
            borderRadius: "30px",
            backgroundColor: "#f1f3f4",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            padding: "8px 16px",
          }}
        >
          {/* Input Field with Attach Icon */}
          <TextField
            fullWidth
            variant="standard"
            placeholder="Message ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <AttachFile sx={{ color: "#9E9E9E" }} />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <Mic sx={{ color: "#9E9E9E" }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                px: 1,
                borderRadius: "30px",
              },
            }}
          />

          {/* Send Button */}
          <IconButton
            onClick={sendMessage}
            sx={{
              backgroundColor: "#7B61FF",
              color: "#fff",
              ml: 1,
              "&:hover": {
                backgroundColor: "#6A50E5",
              },
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Box>
      </Box>

    </Container>  );
};

export default ChatApp;