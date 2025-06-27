import express from "express";

const mcpRouter = express.Router();

mcpRouter.post("/:serverName", (req, res) => {
  const { serverName } = req.params;
  const { input } = req.body;

  // Simulate response based on input/serverName
  const mockResponses: Record<string, string> = {
    timetable: "You have an Engineering Mathematics exam tomorrow at 10 AM.",
    weather: "The weather tomorrow will be sunny with a high of 32°C.",
    reminder: "Reminder set for 'Buy groceries at 6 PM'.",
  };

  const output =
    mockResponses[serverName] || `No mock data found for server: ${serverName}`;

  res.json({
    serverName,
    input,
    output,
  });
});

export default mcpRouter;
