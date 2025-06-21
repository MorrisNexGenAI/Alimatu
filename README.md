Overview of the Entire app:
🎓 Student Grading & Report Card System
An advanced full-stack school grading and reporting system, built with Django (Python) on the backend and React + TypeScript on the frontend. Designed to handle student enrollment, grading, report card generation (PDF/Word), academic evaluations, and flexible template rendering per school.

🧠 Backend Architecture – Django (Python)
The backend is organized into 9 modular Django apps, each serving a core part of the system:

1. enrollment
Connects students to levels and academic years. Serves as the bridge using foreign keys:

Student, Level, AcademicYear

Tracks: date_enrolled, status

2. grades
The core engine for storing and managing student scores.

Many-to-many logic: connects Enrollment, Subject, and Period

Tracks: score, updated_at

Includes: views, serializers, helper.py

3. grade_sheets
The heartbeat of the system, combining all logic to produce final report sheets.

Fields: student, level, academic_year, created_at, updated_at, pdf_path, filename

Includes: helpers, utils, pdf_utils, yearly_pdf_utils

4. students
The base model holding personal student information:

Fields: first_name, last_name, dob, gender, created_at

Includes: api/, views, serializers, helpers

5. levels
Represents digital classrooms (e.g., 7th grade, 8th grade):

Field: name (e.g., “Grade 9”)

Includes: views, serializers, helpers

6. subjects
Courses tied to specific levels.

Fields: subject, level (FK)

Includes: views, serializers, helpers

7. periods
Academic terms (e.g., 1st Term, 2nd Term, 1st Exam, etc.)

Fields: period, is_exam

Includes: views, serializers, helpers

8. pass_and_failed
Determines final student status and template to use.

STATUS_CHOICES: PASS, FAIL, CONDITIONAL, INCOMPLETE, PENDING

Tracks validation metadata and PDF template to use

Fields include: student, level, academic_year, status, template_name, etc.

9. academic_years
Defines school academic calendar years used throughout the system.

🧩 Core Technologies & Tools
Django REST Framework: API creation

pywin32: Word and PDF conversion via Windows COM interface (no WeasyPrint used)

Helper modules: Custom business logic per app

PDF generation: Uses .docx templates, converted to .pdf based on student pass/fail status

Custom api/ routing: All endpoints grouped in students/api/

🌐 Frontend – React + TypeScript
Built with reusability in mind and structured around school-specific themes.

🔁 Reusable Structure
Folders: src/api, hooks, components, types/, pages/, routes/

Key Reusables:

GradeInputForm, GradeSheetTable, StudentForm, StudentList

Sidebar, DashboardShell, ReusableForm, ReusableTable

🏫 School-Specific Templates
Each school has a custom UI under templates/, including styles, layout, and pages:

Bomi Junior High

Charity Day Care

Divine Day Care

Each school folder contains:

Copy
Edit
components/
  ├── common/
  └── layout/
pages/
styles/
bomi.tsx, Dashboard.tsx, etc.
Pages like BGradeEntryPage, BStudentsPage, etc., map to backend endpoints, tailored per school.




🎓 Frontend - Student Grading & Report Card System

This is the frontend of a full-stack student grading and report card system built with React + TypeScript + Tailwind CSS. It connects to a Django REST API and renders dynamic dashboards, grade entry forms, report cards, and school-specific templates.

🧭 Features

Responsive UI for grade entry, student management, and report views

Reusable components and hooks

Tailored themes and layout per school

Centralized API logic with TypeScript interfaces

Clean file architecture for scalability

📁 Project Structure

src/
├── api/                # API logic for students, grades, levels, etc.
├── components/         # Reusable UI components
│   ├── common/
│   ├── modals/
│   └── select/
├── hooks/              # Custom React hooks (e.g. useSubjects, useGrades)
├── pages/              # Core app pages (Dashboard, Grades, Reports, etc.)
├── routes/             # App routing
├── types/              # Global TypeScript interfaces
├── templates/          # School-specific UIs
│   ├── Bomi Junior High/
│   ├── Charity Day Care/
│   └── Divine Day Care/
├── App.tsx
├── main.tsx
└── styles/             # Tailwind and school-specific styles

🏫 School Templates

Each school under templates/ has:

Custom pages (Dashboard, GradeEntry, etc.)

Unique header/footer layout

Local Tailwind theme

Example: templates/Bomi Junior High/pages/BGradeSheetsPage.tsx

🛠 Tech Stack

React + TypeScript

Tailwind CSS

Axios for API requests

React Router DOM for navigation

Vite for fast builds and dev server

🚀 Getting Started

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

🌐 Backend API

Make sure your Django backend is running and accessible (typically at http://localhost:8000/api/).

Update .env with your base API URL:

VITE_API_BASE_URL=http://localhost:8000/api/

📄 License

MIT License
