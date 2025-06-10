# Deploying to Vercel

This guide will help you deploy the Pipeline Visualizer Web application to Vercel for free.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, but recommended)

## Quick Deploy

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Build assets:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts to link your project.

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure environment variables (see below)
6. Click "Deploy"

## Environment Variables

Set these in your Vercel project settings:

```
APP_NAME=Pipeline Visualizer
APP_ENV=production
APP_KEY=base64:your-generated-key-here
APP_DEBUG=false
APP_URL=https://your-project.vercel.app
```

To generate an APP_KEY:
```bash
php artisan key:generate --show
```

## Important Notes

1. **Database**: This deployment uses SQLite in memory, so data won't persist between deployments
2. **File Storage**: Uploaded files won't persist either
3. **Sessions**: Sessions are stored in memory

## Build Configuration

The project is already configured with:
- `vercel.json` - Vercel configuration
- `api/index.php` - Serverless function entry
- `.vercelignore` - Files to ignore during deployment

## Post-Deployment

After deployment:
1. Visit your Vercel URL
2. The application should be running
3. Check the Functions tab in Vercel dashboard for any errors

## Troubleshooting

If you encounter issues:

1. **500 Error**: Check APP_KEY is set correctly
2. **Assets not loading**: Run `npm run build` before deploying
3. **Function timeout**: Vercel free tier has 10-second limit

## Limitations on Free Tier

- 10-second function timeout
- 100GB bandwidth/month
- No persistent storage
- Limited to hobby use

For production use with persistent data, consider upgrading Vercel or using a different hosting solution.