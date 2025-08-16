from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
import json

class CustomUser(AbstractUser):
    ROLE_CHOICES=[
        ('ADMIN','Admin'),
        ('STUDENT','Student')
    ]

    role = models.CharField( max_length=10 , choices=ROLE_CHOICES)
    created_by = models.ForeignKey('self',on_delete=models.SET_NULL,null=True,blank=True)
    student_id = models.CharField(max_length= 20 , unique=True,null=True,blank=True)

    def save(self,*args,**kwargs):
        if self.role == 'STUDENT' and not self.student_id :
            self.student_id = f'STU{self.id or ''}{self.username[:3].upper()}'
        super().save(*args,**kwargs)

class Question(models.Model):
    question_text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_answer = models.CharField(max_length=1,choices=[
        ('A', 'Option A'),
        ('B', 'Option B'),
        ('C', 'Option C'),
        ('D', 'Option D'),
    ])

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return self.question_text[:50]+"..."
    
class Exam(models.Model):
    title = models.CharField( max_length=200)
    description= models.TextField(blank=True)
    questions = models.ManyToManyField(Question,related_name='exams')
    duration_minutes= models.IntegerField(default=60)
    max_violations = models.IntegerField(default= 5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class StudentResponse(models.Model):
    student = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    exam = models.ForeignKey(Exam,on_delete=models.CASCADE)
    answers = models.JSONField(default=dict)
    violations_log = models.JSONField(default=list)  # List of violation details
    cheated = models.BooleanField(default=False)
    score = models.FloatField(null=True, blank=True)
    time_taken = models.IntegerField(help_text="Time taken in minutes")
    submitted_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField()

    class Meta:
        unique_together = ['student', 'exam']

    def calculate_score(self):
        if not self.answers:
            return 0
        
        total_questions = self.exam.questions.count()
        correct_answers = 0
        
        for question_id, selected_option in self.answers.items():
            try:
                question = self.exam.questions.get(id=question_id)
                if question.correct_answer == selected_option:
                    correct_answers += 1
            except Question.DoesNotExist:
                continue
        
        return (correct_answers / total_questions) * 100 if total_questions > 0 else 0

    def save(self, *args, **kwargs):
        if self.score is None:
            self.score = self.calculate_score()
        super().save(*args, **kwargs)