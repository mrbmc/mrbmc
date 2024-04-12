{% if projectList.length > 0 %}<section class="project-list" id="{{label | slug}}">

{% if label %}## {{ label }}{% endif %}

{% if summary %}{{ summary }}{% endif %}

{% for project in projectList %}{% if forloop.index0 < count %}
<article class="project{%if bodyclass != "home" %} full{% endif %}" onclick="location.href='{{project.url}}'">
	<header>
	<h3>{{ project.data.title }}</h3>
	{% if project.data.timeline %}<p class="timeline">{{project.data.timeline}}</p>{% endif %}
	{% if project.data.summary %}<p>{{ project.data.summary }}</p>{% endif %}
	</header>
	<figure>
		<a href="{{ project.url }}"><img src="{{ project.data.thumbnail }}" alt="{{project.data.title}}" /></a>
	</figure>  </article>{% endif %}{% endfor %}

</section>{% endif %}