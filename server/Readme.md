# SimpleFinance Backend Express JS Project

## 📂 Folder Structure
```
/server
├── src                         # Express js app 
│   ├── controller              # Application logic
│   ├── middleware              # Middleware layer
│   ├── routes                  # Routing layer
│   ├── app.ts                  # Server entry point
├── .env                        # Environment variables (ignored in version control)
├── tsconfig.json               # Typescript configuration
├── package.json                # Project metadata and dependencies
├── eslint.config.mjs           # Eslint configure
└── README.md                   # Project documentation
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
| Command         | Description |
|-----------------|-------------|
| `npm run build` | Build for project |
| `npm run start` | Start production server |
| `npm run dev` | Start development server(custom environment variables) |
| `npm run debug` | Start debugging server(detailed logs) |
| `npm run lint`  | Run ESLint |


## 🛠 Tech Stack
- **Express js** (Web server Framework)
- **ESLint** (Code quality)

## 🙌 Contributing
1. Clone this repository
2. Create a new branch (`git checkout -b firstname-issuenumber-issuename`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your branch (`git push origin feature-branch`)
5. Create a pull request with a reviewee


