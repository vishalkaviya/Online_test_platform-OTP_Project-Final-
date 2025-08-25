📝 Online Test Platform

The Online Test Platform is a comprehensive, adaptive testing system built using React.js (frontend) and Django REST Framework (backend) with SQLite database.
It provides students with subject-based adaptive tests and equips administrators with powerful management and analytics tools.

🚀 Features

🔹 User Module

Authentication: Register, Login, Logout, and Password Reset (JWT-based).

Profile Management: View & Edit profile (name, gender, DOB, profile image).

Adaptive Test System:

Starts at medium difficulty.

Adjusts difficulty dynamically based on user performance.

Subject-based test navigation.

Navigation Sidebar with links to:

Dashboard

Test

View Profile

Edit Profile

FAQ

About Us

Contact Us

🔹 Admin Module

Secure Admin Login with role-based access.

User Management:

View, filter, and sort users by name/gender.

Access detailed user profiles.

Subject Management:

Add, edit, and delete subjects.

View question distribution by difficulty.

Question Management:

CRUD operations for questions.

Difficulty-level filtering & subject-wise search.

Analytics Dashboard with charts for:

User activity & engagement.

Performance trends.

Gender distribution.

Top performers.

🎯 Objectives

Develop a user-friendly online test system with adaptive difficulty.

Ensure secure authentication and personalized test experiences.

Provide administrators with tools for efficient management and real-time analytics.

👥 Target Users

Students & Learners → Practice adaptive subject-based tests.

Administrators & Educators → Manage users, subjects, questions, and monitor performance.

🛠️ Tech Stack

Frontend: React.js, HTML, CSS

Backend: Django, Django REST Framework

Database: SQLite

Authentication: JWT (JSON Web Token)

Visualization: Chart.js / Recharts

💻 System Requirements

🔹 Hardware

Processor: Intel Core i3 or higher

RAM: 4 GB minimum (8 GB recommended)

Disk Space: 500 MB+

Display: 1024×768 resolution or higher

Internet connection required

🔹 Software

OS: Windows 10 / Linux / macOS

Frontend: Node.js, React.js, npm

Backend: Python 3.8+, Django, DRF

Database: SQLite

Browser: Chrome / Firefox (latest versions)

Other Tools: VS Code, Postman, Git

⚙️ Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/your-username/online-test-platform.git
cd online-test-platform

2️⃣ Backend Setup (Django + DRF)

cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Backend runs at: http://127.0.0.1:8000/

3️⃣ Frontend Setup (React)

cd frontend
npm install
npm start

Frontend runs at: http://localhost:3000/

🔐 Security

JWT-based authentication.

Role-based access control (User / Admin).

Protected API routes.

📊 Analytics & Reports

Graphical dashboards with user activity, subject performance, and difficulty-level stats.

Real-time adaptive question difficulty updates.

📌 Future Enhancements

AI-driven personalized learning recommendations.

Integration with third-party learning tools.

Exportable performance reports (PDF/Excel).

🤝 Contributing

Fork the repository.

Create a new branch (feature-xyz).

Commit your changes.

Push to your branch.

Submit a Pull Request.

📄 License

This project is licensed under the MIT License – feel free to use and modify it.

👨‍💻 Author

Developed by [Kaviya V] 🚀
