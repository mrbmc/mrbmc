{% section "masthead","full-grid" %}

# {{title}} {data-parallax="50"}

{% if bodyclass == "blog post" %}

**{{date | date: "%B %d, %Y" }}**{.date} &bull; {{ content | timeToRead }} to read {.metadata data-parallax="50"}

{% endif %}

{% if masthead-image or masthead-video %}
{% if masthead-video %}
<video src="{{masthead-video}}" autoplay loop muted preload="auto" playsinline type="video/mp4"></video>
{.figure}
{% else %}
![{{ masthead-title }}]({{ masthead-image }})
{.figure data-parallax="81"}
{% endif %}
{% endif %}

{% endsection %}
