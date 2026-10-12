# 🎓 StudyTracker — Academic Management & Study Suite

A modern, responsive web application designed for students and self-learners to track courses, syllabi, chapters, sub-tasks, assignment deadlines, and focus study sessions (Pomodoro timer) with real-time cloud synchronization powered by **Supabase**.

---

## 🌟 Key Features

### 1. 📊 Interactive Dashboard (`/home`)
- **Curriculum Progress**: Overall syllabus completion meter across all enrolled subjects with real-time progress percentages.
- **Urgent Deadlines Radar**: Real-time deliverable cards highlighting imminent or overdue tasks with dynamic urgency badges (*Overdue*, *Due Today*, *Due Tomorrow*, *In X Days*).
- **Mini Calendar Preview**: Compact monthly date picker widget displaying deadline dots with interactive day agendas and direct task completion toggling right from the homepage.
- **Quick Actions**: Rapidly create new courses or schedule upcoming deliverables directly from the header banner.

### 2. 📚 Course & Curriculum Management (`/myCourses`, `/myCourses/:id`)
- **Course Tracker**: Monitor enrolled subjects, chapter completion counts, total logged study hours, and course statuses (*In Progress*, *Completed*).
- **Chapter & Task Breakdown**: Interactive syllabus tree view allowing users to break down chapters into granular action items/tasks.
- **Progress Synchronization**: Checkbox completion toggles update local state and Supabase tables simultaneously with optimistic UI feedback.
- **Safe Course Removal**: Delete courses with built-in cascading deletion that automatically purges child chapters, tasks, and linked assignments.

### 3. ⏱️ Focus Study Timer (Pomodoro)
- **Built-in Study Session Companion**: Integrated into individual course detail pages.
- **Multiple Modes**: Supports **Focus**, **Short Break**, and **Long Break** sessions with audio-visual completion notifications.
- **Automatic Time Logging**: Focus study session minutes are automatically summed and credited to the active course's total study time in the cloud database.

### 4. 📅 Academic Calendar & Deliverables Sync (`/calendar`)
- **Month Grid View**: Full calendar grid with weekday headers, previous/next month navigation, and a quick **Today** jump button.
- **Color-Coded Statuses**:
  - 🔴 **Overdue**: Deliverables past deadline and still pending.
  - 🟡 **Due Today**: Items due within the current day.
  - 🔵 **Upcoming**: Future deadlines.
  - 🟢 **Completed**: Deliverables marked as completed.
- **Schedule Agenda Drawer**: Click any calendar day to inspect its full deliverable list, toggle completion, or remove items.
- **Pre-filled Scheduling**: Click *Schedule Task for this Day* to open the creation modal with that date pre-selected.
- **Dual View Modes**: Seamlessly switch between the **Month Grid View** and a chronological **Agenda Timeline View**.
- **Multi-Dimensional Filters**: Filter calendar items by course and status (*All*, *Pending*, *Completed*, *Overdue*).

### 5. 📝 Assignments Hub (`/assignments`)
- Detailed tabular overview of deliverables with course tags, formatted deadlines, status indicators, and actions.
- Filter tabs for quick access to *All*, *Pending*, and *Completed* assignments.
- Toggle between the **Table View** and the **Academic Calendar**.

### 6. 🔐 Authentication & Profile (`/`, `/registration`, `/setting`)
- Secure email/password authentication using **Supabase Auth**.
- Protected route guards ensuring guest-only and authenticated-only route separation.
- Persistent session handling across reloads.
- Profile management with customizable student display names.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (Custom tokens, glassmorphism, responsive grid) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Authentication, Row-Level Security) |
| **Routing** | [React Router v8](https://reactrouter.com/) |
| **Forms & Validation** | [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) |
| **Icons** | [React Icons](https://react-icons.github.io/react-icons/) (`io5`, `bi`, `md`, `tb`, `bs`) |

---

## 📁 Project Architecture

```
Study-Tracker/
├── public/                 # Static public assets & brand icons
├── src/
│   ├── assets/             # Images, SVGs, and brand media
│   ├── components/         # Reusable application components
│   │   ├── CalendarPreview/   # Mini calendar dashboard widget
│   │   ├── CoursesTable/      # Course curriculum table & delete modal
│   │   ├── InputGroup/        # Formik-integrated form field component
│   │   ├── Navbar/            # Desktop & mobile responsive header
│   │   ├── ProgressBar/       # Gradient animated progress bar
│   │   ├── Sidebar/           # Desktop navigation sidebar
│   │   ├── TotalProgress/     # Syllabus progress analytics card
│   │   ├── UpComingAssignment/# Urgent deadlines summary card
│   │   ├── UserIcon/          # Initials user avatar badge
│   │   ├── modals/            # Modal dialogs
│   │   │   ├── AddAssignment.jsx # Modal to schedule deliverables
│   │   │   ├── AddCourse.jsx     # Modal to create a new course
│   │   │   └── index.js          # Modals barrel export
│   │   └── index.js           # Components barrel export
│   ├── context/
│   │   └── MainContext.jsx    # Global store for courses, assignments & auth
│   ├── layouts/
│   │   ├── AuthLayout.jsx     # Centered card layout for Login / Register
│   │   └── MainLayout.jsx     # Sidebar + Navbar app shell layout
│   ├── pages/
│   │   ├── Assignment/        # Assignments table & task list
│   │   ├── Auth/              # Login & Registration pages
│   │   ├── Calendar/          # Interactive academic calendar & agenda
│   │   ├── CourseDetails/     # Syllabus chapters, tasks & focus timer
│   │   ├── Courses/           # Course catalog list
│   │   ├── Error/             # 404 Not Found page
│   │   ├── Home/              # Main student dashboard
│   │   ├── Setting/           # Account settings & profile page
│   │   └── index.js           # Pages barrel export
│   ├── routes/
│   │   ├── ProtectedAuth.jsx  # Redirects logged-in users away from auth
│   │   └── ProtectedPages.jsx # Redirects guests to login
│   ├── utils/
│   │   ├── course.js          # Study time & completion math utilities
│   │   ├── date.js            # Date formatting & deadline status utilities
│   │   └── index.js           # Utilities barrel export
│   ├── App.jsx                # Router configuration & toast notifications
│   ├── index.css              # Tailwind theme configuration & custom styles
│   ├── main.jsx               # React DOM entry point
│   └── supabaseClient.js      # Supabase initialization client
├── .env.local                 # Supabase environment variables (gitignored)
├── package.json               # Dependencies and build scripts
└── vite.config.js             # Vite configuration with React & Tailwind plugins
```

---

## 🗄️ Database Schema (Supabase)

The application uses four primary PostgreSQL tables with Row Level Security (RLS) enabled:

### `courses`
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary Key (Default: `gen_random_uuid()`) |
| `user_id` | `uuid` | Foreign key referencing `auth.users(id)` |
| `topic_name` | `text` | Course / subject title |
| `total_chapters` | `integer`| Total number of chapters in syllabus |
| `done_chapters` | `integer`| Number of completed chapters |
| `total_time` | `numeric` | Total minutes logged in focus study timer |
| `status` | `text` | Current status (`'in progress'`, `'completed'`) |
| `created_at` | `timestamptz` | Record creation timestamp |

### `chapters`
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary Key |
| `course_id` | `uuid` | Foreign key referencing `courses(id)` |
| `user_id` | `uuid` | Foreign key referencing `auth.users(id)` |
| `title` | `text` | Chapter name |
| `order_index` | `integer`| Display ordering index |
| `is_done` | `boolean` | Chapter completion flag |

### `tasks`
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary Key |
| `chapter_id` | `uuid` | Foreign key referencing `chapters(id)` |
| `user_id` | `uuid` | Foreign key referencing `auth.users(id)` |
| `title` | `text` | Task description |
| `order_index` | `integer`| Display ordering index |
| `is_done` | `boolean` | Task completion flag |

### `assignments`
| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary Key |
| `user_id` | `uuid` | Foreign key referencing `auth.users(id)` |
| `course_id` | `uuid` | Foreign key referencing `courses(id)` |
| `assignment_name`| `text` | Deliverable or homework title |
| `deadline` | `timestamp`| Target completion date and time |
| `isDone` | `boolean` | Deliverable completion flag |
| `created_at` | `timestamptz` | Record creation timestamp |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) or `pnpm` / `yarn`
- A [Supabase](https://supabase.com/) project

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/study-tracker.git
cd study-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

### 5. Build for Production
```bash
npm run build
```
The compiled output will be generated in the `dist/` directory, ready to deploy to Vercel, Netlify, or any static hosting service.

---

## 📜 Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Launches the local Vite development server with HMR |
| `npm run build` | Compiles the production bundle with Vite |
| `npm run lint` | Runs ESLint across the codebase |
| `npm run preview`| Previews the production build locally |

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
