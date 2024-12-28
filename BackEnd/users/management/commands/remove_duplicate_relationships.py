# users/management/commands/remove_duplicate_relationships.py

from django.core.management.base import BaseCommand
from django.db.models import Count
from users import models
from users.models import Relationship

class Command(BaseCommand):
    help = 'Removes duplicate relationships'

    def handle(self, *args, **kwargs):
        # Step 1: Get all relationships, normalize user order (ensure (user1, user2) and (user2, user1) are treated the same)
        duplicate_relationships = (
            Relationship.objects
            .values('user1', 'user2', 'relationship_type')  # Group by user pair and relationship type
            .annotate(count=Count('id'))  # Count occurrences of the same relationship
            .filter(count__gt=1)  # Only process groups with more than one occurrence
        )

        # Step 2: Loop through each group of duplicates
        for duplicate in duplicate_relationships:
            user1 = duplicate['user1']
            user2 = duplicate['user2']
            relationship_type = duplicate['relationship_type']

            # Normalize relationship (user1, user2) to (min, max)
            if user1 > user2:
                user1, user2 = user2, user1

            # Step 3: Find all relationships that match this pair, considering direction
            relationships = Relationship.objects.filter(
                (models.Q(user1=user1) & models.Q(user2=user2)) | (models.Q(user1=user2) & models.Q(user2=user1)),
                relationship_type=relationship_type
            )

            # Step 4: Keep the first one and delete the rest
            first_relationship = relationships.first()
            relationships.exclude(id=first_relationship.id).delete()  # Delete all but the first one

        self.stdout.write(self.style.SUCCESS('Successfully removed duplicate relationships.'))
