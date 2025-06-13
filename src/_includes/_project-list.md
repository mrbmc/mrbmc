{% assign _heading = heading | slug %}
{% assign _class = "project-list " | append: class %}

{% if heading %}## {{ heading }}{% endif %}

{% if description %}{{ description }}{% endif %}

{% section _heading, _class %}

{% for project in projectList reversed %}{% if forloop.index0 < count %}
<article class="project">

<header>

#### [{{ project.data.title }}]({{ project.url }})

{% if project.data.timeline %}#### {{project.data.timeline}}{.timeline}{% endif %}

{% if project.data.description %}{{ project.data.description }}{.summary}{% endif %}

{% for product in project.data.accomplishments %}
- {{ product }}
{% endfor %}{.small-type}

<span class="muted">{{project.content | timeToRead}} to read</span>  

</header>

[![{{ project.data.title }}]({{ project.data.thumbnail }})]({{project.url}}) {.figure}

</article>
{% endif %}
{% endfor %}

{% endsection %}
