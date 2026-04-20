from rest_framework import serializers
from .models import Subject, Task


class SubjectSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)



class TaskSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    deadline = serializers.DateField()
    subject = serializers.IntegerField()
    completed = serializers.BooleanField()


class SubjectModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'user']
        read_only_fields = ['user']


class TaskModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'deadline', 'subject', 'user', 'completed']
        read_only_fields = ['user']