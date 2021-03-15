let config = {
    host: (process.env.NODE_ENV === 'production') ? `${window.location.hostname}/api` : 'localhost:3001'
}

export default config;