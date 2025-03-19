import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChatStore } from '../store/chatStore';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';

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
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            {msg.sender === 'ai' && (
              <Avatar sx={{ bgcolor: 'green', mr: 1 }}>AI</Avatar>
            )}

            <Box
              sx={{
                backgroundColor: msg.sender === 'user' ? 'primary.main' : 'grey.800',
                color: 'white',
                p: 1.5,
                borderRadius: 2,
                maxWidth: '75%',
                whiteSpace: 'pre-wrap',
              }}
            >
              {/* Use ReactMarkdown for better AI formatting */}
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </Box>

            {msg.sender === 'user' && (
              <Avatar sx={{ bgcolor: 'blue', ml: 1 }}>U</Avatar>
            )}
          </Box>
        ))}
        {loading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Input Section */}
      <Box sx={{ display: 'flex', p: 2, borderTop: '1px solid #ddd' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <IconButton color="primary" onClick={sendMessage} disabled={loading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default ChatApp;
