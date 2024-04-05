---
layout: layout.html
bodyclass: home
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
eleventyExcludeFromCollections: false
---

<section id="masthead" class="bio">

## My family calls me Brian, but my friends call me BMC.{.left}

I am a 👧🏻 👦🏻 father, [👩🏻 husband](https://www.bettykang.com/), 🗽 New Yorker, ️[🚲 cyclist](https://www.strava.com/athletes/773650), [🤿 divemaster](https://www.steelgills.com/@mrbmc), [🌎 world traveler](https://www.google.com/maps/d/u/0/edit?mid=1jAS6t-WP2zKeOYag3KsGKZtqxERvSfE), and **[👨‍💻 product designer](/about/)**.

<div><a class="scrollhint" href="#selected-work">Scroll</a></div>
<canvas width="1024" height="1024" id="gradient-canvas"></canvas>

</section>

{% include "_project-list.md", projectList: collections.work, label: "Selected Work", count: 6 %}

{% include "_post-list.md", postList: collections.posts, label: "Recent Posts", count: 4 %}


<style type="text/css">
html {
    scroll-snap-type: y mandatory;
}
</style>

<!-- <script type="text/javascript" language="javascript" src="/js/home.min.js"></script> -->
