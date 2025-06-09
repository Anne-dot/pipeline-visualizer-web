# Pipeline Visualizer Web - Setup Guide

This guide will help you set up the Pipeline Visualizer Web application on your local machine.

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js and npm
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Anne-dot/pipeline-visualizer-web.git
cd pipeline-visualizer-web
```

### 2. Install Dependencies

Install PHP dependencies:
```bash
composer install
```

Install JavaScript dependencies:
```bash
npm install
```

### 3. Environment Setup

Create your environment configuration file:
```bash
cp .env.example .env
```

Generate the application key:
```bash
php artisan key:generate
```

### 4. Database Setup

This application uses SQLite by default, which requires no additional database server installation.

Create the SQLite database file:
```bash
touch database/database.sqlite
```

Run the database migrations:
```bash
php artisan migrate
```

### 5. Run the Application

You'll need two terminal windows to run both the backend and frontend:

**Terminal 1 - Laravel Backend:**
```bash
php artisan serve
```

**Terminal 2 - Vite Frontend:**
```bash
npm run dev
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## Troubleshooting

### Permission Issues
If you encounter permission issues with the storage or cache directories:
```bash
chmod -R 775 storage bootstrap/cache
```

### Database Connection Error
Ensure the `database/database.sqlite` file exists and has proper permissions:
```bash
ls -la database/database.sqlite
```

### Port Already in Use
If port 8000 is already in use, you can specify a different port:
```bash
php artisan serve --port=8080
```

## Development

- The application uses SQLite for database storage
- All emails are logged to `storage/logs/` instead of being sent
- No external services are required for local development