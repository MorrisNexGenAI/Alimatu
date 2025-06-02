import axios from 'axios';

const generalApi = axios.create({
    baseURL: 'http://localhost:8000/api', 
});

export default generalApi;