# Wallet and Transaction Management API

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [ER Diagram](#er-diagram)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [License](#license)

## Introduction

This project is a RESTful API built with NestJS that handles wallet management, user authentication, and transaction processing. It includes functionalities for registering users, logging in, creating wallets, funding accounts, transferring funds, and withdrawing funds.

## Features

- **User Authentication**: Registration and login using JWT.
- **Wallet Management**: Create, fund, transfer, and withdraw from wallets.
- **Transaction Management**: Retrieve transactions by ID or user.
- **Security**: Secured endpoints using JWT and authorization guards.

## Technology Stack

- **Backend**: [NestJS](https://nestjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/) or [Knex.js](http://knexjs.org/)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: [class-validator](https://github.com/typestack/class-validator)

## ER Diagram

![ER Diagram](./er-diagram.png)

The ER diagram illustrates the relationships between the tables:

- **Users**: Stores user information.
- **Wallets**: Each wallet belongs to a user.
- **Transactions**: Records transactions related to wallets.

## Installation

To get started with the project, follow these steps:

1. **Clone the repository**:

   ```sh
   git clone https://github.com/thexovc/demo-credit-lendsqr.git
   cd demo-credit-lendsqr
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```plaintext
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_db_user
DATABASE_PASS=your_db_password
DATABASE_NAME=your_db_name
JWT_SECRET=your_jwt_secret
ADJUTOR_SECRET=your_adjutor_secret
ADJUTOR_BASE_URL=adjutor_base_url
```

## Running the Application

To run the application locally:

1. **Start the PostgreSQL database** (ensure it matches the credentials in your `.env` file).

2. **Run migrations**:

   ```sh
   npm run migration:run
   ```

3. **Start the application**:
   ```sh
   npm run start:dev
   ```

The application will be running on `http://localhost:3000`.

## API Endpoints

### Authentication

- **Register**: `POST /v1/auth/register`
- **Login**: `POST /v1/auth/login`

### User Management

- **Get User**: `GET /v1/users`
- **Update User**: `PUT /v1/users`

### Wallet Management

- **Get Wallet**: `GET /v1/wallet`
- **Create Wallet**: `POST /v1/wallet/create`
- **Fund Account**: `POST /v1/wallet/fund`
- **Transfer Funds**: `POST /v1/wallet/transfer`
- **Withdraw Funds**: `POST /v1/wallet/withdraw`

### Transaction Management

- **Get Transaction by ID**: `GET /v1/transactions/single/:transactionId`
- **Get All Transactions by User**: `GET /v1/transactions/user`

## Testing

To run the tests, use the following command:

```sh
npm run test
```

This will execute unit tests for the application, ensuring that all functionalities work as expected.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---

### ER Diagram Example

Here is an example ER diagram for your project:

```plaintext
+------------+     +---------+     +--------------+
|   Users    |     | Wallets |     | Transactions |
+------------+     +---------+     +--------------+
| id         |<---1| id      |<--1 | id           |
| email      |     | user_id |     | wallet_id    |
| password   |     | balance |     | amount       |
| created_at |     | currency|     | type         |
| updated_at |     | created_at|   | created_at   |
+------------+     | updated_at|   | updated_at   |
                   +---------+     +--------------+
```

In this diagram:

- A user can have multiple wallets.
- Each wallet belongs to a single user.
- A wallet can have multiple transactions.
- Each transaction is associated with a single wallet.
