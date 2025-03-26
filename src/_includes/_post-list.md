{% section "post-list" %}

{% if heading %}## {{ heading }}{% endif %}

{% if _description %}{{ _description }}{% endif %}

{% for post in postList reversed %}{% if forloop.index0 < count %}<article class="post" role="article" onclick="location.href='{{post.url}}'">

<header>

### [{{post.data.title}}]({{ post.url }})

{{ post.data.date | date: "%b %-e%q, %Y" }}{.date}

</header>

{% if post.data.thumbnail %}
[![{{ post.data.title }}]({{ post.data.thumbnail }})]({{ post.url }}) {.figure}
{% elsif post.data.masthead-image %}
[![{{ post.data.title }}]({{ post.data.masthead-image }})]({{ post.url }}) {.figure}
{% endif %}

</article>{% endif %}{% endfor %}

{% endsection %}