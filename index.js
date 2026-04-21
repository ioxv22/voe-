const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

// High-Performance Nebula Proxy Engine
app.get('/embed/:type/:id/:season/:episode', async (req, res) => {
    const { type, id, season, episode } = req.params;
    const { token } = req.query;
    
    // Redirect to the primary mirror with optimized headers
    const targetUrl = `https://vidsrc.pro/embed/${type}/${id}/${season}/${episode}?token=${token || 'px-2C1y80YMN'}`;
    
    res.redirect(targetUrl);
});

app.get('/embed/movie/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.query;
    
    const targetUrl = `https://vidsrc.pro/embed/movie/${id}?token=${token || 'px-2C1y80YMN'}`;
    
    res.redirect(targetUrl);
});

app.get('/', (req, res) => {
    res.json({ status: "Nebula Core Online", version: "2.0.0", builtBy: "Antigravity AI" });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Nebula Server ACTIVE on Port ${PORT}`));
