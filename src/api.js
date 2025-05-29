// utils/api.js

import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

/**
 * Generic POST request
 * @param {string} endpoint - The API endpoint (e.g. 'loginDB', 'registerDB')
 * @param {object} data - The data to post
 * @returns {Promise} - Axios response
 */
export const PostAPI = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}/${endpoint}`, data);
    return response;
  } catch (error) {
    throw error;
  }
  
};

export const GetAPI = async (endpoint, params = {}, headers = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params,
      headers,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
