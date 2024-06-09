# Adverity Full-stack challenge

Hello, thank you for the time you have taken to review my work. Here are few notes regarding my submission:

- You can run the app with `docker compose up` (please note that it has been tested on docker compose v2 which is now shipped with docker, not docker compose v1 (executed with `docker-compose`) python package), then access it on `http://localhost:3000`. The frontend is nextjs based and is being served from seperate container.
- I have decided to add login and register functionality, please create a user before you login.

What could be done better ( in a hindsight or given more time ):
- Basing the frontend on NextJS was an overkill, there was no need for server side functionalities it provides, so it could be a simple React SPA served as a static file from the django server, however it made the development faster with its built-in routing.
- Seperate bucket container for file storage.
- Additional validation during enrichment process.
- Responsiveness.
- UTs

Looking forward to hearing your feedback!
