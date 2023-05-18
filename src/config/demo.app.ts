export const AppConfig = {
    // API_ENDPOINT: process.env.NODE_ENV == 'production' ? 'https://api.example.com/api' : 'http://127.0.0.1:8080/api',
    API_ENDPOINT: window['REACT_APP_API_ENDPOINT'],
}