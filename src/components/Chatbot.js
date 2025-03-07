// src/components/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Chatbot.css';

const Chatbot = () => {
    //const api_key = process.env.AI_API_KEY; 
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Controls the popup visibility
    
   const generateAnswer = async () => {
        if (!question.trim()) return;
    
        // Add user question to messages
        const userMessage = { text: question, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
    
        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAeX1PXlREUtKfDUPIQOeUNNkUUqED8ncU`,
                method: "POST",
                data: {
                    "contents": [{
                        "parts": [{
                            "text": `You are an AI assistant specialized in agriculture. Your job is to assist farmers with agriculture-related queries only. 
                            If the question is **not related to agriculture**, respond with: "Sorry, I can only answer agriculture-related questions." 
                            Be precise and informative while staying within agricultural topics.
                            
                            User's question: "${question}"`
                        }]
                    }]
                }
            });
    
            // Extract AI response
            const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                               "Sorry, I couldn't understand the request.";
    
            const aiMessage = { text: aiResponse, sender: 'ai' };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
    
        } catch (error) {
            console.error('Error fetching AI response:', error);
            setMessages((prevMessages) => [...prevMessages, { text: "Error connecting to AI.", sender: 'ai' }]);
        }
    
        setQuestion(""); // Clear input after sending
    }; 
    

    return (
        <div className="chatbot-wrapper">
        {/* Floating button */}
        {!isOpen && (
            <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                💬 Chat with AI
            </button>
        )}

        {/* Chat Window */}
        {isOpen && (
            <div className="chatbot-popup">
                <div className="chatbot-header">
                    <h3>AI Farming Assistant</h3>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
                </div>
                <div className="chat-window">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <span>{msg.text}</span>
                        </div>
                    ))}
                </div>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    cols="30"
                    rows="3"
                    placeholder="Ask your question..."
                ></textarea>
                <button className="ask-ai" onClick={generateAnswer}>Ask AI</button>
            </div>
        )}
    </div>
    );
};

export default Chatbot;
