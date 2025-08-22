from django.urls import path
from . import views

urlpatterns = [
    path('csrf-token/', views.get_csrf_token, name='csrf_token'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('current-user/', views.current_user, name='current_user'),
    path('dashboard-stats/', views.get_dashboard_stats, name='get_dashboard_stats'),
    path('upload-csv/', views.upload_csv, name='upload_csv'),
    path('questions/', views.get_questions, name='get_questions'),
    path('create-exam/', views.create_exam, name='create_exam'),
    path('exams/', views.get_exams, name='get_exams'),
    path('exams/<int:exam_id>/', views.get_exam_details, name='get_exam_details'),
    path('exams/<int:exam_id>/submit/', views.submit_exam, name='submit_exam'),
    path('exams/<int:exam_id>/results/', views.get_exam_results, name='get_exam_results'),
    path('create-user/', views.create_user, name='create_user'),
    path('bulk-import-students/', views.bulk_import_students, name='bulk_import_students'),
    path('users/', views.get_all_users, name='get_all_users'),  # New endpoint
    path('users/<int:user_id>/', views.update_user, name='update_user'),  # New endpoint
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),  # New endpoint
    path('students/', views.get_students, name='get_students'),
    path('students/<int:student_id>/results/', views.get_student_results, name='get_student_results'),
    path('results/', views.get_results, name='get_results'),
]