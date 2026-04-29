# Development Guide

## Getting Started with Development

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm start
   ```

3. Server runs at `http://localhost:3000`

## Project Architecture

### Component Hierarchy

```
App
├── Camera (Video input & pose detection)
├── SignDisplay (Show recognized signs)
├── ThemeToggle (Dark/Light mode)
└── Info (Educational content)
```

### Data Flow

1. Camera captures video stream
2. PoseNet detects body keypoints
3. SignRecognition algorithm analyzes keypoints
4. Recognized signs sent to SignDisplay
5. History maintained and displayed

## Key Technologies

### TensorFlow.js + PoseNet

- **PoseNet**: Detects 17 keypoints on human body
- **Architecture**: MobileNetV1 (optimized for real-time)
- **Output Stride**: 16 (balance between speed and accuracy)
- **Keypoints**: Head, shoulders, elbows, wrists, hips, knees, ankles

### React Patterns Used

- Functional components with hooks
- useRef for DOM and model references
- useEffect for side effects (camera, model loading)
- useState for component state
- Custom recognition logic

## Styling System

### CSS Variables (App.css)

```css
--teal-primary: #1abc9c --teal-dark: #16a085 --purple-primary: #9b59b6
  --purple-dark: #8e44ad --dark-bg: #0f0f1e --dark-surface: #1a1a2e
  --light-bg: #f8f9fa --light-surface: #ffffff;
```

### Theme System

Theme is managed at App level and passed via context. CSS variables automatically update when theme changes.

## Adding New Signs

To add sign recognition:

1. **Update SignRecognition Logic** (Camera.js)

   ```javascript
   const recognizeSign = (keypoints) => {
     const signs = [
       {
         name: "NewSign",
         detect: () => checkNewSign(keypoints),
         confidence: 0.75,
       },
       // ... existing signs
     ];
   };
   ```

2. **Add Detection Helper**

   ```javascript
   const checkNewSign = (keypoints) => {
     const hand = keypoints[10]; // Right wrist
     const shoulder = keypoints[6];
     return hand.score > 0.5 && hand.y < shoulder.y;
   };
   ```

3. **Add Description** (SignDisplay.js)
   ```javascript
   const getSignDescription = (signName) => {
     const descriptions = {
       NewSign: "Description of the sign gesture",
       // ... existing descriptions
     };
   };
   ```

## Performance Optimization

### Current Optimizations

- MobileNetV1 for faster inference
- Canvas reuse for drawing
- requestAnimationFrame for smooth detection loop
- Hardware acceleration (WebGL)

### Future Optimizations

- Model quantization
- Web Worker for pose detection
- Batch processing for multiple signs
- Caching recognized signs

## Debugging

### Enable Console Logging

Edit Camera.js:

```javascript
// Uncomment for debugging
console.log("Detected pose:", pose);
console.log("Recognized sign:", sign);
```

### Browser DevTools

- Check console for errors
- Inspect network tab for TensorFlow.js model loading
- Use React DevTools for component inspection

## Testing Signs Manually

Good test poses:

1. Raised hand above shoulder (Hello)
2. Both hands raised (Thank You)
3. Nodding motion (Yes)
4. Hand over chest (Please)
5. Thumbs up (Good)

## Known Issues & Fixes

### Issue: Camera not starting

**Solution**: Check browser permissions, ensure HTTPS in production

### Issue: Low recognition accuracy

**Solution**:

- Improve lighting
- Maintain steady pose
- Clear hand gestures
- Adjust confidence threshold

### Issue: Model loading fails

**Solution**: Check internet connection, browser cache

## Browser Compatibility

| Browser | Support | Notes            |
| ------- | ------- | ---------------- |
| Chrome  | ✅ Full | Recommended      |
| Firefox | ✅ Full | Good performance |
| Safari  | ✅ Full | Works on iOS     |
| Edge    | ✅ Full | Chromium-based   |

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel
```

### GitHub Pages

```bash
npm run build
gh-pages -d build
```

### Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

Create `.env` for configuration:

```env
REACT_APP_POSENET_STRIDE=16
REACT_APP_MIN_CONFIDENCE=0.5
REACT_APP_VIDEO_WIDTH=640
REACT_APP_VIDEO_HEIGHT=480
```

## Resources

- [TensorFlow.js Docs](https://js.tensorflow.org/)
- [PoseNet Paper](https://arxiv.org/abs/1803.08208)
- [React Hooks Guide](https://react.dev/reference/react)
- [ASL Learning Resources](https://www.lifeprint.com/)

## Contributing Guidelines

1. Create feature branch
2. Follow existing code style
3. Add comments for complex logic
4. Test in multiple browsers
5. Update README if needed
6. Submit pull request

## License

MIT License - See LICENSE file
