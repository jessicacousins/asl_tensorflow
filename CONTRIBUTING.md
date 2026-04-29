# Contributing to ASL Recognition

Thank you for your interest in contributing to the ASL Recognition project! We welcome contributions from everyone - whether it's code, documentation, design, or feedback.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and considerate in all interactions.

### Our Values

- **Inclusivity**: Welcome to all backgrounds and experiences
- **Respect**: Honor the Deaf community and ASL culture
- **Quality**: Strive for excellence in code and documentation
- **Accessibility**: Ensure everyone can use and contribute

## Ways to Contribute

### 1. Report Bugs

If you find a bug:

1. Check existing issues first
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS info
   - Screenshots if applicable

### 2. Suggest Features

Have an idea? Create a feature request:

1. Check existing issues
2. Describe the feature clearly
3. Explain the use case
4. Provide examples if possible

### 3. Improve Documentation

Documentation improvements are valuable:

1. Fix typos or unclear sections
2. Add examples and clarifications
3. Improve code comments
4. Update outdated information

### 4. Add Code

Contributing code:

1. Start with small, focused changes
2. Follow code style guidelines
3. Write tests if applicable
4. Update documentation
5. Create descriptive commit messages

### 5. Expand Sign Recognition

Help recognize more signs:

1. Suggest new signs to recognize
2. Provide sign descriptions
3. Help with detection algorithms
4. Test recognition accuracy

## Getting Started

### Setup Development Environment

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/asl_tensorflow.git
cd asl_tensorflow

# Install dependencies
npm install

# Start development server
npm start

# Create a new branch
git checkout -b feature/your-feature-name
```

### Development Workflow

1. **Create a branch** for your work

   ```bash
   git checkout -b feature/add-sign-recognition
   ```

2. **Make your changes**
   - Keep changes focused
   - Follow code style
   - Add comments for complex logic

3. **Test thoroughly**

   ```bash
   npm start
   # Test in multiple browsers
   # Check console for errors
   ```

4. **Update documentation**
   - Update README if needed
   - Add comments to code
   - Update DEVELOPMENT.md if architecture changes

5. **Commit with clear messages**

   ```bash
   git commit -m "feat: add new sign recognition for 'Love'"
   # Good format: type(scope): description
   # Types: feat, fix, docs, style, refactor, test, chore
   ```

6. **Push and create Pull Request**
   ```bash
   git push origin feature/add-sign-recognition
   # Create PR on GitHub
   ```

## Code Style Guidelines

### JavaScript

```javascript
// Use meaningful variable names
const recognizedSign = recognizeSignFromKeypoints(keypoints);

// Use arrow functions
const calculateDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// Add JSDoc comments for functions
/**
 * Detects if hand is raised above shoulder
 * @param {Array} keypoints - Body keypoints from pose detection
 * @returns {boolean} True if hand raised above shoulder
 */
const isHandRaised = (keypoints) => {
  const hand = keypoints[10];
  const shoulder = keypoints[6];
  return hand.y < shoulder.y - 50;
};

// Use const by default, let if reassigned
const CONFIDENCE_THRESHOLD = 0.6;
let detectionCount = 0;

// Add comments for complex logic
// Check if both hands are at same height (indicating symmetrical gesture)
const bothHandsAligned = Math.abs(leftWrist.y - rightWrist.y) < 30;
```

### React Components

```javascript
import React, { useState, useEffect, useRef } from "react";
import "./Component.css";

/**
 * MyComponent - Brief description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @returns {JSX.Element} Rendered component
 */
const MyComponent = ({ title, onEvent }) => {
  const [state, setState] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    // Side effects here
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  const handleClick = () => {
    // Handler logic
  };

  return (
    <div className="component">
      <h2>{title}</h2>
      {/* JSX content */}
    </div>
  );
};

export default MyComponent;
```

### CSS

```css
/* Use semantic class names */
.camera-container {
  /* Spacing */
  padding: 1rem;
  margin-bottom: 1.5rem;

  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* Styling */
  border-radius: 12px;
  background-color: var(--dark-surface);
}

/* Use CSS variables for colors */
.btn-primary {
  background: linear-gradient(135deg, var(--teal-primary), var(--teal-dark));
  color: white;
}

/* Mobile-first responsive design */
@media (max-width: 768px) {
  .camera-container {
    padding: 0.75rem;
  }
}

/* Animations for interactions */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fadeIn {
  animation: fadeIn 0.3s ease;
}
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Comments added for complex sections
- [ ] No console errors or warnings
- [ ] Tested in multiple browsers
- [ ] Documentation updated if needed
- [ ] Commit messages are clear

### PR Description Template

```markdown
## Description

Brief description of what this PR does

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues

Closes #(issue number)

## Testing

How to test these changes:

1. Step one
2. Step two

## Screenshots (if applicable)

[Add screenshots here]

## Checklist

- [ ] Code follows style guidelines
- [ ] I've tested this locally
- [ ] Documentation is updated
- [ ] No new warnings generated
```

### Review Process

1. Maintainers review your PR
2. May request changes
3. Address feedback in new commits
4. Repeat until approved
5. Squash commits (if requested)
6. Merge to main branch

## Sign Recognition Contributions

### Adding New Signs

1. **Identify the sign**
   - Research ASL sign
   - Get video reference
   - Document the gesture

2. **Implement detection** (Camera.js)

   ```javascript
   const signs = [
     {
       name: "NewSign",
       detect: () => checkNewSignLogic(keypoints),
       confidence: 0.75,
     },
   ];

   const checkNewSignLogic = (keypoints) => {
     // Implement detection logic
     return shouldRecognizeSign;
   };
   ```

3. **Add description** (SignDisplay.js)

   ```javascript
   const getSignDescription = (signName) => {
     const descriptions = {
       NewSign: "Detailed description of how to make this sign",
     };
   };
   ```

4. **Document** (ASL_GUIDE.md)
   - Add sign to guide
   - Include description
   - Provide learning resources

5. **Test**
   - Test sign recognition
   - Check confidence scores
   - Verify in different lighting

## Documentation Contributions

### Updating Guides

- Keep language clear and simple
- Use examples where helpful
- Update table of contents
- Link to related sections
- Proofread for errors

### Adding Code Comments

```javascript
// Good comment - explains WHY
// Check if hands are close together (indicating a closed hand gesture)
const handsClose = distance(hand1, hand2) < 50;

// Bad comment - states the obvious
// Check if hands are close
```

## Testing Contributions

### Manual Testing

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile
- [ ] Test dark mode
- [ ] Test light mode
- [ ] Test with poor lighting
- [ ] Test with different hand sizes

### Edge Cases

- [ ] Camera permission denied
- [ ] No keypoints detected
- [ ] Low confidence detections
- [ ] Multiple people in frame
- [ ] Extreme lighting conditions

## Performance Testing

```bash
# Check bundle size
npm run build

# Analyze build
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'

# Profile in Chrome DevTools
# 1. Open DevTools
# 2. Go to Performance tab
# 3. Record while signing
# 4. Analyze frame rate and CPU usage
```

## Accessibility Contributions

Help make ASL Recognition accessible to everyone:

- [ ] Test with screen readers
- [ ] Ensure keyboard navigation works
- [ ] Check color contrast ratios
- [ ] Verify alt text on images
- [ ] Test with different zoom levels

## Getting Help

### Questions?

- Check documentation files
- Search existing issues
- Create a discussion issue
- Comment on related PRs

### Need Guidance?

- Review DEVELOPMENT.md
- Check similar implementations
- Ask in PR comments
- Reach out to maintainers

## Recognition

Contributors will be:

- Added to CONTRIBUTORS.md
- Credited in release notes
- Featured in project README
- Recognized in community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [React Documentation](https://react.dev)
- [TensorFlow.js Docs](https://js.tensorflow.org/)
- [ASL Resources](https://www.lifeprint.com/)

---

## Code Review Checklist (for Maintainers)

- [ ] Code follows style guidelines
- [ ] Changes are focused and limited
- [ ] Tests pass and coverage acceptable
- [ ] Documentation is updated
- [ ] Performance impact assessed
- [ ] Accessibility considerations met
- [ ] No security issues introduced

---

**Thank you for contributing to making ASL Recognition better!** 🤟

Together, we're building tools that help people communicate and learn. Your contribution matters!
