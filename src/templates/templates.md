This is a description of my fronend.
The schools templates are divided per schools with based on their uniquess. 
we have codes that are allocated to all students. They are found within the following folders: src/api(academic_years, api, grades, index, levels, pass_failed_statues, periods, students, subjects), hooks, {components(common/modals,reusableform,reusableTable, select)(grade_sheets/GradeInputForm, GradeSheetTable)(students/studentForm, StudentList)DashboardShell, sidebar, studentGradeEntry},pages((DashboardPage, GradeEntryPage, GradeSheetsPage, GradeViewPage, ReportCard, StudentsPage, StudentManagement)This is where the pages from the templates per schools are called and render), routes,types/(index.ts), App.tsx, and main.tsx, .env, etc....plus styles where the tailwinds are configure or called.
Then we have templates by schools and the schools for now are:
Bomi Junior High
Charity Day Care
Divine Day Care

Each templates are made up of folders and files which are connected to the main app folders and files.

we have templates/
Bomi junior High
Charity Day Care
Divine Day Care

Bomi junior High/
components
pages
styles
bomi.tsx
Dashboard.tsx

components/
common
layout

common/
Select.tsx
Sidebar.tsx

layout/
bomi.css
BomiFooter.tsx
BomiHeader.tsx

pages/
BDashboardPage
BGradeEntryPage
BGradeSheetsPage
BGradeViewPage
BReportCard
BStudentsPage
BStudentManagement

styles/
b_dashboardpage
b_gradeentrypage
b_gradesheetspage
b_reportcardpage
b_studentpage
b_studentmanagementpage
bomi-theme.css


So the app is like this:
the backend comes in through the reusable folders and files starting with the api, define actions through the hooks, store unique types in types/index.ts, form other components to src/components, store main ui for each schools in their own templates with codes that are not reusable but are personally for the schools.