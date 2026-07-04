const chatbotEngine = require('../utils/chatbotEngine');

// ─── @route  POST /api/chatbot/message ────────────────────────────────────────
// ─── @access Private (all roles)
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    const reply = await chatbotEngine.respond(message.trim(), req.user);

    res.status(200).json({
      success: true,
      data: {
        text: reply.text,
        properties: reply.properties || [],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
