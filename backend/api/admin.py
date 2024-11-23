from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Subdivision, Master, Facility, Machinery, Driver

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'subdivision')}),
    )
    list_display = ['username', 'role', 'subdivision']

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
