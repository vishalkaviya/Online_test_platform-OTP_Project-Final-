from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Question, Subject, Result, UserProfile, Option
from django.contrib.auth.models import User
from django.db.models import Count, Q
from api.serializers import QuestionSerializer, SubjectSerializer, AddQuestionSerializer
import random
from rest_framework.generics import RetrieveUpdateAPIView
from django.utils.timezone import localtime


user_progress = {}  # In-memory user state tracking

class SubjectListView(APIView):
    def get(self, request):
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

class AddQuestionView(APIView):
    def post(self, request):
        serializer = AddQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StartTestView(APIView):
    def post(self, request):
        subject_id = request.data.get("subject_id")
        user_id = request.data.get("user_id", "anonymous")

        user_progress[user_id] = {
            "subject_id": subject_id,
            "history": [],
            "seen_questions": set(),
            "current_level": "medium"
        }

        if user_id != "anonymous":
            Result.objects.filter(user_id=user_id).delete()

        return Response({"message": "Test started"})

# // TOTAL COUNT 7TH AS SAME AS 8TH QUES
class NextQuestionView(APIView):
    def get(self, request):
        user_id = request.query_params.get("user_id", "anonymous")
        progress = user_progress.get(user_id)

        if not progress:
            return Response({"error": "Start test first."}, status=400)

        level = progress["current_level"]
        subject_id = progress["subject_id"]

        questions = Question.objects.filter(subject_id=subject_id, difficulty=level).exclude(id__in=progress["seen_questions"])

        if not questions.exists():
            return Response({"error": f"No more {level} questions available."}, status=404)

        question = random.choice(questions)
        progress["seen_questions"].add(question.id)
        progress["last_question_id"] = question.id

        serializer = QuestionSerializer(question)
        return Response(serializer.data)



class SubmitAnswerView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        question_id = request.data.get("question_id")
        selected_option_id = request.data.get("selected_option_id")

        if not user_id or not question_id or not selected_option_id:
            return Response({"error": "Missing required data."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
            question = Question.objects.get(id=question_id)
            selected_option = Option.objects.get(id=selected_option_id)
        except (User.DoesNotExist, Question.DoesNotExist, Option.DoesNotExist):
            return Response({"error": "Invalid data provided."}, status=status.HTTP_400_BAD_REQUEST)

        correct = selected_option.is_correct

        progress = user_progress.get(user_id)
        if not progress:
            return Response({"error": "Start test first."}, status=status.HTTP_400_BAD_REQUEST)

        level = progress["current_level"]
        history = progress["history"]

        # Update question stats
        if correct:
            question.correct_count += 1
        else:
            question.wrong_count += 1
        question.save()

        # Save result
        Result.objects.create(user=user, question=question, is_correct=correct)

        # Update user history
        history.append((level, correct))

        # Count correct/wrong by level
        medium_correct = sum(1 for l, c in history if l == "medium" and c)
        medium_wrong = sum(1 for l, c in history if l == "medium" and not c)
        hard_correct = sum(1 for l, c in history if l == "hard" and c)
        hard_wrong = sum(1 for l, c in history if l == "hard" and not c)
        easy_correct = sum(1 for l, c in history if l == "easy" and c)
        easy_wrong = sum(1 for l, c in history if l == "easy" and not c)

        # Adaptive flow logic
        if level == "medium":
            medium_questions = [h for h in history if h[0] == "medium"]
            if len(medium_questions) == 1:
                progress["current_level"] = "medium" if correct else "easy"
            elif len(medium_questions) == 2:
                progress["current_level"] = "hard" if correct else "medium"
            elif len(medium_questions) == 3:
                progress["current_level"] = "hard" if correct else "easy"
            elif len(medium_questions) == 4:
                return Response({"finished": True, "status": "PASS" if correct else "FAIL"})

        elif level == "hard":
            if hard_correct == 4:
                return Response({"finished": True, "status": "PASS"})
            elif hard_correct in [1, 2, 3] and not correct:
                progress["current_level"] = "medium"
            else:
                progress["current_level"] = "hard"

        elif level == "easy":
            easy_questions = [h for h in history if h[0] == "easy"]
            if easy_wrong == 2:
                return Response({"finished": True, "status": "FAIL"})
            elif len(easy_questions) == 1:
                progress["current_level"] = "medium" if correct else "easy"
            elif len(easy_questions) == 2:
                return Response({"finished": True, "status": "FAIL" if not correct else "PASS"})

        # ✅ Final safeguard: max 8 questions
        if len(history) >= 8:
            total_correct = sum(1 for _, c in history if c)
            status_label = "PASS" if total_correct >= 5 else "FAIL"
            return Response({"finished": True, "status": status_label})

        # Default: send next question
        return Response({
            "correct": correct,
            "next_level": progress["current_level"]
        })


class GetResultView(APIView):
    def get(self, request):
        user_id = request.query_params.get("user_id")

        if not user_id:
            return Response({"error": "User ID is required"}, status=400)

        try:
            user = User.objects.get(id=user_id)
            results = Result.objects.filter(user_id=user_id)
            total = results.count()
            correct = results.filter(is_correct=True).count()

            return Response({
                "username": user.username,
                "total_questions": total,
                "correct_answers": correct,
                "wrong_answers": total - correct,
                "percentage": int((correct / total) * 100) if total else 0,
                "passed": correct >= (total * 0.5),
            })
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class GetAnalyticsView(APIView):
    def get(self, request):
        # Total question count by difficulty
        easy = Question.objects.filter(difficulty='easy').count()
        medium = Question.objects.filter(difficulty='medium').count()
        hard = Question.objects.filter(difficulty='hard').count()
        total_q = easy + medium + hard

        # Gender-based correct/incorrect stats
        gender_data = {}
        for gender in ['Male', 'Female', 'Other']:
            results = Result.objects.filter(user__userprofile__gender=gender)
            gender_data[gender] = {
                'correct': results.filter(is_correct=True).count(),
                'incorrect': results.filter(is_correct=False).count(),
            }

        # Subject-wise difficulty distribution
        subj_data = {}
        for subj in Subject.objects.all():
            subj_questions = Question.objects.filter(subject=subj)
            subj_data[subj.name] = {
                'easy': subj_questions.filter(difficulty='easy').count(),
                'medium': subj_questions.filter(difficulty='medium').count(),
                'hard': subj_questions.filter(difficulty='hard').count(),
            }

        # Per-subject correct and incorrect counts
        correct_counts = {}
        incorrect_counts = {}
        for subj in Subject.objects.all():
            correct = Result.objects.filter(question__subject=subj, is_correct=True).count()
            incorrect = Result.objects.filter(question__subject=subj, is_correct=False).count()
            correct_counts[subj.name] = correct
            incorrect_counts[subj.name] = incorrect

        # Overall correct/incorrect
        correct_total = Result.objects.filter(is_correct=True).count()
        incorrect_total = Result.objects.filter(is_correct=False).count()

        # ✅ Recently active 5 unique users (sorted by latest attempt)
        recent_results = Result.objects.select_related('user').order_by('-date_taken')
        seen_users = set()
        user_data = []

        for result in recent_results:
            if result.user.id in seen_users:
                continue

            profile = UserProfile.objects.filter(user=result.user).first()
            user_data.append({
                "user": result.user.username,
                "image": profile.image.url if profile and profile.image else None,
                "last_attempt": localtime(result.date_taken).strftime("%d %b %Y, %I:%M %p")
            })

            seen_users.add(result.user.id)

            if len(user_data) == 8:
                break

        return Response({
            "total_questions": total_q,
            "easy": easy,
            "medium": medium,
            "hard": hard,
            "gender_stats": gender_data,
            "subject_stats": subj_data,
            "correct_total": correct_total,
            "incorrect_total": incorrect_total,
            "correct_counts": correct_counts,
            "incorrect_counts": incorrect_counts,
            "top_users": user_data
        })


class EditQuestionView(APIView):
    def get(self, request, id):
        try:
            question = Question.objects.get(id=id)
            serializer = QuestionSerializer(question)
            return Response(serializer.data)
        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        try:
            question = Question.objects.get(id=id)
            serializer = QuestionSerializer(question, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Question.DoesNotExist:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
