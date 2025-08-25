from django.urls import path
from api.views import auth_views, user_views
from api.views.user_views import AllUsersView
from api.views import admin_views


from api.views.test_views import (
    AddQuestionView,
    StartTestView,
    NextQuestionView,
    SubmitAnswerView,
    GetResultView,
    SubjectListView,
    EditQuestionView,
     GetAnalyticsView,
)

urlpatterns = [
    path('register/', auth_views.RegisterView.as_view(), name='register'),

    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('profile/', user_views.ViewProfileView.as_view(), name='view_profile'),
    path('edit-profile/', user_views.EditProfileView.as_view(), name='edit_profile'),
    path('add-question/', AddQuestionView.as_view(), name='add-question'),
    path('start-test/', StartTestView.as_view(), name='start-test'),
    path('get-question/', NextQuestionView.as_view(), name='get-question'),
    path('submit-answer/', SubmitAnswerView.as_view(), name='submit-answer'),
    path('result/', GetResultView.as_view(), name='result'),
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('admin/questions/<int:id>/', EditQuestionView.as_view(), name='edit-question'),

   path('all-users/', user_views.AllUsersView.as_view(), name='all-users'),
    path('admin/questions/', admin_views.ManageQuestionsView.as_view(), name='manage-questions'),
   path('admin/questions-detail/<int:qid>/', admin_views.QuestionDetailView.as_view(), name='question-detail'),

    path('admin/questions/flagged/', admin_views.FlaggedQuestionsView.as_view(), name='question-flagged'),
    
    path('admin/stats/', admin_views.AdminStatsView.as_view(), name='admin-stats'),
    path('admin/user-distribution/', admin_views.UserDistributionView.as_view(), name='admin-user-distribution'),
path('admin/top-subjects/', admin_views.TopSubjectsView.as_view(), name='admin-top-subjects'),

path('admin/top-new-users/', admin_views.TopNewUsersView.as_view(), name='top-new-users'),
path("admin/subjects/", admin_views.SubjectListCreateView.as_view(), name="subject-crud"),
    path("admin/subjects/<int:pk>/", admin_views.SubjectUpdateDeleteView.as_view(), name="subject-update-delete"),
 path('get-analytics/', GetAnalyticsView.as_view(), name='get-analytics'),
path('reset-password/', auth_views.ResetPasswordView.as_view(), name='reset-password'),
]
