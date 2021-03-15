let config = {
    host: (process.env.NODE_ENV === 'production') ? `${window.location.hostname}/api` : 'localhost:3001',
    debug: (process.env.NODE_ENV === 'production') ? false : false
}

export default config;