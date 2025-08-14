import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`; // uses .env value

export const getConversations = async () => {
  const { data } = await axios.get(`${API_URL}/conversations/`);
  return data;
};

export const sendMessage = async (msg) => {
  const { data } = await axios.post(`${API_URL}/conversations`, msg);
  return data;
};
