# Pipeline Visualizer Web - Setup Guide

This guide will help you set up the Pipeline Visualizer Web application on your local machine.

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js and npm
- Git

## Windows Setup (WSL)

### Using Windows Subsystem for Linux (WSL)

WSL is recommended for Windows users as it provides a Linux environment that works better with PHP development tools.

1. **Install WSL**:
   ```powershell
   # Run in PowerShell as Administrator
   wsl --install
   ```

2. **Install PHP in WSL**:
   ```bash
   sudo apt update
   sudo apt install php8.1-cli php8.1-xml php8.1-curl php8.1-mbstring php8.1-sqlite3
   ```

3. **Install Composer in WSL**:
   ```bash
   curl -sS https://getcomposer.org/installer | php
   sudo mv composer.phar /usr/local/bin/composer
   sudo chmod +x /usr/local/bin/composer
   ```

4. **Install Node.js in WSL**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt install nodejs
   ```

### Common WSL Issues

**If `composer install` fails in WSL:**

1. **Clear Composer cache**:
   ```bash
   composer clear-cache
   ```

2. **Try with verbose output to see the error**:
   ```bash
   composer install -vvv
   ```

3. **If you get SSL/TLS errors**:
   ```bash
   composer config --global disable-tls true
   composer config --global secure-http false
   ```

4. **If you get memory errors**:
   ```bash
   COMPOSER_MEMORY_LIMIT=-1 composer install
   ```

5. **If permissions are an issue**:
   ```bash
   sudo composer install --no-scripts
   php artisan clear-compiled
   composer dump-autoload
   ```

6. **WSL File System Performance Issues**:
   
   If `composer install` is extremely slow, it's likely due to WSL accessing Windows file system. Clone the project inside WSL's Linux file system instead:
   
   ```bash
   # Navigate to WSL home directory
   cd ~
   
   # Clone the project here
   git clone https://github.com/Anne-dot/pipeline-visualizer-web.git
   cd pipeline-visualizer-web
   
   # Now composer install should work faster
   composer install
   ```

7. **Alternative: Use PHP from Windows**:
   
   If WSL continues to have issues, you can use Windows-native PHP:
   ```bash
   # Exit WSL and use Windows Command Prompt or PowerShell
   # Make sure PHP and Composer are installed on Windows
   # Then run:
   composer install
   ```

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