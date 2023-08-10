const http = require('http');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const winston = require('winston');

// Load configuration from .env file
dotenv.config();

// Load server configuration from JSON file
const serversConfigPath = process.env.SERVERS_CONFIG_PATH || 'servers.json';
const backendServers = JSON.parse(fs.readFileSync(serversConfigPath, 'utf8'));

// Configure logging
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console()
        // You can add more transports here, like file transport for persistent logs
    ]
});

const healthCheckInterval = 5000;

// Create a load balancer
const loadBalancer = http.createServer((req, res) => {
    // Choose the next server using weighted round-robin
    const selectedServer = selectServerWithWeightedRoundRobin();

    logger.info(`Incoming request: ${req.method} ${req.url} - Selected server: ${selectedServer.host}:${selectedServer.port}`);
    // Increment the selected server's connection count
    selectedServer.connections++;

    // Forward the request to the selected server
    const proxyRequest = http.request(
        {
            host: selectedServer.host,
            port: selectedServer.port,
            method: req.method,
            path: req.url,
            headers: req.headers
        },
        proxyResponse => {
            logger.info(`Response from ${selectedServer.host}:${selectedServer.port}: Status ${proxyResponse.statusCode}`);
            res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
            proxyResponse.pipe(res);
            selectedServer.connections--;
        }
    );

    req.pipe(proxyRequest);
});

// Start the load balancer on port 3000
loadBalancer.listen(3000, () => {
    console.log('Load balancer listening on port 3000');
    // Start health checks
    setInterval(performHealthChecks, healthCheckInterval);
});

// Select a server using weighted round-robin algorithm
function selectServerWithWeightedRoundRobin() {
    let totalWeight = 0;
    for (const server of backendServers) {
        totalWeight += server.weight;
    }

    let randomWeight = Math.floor(Math.random() * totalWeight);
    for (const server of backendServers) {
        randomWeight -= server.weight;
        if (randomWeight < 0) {
            return server;
        }
    }
}



function performHealthChecks() {
    for (const server of backendServers) {
        const protocol = server.port === 443 ? https : http;

        const healthCheckRequest = protocol.get(
            {
                host: server.host,
                port: server.port,
                path: '/health',
                timeout: 3000
            },
            healthCheckResponse => {
                const isHealthy = healthCheckResponse.statusCode === 200;
                if (isHealthy !== server.health) {
                    logger.info(`Server ${server.host}:${server.port} is now ${isHealthy ? 'healthy' : 'unhealthy'}`);
                }
                server.health = isHealthy;

                // Add back to rotation if healthy
                if (isHealthy && !server.inRotation) {
                    logger.info(`Adding server ${server.host}:${server.port} back to rotation`);
                    server.inRotation = true;
                }
            }
        );

        healthCheckRequest.on('error', () => {
            if (server.inRotation) {
                logger.warn(`Removing server ${server.host}:${server.port} from rotation due to health check failure`);
                server.inRotation = false;
            }
            server.health = false;
        });
    }
}