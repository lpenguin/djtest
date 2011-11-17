from django.forms import ModelForm

class TestEditForm(ModelForm):
	class Meta:
		model = Test
		fields = ('data',)
