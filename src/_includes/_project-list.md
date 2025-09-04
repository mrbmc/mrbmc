{% assign slug = heading | slug %}
{% unless id %}{% assign id = slug %}{% endunless %}
{% assign _class = "project-list " | append: class %}


{% section id, _class %}

{% if heading %}## {{ heading }}{% endif %}

{% if description %}{{ description }}{% endif %}

{% for project in collection reversed %}{% if forloop.index0 < count %}{% include "_project.md" %}{% endif %}{% endfor %}

{% endsection %}
