from django.contrib import admin
from .models import UserProfile

admin.site.register(UserProfile)



from django.contrib import admin
from .models import Subject, Question, Option

admin.site.register(Subject)

class OptionInline(admin.TabularInline):
    model = Option
    extra = 4

class QuestionAdmin(admin.ModelAdmin):
    inlines = [OptionInline]
    list_display = ['question_text', 'subject', 'difficulty']

admin.site.register(Question, QuestionAdmin)




## // THIS IS FINAL ONE
# # api/admin.py

# from django.contrib import admin
# from .models import Question, Option

# admin.site.register(Question)
# admin.site.register(Option)


