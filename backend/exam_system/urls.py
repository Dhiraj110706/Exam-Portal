from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('current-user/', views.current_user, name='current_user'),
    path('upload-csv/', views.upload_csv, name='upload_csv'),
    path('questions/', views.get_questions, name='get_questions'),
    path('create-exam/', views.create_exam, name='create_exam'),
    path('exams/', views.get_exams, name='get_exams'),
    path('exams/<int:exam_id>/', views.get_exam_details, name='get_exam_details'),
    path('exams/<int:exam_id>/submit/', views.submit_exam, name='submit_exam'),
    path('create-user/', views.create_user, name='create_user'),
    path('students/', views.get_students, name='get_students'),
]

# exam_project/urls.py
