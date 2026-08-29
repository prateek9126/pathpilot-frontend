# PathPilot Frontend 🖥️

This is the React frontend for the **PathPilot AI** platform. It is built on top of Vite and React 19, utilizing Vanilla CSS for a clean, highly customized Light Theme with premium micro-interactions.

---

## 📂 Folder Structure

The frontend application code is organized as follows:

```text
pathpilot-frontend/
├── public/                 # Static assets (videos, global icons)
├── src/
│   ├── assets/             # Brand logos & graphics
│   ├── components/         # Page components and views
│   │   ├── AiAssistant.jsx       # Floating AI chatbot panel
│   │   ├── CareerOverview.jsx    # Career transition & comparison matrix
│   │   ├── Certifications.jsx    # Certification search & prep plan
│   │   ├── Dashboard.jsx         # 2x2 statistics grid and recommendations
│   │   ├── Footer.jsx            # Core footer with links
│   │   ├── Landing.jsx           # Main home page with sections
│   │   ├── LearningHub.jsx       # Horizontal selections for Hub
│   │   ├── Onboarding.jsx        # Conversational / manual onboarding
│   │   ├── Path.jsx              # Timeline and Path advisor widget
│   │   ├── PathPilotSections.jsx # Section 1 (Hero Video) & Section 2 (About)
│   │   ├── Profile.jsx           # User statistics & credentials list
│   │   ├── Projects.jsx          # Project grid, matrix & code advisor
│   │   ├── Resources.jsx         # Resource grid & budget slider
│   │   ├── Roadmap.jsx           # Phase roadmap timeline
│   │   └── Workspace.jsx         # Coding workspace, quizzes & feedback
│   ├── App.css             # Main layout framework stylesheet
│   ├── App.jsx             # Main router & global state manager
│   ├── api.js              # Fetch client wrappers for backend communication
│   ├── index.css           # Global CSS variables, Light Theme design system
│   └── main.jsx            # React root mount definition
├── .env                    # Environment configuration
├── package.json            # Node project dependencies
└── vite.config.js          # Vite plugins configuration
```

---

## 🎨 Theme & Design System

The application uses **Vanilla CSS** with a modern CSS Variables design token system defined in `src/index.css`.

- **Colors**: Dominated by high-contrast whites, soft greys, and premium bright blue accents.
- **Components Styling**: Rounded borders, subtle drop shadows, clean borders, and smooth transitions on hover.
- **Light Theme Fixes**: Replaced legacy dark backgrounds with light blue/white palettes, including standardizing the contrast on "NEXT BEST ACTION" cards and "Should You Stay or Switch" prompts.
- **Form Controls**: Fully aligned margins, padding, and alignments for checkboxes and radio options inside MCQ quizzes and Workspace objectives.

---

## 🔧 Environment Configuration

The API base URL is specified via the `.env` file at the root of this folder:

```env
VITE_API_URL=http://localhost:8080/api
```

- When running locally, ensure it points to the local Spring Boot address (`http://localhost:8080/api`).
- When deploying, update it to point to your live backend endpoint.

---

## 🚀 Available Scripts

In the project directory, you can run the following commands:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches the local dev server at [http://localhost:5173](http://localhost:5173) with hot module replacement (HMR). |
| `npm run build` | Compiles the React application into static production-ready files in the `dist/` directory. |
| `npm run lint` | Inspects the codebase using **Oxlint** for fast rule validations. |
| `npm run preview` | Spins up a local web server to preview the production build output. |

---

## 📦 Key Dependencies

- **React 19** & **React DOM 19** — Foundation.
- **Lucide React** — For scalable, clean dashboard SVG icons.
- **Vite** — High performance compiler and dev-server.
- **Oxlint** — Lightweight linter.
