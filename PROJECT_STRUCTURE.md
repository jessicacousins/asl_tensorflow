# Project Structure

## Directory Tree

```
asl_tensorflow/
│
├── public/                      # Static assets
│   ├── index.html              # HTML entry point
│   └── manifest.json           # PWA manifest
│
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── Camera.js           # Pose detection & sign recognition
│   │   ├── Camera.css          # Camera component styles
│   │   ├── SignDisplay.js      # Display recognized signs
│   │   ├── SignDisplay.css     # Sign display styles
│   │   ├── ThemeToggle.js      # Theme switcher
│   │   ├── ThemeToggle.css     # Theme toggle styles
│   │   ├── Info.js             # Educational guide
│   │   └── Info.css            # Info section styles
│   │
│   ├── App.js                  # Main app component
│   ├── App.css                 # Global styles & theme variables
│   ├── index.js                # React entry point
│   └── index.css               # Base styles
│
├── package.json                # Project dependencies & scripts
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment variables template
│
├── README.md                   # Main project documentation
├── INSTALL.md                  # Installation guide
├── DEVELOPMENT.md              # Developer guide
├── ASL_GUIDE.md                # American Sign Language guide
├── PROJECT_STRUCTURE.md        # This file
└── CONTRIBUTING.md             # Contribution guidelines
```

## File Descriptions

### Core Application Files

#### `src/App.js`

- Main application component
- Manages app state (theme, recognized signs)
- Coordinates child components
- Handles theme switching logic

#### `src/components/Camera.js`

- Integrates PoseNet for body pose detection
- Implements sign recognition algorithm
- Manages video stream and canvas drawing
- Main ML logic for detecting ASL signs
- ~400 lines of code

#### `src/components/SignDisplay.js`

- Displays recognized sign name
- Shows confidence percentage
- Maintains recognition history
- Provides tips and educational content
- Displays confidence bar graph

#### `src/components/Info.js`

- Educational guide for ASL
- Expandable sections for learning
- Basic signs reference
- Hand shapes guide
- App instructions and tips

#### `src/components/ThemeToggle.js`

- Simple theme switcher button
- Toggles dark/light mode
- Visual indicator of current theme

### Styling Files

#### `src/App.css`

- Global CSS variables for theming
- Color palette definitions
- Base component styles
- Animation keyframes
- Responsive design breakpoints

#### `src/components/Camera.css`

- Video feed container styles
- Camera controls layout
- PoseNet visualization styles
- Loading spinner animation

#### `src/components/SignDisplay.css`

- Sign recognition display styles
- Confidence meter styling
- History list layout
- Tips section styling

#### `src/components/Info.css`

- Educational guide grid
- Expandable card animations
- About section styling

### Configuration Files

#### `package.json`

- Project metadata
- Dependency list
- NPM scripts
  - `start` - Development server
  - `build` - Production build
  - `test` - Run tests
  - `eject` - Eject from Create React App

#### `.gitignore`

- Ignores: node_modules, build, .env
- Ignores: IDE files, OS files

#### `.env.example`

- Template for environment variables
- Configuration options documented
- Copy to `.env` to use

### Documentation Files

#### `README.md`

- Project overview
- Feature list
- Installation instructions
- Usage guide
- Tech stack details
- Future enhancements

#### `INSTALL.md`

- Step-by-step setup instructions
- System requirements
- Troubleshooting guide
- Advanced setup options
- Performance tips

#### `DEVELOPMENT.md`

- Architecture overview
- Component hierarchy
- Development workflow
- How to add new signs
- Performance optimization
- Debugging tips

#### `ASL_GUIDE.md`

- ASL fundamentals
- Common signs and phrases
- Hand shapes reference
- Learning resources
- Grammar basics
- Etiquette and respect

#### `CONTRIBUTING.md`

- Contribution guidelines
- Code style standards
- Pull request process
- Issue reporting
- Development setup

#### `PROJECT_STRUCTURE.md`

- This file
- Directory organization
- File descriptions
- Data flow overview

### Public Assets

#### `public/index.html`

- HTML entry point
- Meta tags for SEO
- Root div for React mounting
- PWA configuration

#### `public/manifest.json`

- Progressive Web App manifest
- App name and icons
- Display settings
- Theme colors

## Data Flow

```
User Action (Start Camera)
        ↓
Camera Component
        ↓
Get Video Stream ← Browser Camera API
        ↓
PoseNet Model Load ← TensorFlow.js
        ↓
Video Loop (RequestAnimationFrame)
        ├─ Detect Pose (PoseNet)
        ├─ Draw Skeleton (Canvas)
        ├─ Recognize Sign (Recognition Algorithm)
        └─ Update State
        ↓
SignDisplay Component
        ├─ Show Recognized Sign
        ├─ Display Confidence
        ├─ Update History
        └─ Show Tips
        ↓
User Sees Results
```

## Component Hierarchy

```
App (Main)
│
├── Header
│   ├── Title
│   └── ThemeToggle
│
├── Main Content
│   ├── Camera (Left)
│   │   ├── Video Feed
│   │   ├── Canvas (Pose Overlay)
│   │   ├── Loading State
│   │   └── Controls
│   │
│   └── SignDisplay (Right)
│       ├── Recognized Sign
│       ├── Confidence Meter
│       ├── History List
│       └── Tips Section
│
├── Info Section (Educational)
│   ├── Basic Signs
│   ├── Hand Shapes
│   ├── Usage Guide
│   └── Tips
│
└── Footer
```

## State Management

### App Level State

- `theme` - Current theme (dark/light)
- `recognizedSign` - Currently detected sign
- `confidence` - Detection confidence score
- `isListening` - Camera active status

### Camera Component State

- `net` - PoseNet model instance
- `isLoading` - Model loading state
- `isCameraActive` - Camera stream status

### SignDisplay Component State

- `signHistory` - Array of detected signs
- `translation` - Display translation

## CSS Organization

### Variables

- Color scheme (teal, purple)
- Dark/Light mode colors
- Spacing units
- Font sizes

### Class Naming

- BEM-inspired (Block\_\_Element--Modifier)
- Component-based classes
- Utility classes for states

### Responsive Design

- Mobile first approach
- Breakpoints at 768px, 1024px
- Flexbox and Grid layouts

## Performance Considerations

### Optimizations Implemented

- MobileNetV1 for faster inference
- Canvas reuse for drawing
- RequestAnimationFrame for smooth loop
- Hardware acceleration (WebGL)

### Assets Size

- PoseNet model: ~27MB (loaded once)
- CSS: ~15KB (minified)
- JS bundle: ~200KB+ (before minification)

## Browser Compatibility

| Feature  | Chrome | Firefox | Safari | Edge |
| -------- | ------ | ------- | ------ | ---- |
| WebGL    | ✅     | ✅      | ✅     | ✅   |
| WebRTC   | ✅     | ✅      | ✅     | ✅   |
| ES6      | ✅     | ✅      | ✅     | ✅   |
| CSS Grid | ✅     | ✅      | ✅     | ✅   |

## Module Dependencies

### Production Dependencies

- `react` v18.2+ - UI framework
- `react-dom` v18.2+ - DOM rendering
- `@tensorflow/tfjs` v4.11+ - ML framework
- `@tensorflow-models/posenet` v2.2+ - Pose detection

### Development Dependencies

- `react-scripts` v5.0+ - Build tools
- `web-vitals` v2.1+ - Performance metrics

## Adding New Features

### To Add New Sign Recognition

1. Update `recognizeSign()` in Camera.js
2. Add detection helper function
3. Update descriptions in SignDisplay.js
4. Add to ASL_GUIDE.md

### To Change Colors

1. Update CSS variables in App.css
2. Theme colors propagate throughout app
3. No component updates needed

### To Add New Page/Section

1. Create new component in `src/components/`
2. Create corresponding CSS file
3. Import and add to App.js
4. Update routing if needed

## File Size Analysis

| File           | Size  | Purpose        |
| -------------- | ----- | -------------- |
| Camera.js      | ~12KB | Pose detection |
| App.css        | ~8KB  | Global styling |
| SignDisplay.js | ~4KB  | Sign display   |
| Info.js        | ~3KB  | Education      |
| PoseNet Model  | ~27MB | ML model       |

## Deployment Considerations

### Required Files

- All JS files in `src/`
- All CSS files
- `public/index.html`
- `package.json`

### Build Output

- `build/` folder created
- Minified and optimized
- ~150KB+ JavaScript
- Ready for production

### Environment

- Static hosting (no backend required)
- Needs HTTPS in production
- Works offline (models cached)

## Git Structure

### Branches (Recommended)

- `main` - Production ready
- `develop` - Development branch
- `feature/*` - Feature branches

### Commit Strategy

- Semantic commits
- Feature-focused commits
- Reference issues in commits

---

**Project Structure Version**: 1.0  
**Last Updated**: April 2026  
**Maintained By**: ASL Recognition Team
