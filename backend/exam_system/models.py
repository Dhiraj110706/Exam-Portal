# from django.db import models

# # Create your models here.
# from django.contrib.auth.models import AbstractUser
# import json

# class CustomUser(AbstractUser):
#     ROLE_CHOICES=[
#         ('ADMIN','Admin'),
#         ('STUDENT','Student')
#     ]

#     role = models.CharField( max_length=10 , choices=ROLE_CHOICES)
#     created_by = models.ForeignKey('self',on_delete=models.SET_NULL,null=True,blank=True)
#     student_id = models.CharField(max_length= 20 , unique=True,null=True,blank=True)

#     def save(self,*args,**kwargs):
#         if self.role == 'STUDENT' and not self.student_id :
#             self.student_id = f'STU{self.id or ''}{self.username[:3].upper()}'
#         super().save(*args,**kwargs)

# class Question(models.Model):
#     question_text = models.TextField()
#     option_a = models.CharField(max_length=500)
#     option_b = models.CharField(max_length=500)
#     option_c = models.CharField(max_length=500)
#     option_d = models.CharField(max_length=500)
#     correct_answer = models.CharField(max_length=1,choices=[
#         ('A', 'Option A'),
#         ('B', 'Option B'),
#         ('C', 'Option C'),
#         ('D', 'Option D'),
#     ])

#     created_at = models.DateTimeField(auto_now_add=True)
#     created_by = models.ForeignKey(CustomUser,on_delete=models.CASCADE)

#     def __str__(self):
#         return self.question_text[:50]+"..."
    
# class Exam(models.Model):
#     title = models.CharField( max_length=200)
#     description= models.TextField(blank=True)
#     questions = models.ManyToManyField(Question,related_name='exams')
#     duration_minutes= models.IntegerField(default=60)
#     max_violations = models.IntegerField(default= 5)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     created_by = models.ForeignKey(CustomUser,on_delete=models.CASCADE)

#     def __str__(self):
#         return self.title

# class StudentResponse(models.Model):
#     student = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
#     exam = models.ForeignKey(Exam,on_delete=models.CASCADE)
#     answers = models.JSONField(default=dict)
#     violations_log = models.JSONField(default=list)  # List of violation details
#     cheated = models.BooleanField(default=False)
#     score = models.FloatField(null=True, blank=True)
#     time_taken = models.IntegerField(help_text="Time taken in minutes")
#     submitted_at = models.DateTimeField(auto_now_add=True)
#     started_at = models.DateTimeField()

#     class Meta:
#         unique_together = ['student', 'exam']

#     def calculate_score(self):
#         if not self.answers:
#             return 0
        
#         total_questions = self.exam.questions.count()
#         correct_answers = 0
        
#         for question_id, selected_option in self.answers.items():
#             try:
#                 question = self.exam.questions.get(id=question_id)
#                 if question.correct_answer == selected_option:
#                     correct_answers += 1
#             except Question.DoesNotExist:
#                 continue
        
#         return (correct_answers / total_questions) * 100 if total_questions > 0 else 0

#     def save(self, *args, **kwargs):
#         if self.score is None:
#             self.score = self.calculate_score()
#         super().save(*args, **kwargs)

# backend/exam_system/models.py - Fixed version

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import json

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('STUDENT', 'Student')
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    created_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True)
    student_id = models.CharField(max_length=20, unique=True, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Generate student_id only for students and only if not already set
        if self.role == 'STUDENT' and not self.student_id:
            # First save to get the ID
            if not self.pk:
                super().save(*args, **kwargs)
            # Now generate student_id with the actual ID
            self.student_id = f'STU{self.pk}{self.username[:3].upper()}'
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Question(models.Model):
    question_text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_answer = models.CharField(max_length=1, choices=[
        ('A', 'Option A'),
        ('B', 'Option B'),
        ('C', 'Option C'),
        ('D', 'Option D'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.question_text[:50] + ("..." if len(self.question_text) > 50 else "")

    class Meta:
        ordering = ['-created_at']

class Exam(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    questions = models.ManyToManyField(Question, related_name='exams', blank=True)
    duration_minutes = models.IntegerField(default=60)
    max_violations = models.IntegerField(default=5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    def get_questions_count(self):
        return self.questions.count()

    class Meta:
        ordering = ['-created_at']

class StudentResponse(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    answers = models.JSONField(default=dict)
    violations_log = models.JSONField(default=list)  # List of violation details
    cheated = models.BooleanField(default=False)
    score = models.FloatField(null=True, blank=True)
    time_taken = models.IntegerField(help_text="Time taken in minutes")
    submitted_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField()

    class Meta:
        unique_together = ['student', 'exam']
        ordering = ['-submitted_at']

    def calculate_score(self):
        """Calculate the score based on correct answers"""
        if not self.answers:
            return 0
        
        total_questions = self.exam.questions.count()
        if total_questions == 0:
            return 0
        
        correct_answers = 0
        
        for question_id_str, selected_option in self.answers.items():
            try:
                question_id = int(question_id_str)
                question = self.exam.questions.get(id=question_id)
                if question.correct_answer == selected_option:
                    correct_answers += 1
            except (ValueError, Question.DoesNotExist):
                continue
        
        return (correct_answers / total_questions) * 100

    def get_violations_count(self):
        """Get the number of violations"""
        return len(self.violations_log) if self.violations_log else 0

    def is_passing(self, passing_score=50):
        """Check if the student passed the exam"""
        return self.score and self.score >= passing_score

    def save(self, *args, **kwargs):
        # Auto-calculate score if not provided
        if self.score is None:
            self.score = self.calculate_score()
        
        # Auto-determine if student cheated based on violations
        if not hasattr(self, '_skip_cheat_check'):
            violations_count = self.get_violations_count()
            if violations_count >= self.exam.max_violations:
                self.cheated = True
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.username} - {self.exam.title} - {self.score}%"