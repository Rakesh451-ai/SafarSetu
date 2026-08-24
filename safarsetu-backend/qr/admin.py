from django.contrib import admin
from .models import QRScanLog


@admin.register(QRScanLog)
class QRScanLogAdmin(admin.ModelAdmin):
    list_display = ('qr_code_scanned', 'destination', 'tourist', 'scan_type', 'scanned_at')
    list_filter = ('scan_type', 'scanned_at')
    search_fields = ('qr_code_scanned', 'destination__name', 'tourist__full_name')
    ordering = ('-scanned_at',)
