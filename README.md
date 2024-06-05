# Harisenin Full Stack Developer Bootcamp - Express.js Practice

This is a simple Express.js application for practicing the concepts learned in the Harisenin Full Stack Developer Bootcamp.

## Installation

1. Clone this repository
2. Run `npm install`
3. Run `cp .env.example .env`
4. Update database credentials & set JWT secret in `.env` file
5. Run `sequelize db:migrate`
6. Run `sequelize db:seed:all`
7. Run `npm run dev`

## API Endpoints

### Auth

- POST `/api/auth/register` Register a new user
- POST `/api/auth/login` Get JWT token

### Books

- GET `/api/books?keyword=&page=1&limit=5` Get all books with pagination and search

### Orders

- GET `/api/orders` Get my orders
- POST `/api/orders` Create an order
