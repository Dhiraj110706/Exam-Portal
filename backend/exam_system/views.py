from django.shortcuts import render

# Create your views here.
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
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
                }
            })
        else:
            return Response({'success': False, 'message': 'Invalid credentials'})
    
    return Response({'success': False, 'message': 'Username and password required'})

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'success': True})

@api_view(['GET'])
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

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_exam(request):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    data = request.data.copy()
    data['created_by'] = request.user.id
    
    serializer = ExamSerializer(data=data)
    if serializer.is_valid():
        exam = serializer.save()
        
        # Add questions to exam
        question_ids = request.data.get('question_ids', [])
        if question_ids:
            questions = Question.objects.filter(id__in=question_ids)
            exam.questions.set(questions)
        
        return Response({
            'success': True,
            'exam_id': exam.id,
            'message': 'Exam created successfully'
        })
    
    return Response({'error': serializer.errors}, status=400)

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
                'violations_count': response.violations_count
            })
        
        return Response({'error': serializer.errors}, status=400)
        
    except Exam.DoesNotExist:
        return Response({'error': 'Exam not found'}, status=404)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_user(request):
    if request.user.role != 'ADMIN':
        return Response({'error': 'Admin access required'}, status=403)
    
    data = request.data.copy()
    data['created_by'] = request.user.id
    
    serializer = UserSerializer(data=data)
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

