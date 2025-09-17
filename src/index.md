---
layout: layout.html
bodyclass: home
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
eleventyExcludeFromCollections: false
cssfile: "css/pages/home.css"
---

{% section "masthead","full-grid" %}

Design, Product Discovery, and Cross-Functional Leadership across B2C and B2B, from early startups to global enterprises.{.blur-in .large-type .center}

{#boids}

{% endsection %}

{% comment %}
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
    class: " full-grid", 
    heading: false, 
    description:false%}

----

{% include "_post-list.md", postList: collections.post, heading: "Recent Blog Posts", count: 4, description:false %}


<script type="module" src="/js/home.bundle.js"></script>
