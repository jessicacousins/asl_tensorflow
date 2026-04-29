# Quick Start Guide

Get ASL Recognition running in 5 minutes! ⚡

## 30-Second Setup

```bash
# 1. Navigate to project
cd asl_tensorflow

# 2. Install dependencies (2-3 minutes)
npm install

# 3. Start development server (30 seconds)
npm start

# 4. App opens automatically at http://localhost:3000
```

**That's it!** You're ready to go. 🤟

## First Use (2 minutes)

1. **Click "📹 Start Camera"**
   - Browser will ask for camera permission
   - Click "Allow"

2. **Position yourself**
   - Sit 2-3 feet from camera
   - Ensure good lighting from front

3. **Make a sign**
   - Try raising your hand and waving (Hello)
   - Watch for recognition in the display panel

4. **Explore**
   - Check the history panel for detections
   - Toggle dark/light mode with theme button
   - Read tips section for best practices

## Example Signs to Try

| Sign              | How                           | Result              |
| ----------------- | ----------------------------- | ------------------- |
| **Hello**         | Raise hand, wave side-to-side | "Hello" appears     |
| **Thank You**     | Hand at chest, move forward   | "Thank You" appears |
| **Good**          | Thumbs up gesture             | "Good" appears      |
| **Both Hands Up** | Raise both hands              | "Thank You" appears |

## Keyboard Shortcuts

| Key            | Action                     |
| -------------- | -------------------------- |
| `Ctrl+Shift+R` | Hard refresh (clear cache) |
| `F12`          | Open Developer Console     |

## Common Issues (Quick Fixes)

### Camera not showing?

```bash
# Restart the server
npm start
```

### Page not loading?

- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear cache: DevTools > Storage > Clear Site Data

### Model loading slowly?

- Wait 30-60 seconds on first load
- Model is downloaded and cached
- Subsequent loads are faster

### Recognition not working?

- Check lighting (needs bright, even light)
- Keep hands above shoulder height
- Make clear, slow gestures
- Stay 2-3 feet from camera

## Next Steps

### Learn More

- 📖 Read [README.md](./README.md) for full documentation
- 🧠 Check [ASL_GUIDE.md](./ASL_GUIDE.md) to learn ASL
- 👨‍💻 See [DEVELOPMENT.md](./DEVELOPMENT.md) for code details

### Customize

- Change colors in `src/App.css` (line 1-10)
- Modify camera settings in `src/components/Camera.js`
- Add new signs (see DEVELOPMENT.md)

### Deploy

- Build for production: `npm run build`
- Deploy to Vercel, GitHub Pages, or your own server
- See DEVELOPMENT.md for deployment options

## Project Structure (Mini)

```
asl_tensorflow/
├── src/
│   ├── components/          # React components
│   ├── App.js               # Main app
│   ├── App.css              # Styles
│   └── index.js             # Entry point
├── public/
│   └── index.html           # HTML file
├── package.json             # Dependencies
└── README.md                # Full docs
```

## Available Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject (⚠️ irreversible)
npm eject
```

## Browser Support

| Browser | Status   |
| ------- | -------- |
| Chrome  | ✅ Best  |
| Firefox | ✅ Great |
| Safari  | ✅ Good  |
| Edge    | ✅ Good  |

## System Requirements (Minimum)

- Node.js v14+
- 500MB free disk space
- 2GB RAM
- Working webcam
- Modern browser

## Tips for Best Results

✅ **Good Lighting** - Sit near window or under lamp
✅ **Plain Background** - Avoid cluttered backgrounds
✅ **Distance** - 2-3 feet from camera
✅ **Movement** - Slow, deliberate gestures
✅ **Positioning** - Face camera directly
✅ **Hands Above Shoulders** - Keep in optimal frame
✅ **Clear Gestures** - Complete full hand movements

## Video Demo Signs

Try these signs in this order:

1. **Hello** (Beginner) - Raise hand, wave
2. **Good** (Beginner) - Thumbs up
3. **Thank You** (Intermediate) - Hand from chest forward
4. **Please** (Intermediate) - Hand on chest, circle

## Troubleshooting Script

If something doesn't work, try this order:

```bash
# 1. Hard refresh browser
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

# 2. Stop and restart server
npm start

# 3. Clear and reinstall
npm cache clean --force
rm -rf node_modules
npm install
npm start

# 4. Check console for errors
# F12 > Console tab
```

## Performance Check

If running slow:

- Close other applications
- Check browser tab: should show model loading progress
- Look at Performance tab in DevTools
- Target: 30+ FPS during detection

## Privacy & Security

✅ **All local processing** - No data sent anywhere
✅ **Your camera control** - You grant permission
✅ **No storage** - Signs not saved
✅ **Open source** - Inspect the code

## Getting Help

1. Check [README.md](./README.md)
2. See [INSTALL.md](./INSTALL.md) troubleshooting
3. Read [ASL_GUIDE.md](./ASL_GUIDE.md) for learning
4. Review [DEVELOPMENT.md](./DEVELOPMENT.md) for code questions

## 🤟 You're All Set!

Start recognizing signs and have fun learning ASL!

### Share Your Experience

- Try different signs
- Experiment with movements
- Check history panel
- Learn more in ASL_GUIDE.md

### Keep Learning

- ASL is beautiful and expressive
- Every sign is a connection
- Community is welcoming
- Keep practicing!

---

**Happy signing!** 🤟

Questions? Check the docs or create an issue on GitHub!
