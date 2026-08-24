from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager where email is the unique identifier for auth."""
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        email = self.normalize_email(email).lower()
        if 'username' not in extra_fields or not extra_fields['username']:
            extra_fields['username'] = email
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        TOURIST = 'TOURIST', _('Tourist')
        ADMIN = 'ADMIN', _('Administrator')
        RESPONSE_OPERATOR = 'RESPONSE_OPERATOR', _('Response Operator')

    class Language(models.TextChoices):
        EN = 'en', _('English')
        HI = 'hi', _('Hindi (हिन्दी)')
        BN = 'bn', _('Bengali (বাংলা)')
        MR = 'mr', _('Marathi (मराठी)')
        TA = 'ta', _('Tamil (தமிழ்)')
        TE = 'te', _('Telugu (తెలుగు)')
        KN = 'kn', _('Kannada (ಕನ್ನಡ)')
        GU = 'gu', _('Gujarati (ગુજરાતી)')
        ML = 'ml', _('Malayalam (മലയാളം)')
        PA = 'pa', _('Punjabi (ਪੰਜਾਬੀ)')

    email = models.EmailField(_('email address'), unique=True, db_index=True)
    phone = models.CharField(_('phone number'), max_length=25, blank=True, db_index=True)
    role = models.CharField(
        _('user role'),
        max_length=25,
        choices=Role.choices,
        default=Role.TOURIST,
        db_index=True
    )
    preferred_language = models.CharField(
        _('preferred language'),
        max_length=10,
        choices=Language.choices,
        default=Language.EN
    )

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.email}) - {self.role}"

    @property
    def is_tourist(self):
        return self.role == self.Role.TOURIST

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN or self.is_superuser

    @property
    def is_response_operator(self):
        return self.role == self.Role.RESPONSE_OPERATOR
