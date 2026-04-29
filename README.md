# 🤟 ASL Recognition - American Sign Language Detection

A professional, real-time American Sign Language (ASL) recognition web application built with React and TensorFlow.js. This app uses pose detection to recognize common ASL signs and translate them to text, helping people learn and communicate in sign language.

![ASL Recognition](https://img.shields.io/badge/ASL-Recognition-teal)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-v4.11+-blue)
![React](https://img.shields.io/badge/React-18.2+-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Real-time Sign Recognition**: Detects and recognizes ASL signs using your webcam
- **Pose Detection**: Uses PoseNet to track body keypoints and hand positions
- **Live Visualization**: See skeleton and pose overlays in real-time
- **Recognition History**: Track all detected signs with confidence scores and timestamps
- **Dark & Light Mode**: Professional UI with teal and purple color schemes
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Privacy First**: All processing happens locally in your browser - no data sent to servers
- **Educational Guide**: Learn basic ASL signs and hand shapes
- **High Performance**: Optimized TensorFlow.js model for smooth detection

## 🎯 Recognized Signs

Currently recognizes:

- **Hello** - Wave hand near shoulder level
- **Thank You** - Both hands gesture in appreciation
- **Yes** - Affirmative head nod
- **Please** - Hand over heart in circular motion
- **Good** - Thumbs up gesture
- And more hand gestures!

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A modern web browser with webcam access
- Good lighting environment

### Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd asl_tensorflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Grant camera permissions when prompted

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📖 How to Use

1. **Start Camera**: Click "📹 Start Camera" to enable your webcam
2. **Position Yourself**: Face the camera with good lighting
3. **Make Signs**: Perform ASL signs in front of the camera
4. **View Recognition**: See recognized signs appear in real-time with confidence scores
5. **Check History**: Browse past recognized signs in the history panel
6. **Toggle Theme**: Switch between dark and light modes with the theme button

## 💡 Tips for Best Results

✓ **Lighting**: Ensure bright, even lighting from the front
✓ **Distance**: Position yourself 2-3 feet from the camera
✓ **Movement**: Make slow, deliberate hand movements
✓ **Position**: Keep hands above shoulder height
✓ **Background**: Use a plain, contrasting background
✓ **Clear Gestures**: Make defined, complete sign movements

## 🏗️ Project Structure

```
asl_tensorflow/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Camera.js           # Pose detection & sign recognition
│   │   ├── Camera.css
│   │   ├── SignDisplay.js      # Display recognized signs
│   │   ├── SignDisplay.css
│   │   ├── ThemeToggle.js      # Dark/light mode toggle
│   │   ├── ThemeToggle.css
│   │   ├── Info.js             # Educational guide
│   │   └── Info.css
│   ├── App.js                  # Main app component
│   ├── App.css                 # Global styles
│   ├── index.js                # React entry point
│   └── index.css
├── package.json
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

- **Frontend**: React 18.2+
- **ML Framework**: TensorFlow.js 4.11+
- **Pose Detection**: PoseNet 2.2+
- **Styling**: CSS3 with CSS Variables
- **Build Tool**: Create React App

## 🎨 Color Palette

### Dark Mode

- Primary Teal: `#1abc9c`
- Primary Purple: `#9b59b6`
- Background: `#0f0f1e`
- Surface: `#1a1a2e`

### Light Mode

- Primary Teal: `#16a085`
- Primary Purple: `#8e44ad`
- Background: `#f8f9fa`
- Surface: `#ffffff`

## 🔐 Privacy & Security

✓ **Local Processing**: All AI processing happens in your browser
✓ **No Data Storage**: Signs are not stored or transmitted
✓ **No Tracking**: No analytics or tracking systems
✓ **Camera Control**: You have full control over camera permissions
✓ **Open Source**: Inspect the code to verify security

## 🚦 Current Limitations

- Recognizes common ASL signs (will be expanded)
- Best performance with good lighting
- Requires modern browser with WebGL support
- May need calibration for different hand sizes

## 📚 ASL Resources

Want to learn more about American Sign Language?

- [ASL University](https://www.lifeprint.com/) - Free ASL dictionary and lessons
- [Gallaudet University](https://www.gallaudet.edu/) - Leading deaf university
- [NFSD](https://nfsd.org/) - National Fraternal Society of the Deaf
- [ASL Connect](https://www.aslconnect.com/) - Online ASL community

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Expand sign vocabulary and recognition accuracy
- Add more pose-based gestures
- Improve mobile compatibility
- Add sign language tutorials
- Performance optimization

## 📝 Future Enhancements

- [ ] Expand sign recognition database
- [ ] Add finger spelling recognition
- [ ] Implement sentence structure support
- [ ] Mobile app version
- [ ] Voice output for recognized signs
- [ ] Multi-user support
- [ ] Sign language lessons and tutorials
- [ ] Export recognition history

## ⚖️ License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- TensorFlow.js team for amazing ML tools
- PoseNet developers for pose detection models
- React community for the excellent framework
- ASL community for invaluable feedback and guidance

## 📧 Contact & Support

Have questions or suggestions? Feel free to reach out!

---

**Built with ❤️ to help people communicate and learn American Sign Language**

🤟 **Keep signing, keep learning!** 🤟
