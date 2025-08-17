# Secure Exam System

A comprehensive online examination platform with advanced anti-cheating features, built with Django REST Framework and React.

## Features

### Admin Features
- **Dashboard Overview**: View statistics and recent activities
- **Question Management**: Upload questions via CSV or create manually
- **Exam Creation**: Create exams by selecting questions from the bank
- **User Management**: Create and manage student accounts
- **Results Analysis**: View detailed exam results and cheating detection logs
- **Anti-cheating Monitoring**: Real-time violation tracking

### Student Features
- **Secure Exam Interface**: Fullscreen, monitored exam environment
- **Real-time Monitoring**: Camera-based face detection and behavior tracking
- **Violation Tracking**: Automatic detection of cheating attempts
- **Auto-submission**: Automatic submission when time expires or violations exceed limit
- **Clean UI**: Intuitive interface for taking exams

### Anti-cheating Features
- **Face Detection**: Monitors student presence via camera
- **Tab Switch Detection**: Detects when students leave the exam window
- **Right-click Prevention**: Disables context menus and copy-paste
- **Developer Tools Detection**: Prevents access to browser dev tools
- **Fullscreen Enforcement**: Requires fullscreen mode during exams
- **Violation Logging**: Comprehensive logging of all suspicious activities

## Tech Stack

### Backend
- **Django 5.2.5**: Web framework
- **Django REST Framework**: API development
- **SQLite**: Database (easily switchable to PostgreSQL)
- **Python-decouple**: Environment variable management

### Frontend
- **React 18**: Frontend framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling framework
- **Lucide React**: Icon library
- **Vite**: Build tool and dev server

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exam-system
   ```

2. **Create virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your settings
   ```

5. **Database setup**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create sample data**
   ```bash
   python manage.py create_sample_data
   ```

7. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## Usage

### Default Login Credentials
- **Admin**: username=`admin`, password=`password`
- **Students**: username=`john_doe`/`jane_smith`/`bob_wilson`, password=`password`

### Admin Workflow
1. Login as admin
2. Upload questions via CSV or create manually
3. Create exams by selecting questions
4. Create student accounts
5. Monitor exam results and violations

### Student Workflow
1. Login with student credentials
2. View available exams
3. Click "Start Exam" to begin
4. Allow camera access and enter fullscreen mode
5. Complete exam within time limit
6. Submit or auto-submit when time expires

### CSV Format for Questions
```csv
question,a,b,c,d,correct
"What is the capital of France?","London","Berlin","Paris","Madrid","C"
"Which planet is closest to the Sun?","Venus","Mercury","Earth","Mars","B"
```

## API Endpoints

### Authentication
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `GET /api/current-user/` - Get current user info

### Questions
- `GET /api/questions/` - List all questions (admin only)
- `POST /api/upload-csv/` - Upload questions via CSV (admin only)

### Exams
- `POST /api/create-exam/` - Create new exam (admin only)
- `GET /api/exams/` - List exams
- `GET /api/exams/{id}/` - Get exam details
- `POST /api/exams/{id}/submit/` - Submit exam answers

### Users
- `POST /api/create-user/` - Create new user (admin only)
- `GET /api/students/` - List students (admin only)

## Security Features

### Anti-cheating Implementation
1. **Camera Monitoring**: Continuous face detection during exams
2. **Window Focus**: Detects when student leaves exam window
3. **Keyboard Shortcuts**: Blocks common cheating shortcuts (F12, Ctrl+C, etc.)
4. **Right-click Prevention**: Disables context menus
5. **Fullscreen Lock**: Forces fullscreen mode during exams
6. **Violation Limits**: Auto-submits exam when violations exceed threshold

### Data Security
- CSRF protection enabled
- CORS properly configured
- Session-based authentication
- Input validation and sanitization
- SQL injection prevention via Django ORM

## Deployment

### Production Settings
1. Set `DEBUG=False` in environment variables
2. Configure `ALLOWED_HOSTS` properly
3. Use PostgreSQL for production database
4. Configure static files serving
5. Set up proper CORS settings
6. Use HTTPS in production

### Docker Deployment (Optional)
```dockerfile
# Dockerfile example for backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "exam_project.wsgi:application"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the GitHub repository or contact the development team.

## Roadmap

- [ ] Advanced ML-based face recognition
- [ ] Mobile app support
- [ ] Advanced analytics dashboard
- [ ] Question categorization and tagging
- [ ] Bulk user import via CSV
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Advanced reporting features
