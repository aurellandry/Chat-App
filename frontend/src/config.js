let config = {
    host: (process.env.NODE_ENV === 'production') ? `${window.location.hostname}/api` : 'localhost:3001',
    // Activer les logs côté navigateur selon l'environnement
    debug: (process.env.NODE_ENV === 'production') ? false : true
}

export default config;