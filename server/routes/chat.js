const express = require('express');
const router = express.Router();

// Simple chat endpoint
router.post('/', async (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }
  
  try {
    // This is a simple echo response
    // In a real application, you would integrate with an AI service
    const response = `You asked: "${query}". This is a simple echo response. To use an actual AI service, you would need to integrate with OpenAI or another provider.`;
    
    // Send back the response
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

module.exports = router;