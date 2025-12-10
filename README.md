# 🍽️ Recipe Search Application

A modern recipe search application built with React and Spring Boot, powered by the [Spoonacular API](https://spoonacular.com/food-api). Search for recipes, filter by diet, cuisine, and meal type, view detailed nutritional information, and customize recipes by excluding ingredients.

🔗 **Live Demo:** [https://rex-assignment.onrender.com/](https://rex-assignment.onrender.com)

---

## ✨ Features

- **Recipe Search** - Search thousands of recipes with real-time autocomplete suggestions
- **Advanced Filters** - Filter by diet type (vegetarian, vegan, keto, etc.), cuisine, and meal type
- **Pagination** - Browse through large result sets efficiently
- **Recipe Details** - View complete recipe information including:
  - Ingredients list with amounts
  - Step-by-step cooking instructions
  - Nutritional facts (calories, protein, carbs, fat, etc.)
  - Health score and preparation time
- **Ingredient Exclusion** - Exclude ingredients and see updated nutritional information
- **Dark/Light Mode** - Toggle between themes with the "Fresh Sage" color scheme
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Accessible** - Built with accessibility best practices

---

## 🛠️ Tech Stack

| Frontend | Backend |
|----------|---------|
| React 18 | Java 21 |
| Vite | Spring Boot 4.0 |
| Tailwind CSS | RestClient |
| React Router | Lombok |
| Axios | Maven |
| Lucide React Icons | Docker |

---

## 📋 Prerequisites

### Frontend
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher

### Backend
- **Option A (Docker):** Docker installed
- **Option B (Local):** Java 21 and Maven 3.9+

### API Key
You'll need a Spoonacular API key. Get one for free at:  
👉 [https://spoonacular.com/food-api/console#Dashboard](https://spoonacular.com/food-api/console#Dashboard)

---

## 🚀 Setup

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd rex-assignment-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your values:
   ```env
   VITE_PORT=3000
   VITE_API_URL=http://localhost:4000
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

---

### Backend Setup

#### Option A: Using Docker (Recommended)

Pull and run the Docker image:

```bash
docker run -d \
  -p 4000:4000 \
  -e SPOONACULAR_API_KEY=your_api_key_here \
  -e CORS_ALLOWED_ORIGINS=* \
  --name recipe-api \
  yazan15ali/recipe-api
```

View logs:
```bash
docker logs -f recipe-api
```

Stop the container:
```bash
docker stop recipe-api
```

Stop and remove the container:
```bash
docker rm -f recipe-api
```

---

#### Option B: Local Development

1. Navigate to the server directory:
   ```bash
   cd rex-assignment-server
   ```

2. Copy the example properties file:
   ```bash
   cp src/main/resources/application-local.properties.example src/main/resources/application-local.properties
   ```

3. Edit `application-local.properties` and fill in your values:
   ```properties
   spoonacular.api.key=your_api_key_here
   cors.allowed-origins=*
   ```

4. Run the application:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   ```

The backend API will be available at `http://localhost:4000`

---

## 🌐 Environment Variables

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_PORT` | Dev server port | `3000` |
| `VITE_API_URL` | Backend API URL | `http://localhost:4000` |

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `SPOONACULAR_API_KEY` | Spoonacular API key | ✅ Yes |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | No (default: *) |
| `SERVER_PORT` | Server port | No (default: 4000) |

---

## 🧪 Running Tests

### Frontend Tests

```bash
cd rex-assignment-client

# Run tests once
npm test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Backend Tests

```bash
cd rex-assignment-server

# Run all tests
./mvnw test

# Run tests with verbose output
./mvnw test -Dtest=*Test

# Run a specific test class
./mvnw test -Dtest=RecipeServiceImplTest
```

---

## 📁 Project Structure

```
rex-assignment/
├── rex-assignment-client/          # React frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Page components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API service layer
│   │   └── test/                   # Test files and mocks
│   ├── package.json
│   └── vite.config.js
│
├── rex-assignment-server/          # Spring Boot backend
│   ├── src/
│   │   ├── main/java/.../
│   │   │   ├── controller/         # REST controllers
│   │   │   ├── service/            # Business logic
│   │   │   ├── dto/                # Data transfer objects
│   │   │   ├── config/             # Configuration classes
│   │   │   └── exception/          # Exception handlers
│   │   └── test/                   # Unit tests
│   └── pom.xml
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes/search` | Search recipes with filters |
| GET | `/api/recipes/{id}` | Get recipe details |
| GET | `/api/recipes/{id}/exclude` | Get recipe with excluded ingredients |
| GET | `/api/recipes/autocomplete` | Get search suggestions |
| GET | `/api/recipes/health` | Health check endpoint |
