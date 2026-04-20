from django.urls import path
from .views import subject_list, subject_detail, subject_update, login_view, signup_view, TaskListCreateView, TaskDetailView, LogoutView

urlpatterns = [
    path('subjects/', subject_list),
    path('login/', login_view),
    path('logout/', LogoutView.as_view()),
    path('tasks/', TaskListCreateView.as_view()),
    path('tasks/<int:pk>/', TaskDetailView.as_view()),
    path('subjects/<int:pk>/', subject_detail),
    path('signup/', signup_view),
    path('subjects/<int:pk>/update/', subject_update),
]
