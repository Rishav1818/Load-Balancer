import requests
import random
import statistics

# Load balancer URL
load_balancer_url = "http://localhost:3000/"

# Backend servers with weights and ports
backend_servers = [
    {"weight": 1, "name": "Server A", "port": 3001},
    {"weight": 2, "name": "Server B", "port": 3002},
    {"weight": 1, "name": "Server C", "port": 3003}
]

# Total number of requests
total_requests = 10000

# Initialize hit counts for each server
hit_counts = {server["name"]: 0 for server in backend_servers}

# Send requests and track hits for each server
for _ in range(total_requests):
    response = requests.get(load_balancer_url)
    response_text = response.text
    selected_server_port = int(response_text.split()[-1])
    
    for server in backend_servers:
        if server["port"] == selected_server_port:
            hit_counts[server["name"]] += 1
            break

# Calculate the expected number of hits for each server
total_weight = sum([server["weight"] for server in backend_servers])
expected_hits = {server["name"]: (server["weight"] / total_weight) * total_requests for server in backend_servers}

# Calculate absolute error and relative error
absolute_errors = {server["name"]: abs(hit_counts[server["name"]] - expected_hits[server["name"]]) for server in backend_servers}
relative_errors = {server["name"]: (absolute_errors[server["name"]] / expected_hits[server["name"]]) * 100 for server in backend_servers}

# Print the results
print("Expected Distribution:")
for server in backend_servers:
    print(f"{server['name']}: {expected_hits[server['name']]} hits")

print("\nActual Distribution:")
for server in backend_servers:
    print(f"{server['name']}: {hit_counts[server['name']]} hits")

print("\nAccuracy Metrics:")
for server in backend_servers:
    print(f"{server['name']} - Absolute Error: {absolute_errors[server['name']]}, Relative Error: {relative_errors[server['name']]:.2f}%")

# Calculate standard deviation
deviations = [abs(hit_counts[server["name"]] - expected_hits[server["name"]]) for server in backend_servers]
standard_deviation = statistics.stdev(deviations)
print("\nStandard Deviation:", standard_deviation)
