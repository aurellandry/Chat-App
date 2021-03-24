let config = {
    host: (process.env.NODE_ENV === 'production') ? `https://${window.location.hostname}/api` : 'http://localhost:3001',
    // Activer les logs côté navigateur selon l'environnement
    debug: (process.env.NODE_ENV === 'production') ? false : true,
    wsProtocol:  (process.env.NODE_ENV === 'production') ? 'wss' : 'ws',
}

export default config;