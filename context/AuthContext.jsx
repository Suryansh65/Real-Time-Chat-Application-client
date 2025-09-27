/* eslint-disable no-unused-vars */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext.js";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState(null);
  const [socket, setSocket] = useState(null);
  //check if user is authenticated and if so, set the data and connect the socket
  const checkAuth = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/check`);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };
  //Login function to handle user authentication and socket connection (Both for login and signup)
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/${state}`,
        credentials
      );
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };
  //Logout function to handle user logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    socket.disconnect();
  };

  //   Update profile function to handle user profile updates
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/auth/update-profile`,
        body
      );
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error(err?.message);
    }
  };
  //  Connect socket function to handle socket connection and online users updates
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });
  };
  // we have to check whenever user come on page whether the user is authenticated or not
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);
  const value = {
    axios,
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
