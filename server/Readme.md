# SimpleFinance Backend Express JS Project

## 📂 Folder Structure
```
/server
├── build                      # Compiled TypeScript files (output directory)
├── node_modules               # Node.js dependencies
├── src                        # Source code
│   ├── controller             # Controllers handling API requests
│   │   ├── indexController.ts
│   │   ├── loginController.ts
│   │   ├── tagController.ts
│   │   ├── transactionController.ts
│   │   ├── userController.ts
│   ├── db                     # Database services and models
│   │   ├── db.ts
│   │   ├── tagDB.ts
│   │   ├── tagService.ts
│   │   ├── transactionDB.ts
│   │   ├── transactionService.ts
│   │   ├── userDB.ts
│   │   ├── userService.ts
│   ├── middleware             # Middleware for authentication, validation, etc.
│   │   ├── authenticator.ts
│   │   ├── dbValidation.ts
│   │   ├── errorHandler.ts
│   │   ├── loggers.ts
│   ├── routes                 # API route handlers
│   │   ├── index.ts
│   │   ├── login.ts
│   │   ├── tag.ts
│   │   ├── transaction.ts
│   │   ├── user.ts
│   ├── app.ts                 # Main entry point of the backend
├── tests                      # Test cases
│   ├── controller             # Unit tests for controllers
│   │   ├── indexController.test.ts
│   │   ├── loginController.test.ts
│   │   ├── tagController.test.ts
│   │   ├── transactionController.test.ts
│   │   ├── userController.test.ts
├── .env                       # Environment variables
├── eslint.config.mjs          # ESLint configuration
├── package.json               # Project metadata and dependencies
├── package-lock.json          # Dependency lock file
├── Readme.md                  # Project documentation
├── tsconfig.json              # TypeScript configuration file
```

## 🛠 Installation & Setup
### 1️⃣ Clone the repository
```sh
git@github.com:Dean6622/Comp4350-Team3.git
cd Comp4350-Team3/server
```

### 2️⃣ Install dependencies
```sh
npm install 
```

## 📦 Building for Project
```sh
npm run build
```

Send requests to `http://localhost:3000` if the port is not defined in the environment variables


## ✅ Code Quality
- **Linting:** `npm run lint`

## 📚 Useful Commands
| Command                        | Description                                           |
|--------------------------------|-------------------------------------------------------|
| `npm run build`                | Build for project                                     |
| `npm run start`                | Start production server                               |
| `npm run dev`                  | Start development server(custom environment variables) |
| `npm run debug`                | Start debugging server(detailed logs)                 |
| `npm run lint`                 | Run ESLint                                            |
| `npm run clean & npm run test` | Running all test(include unit test and integrate test) |
| `npm run test -- --coverage`   | Run test coverage                                     |


## 🛠 Tech Stack
- **Express js** (Web server Framework)
- **ESLint** (Code quality)

## 🙌 Contributing
1. Clone this repository
2. Create a new branch (`git checkout -b firstname-issuenumber-issuename`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature-branch`)
5. Create a pull request with a reviewer


