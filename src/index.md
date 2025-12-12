---
layout: layout.html
bodyclass: home
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
eleventyExcludeFromCollections: false
cssfile: "css/pages/home.css"
hidefooter: true
---

{% section "masthead","full-width-grid" %}

# Brian McConnell {.blur-in}

I am a design leader who builds with technology and empathy. I embed human-centered practices into engineering-driven organizations and lead transformations at any scale.{.blur-in .large-type}

* [Portfolio](/portfolio/)
* [How I Work](/about/)
* [Blog](/blog/)

{.blur-in .nav #mininav}

<canvas id="crane-canvas"></canvas> {#crane}

{% endsection %}

{% comment %}
Technical design leader who ships. I combine human-centered rigor and engineering fluency to build impactful products. Experienced leading transformations across startups and enterprises.
{% endcomment %}

<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js"
  }
}
</script>
<script type="module" src="/js/home.bundle.js"></script>
