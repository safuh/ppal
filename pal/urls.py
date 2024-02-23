# example/urls.py
from django.urls import path

from pal import views
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    path('bscCheckout',views.bsc),
    path('createOrder',views.createOrder),path('bsCheckout',views.bs),
    path('devCheckout',views.dev),
   
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)