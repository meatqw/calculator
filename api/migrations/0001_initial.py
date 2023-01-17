# Generated by Django 4.1.5 on 2023-01-17 06:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Coefficients',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(blank=True, max_length=200, verbose_name='Наименование')),
                ('price', models.FloatField(blank=True, default=0, verbose_name='Цена')),
            ],
            options={
                'verbose_name': 'Коэффициент',
                'verbose_name_plural': 'Коэффициенты',
            },
        ),
        migrations.CreateModel(
            name='Materials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(blank=True, max_length=200, verbose_name='Наименование')),
                ('price', models.FloatField(blank=True, default=0, verbose_name='Цена')),
            ],
            options={
                'verbose_name': 'Материалы',
                'verbose_name_plural': 'Материал',
            },
        ),
        migrations.CreateModel(
            name='Diameters',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField(blank=True, max_length=200, verbose_name='Наименование')),
                ('total', models.FloatField(blank=True, default=0, verbose_name='Цена')),
                ('material', models.ManyToManyField(to='api.materials')),
            ],
            options={
                'verbose_name': 'Диаметр коронки',
                'verbose_name_plural': 'Диаметры коронок',
            },
        ),
    ]
