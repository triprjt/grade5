from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from grade5.models import Subject, Chapter  # Replace 'grade5' with your actual app name if needed

class Command(BaseCommand):
    help = 'Updates the Chapter names in the database.'
    
    chapter_contents = [
        "Introduction to Physics",
        "Motion in One Dimension",
        "Forces and Newton’s Laws of Motion",
        "Motion in Two Dimensions",
        "Circular Motion and Gravity",
        "Conservation Laws",
        "Simple Machines",
        "Rotational Motion",
        "Thermal Physics",
        "Fluids",
    ]

    def handle(self, *args, **kwargs):

        # Update chapter names to include numbering
        for user in User.objects.all():
            for subject in Subject.objects.filter(user=user):
                chapters = Chapter.objects.filter(subject=subject, user=user).order_by('id')
                for i, chapter in enumerate(chapters):
                    if i < len(self.chapter_contents):
                        new_name = f"{i + 1}. {self.chapter_contents[i]}"
                        chapter.name = new_name
                        chapter.save()

        self.stdout.write(self.style.SUCCESS('Chapter names updated successfully!'))
