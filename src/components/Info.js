import React, { useState } from "react";
import "./Info.css";

const Info = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const aslGuide = [
    {
      title: "Basic ASL Signs",
      content: [
        { sign: "Hello", desc: "Open hand with fingers spread, waving motion" },
        {
          sign: "Thank You",
          desc: "Both hands together near chest, moving forward",
        },
        { sign: "Yes", desc: "Fist with thumb extended upward" },
        { sign: "Please", desc: "Flat hand rubbing chest in circular motion" },
        { sign: "Good", desc: "Thumbs up gesture with fist" },
      ],
    },
    {
      title: "Hand Shapes",
      content: [
        { sign: "A", desc: "Fist with thumb tucked inside curled fingers" },
        { sign: "B", desc: "Flat hand with all fingers extended together" },
        { sign: "C", desc: "Hand curved in C-shape, thumb and pinky close" },
        { sign: "I", desc: "Pinky finger extended, other fingers curled" },
        { sign: "Love", desc: "Both hands crossed over heart area" },
      ],
    },
    {
      title: "How to Use This App",
      content: [
        { sign: "Step 1", desc: 'Click "Start Camera" to enable your webcam' },
        { sign: "Step 2", desc: "Face the camera with good lighting" },
        { sign: "Step 3", desc: "Make clear sign gestures in front of camera" },
        { sign: "Step 4", desc: "Watch recognized signs appear in real-time" },
        { sign: "Step 5", desc: "Check history to see all detected signs" },
      ],
    },
    {
      title: "Tips for Best Results",
      content: [
        {
          sign: "Lighting",
          desc: "Ensure bright, even lighting from the front",
        },
        { sign: "Distance", desc: "Position yourself 2-3 feet from camera" },
        { sign: "Movement", desc: "Make slow, deliberate hand movements" },
        { sign: "Positioning", desc: "Keep hands above shoulder height" },
        {
          sign: "Background",
          desc: "Use a plain, contrasting background",
        },
      ],
    },
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="info-container">
      <h2>Learn ASL</h2>
      <p className="info-subtitle">
        American Sign Language guide and recognition tips
      </p>

      <div className="guide-grid">
        {aslGuide.map((section, index) => (
          <div
            key={index}
            className={`guide-card surface ${
              expandedIndex === index ? "expanded" : ""
            }`}
          >
            <button
              className="guide-header-btn"
              onClick={() => toggleExpand(index)}
            >
              <h3>{section.title}</h3>
              <span className="expand-icon">
                {expandedIndex === index ? "▼" : "▶"}
              </span>
            </button>

            {expandedIndex === index && (
              <div className="guide-content fadeIn">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="guide-item">
                    <div className="guide-sign">{item.sign}</div>
                    <p className="guide-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="about-section surface">
        <h3>About ASL Recognition</h3>
        <p>
          This application uses TensorFlow.js and MediaPipe to detect hand
          landmarks and finger positions, then recognizes ASL signs in
          real-time. It's designed to help people learn American Sign Language
          and bridge communication barriers.
        </p>
        <p>
          All processing happens directly in your browser - no data is sent to
          external servers. Your privacy is protected.
        </p>
        <div className="tech-stack">
          <h4>Built With:</h4>
          <ul>
            <li>⚡ React - UI Framework</li>
            <li>🧠 TensorFlow.js - Machine Learning</li>
            <li>🤳 MediaPipe - Hand Landmark Detection</li>
            <li>🎨 Modern CSS - Responsive Design</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Info;
