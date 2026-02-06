# Deployment Plan for UrbanBites on Render

## Backend Changes
- [x] Add "start" script to backend/package.json for production
- [x] Update CORS origins in backend/index.js to allow production URLs
- [x] Ensure environment variables are handled properly

## Frontend Changes
- [x] Make serverUrl configurable via environment variable in frontend/src/App.jsx
- [x] Ensure build process works for deployment

## Deployment Steps
- [ ] Deploy backend to Render Web Service
- [ ] Deploy frontend to Render Static Site
- [ ] Configure environment variables on Render
- [ ] Test the deployed application
