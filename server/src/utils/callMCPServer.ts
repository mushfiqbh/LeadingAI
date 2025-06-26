import axios from "axios";


export default async function callMCPServer(serverName: string, input: string) {
  // Replace with actual endpoint logic
  const endpoint = `https://hooks.zapier.com/hooks/catch/.../${serverName}`;
  const response = await axios.post(endpoint, { input });
  return response.data;
}