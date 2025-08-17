from rest_framework import serializers
from .models import CustomUser, Question, Exam, StudentResponse

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'student_id', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class ExamSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()
    created_by = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    
    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'duration_minutes', 'max_violations', 
                 'is_active', 'created_at', 'created_by', 'questions_count']
    
    def get_questions_count(self, obj):
        return obj.questions.count()
    
    def create(self, validated_data):
        # Create the exam
        exam = Exam.objects.create(**validated_data)
        return exam

class StudentResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentResponse
        fields = '__all__'
