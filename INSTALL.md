# Installation Guide

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)
- **Browser**: Modern browser with WebGL support (Chrome, Firefox, Safari, Edge)
- **Camera**: Working webcam with permissions
- **Storage**: ~500MB for dependencies
- **RAM**: Minimum 2GB (4GB+ recommended)
- **Internet**: Required for initial setup and model downloads

## Step-by-Step Installation

### 1. Install Node.js

If you don't have Node.js installed:

**Windows:**

- Download from https://nodejs.org/ (LTS version recommended)
- Run the installer
- Follow installation wizard
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

**macOS:**

```bash
brew install node
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install nodejs npm
```

### 2. Navigate to Project Directory

```bash
cd /path/to/asl_tensorflow
```

### 3. Install Dependencies

```bash
npm install
```

This will:

- Download React and dependencies
- Install TensorFlow.js
- Install PoseNet model
- Set up development tools

**Estimated time**: 2-5 minutes (depends on internet speed)

### 4. Start Development Server

```bash
npm start
```

Output should show:

```
Compiled successfully!

You can now view asl-tensorflow-recognition in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### 5. Open in Browser

- Automatically opens at `http://localhost:3000`
- Or manually navigate to the URL shown in terminal

### 6. Grant Camera Permissions

When prompted:

- ✅ Click "Allow" to permit camera access
- The app will not work without camera permissions

### 7. Start Using!

- Click "📹 Start Camera"
- Make ASL gestures
- See live recognition

## Troubleshooting Installation

### Issue: "npm not found"

**Solution:**

- Node.js might not be installed
- Restart terminal after installation
- Check PATH environment variable
- Verify: `npm --version`

### Issue: Port 3000 already in use

**Solution:**

```bash
# Use a different port
PORT=3001 npm start
```

### Issue: Module not found errors

**Solution:**

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### Issue: Model download fails

**Solution:**

- Check internet connection
- Disable VPN/proxy if using
- Try again - models may be cached locally
- Check free disk space (need ~100MB)

### Issue: Camera not working

**Solution:**

- Check browser permissions
- Ensure no other app using camera
- Try different browser
- Check camera drivers (Windows)
- Allow microphone/camera in browser settings

### Issue: Low performance / lag

**Solution:**

- Improve lighting conditions
- Close other applications
- Try different browser
- Clear browser cache
- Reduce video resolution in code

### Issue: PoseNet model not loading

**Solution:**

```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# Or restart development server
npm start
```

## Advanced Setup

### Using Yarn Instead of npm

```bash
# Install Yarn
npm install -g yarn

# Install dependencies with Yarn
yarn install

# Start development server
yarn start
```

### Environment Variables

Create `.env` file in project root:

```env
REACT_APP_POSENET_STRIDE=16
REACT_APP_VIDEO_WIDTH=640
REACT_APP_VIDEO_HEIGHT=480
REACT_APP_DEBUG=false
```

### Production Build

```bash
npm run build
```

Creates optimized production build in `build/` folder:

- Minified JavaScript
- Optimized assets
- ~100KB+ smaller bundle
- Ready for deployment

### Docker Setup

If you have Docker installed:

```bash
# Build image
docker build -t asl-recognition .

# Run container
docker run -p 3000:3000 asl-recognition
```

Access at `http://localhost:3000`

## Verification

To verify everything is working:

1. ✅ Terminal shows "Compiled successfully!"
2. ✅ Browser opens at http://localhost:3000
3. ✅ Page title shows "ASL Recognition"
4. ✅ Camera button is visible and clickable
5. ✅ Clicking camera button prompts for permissions
6. ✅ Video feed appears after granting permission
7. ✅ Skeleton visualization visible on video
8. ✅ Sign detection working and displaying results

## First-Time Usage Tips

1. **Good Lighting**: Sit near a window or under good lighting
2. **Position**: Sit 2-3 feet away from camera
3. **Clear Gestures**: Make slow, deliberate hand movements
4. **Test Signs**: Try "Hello" (raise hand and wave)
5. **Check Console**: Look for any error messages (F12)

## Getting Updates

```bash
# Check for updates
npm outdated

# Update packages safely
npm update

# Update specific package
npm install package-name@latest
```

## Uninstall

```bash
# Remove node_modules folder
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Delete package-lock.json
rm package-lock.json

# Remove all files and start fresh
rm -rf .
```

## Next Steps

After successful installation:

1. ✅ Read [README.md](./README.md) for usage guide
2. ✅ Check [DEVELOPMENT.md](./DEVELOPMENT.md) for development
3. ✅ Try the different ASL signs provided
4. ✅ Explore the code and customize
5. ✅ Join the ASL learning community

## Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review error messages in browser console (F12)
3. Check terminal output for error details
4. Search online for specific error message
5. Verify all system requirements are met

## System Information

Check your system:

```bash
node --version
npm --version
node -p "require('os').platform()"
```

## Performance Tips

For best performance:

- Use Chrome browser (fastest TensorFlow.js support)
- Close unnecessary applications
- Improve lighting conditions
- Use stable internet connection
- Keep browser cache cleared
- Update graphics drivers

---

**Installation complete! You're ready to explore ASL Recognition.** 🤟
