---
layout: layout.html
bodyclass: blog post
cssfile: "css/pages/post.css"
---

{% if masthead-video or masthead-image %}
{% include "_masthead.md" %}
{% else %}
# {{ title }}{.blur-in}
**{{date | date: "%B %d, %Y" }}**{.date} &bull; {{ content | timeToRead }} to read {.metadata data-parallax="50"}
{% endif %}

<a id="content"></a>
{{content}}

----

{% for tag in tags %}{% if forloop.index0 >= 1 %}
- [{{tag}}](/tags/{{ tag | slugify }}){% endif %}{% endfor %}
{.tags}

----

## Related Posts

{% assign similar = collections.post | similarPosts: page.inputPath, tags %}
{% for post in similar limit: 3 %}
{{ post.data.date | date: "%Y-%m-%d" }} &nbsp; [{{ post.data.title }}]({{ post.url }})
{% endfor %}

