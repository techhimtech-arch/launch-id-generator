
## School ID Card Generator (Frontend-Only)

A single-page React app that turns an Excel roster + photo uploads into print-ready ID cards — all in the browser, no backend.

### Core flow
1. **Upload Excel** → parsed in-browser with SheetJS (`xlsx`). First row = headers, user picks which columns map to Name, Roll No, Class, etc.
2. **Upload photos** (multi-select or drag-drop, JPG/PNG).
3. **Auto-map** photos to students sequentially (photo 1 → student 1, …).
4. **Review & reassign** in a grid: each student row shows their assigned photo with a dropdown / drag to swap to any other uploaded photo, or "no photo".
5. **Crop** assigned photo via a modal (react-easy-crop) — square crop, zoom slider, save back as data URL.
6. **Generate PDF** with jsPDF — A4 sheet, multiple ID cards per page (e.g., 2×5 grid), each card showing photo + student fields + school name/logo.

### Screens
- **Step 1 — Upload**: drop zones for Excel and photos, shows counts.
- **Step 2 — Column mapping**: dropdowns to map Excel columns to ID-card fields (Name required, others optional).
- **Step 3 — Student grid**: table of students with thumbnail of assigned photo, reassign dropdown, "Crop" button, and a side panel of unassigned photos.
- **Step 4 — Card designer (light)**: pick school name, optional logo upload, accent color, card orientation (portrait/landscape).
- **Step 5 — Preview & Download PDF**: live preview of first few cards, "Download PDF" button.

### Tech
- `xlsx` (SheetJS) for Excel parsing
- `react-easy-crop` for cropping
- `jspdf` for PDF generation
- `react-dropzone` for uploads
- shadcn/ui components, Tailwind, React Router (single route is fine, stepper UI inside)

### Out of scope (v1)
- Saving sessions (everything resets on refresh — pure local)
- Custom card templates beyond one clean default + color/logo
- Barcode/QR codes (can be added later)

### Design
Clean, utilitarian, light theme — this is a tool, not a marketing site. Sidebar stepper on the left, working area on the right. Neutral grays with a single blue accent.
