from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),                 # ✅ Enable admin panel
    path('api/', include('api.urls')),  
                 # Your API endpoints
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
