const http = require('http');

// Server configuration objects
const servers = [
    { "host": "localhost", "port": 3001 },
    { "host": "localhost", "port": 3002 },
    { "host": "localhost", "port": 3003 }
];

// Create server instances based on configuration
servers.forEach(serverConfig => {
    const { host, port, weight } = serverConfig;

    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Hello from Server at port ${port}\n`);
    });

    server.listen(port, host, () => {
        console.log(`Server running at http://${host}:${port}`);
    });
});
