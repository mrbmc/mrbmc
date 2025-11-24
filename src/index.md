---
layout: layout.html
bodyclass: home
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
eleventyExcludeFromCollections: false
cssfile: "css/pages/home.css"
---

{% section "masthead","full-width-grid" %}

# Brian McConnell 

I am a design leader who builds with technology and empathy. I embed human-centered practices into engineering-driven organizations and lead transformations at any scale.{.blur-in .large-type}

<canvas id="crane-canvas"></canvas> {#crane}

{% endsection %}

{% comment %}
Technical design leader who ships. I combine human-centered rigor and engineering fluency to build impactful products. Experienced leading transformations across startups and enterprises.

<canvas id="gradient-canvas"></canvas>
<script type="module" language="javascript">
    import { Gradient } from "/js/gradient.js";
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
</script>
{% endcomment %}

{% include "_project-list.md", 
    count: 9, 
    collection: collections.work, 
    id: "work",
    class: "full-width-grid", 
    heading: false, 
    description:false
    %}

----

{% include "_post-list.md", 
    postList: collections.post, 
    heading: "Recent Blog Posts", 
    id: "blog",
    class: "full-width",
    count: 4, 
    description:false 
    %}


<script type="module" src="/js/home.bundle.js"></script>
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js"
  }
}
</script>
<script type="module" src="/js/crane.bundle.js"></script>
