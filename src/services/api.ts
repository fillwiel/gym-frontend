import axios from 'axios';
import { SignUpRequest, UserTask } from '../types';
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN || '';
const MEMBER_ID = import.meta.env.VITE_MEMBER_ID || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Basic ${AUTH_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const signUpForClass = async (classData: Omit<SignUpRequest, 'memberId'>): Promise<void> => {
  const loadingToast = toast.loading('Signing you up...');

  try {
    await api.post('/api/schedule', {
      ...classData,
      memberId: MEMBER_ID,
    });

    toast.success('Successfully signed up for class!', { id: loadingToast });
  } catch (error) {
    console.error('Error signing up for class:', error);
    toast.error('Failed to sign up. Please try again.', { id: loadingToast });
    throw new Error('Failed to sign up for class');
  }
};

export const getUserTasks = async (): Promise<UserTask[]> => {
  try {
    const response = await api.get(`/api/schedule/members/${MEMBER_ID}/tasks/pending`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    return [];
  }
};

export { MEMBER_ID };