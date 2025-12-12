---
layout: layout.html
title: Brian McConnell | Photography
bodyclass: photos
permalink: /photos/
pagination: 
  data: collections.gallery
  size: 20
  reverse: false
  alias: pics
cssfile: "css/pages/photos.css"
---

{% section "masthead" %}

# Photography

Mostly horizons, textures, and silhouettes.

{% endsection %}


{% section "gallery" %}

{% for p in pics %}

![{{ p.title }}]({{p.path}}){.fade-in data-spy="scroll" loading="lazy"} {id="{{p.id}}"}

{% endfor %}

{% endsection %}

<nav id="thumbnails">

{% for p in pics %}

[![{{ p.titles }}]({{p.thumb}})](#{{p.id}})

{% endfor %}

</nav>

{%if pagination.pages.length > 1 %}
<nav class="pagination">
{% for pageEntry in pagination.pages %}
    <a href="{{ pagination.hrefs[ forloop.index0 ] }}"{% if page.url == pagination.hrefs[ forloop.index0 ] %} aria-current="page"{% endif %}>Page {{ forloop.index }}</a>
{% endfor %}
</nav>
{% endif %}

<script type="module" src="/js/photos.bundle.js"></script>
