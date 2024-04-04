{% if postList.length > 0 %}<section id="blog" class="blog">

{% if label %}## {{ label }}{% endif %}

{% if summary %}{{ summary }}{% endif %}

{% for post in postList %}
{% if forloop.index0 < count %}
<span class="date">{{ post.data.date | date: "%Y-%m-%d" }}</span> [{{post.data.title}}]({{ post.url }})
{.post}{% endif %}
{% endfor %}

</section>{% endif %}