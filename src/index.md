---
layout: layout.html
bodyclass: home
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
eleventyExcludeFromCollections: false
cssfile: "css/pages/home.css"
---

{% section "masthead" %}

# UX design, product discovery, and cross-functional leadership.{.blur-in}

<canvas id="gradient-canvas"></canvas>

{% endsection %}

{% include "_project-list.md", projectList: collections.work, heading: "Selected Work", count: 6, class: "fullWidth", description:false %}

{% include "_post-list.md", postList: collections.post, heading: "Recent Posts", count: 4, description:false %}

<script type="module" language="javascript">
	import { Gradient } from "/js/gradient.js";
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
</script>
