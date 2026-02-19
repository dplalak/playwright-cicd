import axios from 'axios';
import { 
    AUTH_USER,
    UNAUTH_USER,
    AUTH_ERROR
} from './types';
const ROOT_URL = process.env.API_URI || 'http://localhost:8000';

axios.defaults.baseURL = ROOT_URL;
if (localStorage.getItem('auth_jwt_token')) {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('auth_jwt_token');
}
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export function signUserIn(data) {
    return function (dispatch) {
        // Submit email/password to server
        return axios
            .post(`/signin`, data)
            .then(res => {
                dispatch({type: AUTH_USER})
                localStorage.setItem('auth_jwt_token', res.data.token);
                window.location = '/#account';
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('auth_jwt_token');
            })
            .catch(error => {
                console.log(error);
                const msg = error.response?.data?.error || error.response?.data || 'Server Error, try later.';
                dispatch({type: AUTH_ERROR, payload: msg})
                return Promise.reject(error);
            });
    }
}

export function signUserUp(userObj) {
    return function (dispatch) {
        // Submit email/password to server
        return axios
            .post(`/signup`, userObj)
            .then(res => {
                dispatch({type: AUTH_USER})
                localStorage.setItem('auth_jwt_token', res.data.token);
                window.location = '/#account';
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('auth_jwt_token');
            })
            .catch(error => {
                console.log(error);
                const msg = error.response?.data?.error || 'Server Error, try later.';
                dispatch({type: AUTH_ERROR, payload: msg})
                return Promise.reject(error);
            });
    }
}

export function signUserOut() {
    return function (dispatch) {
        dispatch({type: UNAUTH_USER})
        localStorage.removeItem('auth_jwt_token');
    }
}

const request = axios;
export { request };