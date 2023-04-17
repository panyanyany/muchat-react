export const AppConfig = {
    API_ENDPOINT: process.env.NODE_ENV == 'production' ? 'https://api.example.com/api' : 'http://api:8080/api',
}

