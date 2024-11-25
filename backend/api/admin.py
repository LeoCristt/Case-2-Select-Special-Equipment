from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Subdivision, Master, Facility, Machinery, Driver, Brigade

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Настройка отображения полей в форме редактирования
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('role', 'subdivision')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Поля для формы создания пользователя
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role', 'subdivision', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )

    # Поля, отображаемые в списке пользователей
    list_display = ['username', 'role', 'subdivision', 'is_staff']
    search_fields = ['username', 'role']
    ordering = ['username']

@admin.register(Subdivision)
class SubdivisionAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Master)
class MasterAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Machinery)
class MachineryAdmin(admin.ModelAdmin):
    list_display = ['type', 'kind', 'brand', 'license_plate', 'technical_passport', 'driver', 'subdivision']

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Brigade)
class BrigadeAdmin(admin.ModelAdmin):
    list_display = ['name', 'subdivision']
