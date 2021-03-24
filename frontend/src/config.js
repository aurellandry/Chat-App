let config = {
    host: (process.env.NODE_ENV === 'production') ? `https://${window.location.hostname}/api` : 'http://localhost:3001',
    // Activer les logs côté navigateur selon l'environnement
    debug: (process.env.NODE_ENV === 'production') ? false : true,
    wsHost: (process.env.NODE_ENV === 'production') ? `wss://${window.location.hostname}/api` : 'ws://localhost:3001',
}

export default config;