# AxoNginx
AxoNginx is a lightweight, feature-rich web server built entirely in Node.js that brings the core functionality of traditional web servers to JavaScript environments. Designed with modern web applications in mind, it combines the simplicity of Express.js with advanced server capabilities including reverse proxying, SSL termination, intelligent load balancing, and built-in caching mechanisms.


Built on a robust master-worker architecture using Node.js clustering, AxoNginx delivers high-performance request handling while maintaining scalability and fault tolerance. Whether you're serving static files, load balancing across multiple upstream servers, or implementing sophisticated rate limiting policies, AxoNginx provides a comprehensive solution that's both developer-friendly and production-ready. Its modular design supports multiple load balancing algorithms including Round Robin, IP-Hash, and Weighted Random, making it suitable for everything from simple static sites to complex microservice architectures.
## Features
- ✔ Serve static files
- ✔ Reverse proxy
- ✔ SSL support
- ✔ Load balancing:
  - ✔ Round Robin
  - ✔ Random
  - ✔ Ip-Hash
  - ✔ Weighted Random
- ✔ Rate limiting
- ✔ Caching

## Architecture
![Screenshot 2024-12-24 023409](https://github.com/user-attachments/assets/0fd009ba-e12a-4012-8a28-b4a3e917dbd7)


### 1. **Master Process**
- Accepts incoming connections.
- Creates worker processes.
- Monitors worker processes.
- Restarts worker processes as needed.

### 2. **Worker Process**
- Accepts incoming connections.
- Handles client requests.
- Sends responses to clients.
- Implements caching for optimized responses.
- Applies rate limiting for request control.
- Proxies requests to upstream servers.
- Load balances requests using the configured algorithm.
- Serves static files efficiently.
- Terminates SSL connections.

### 3. **Cache Manager**
- Stores responses for quick access.
- Retrieves cached responses to reduce load.
- Invalidates outdated or unused responses.

## Tech Stack
### **Backend**
- **Node.js**: Core runtime for building the server.
- **Express.js**: Framework for handling routing and middleware.
- **Node-Cluster**: Handles creation of multiple workers and communication between master and workers node.

### **SSL and Security**
- **OpenSSL**: For SSL certificate generation and handling.

### **Load Balancing**
- Custom algorithms implemented in JavaScript for:
  - Round Robin
  - Random
  - Ip-Hash
  - Weighted Random

### **Rate Limiting**
- **express-rate-limit**: Middleware for request rate limiting.

### **Static File Serving**
- **serve-static**: Middleware for serving static assets.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nginx-clone-js.git
   cd nginx-clone-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the config.yaml file according to requirement

4. Run the application:
   ```bash
   node index.js
   ```

## Usage
### Static File Serving
Place your static files in the `templates/` directory. The server will serves them.

### Reverse Proxy
Configure reverse proxy targets in the `config.json` file. Example:

### Rate Limiting
- Default rate limit: `100 requests per 15 minutes` per IP.
  
### SSL
- Place your SSL certificate and key in the `template/` directory.


### Load Balancing
Load balancing strategies can be selected via configuration. Default is `Round Robin`.


