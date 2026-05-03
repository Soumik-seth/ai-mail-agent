import { handleAgentTask } from "../services/agentService.js";

export const runAgent = async (req, res) => {
  try {
    const result = await handleAgentTask(req.body.query, req.file);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};