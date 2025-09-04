# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Install dependencies
pnpm install

# Start development server (port 3000, bound to 127.0.0.1)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Production Deployment
```bash
# Clean build (as shown in README.md)
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
pnpm start
```

### Docker
```bash
# Development container
docker build -f Dockerfile -t netcdfaster-frontend:dev .

# Production container  
docker build -f Dockerfile.prod -t netcdfaster-frontend:prod .
```

## Architecture

### Core Application Structure
- **Frontend**: Next.js 14 + React 18 application for netCDF data processing and visualization
- **Backend Integration**: Communicates with Python Flask backend (default: port 5000) for netCDF file processing
- **Dual Input System**: Supports both local file upload and remote URL processing

### Key Components Architecture

**Main Pages:**
- `app/page.js` - Landing page with dual input component and file processing
- `app/vardetails/page.js` - Variable visualization page that plots netCDF data using backend API

**Input System:**
- `app/components/DualInput.js` - Primary interface supporting URL input and file upload with drag-and-drop
- `app/components/FileUpload.js` - Simple file upload component (currently commented out)

**Data Visualization:**
- `app/components/VarDetailCard.js` - Interactive form for netCDF variable selection with time/coordinate filtering
- Uses localStorage to pass variable metadata between pages
- Supports coordinate filtering for time, latitude, and longitude dimensions

**API Layer:**
- `app/api/upload.js` - Next.js API route for file upload handling (uses formidable)
- `app/api/process-url.js` - URL processing endpoint
- `app/utils/api.js` - Centralized API utilities with error handling and validation

### Environment Configuration
- Uses `NEXT_PUBLIC_BACKEND_URL` for client-side API calls
- `BACKEND_URL` for server-side API proxying via next.config.js rewrites
- `API_TIMEOUT` and `MAX_FILE_SIZE` for request configuration

### Error Handling System
- `app/utils/errorHandler.js` - Centralized error types and handling
- `app/utils/loadingStates.js` - Async operation state management
- `app/components/ErrorDisplay.js` - User-friendly error display component

### Styling
- **Mixed UI Framework Approach**: Combines Tailwind CSS, DaisyUI, and Ant Design
- Components use inconsistent styling approaches (should be unified)

### Data Flow
1. **File Upload**: User uploads netCDF file → processed by backend → metadata returned
2. **Variable Selection**: User navigates to `/vardetails` → selects variable details from localStorage → submits query with coordinate filters
3. **Visualization**: Backend generates plot → returned as blob image → displayed in frontend

### Backend Communication
- Main backend runs on Flask (Python) handling netCDF processing
- API endpoints: `/file/upload`, `/file/varplot`
- Authentication uses `credentials: 'include'` for session management

### Contact & Support
For questions or support: songzl@tamu.edu