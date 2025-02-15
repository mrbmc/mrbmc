{% assign _heading = heading | slug %}
{% assign _class = "project-list " | append: class %}
{% section _heading, _class %}

{% if heading %}## {{ heading }}{% endif %}

{% if description %}{{ description }}{% endif %}

{% for project in projectList reversed %}{% if forloop.index0 < count %}
<article class="project{%if bodyclass != "home" %} full{% endif %}" onclick="location.href='{{project.url}}'">

<header>

#### [{{ project.data.title }}]({{ project.url }})

{% if project.data.timeline %}#### {{project.data.timeline}}{.timeline}{% endif %}

{% if project.data.description %}{{ project.data.description }}{.summary}{% endif %}

</header>

[![{{ project.data.title }}]({{ project.data.thumbnail }})]({{ project.url }}) {.figure}

</article>
{% endif %}
{% endfor %}

{% endsection %}
