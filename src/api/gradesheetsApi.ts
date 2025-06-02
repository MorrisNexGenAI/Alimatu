import axios from 'axios';

const gradesheetsApi = axios.create({
  baseURL: 'http://localhost:8000/gradesheets',
});

export default gradesheetsApi;