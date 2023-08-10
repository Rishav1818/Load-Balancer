# Load Balancer

A simple load balancer implemented in Node.js for distributing incoming requests to multiple backend servers. The load balancer supports features like weighted round-robin, health checks, and logging.

## Features

- Weighted round-robin algorithm for distributing requests among backend servers.
- Health checks to monitor the health of backend servers.
- Logging of load balancer activities, server responses, and health changes.
- Dynamic configuration using a JSON file for backend servers.
- Support for HTTP and HTTPS backend servers.

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine:

   ```sh
   git clone https://github.com/your-username/load-balancer.git

2. Navigate to the project directory:
    ```sh
    cd load-balancer

3. Install the required dependencies:
    ```sh
    npm install

## Usage

1. Configure the backend servers by editing the 'servers.json' file.
2. Start the load balancer:
    ```sh
    nodemon loadBalancer.js

3. Access the load balancer at 'http://localhost:3000'.

## Configuration

- Edit the 'servers.json' file to add, remove, or modify backend servers.
- Adjust the server weights and other settings to control request distribution.

## Monitoring

- Monitor load balancer activities in the console logs.
- Health check results and server changes are logged.

## Testing

To test the load balancer's distribution, you can use the provided Python script ('test.py'). This script simulates multiple requests and calculates the hit counts for each backend server.

1. Make sure the load balancer is running.
2. Install the required Python packages:
    ```sh
    pip install requests

3. Run the testing script:
    ```sh
    python test.py

4. Run the testing server:
    ```sh
    nodemon testserver.js

5. The script will display the expected and actual hit counts for each server, along with accuracy metrics.

## Contributing

Contributions are welcome! If you find any issues or want to enhance the load balancer, feel free to submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Disclaimer: This load balancer is provided for educational purposes and as a starting point for building more robust load balancers. It may not be suitable for production use without further refinement and security considerations.
