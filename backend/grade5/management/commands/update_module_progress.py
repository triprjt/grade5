from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from grade5.models import Subject, Chapter, Module, TextField, ImageField, VideoField, MCQ, Content, MCQSet  # Replace 'your_app_name' with the actual app name

class Command(BaseCommand):
    help = 'Updates the is_completed field for specified modules and content types.'

    def handle(self, *args, **kwargs):

        # Fetch Alice
        alice = User.objects.get(username='Alice')

        # Fetch Chapters with ids 3 and 4
        chapters = Chapter.objects.filter(id__in=[3, 4], user=alice)

        # Loop through each chapter
        for chapter in chapters:
            modules_to_update = None
            if chapter.id == 3:
                modules_to_update = Module.objects.filter(chapter=chapter, user=alice, name__in=[f'Module {i}' for i in range(6, 11)])
            elif chapter.id == 4:
                modules_to_update = Module.objects.filter(chapter=chapter, user=alice, name__in=[f'Module {i}' for i in range(1, 7)])

            if modules_to_update is not None:
                # Update is_completed for modules and their content
                for module in modules_to_update:
                    module.is_completed = True  # Setting to True
                    module.save()

                    content = module.content
                    content.text.is_completed = True  # Setting to True
                    content.image.is_completed = True  # Setting to True
                    content.video.is_completed = True  # Setting to True
                    content.mcq_set.is_completed = True  # Setting to True
                    content.text.save()
                    content.image.save()
                    content.video.save()
                    content.mcq_set.save()

        self.stdout.write(self.style.SUCCESS('Updated is_completed fields successfully!'))
