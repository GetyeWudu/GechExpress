from django.urls import path
from .views import   RegisterView, LogoutView, PasswordChangeView, PasswordResetRequestView,  LoginView
from .google.google_views import GoogleLoginView

urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("password-change/", PasswordChangeView.as_view(), name="password_change"),
    path(
        "password-reset-request/",
        PasswordResetRequestView.as_view(),
        name="password_reset_request",
    ),
    path(
        "google/",
        GoogleLoginView.as_view(),
        name="google_login",
    ),
    

]
