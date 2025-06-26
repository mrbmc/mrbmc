---
layout: layout.html
bodyclass: home
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
eleventyExcludeFromCollections: false
cssfile: "css/pages/home.css"
---

{% section "masthead","full-grid" %}

# Design, Product Discovery, and Cross-Functional Leadership

<canvas id="boids"></canvas>

{% endsection %}

{% comment %}
<canvas id="gradient-canvas"></canvas>
<script type="module" language="javascript">
    import { Gradient } from "/js/gradient.js";
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
</script>
{% endcomment %}

{% include "_project-list.md", projectList: collections.work, heading: false, count: 9, class: "full-grid", description:false %}

{% include "_post-list.md", postList: collections.post, heading: "Recent Posts", count: 4, description:false %}

<!-- <script type="text/javascript" language="javascript" src="/js/modules/molf.mjs"></script> -->

<script type="module" src="/js/home.bundle.js"></script>

