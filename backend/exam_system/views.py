from django.shortcuts import render

# Create your views here.
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.http import JsonResponse
from django.utils import timezone
from django.middleware.csrf import get_token
import csv
import io
from .models import CustomUser, Question, Exam, StudentResponse
from .serializers import UserSerializer, QuestionSerializer, ExamSerializer, StudentResponseSerializer

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if username and password:
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'role': user.role,
                    'student_id': user.student_id,
                },
                'csrf_token': get_token(request)
            })
        else:
            return Response({'success': False, 'message': 'Invalid credentials'})
    
    return Response({'success': False, 'message': 'Username and password required'})

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def logout_view(request):
    logout(request)
    return Response({'success': True})

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def current_user(request):
    if request.user.is_authenticated:
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'role': request.user.role,
            'student_id': request.user.student_id,
        })
    return Response({'error': 'Not authenticated'}, status=401)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_csv(request):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=400)
    
    csv_file = request.FILES['file']
    if not csv_file.name.endswith('.csv'):
        return Response({'error': 'File must be CSV format'}, status=400)
    
    try:
        decoded_file = csv_file.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded_file))
        
        questions = []
        for row in reader:
            question = Question(
                question_text=row['question'],
                option_a=row['a'],
                option_b=row['b'],
                option_c=row['c'],
                option_d=row['d'],
                correct_answer=row['correct'].upper(),
                created_by=request.user
            )
            questions.append(question)
        
        Question.objects.bulk_create(questions)
        return Response({
            'success': True,
            'message': f'{len(questions)} questions uploaded successfully'
        })
    
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_questions(request):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    questions = Question.objects.all().order_by('-created_at')
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

# @api_view(['POST'])
# @permission_classes([permissions.IsAuthenticated])
# def create_exam(request):
#     if request.user.role != 'ADMIN':
#         return Response({'error': 'Admin access required'}, status=403)
    
#     data = request.data.copy()
#     data['created_by'] = request.user.id
    
#     serializer = ExamSerializer(data=data)
#     if serializer.is_valid():
#         exam = serializer.save()
        
#         # Add questions to exam
#         question_ids = request.data.get('question_ids', [])
#         if question_ids:
#             questions = Question.objects.filter(id__in=question_ids)
#             exam.questions.set(questions)
        
#         return Response({
#             'success': True,
#             'exam_id': exam.id,
#             'message': 'Exam created successfully'
#         })
    
#     return Response({'error': serializer.errors}, status=400)

# backend/exam_system/views.py - Alternative approach with serializer

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_exam(request):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        # Extract data from request
        data = request.data.copy()
        question_ids = data.pop('question_ids', [])
        
        # Add created_by to data
        data['created_by'] = request.user.id
        
        # Validate question_ids
        if not question_ids or len(question_ids) == 0:
            return Response({'error': 'At least one question must be selected'}, status=400)
        
        # Validate that all question IDs exist and belong to the current user
        questions = Question.objects.filter(id__in=question_ids, created_by=request.user)
        if questions.count() != len(question_ids):
            return Response({'error': 'Some selected questions do not exist or you do not have permission to use them'}, status=400)
        
        # Create exam using serializer
        serializer = ExamSerializer(data=data)
        if serializer.is_valid():
            exam = serializer.save()
            
            # Add questions to exam
            exam.questions.set(questions)
            
            return Response({
                'success': True,
                'exam_id': exam.id,
                'message': f'Exam "{exam.title}" created successfully with {questions.count()} questions'
            }, status=201)
        else:
            return Response({'error': serializer.errors}, status=400)
    
    except Exception as e:
        print(f"Error creating exam: {str(e)}")  # For debugging
        import traceback
        traceback.print_exc()  # Print full traceback for debugging
        return Response({'error': f'Failed to create exam: {str(e)}'}, status=500)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_exams(request):
    if request.user.role == 'ADMIN':
        exams = Exam.objects.filter(created_by=request.user)
    else:
        exams = Exam.objects.filter(is_active=True)
    
    serializer = ExamSerializer(exams, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_exam_details(request, exam_id):
    try:
        exam = Exam.objects.get(id=exam_id)
        
        if request.user.role == 'STUDENT':
            # Check if student already took this exam
            try:
                response = StudentResponse.objects.get(student=request.user, exam=exam)
                return Response({
                    'error': 'Exam already taken',
                    'score': response.score,
                    'submitted_at': response.submitted_at
                }, status=400)
            except StudentResponse.DoesNotExist:
                pass
        
        exam_data = ExamSerializer(exam).data
        questions_data = QuestionSerializer(exam.questions.all(), many=True).data
        
        # Remove correct answers for students
        if request.user.role == 'STUDENT':
            for question in questions_data:
                question.pop('correct_answer', None)
        
        exam_data['questions'] = questions_data
        return Response(exam_data)
        
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_exam(request, exam_id):
    if request.user.role != 'STUDENT':
        return Response({'error': 'Student access required'}, status=403)
    
    try:
        exam = Exam.objects.get(id=exam_id)
        
        # Check if already submitted
        if StudentResponse.objects.filter(student=request.user, exam=exam).exists():
            return Response({'error': 'Exam already submitted'}, status=400)
        
        data = {
            'student': request.user.id,
            'exam': exam.id,
            'answers': request.data.get('answers', {}),
            'violations_count': request.data.get('violations_count', 0),
            'violations_log': request.data.get('violations_log', []),
            'cheated': request.data.get('cheated', False),
            'time_taken': request.data.get('time_taken', 0),
            'started_at': request.data.get('started_at', timezone.now())
        }
        
        serializer = StudentResponseSerializer(data=data)
        if serializer.is_valid():
            response = serializer.save()
            return Response({
                'success': True,
                'score': response.score,
                'cheated': response.cheated,
                'violations_count': len(response.violations_log)
            })
        
        return Response({'error': serializer.errors}, status=400)
        
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)

# @api_view(['POST'])
# @permission_classes([permissions.IsAuthenticated])
# def create_user(request):
#     if request.user.role != 'ADMIN':
#         return Response({'error': 'Admin access required'}, status=403)
    
#     data = request.data.copy()
#     data['created_by'] = request.user
    
#     serializer = UserSerializer(data=data)
#     if serializer.is_valid():
#         user = serializer.save()
#         return Response({
#             'success': True,
#             'user_id': user.id,
#             'message': f'{user.role} created successfully'
#         })
    
#     return Response({'error': serializer.errors}, status=400)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_user(request):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)

    serializer = UserSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'success': True,
            'user_id': user.id,
            'message': f'{user.role} created successfully'
        })

    return Response({'error': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_students(request):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    students = CustomUser.objects.filter(role='STUDENT', created_by=request.user)
    serializer = UserSerializer(students, many=True)
    return Response(serializer.data)

# Add CSRF token endpoint
@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_csrf_token(request):
    return Response({
        'csrf_token': get_token(request)
    })

# Add this to your backend/exam_system/views.py file

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def bulk_import_students(request):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=400)
    
    csv_file = request.FILES['file']
    if not csv_file.name.endswith('.csv'):
        return Response({'error': 'File must be CSV format'}, status=400)
    
    try:
        decoded_file = csv_file.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded_file))
        
        students_created = []
        errors = []
        
        for row_num, row in enumerate(reader, start=2):  # Start at 2 because of header row
            try:
                # Validate required fields
                required_fields = ['first_name', 'last_name', 'username', 'password']
                missing_fields = [field for field in required_fields if not row.get(field, '').strip()]
                
                if missing_fields:
                    errors.append(f"Row {row_num}: Missing required fields: {', '.join(missing_fields)}")
                    continue
                
                # Check if username already exists
                if CustomUser.objects.filter(username=row['username'].strip()).exists():
                    errors.append(f"Row {row_num}: Username '{row['username'].strip()}' already exists")
                    continue
                
                # Create student
                student_data = {
                    'username': row['username'].strip(),
                    'first_name': row['first_name'].strip(),
                    'last_name': row['last_name'].strip(),
                    'email': row.get('email', '').strip(),
                    'role': 'STUDENT',
                    'created_by': request.user
                }
                
                # Create user
                student = CustomUser.objects.create_user(
                    username=student_data['username'],
                    password=row['password'].strip(),
                    first_name=student_data['first_name'],
                    last_name=student_data['last_name'],
                    email=student_data['email'] if student_data['email'] else None,
                    role=student_data['role'],
                    created_by=student_data['created_by']
                )
                
                students_created.append({
                    'username': student.username,
                    'student_id': student.student_id,
                    'name': f"{student.first_name} {student.last_name}"
                })
                
            except Exception as e:
                errors.append(f"Row {row_num}: Error creating student - {str(e)}")
        
        response_data = {
            'success': True,
            'imported_count': len(students_created),
            'error_count': len(errors),
            'message': f'Successfully imported {len(students_created)} students'
        }
        
        if errors:
            response_data['errors'] = errors
            response_data['message'] += f' ({len(errors)} errors occurred)'
        
        return Response(response_data)
        
    except Exception as e:
        return Response({'error': f'Failed to process CSV: {str(e)}'}, status=400)
    
# Add these views to your backend/exam_system/views.py

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_results(request):
    """Get all exam results (admin only)"""
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        # Get all student responses for exams created by this admin
        results = StudentResponse.objects.filter(
            exam__created_by=request.user
        ).select_related('student', 'exam').order_by('-submitted_at')
        
        results_data = []
        for result in results:
            violations_count = len(result.violations_log) if result.violations_log else 0
            
            results_data.append({
                'id': result.id,
                'student': {
                    'id': result.student.id,
                    'username': result.student.username,
                    'first_name': result.student.first_name,
                    'last_name': result.student.last_name,
                    'student_id': result.student.student_id,
                },
                'exam': {
                    'id': result.exam.id,
                    'title': result.exam.title,
                    'duration_minutes': result.exam.duration_minutes,
                    'max_violations': result.exam.max_violations,
                },
                'score': result.score,
                'time_taken': result.time_taken,
                'cheated': result.cheated,
                'violations_count': violations_count,
                'submitted_at': result.submitted_at.isoformat(),
                'started_at': result.started_at.isoformat(),
                'answers': result.answers,
                'violations_log': result.violations_log
            })
        
        return Response(results_data)
    
    except Exception as e:
        print(f"Error getting results: {str(e)}")
        return Response({'error': 'Failed to load results'}, status=500)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_exam_results(request, exam_id):
    """Get results for a specific exam"""
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        # Verify the exam belongs to this admin
        exam = Exam.objects.get(id=exam_id, created_by=request.user)
        
        # Get all responses for this exam
        results = StudentResponse.objects.filter(exam=exam).select_related('student')
        
        results_data = []
        for result in results:
            violations_count = len(result.violations_log) if result.violations_log else 0
            
            results_data.append({
                'id': result.id,
                'student': {
                    'id': result.student.id,
                    'username': result.student.username,
                    'first_name': result.student.first_name,
                    'last_name': result.student.last_name,
                    'student_id': result.student.student_id,
                },
                'exam': {
                    'id': exam.id,
                    'title': exam.title,
                },
                'score': result.score,
                'time_taken': result.time_taken,
                'cheated': result.cheated,
                'violations_count': violations_count,
                'submitted_at': result.submitted_at.isoformat(),
                'answers': result.answers,
                'violations_log': result.violations_log
            })
        
        return Response(results_data)
    
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)
    except Exception as e:
        print(f"Error getting exam results: {str(e)}")
        return Response({'error': 'Failed to load exam results'}, status=500)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_student_results(request, student_id):
    """Get results for a specific student"""
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        # Verify the student was created by this admin
        student = CustomUser.objects.get(id=student_id, created_by=request.user, role='STUDENT')
        
        # Get all responses for this student
        results = StudentResponse.objects.filter(student=student).select_related('exam')
        
        results_data = []
        for result in results:
            violations_count = len(result.violations_log) if result.violations_log else 0
            
            results_data.append({
                'id': result.id,
                'student': {
                    'id': student.id,
                    'username': student.username,
                    'first_name': student.first_name,
                    'last_name': student.last_name,
                    'student_id': student.student_id,
                },
                'exam': {
                    'id': result.exam.id,
                    'title': result.exam.title,
                },
                'score': result.score,
                'time_taken': result.time_taken,
                'cheated': result.cheated,
                'violations_count': violations_count,
                'submitted_at': result.submitted_at.isoformat(),
                'answers': result.answers,
                'violations_log': result.violations_log
            })
        
        return Response(results_data)
    
    except CustomUser.DoesNotExist:
        return Response({'error': 'Student not found'}, status=404)
    except Exception as e:
        print(f"Error getting student results: {str(e)}")
        return Response({'error': 'Failed to load student results'}, status=500)
    
# Add this view to your backend/exam_system/views.py file

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_dashboard_stats(request):
    """Get comprehensive dashboard statistics for admin"""
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        # Get counts for entities created by this admin
        students_count = CustomUser.objects.filter(
            role='STUDENT', 
            created_by=request.user
        ).count()
        
        exams_count = Exam.objects.filter(created_by=request.user).count()
        
        active_exams_count = Exam.objects.filter(
            created_by=request.user, 
            is_active=True
        ).count()
        
        questions_count = Question.objects.filter(created_by=request.user).count()
        
        # Get all student responses for this admin's exams
        results = StudentResponse.objects.filter(
            exam__created_by=request.user
        ).select_related('student', 'exam')
        
        total_results = results.count()
        
        # Calculate average score
        if total_results > 0:
            scores = [result.score for result in results if result.score is not None]
            average_score = round(sum(scores) / len(scores), 1) if scores else 0
        else:
            average_score = 0
        
        # Get flagged submissions
        flagged_submissions = results.filter(cheated=True).count()
        
        # Calculate performance trends
        performance_trends = {
            'excellent': results.filter(score__gte=90).count(),
            'good': results.filter(score__gte=70, score__lt=90).count(),
            'average': results.filter(score__gte=50, score__lt=70).count(),
            'poor': results.filter(score__lt=50).count()
        }
        
        # Get recent results (last 10)
        recent_results = results.order_by('-submitted_at')[:10]
        
        # Format recent activity data
        recent_activity = []
        for result in recent_results:
            violations_count = len(result.violations_log) if result.violations_log else 0
            recent_activity.append({
                'id': result.id,
                'student': {
                    'id': result.student.id,
                    'username': result.student.username,
                    'first_name': result.student.first_name,
                    'last_name': result.student.last_name,
                    'student_id': result.student.student_id,
                },
                'exam': {
                    'id': result.exam.id,
                    'title': result.exam.title,
                },
                'score': result.score,
                'time_taken': result.time_taken,
                'cheated': result.cheated,
                'violations_count': violations_count,
                'submitted_at': result.submitted_at.isoformat(),
                'started_at': result.started_at.isoformat(),
            })
        
        # Calculate summary statistics
        summary = {
            'completion_rate': round((total_results / students_count * 100), 1) if students_count > 0 else 0,
            'pass_rate': round((results.filter(score__gte=50).count() / total_results * 100), 1) if total_results > 0 else 0,
            'cheat_rate': round((flagged_submissions / total_results * 100), 1) if total_results > 0 else 0
        }
        
        # Get exam-wise statistics
        exam_stats = []
        admin_exams = Exam.objects.filter(created_by=request.user)
        for exam in admin_exams:
            exam_results = results.filter(exam=exam)
            exam_results_count = exam_results.count()
            
            if exam_results_count > 0:
                exam_average = round(sum(r.score for r in exam_results if r.score) / exam_results_count, 1)
                exam_cheated = exam_results.filter(cheated=True).count()
            else:
                exam_average = 0
                exam_cheated = 0
            
            exam_stats.append({
                'id': exam.id,
                'title': exam.title,
                'total_attempts': exam_results_count,
                'average_score': exam_average,
                'cheated_count': exam_cheated,
                'is_active': exam.is_active,
                'created_at': exam.created_at.isoformat(),
                'questions_count': exam.questions.count()
            })
        
        # Sort exam stats by creation date (newest first)
        exam_stats.sort(key=lambda x: x['created_at'], reverse=True)
        
        return Response({
            'totalStudents': students_count,
            'totalExams': exams_count,
            'activeExams': active_exams_count,
            'totalQuestions': questions_count,
            'averageScore': average_score,
            'totalResults': total_results,
            'flaggedSubmissions': flagged_submissions,
            'performanceTrends': performance_trends,
            'recentResults': recent_activity,
            'summary': summary,
            'examStats': exam_stats[:5],  # Top 5 recent exams
            'timestamp': timezone.now().isoformat(),
        })
        
    except Exception as e:
        print(f"Error getting dashboard stats: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': 'Failed to load dashboard statistics'}, status=500)
    
# Add these views to your backend/exam_system/views.py file

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_user(request, user_id):
    """Update a user (admin only)"""
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        # Get the user to update - must be created by this admin
        user = CustomUser.objects.get(id=user_id, created_by=request.user)
        
        # Validate input data
        data = request.data
        errors = {}
        
        # Check required fields
        if not data.get('username', '').strip():
            errors['username'] = 'Username is required'
        if not data.get('first_name', '').strip():
            errors['first_name'] = 'First name is required'
        if not data.get('last_name', '').strip():
            errors['last_name'] = 'Last name is required'
        
        # Check if username is already taken by another user
        username = data.get('username', '').strip()
        if username and username != user.username:
            if CustomUser.objects.filter(username=username).exclude(id=user.id).exists():
                errors['username'] = 'Username already exists'
        
        # Validate email if provided
        email = data.get('email', '').strip()
        if email:
            import re
            email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
            if not re.match(email_regex, email):
                errors['email'] = 'Invalid email format'
        
        # Validate password if provided
        password = data.get('password', '').strip()
        if password and len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters'
        
        # Validate role
        role = data.get('role', 'STUDENT')
        if role not in ['STUDENT', 'ADMIN']:
            errors['role'] = 'Invalid role'
        
        if errors:
            return Response({'error': errors}, status=400)
        
        # Update user fields
        user.username = username
        user.first_name = data.get('first_name', '').strip()
        user.last_name = data.get('last_name', '').strip()
        user.email = email if email else None
        user.role = role
        
        # Update password if provided
        if password:
            user.set_password(password)
        
        user.save()
        
        # Return updated user data
        user_data = {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'role': user.role,
            'student_id': user.student_id,
            'date_joined': user.date_joined.isoformat() if user.date_joined else None,
        }
        
        return Response({
            'success': True,
            'message': f'User {user.username} updated successfully',
            'user': user_data
        })
        
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found or you do not have permission to edit this user'}, status=404)
    except Exception as e:
        print(f"Error updating user: {str(e)}")
        return Response({'error': f'Failed to update user: {str(e)}'}, status=500)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_user(request, user_id):
    """Delete a user (admin only)"""
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        # Get the user to delete - must be created by this admin
        user = CustomUser.objects.get(id=user_id, created_by=request.user)
        
        # Check if user has any exam responses
        has_responses = StudentResponse.objects.filter(student=user).exists()
        
        if has_responses:
            # Instead of deleting, we could mark as inactive or return an error
            return Response({
                'error': 'Cannot delete user with exam responses. Consider deactivating instead.'
            }, status=400)
        
        # Store user info for response
        username = user.username
        full_name = f"{user.first_name} {user.last_name}"
        
        # Delete the user
        user.delete()
        
        return Response({
            'success': True,
            'message': f'User {full_name} (@{username}) deleted successfully'
        })
        
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found or you do not have permission to delete this user'}, status=404)
    except Exception as e:
        print(f"Error deleting user: {str(e)}")
        return Response({'error': f'Failed to delete user: {str(e)}'}, status=500)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_all_users(request):
    """Get all users created by the admin"""
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    try:
        # Get all users created by this admin
        users = CustomUser.objects.filter(created_by=request.user).order_by('-date_joined')
        
        users_data = []
        for user in users:
            users_data.append({
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'role': user.role,
                'student_id': user.student_id,
                'date_joined': user.date_joined.isoformat() if user.date_joined else None,
                'is_active': user.is_active,
            })
        
        return Response(users_data)
        
    except Exception as e:
        print(f"Error getting users: {str(e)}")
        return Response({'error': 'Failed to load users'}, status=500)