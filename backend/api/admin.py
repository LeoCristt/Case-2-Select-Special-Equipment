from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Subdivision, Type, Master, Object

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'subdivision')}),
    )
    list_display = ['username', 'role', 'subdivision']

@admin.register(Subdivision)
class SubdivisionAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Master)
class MasterAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'patronymic', 'object']

@admin.register(Object)
class ObjectAdmin(admin.ModelAdmin):
    list_display = ['name']
