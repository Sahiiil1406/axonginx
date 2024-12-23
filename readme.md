## Building nginx clonen in javascript

Features:
- [x] Serve static files:DONE
- [x] Reverse proxy:Done
- [x] Caching:Half Done
Optional:
- [x] Rate limiting
- [x] Load balancing: Round Robin, Random, Weighted Round Robin, Weighted Random
- [x] SSL

Architecture:

1.Master process:
- Accept incoming connections
- Create worker processes
- Monitor worker processes
- Restart worker processes

2.Worker process:
- Accept incoming connections
- Handle requests
- Send responses
- Cache responses
- Rate limit requests
- Proxy requests
- Load balance requests
- Serve static files
- SSL termination

3.Cache Manager:
- Store responses
- Retrieve responses
- Invalidate responses






