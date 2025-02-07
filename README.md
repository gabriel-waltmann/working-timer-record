# Working timer record

## 💻 About the project

A RESTful API for managing working time records. The API allows users to create, read, update, and delete workspace timers, as well as export timer data.

## 🔨 Features

✔️ Create and manage workspaces <br>
✔️ Create and manage workspace timers <br>
✔️ Export timer data in various formats <br>
✔️ JSON responses <br>
✔️ Auto stop workspace timer after 4 hours <br>

## 🔧 Techs

✔️ Node.js <br>
✔️ TypeScript <br>
✔️ MongoDB<br>
✔️ Redis<br>
✔️ Swagger<br>

## 🚀 How to run

1. Clone the project: [repo](https://github.com/gabriel-waltmann/working-timer-record.git)
2. Install pnpm: `npm install -g pnpm`
3. Install all dependencies: `pnpm install`
4. Create a .env file at root
5. Add this variables:
   MONGODB_URL=mongodb://your-mongodb-host/your-database
   REDIS_HOST=your-redis-host
   REDIS_PORT=your-redis-port
6. Optional: [Stup mongo and redis locally](./docs/docker-setup.md)
7. Execute in terminal: `pnpm dev`
8. Project running at [https://localhost:3000]
9. Swagger running at [https://localhost:3000/api-docs]

## 📸 Demo

<img src="./public/README/demo.png" alt="demostração desktop" height="425" align="center">

## License - [MIT](./LICENSE)

[![licence mit](https://img.shields.io/badge/licence-MIT-blue.svg)](./LICENSE)

## ✏️ Developer by Gabriel Waltmann

[<img src="https://img.icons8.com/color/512/linkedin-2.png" alt="linkedin" height="50"></a>](https://www.linkedin.com/in/gabrielwaltmann/)
[<img src="https://avatars.githubusercontent.com/u/9919?v=4" alt="github" height="50">](https://github.com/gabrielwaltmann)
<br/>
Copyright © 2024 Gabriel Waltmann. All rights reserved
