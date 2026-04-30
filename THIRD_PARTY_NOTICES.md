# Third-Party Notices

This project is intended to be released under the MIT License. The application
source, custom classifier rules, and inline SVG icon system are project-owned.

Direct runtime dependencies:

| Package | License | Notes |
| --- | --- | --- |
| `@mediapipe/tasks-vision` | Apache-2.0 | Browser hand, face, and pose landmark tracking. Runtime models are downloaded from Google's public model hosting URLs configured in `src/hooks/useHandTracker.js`. |
| `@tensorflow/tfjs` | Apache-2.0 | TensorFlow.js package. |
| `@tensorflow/tfjs-backend-webgl` | Apache-2.0 | TensorFlow.js WebGL backend. |
| `react` | MIT | UI framework. |
| `react-dom` | MIT | React DOM renderer. |

Development dependencies:

| Package | License | Notes |
| --- | --- | --- |
| `@vitejs/plugin-react` | MIT | Development/build tooling. |
| `vite` | MIT | Development/build tooling. |

The lockfile includes transitive dependencies with permissive licenses such as
MIT, Apache-2.0, BSD, and ISC. Before a formal public launch, run a current
license audit from CI and keep generated notices with the production bundle if
your hosting or distribution process requires it.
