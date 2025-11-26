<article class="project col-6">

<header>

#### [{{ project.data.title }}]({{ project.url }})

{% if project.data.timeline %}#### {{project.data.timeline}}{.timeline}{% endif %}

{% if project.data.summary %}{{ project.data.summary }}{.summary}{% endif %}

{% for product in project.data.accomplishments %}
- {{ product }}
{% endfor %}{.small-type}

{{project.templateContent | timeToRead}} to read{.muted .duration}

</header>

[![{{ project.data.title }}]({{ project.data.thumbnail }})]({{project.url}}) {.figure}

</article>
