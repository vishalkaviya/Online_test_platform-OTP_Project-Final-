from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from api.models import Question, Option
from api.serializers import QuestionSerializer, AddQuestionSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.models import Subject
from api.serializers import SubjectSerializer 
from django.db.models import F, Q, Count  # ✅ Include Count here

from django.contrib.auth.models import User
from django.db.models import Sum
from api.models import UserProfile, Answer
from django.db import models



class ManageQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Question.objects.all().select_related('subject')
        search = request.query_params.get('search')
        subject_id = request.query_params.get('subject')
        difficulty = request.query_params.get('difficulty')  # ✅ GET difficulty

        if search:
            qs = qs.filter(question_text__icontains=search)
        if subject_id:
            qs = qs.filter(subject_id=subject_id)
        if difficulty:
            qs = qs.filter(difficulty=difficulty)  # ✅ FILTER by difficulty

        serializer = QuestionSerializer(qs, many=True)
        return Response(serializer.data)


class QuestionDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, qid):
        try:
            return Question.objects.get(id=qid)
        except Question.DoesNotExist:
            return None

    def put(self, request, qid):
        question = self.get_object(qid)
        if not question:
            return Response({'error': 'Question not found'}, status=404)

        serializer = AddQuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, qid):
        question = self.get_object(qid)
        if not question:
            return Response({'error': 'Question not found'}, status=404)
        question.delete()
        return Response({'message': 'Question deleted successfully'}, status=204)

class FlaggedQuestionsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        flagged = Question.objects.filter(wrong_count__gt=models.F('correct_count') + 10)

        serializer = QuestionSerializer(flagged, many=True)
        return Response(serializer.data)
# views/admin_views.py

class SubjectListAdminView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        subjects = Subject.objects.all()
        subject_data = []

        for subject in subjects:
            total = subject.question_set.count()
            easy = subject.question_set.filter(difficulty="easy").count()
            medium = subject.question_set.filter(difficulty="medium").count()
            hard = subject.question_set.filter(difficulty="hard").count()

            correct = subject.question_set.aggregate(correct=models.Sum("correct_count"))["correct"] or 0
            wrong = subject.question_set.aggregate(wrong=models.Sum("wrong_count"))["wrong"] or 0

            subject_data.append({
                "id": subject.id,
                "name": subject.name,
                "total_questions": total,
                "easy_count": easy,
                "medium_count": medium,
                "hard_count": hard,
                "correct_count": correct,
                "wrong_count": wrong,
            })

        return Response(subject_data)

class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_questions = Question.objects.count()
        total_subjects = Subject.objects.count()
        tests_today = 42  # You can replace with actual test model query if needed

        return Response({
            'totalUsers': total_users,
            'totalQuestions': total_questions,
            'totalSubjects': total_subjects,
            'testsTakenToday': tests_today,
        })
class UserDistributionView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        active = User.objects.filter(is_active=True).count()
        inactive = User.objects.filter(is_active=False).count()
        return Response({
            'active': active,
            'inactive': inactive
        })


class TopSubjectsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        top_subjects = (
            Subject.objects
            .annotate(correct_answers=Sum('question__correct_count'))
            .order_by('-correct_answers')[:5]
        )
        return Response([
            {
                "name": sub.name,
                "correct_answers": sub.correct_answers or 0
            } for sub in top_subjects
        ])
class TopNewUsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.order_by('-date_joined')[:5]
        data = [
            {
                "username": user.username,
                "email": user.email,
                "date_joined": user.date_joined.strftime("%Y-%m-%d %H:%M"),
                "is_active": user.is_active
            }
            for user in users
        ]
        return Response(data)
# views.py
class SubjectListAdminView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        subjects = Subject.objects.all()
        subject_data = []

        for subject in subjects:
            # Get all questions for this subject
            questions = subject.question_set.all()
            question_ids = questions.values_list("id", flat=True)

            # Difficulty counts
            easy = questions.filter(difficulty="easy").count()
            medium = questions.filter(difficulty="medium").count()
            hard = questions.filter(difficulty="hard").count()
            total = questions.count()

            # ✅ Accurate correct/wrong answer counts
            correct = Answer.objects.filter(question_id__in=question_ids, is_correct=True).count()
            wrong = Answer.objects.filter(question_id__in=question_ids, is_correct=False).count()

            subject_data.append({
                "id": subject.id,
                "name": subject.name,
                "total_questions": total,
                "easy_count": easy,
                "medium_count": medium,
                "hard_count": hard,
                "correct_count": correct,
                "wrong_count": wrong
            })

        return Response(subject_data)

class SubjectListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        subjects = Subject.objects.all()
        subject_data = []

        for subject in subjects:
            questions = subject.question_set.all()

            total = questions.count()
            easy = questions.filter(difficulty="easy").count()
            medium = questions.filter(difficulty="medium").count()
            hard = questions.filter(difficulty="hard").count()

            aggregates = questions.aggregate(
                correct=models.Sum("correct_count"),
                wrong=models.Sum("wrong_count")
            )

            subject_data.append({
                "id": subject.id,
                "name": subject.name,
                "total_questions": total,
                "easy_count": easy,
                "medium_count": medium,
                "hard_count": hard,
                "correct_count": aggregates["correct"] or 0,
                "wrong_count": aggregates["wrong"] or 0,
            })

        return Response(subject_data)

    def post(self, request):
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubjectUpdateDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            subject = Subject.objects.get(pk=pk)
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=404)

        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            subject = Subject.objects.get(pk=pk)
            subject.delete()
            return Response(status=204)
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=404)