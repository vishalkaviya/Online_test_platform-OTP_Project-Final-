from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from api.models import Question, Subject,Option # ✅ CORRECT

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')

        user = User.objects.create_user(username=username, email=email, password=password)
        UserProfile.objects.create(user=user)  # ✅ Also create empty profile
        return user





class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'mobile', 'gender', 'dob', 'image']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['first_name', 'last_name', 'mobile', 'gender', 'dob', 'image']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_active', 'date_joined', 'last_login', 'profile']


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']
class SubjectSerializer(serializers.ModelSerializer):
    total_questions = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = ['id', 'name', 'total_questions']

    def get_total_questions(self, obj):
        return obj.question_set.count()

# serializers.py
class QuestionSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)  # ✅ show full subject object (e.g. name)
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            'id',
            'question_text',
            'difficulty',
            'correct_count',
            'wrong_count',
            'subject',     # ✅ subject name
            'options'      # ✅ options
        ]


class AddOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['text', 'is_correct']

class AddQuestionSerializer(serializers.ModelSerializer):
    options = AddOptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ['subject', 'question_text', 'difficulty', 'correct_count', 'wrong_count', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        for opt in options_data:
            Option.objects.create(question=question, **opt)
        return question

    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', None)

        # Update question fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if options_data is not None:
            # Delete existing options
            instance.options.all().delete()
            # Recreate options
            for opt in options_data:
                Option.objects.create(question=instance, **opt)

        return instance


class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'last_login', 'profile']