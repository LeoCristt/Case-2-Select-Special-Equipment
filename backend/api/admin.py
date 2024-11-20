from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Subdivision

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'subdivision')}),
    )
    list_display = ['username', 'role', 'subdivision']

@admin.register(Subdivision)
class SubdivisionAdmin(admin.ModelAdmin):
    list_display = ['name']
