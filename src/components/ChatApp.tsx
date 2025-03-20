import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Avatar,
  InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChatStore } from '../store/chatStore';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { ArrowUpward, AttachFile, Mic } from '@mui/icons-material';

const API_URL = 'https://test-stream-python.onrender.com/stream';
const API_KEY = '19290737-c14d-4757-90f1-f5ed89014fa4';

const ChatApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { messages, addMessage, updateLastMessage } = useChatStore();

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: uuidv4(), text: input, sender: 'user' };
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
      const aiMessage = { id: uuidv4(), text: '', sender: 'ai' };
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
      addMessage({ id: uuidv4(), text: 'Error: AI response failed.', sender: 'ai' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }} ref={(el) => {
        if (el) {
          el.scrollTop = el.scrollHeight
        }
      }}>
      {messages.map((msg, index) => (
        <Box
        key={msg.id}
        sx={{
          display: 'flex',
          justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
          mb: 2,
          '@keyframes bounce': {
            '0%, 100%': {
              transform: 'translateY(0)',
            },
            '50%': {
              transform: 'translateY(-10px)',
            },
          },
          animation: loading && index === messages.length - 1 ? 'bounce 1s infinite' : 'none',
        }}
        >
        {msg.sender === 'ai' && (
          <Avatar sx={{ bgcolor: 'green', mr: 1 }}>AI</Avatar>
        )}

        <Box
          sx={{
          backgroundColor: msg.sender === 'user' ? 'primary.main' : '#e3f2fd',
          color:"#202124",
          p: 1.5,
          borderRadius: 2,
          maxWidth: '75%',
          whiteSpace: 'pre-wrap',
          '& p': { margin: 0 },
          '& pre': { 
            overflowX: 'auto',
            maxWidth: '100%',
            '& code': {
            display: 'block',
            padding: '0.5em',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 1
            }
          }
          }}
        >
          <ReactMarkdown components={{
          pre: ({ children }) => <pre style={{ margin: 0 }}>{children}</pre>,
          code: ({ children }) => <code>{children}</code>
          }}>
          {msg.text || (loading && index === messages.length - 1 && '...')}
          </ReactMarkdown>
        </Box>        {msg.sender === 'user' && (
          <Avatar sx={{ bgcolor: 'blue', ml: 1 }}>U</Avatar>
        )}
        </Box>
      ))}
      {loading && messages[messages.length - 1]?.sender === 'ai' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mb: 2,
            '@keyframes bounce': {
              '0%, 100%': {
                transform: 'translateY(0)',
              },
              '50%': {
                transform: 'translateY(-10px)',
              },
            },
            animation: 'bounce 1s infinite',
          }}
        >
          {/* <Avatar sx={{ bgcolor: 'green', mr: 1 }}>AI</Avatar> */}
          <Box
          
            sx={{
              backgroundColor: 'grey.800',
              color: 'white',
              p: 1.5,
              borderRadius: 2,
              maxWidth: '75%',
              display: 'flex',
              gap: 0.5,
            }}
          >
            <span>.</span>
            <span
              style={{
              display: 'inline-block',
              animation: 'bounce 1s infinite',
              }}
            >
              .
            </span>
            <span>.</span>
          </Box>
        </Box>
      )}
      </Box>
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

    </Container>
  );
};

export default ChatApp;