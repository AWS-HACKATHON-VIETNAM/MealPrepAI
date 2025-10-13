from django.db import migrations, models


def forward_populate_grocery_list(apps, schema_editor):
    GroceryItem = apps.get_model('api', 'GroceryItem')
    connection = schema_editor.connection
    table_names = connection.introspection.table_names()

    if 'api_grocerylist_items' in table_names:
        with connection.cursor() as cursor:
            cursor.execute(
                'SELECT grocerylist_id, groceryitem_id FROM api_grocerylist_items'
            )
            rows = cursor.fetchall()

        item_to_list = {}
        for list_id, item_id in rows:
            if item_id not in item_to_list:
                item_to_list[item_id] = list_id

        for item_id, list_id in item_to_list.items():
            GroceryItem.objects.filter(id=item_id).update(grocery_list_id=list_id)


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_pantryitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='groceryitem',
            name='grocery_list',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=models.CASCADE,
                related_name='items',
                to='api.grocerylist',
            ),
        ),
        migrations.RunPython(forward_populate_grocery_list, migrations.RunPython.noop),
        migrations.RunSQL(
            'DROP TABLE IF EXISTS api_grocerylist_items',
            migrations.RunSQL.noop,
        ),
    ]
