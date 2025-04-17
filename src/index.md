---
layout: layout.html
bodyclass: home
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
eleventyExcludeFromCollections: false
cssfile: "css/pages/home.css"
---

{% section "bio","full-width" %}

# Hello there.

My family calls me **Brian**. My friends call me **BMC[\*](#killabmc){onclick="event.preventDefault();return false;"}**. I am a father 👧🏻 👦🏻, [husband 👩🏻](https://www.bettykang.com/), New Yorker 🗽, ️[cyclist 🚲](https://www.strava.com/athletes/773650), [divemaster 🤿](https://www.steelgills.com), short order cook 👨‍🍳, [world traveler 🌎](https://www.google.com/maps/d/u/0/edit?mid=1jAS6t-WP2zKeOYag3KsGKZtqxERvSfE), and **[digital product maker 👨‍💻](/portfolio/)**.{.large-type}

Short for "killaBMC", my genuine wu-tang-name betrothed by the GZA{#killabmc .tooltip}

![Portrait of Brian](/images/profile/mrbmc-20241121.jpeg) {.portrait  .blur-in}

{% endsection %}


{% comment %}
<canvas id="gradient-canvas"></canvas>
<script type="module" language="javascript">
    import { Gradient } from "/js/gradient.js";
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
</script>
{% endcomment %}

{% include "_project-list.md", projectList: collections.work, heading: false, count: 6, class: "full-grid", description:false %}

{% include "_post-list.md", postList: collections.post, heading: "Recent Posts", count: 4, description:false %}

<script type="text/javascript">
window.addEventListener('load', function(e) {
    document.querySelector("a[href='#killabmc']").addEventListener('mouseover',function(event){
        const tip = document.getElementById('killabmc');
        var xposition = (event.clientX - this.offsetLeft);
        var yposition = (event.clientY - this.offsetTop);
        tip.style.left = (this.offsetLeft - (tip.offsetWidth / 2)) + "px";
        tip.style.top = (this.offsetTop - tip.offsetHeight) + "px";
        tip.classList.add("in");
    });
    document.querySelector("a[href='#killabmc']").addEventListener('mouseout',function(event){
        const tip = document.getElementById('killabmc');
        tip.classList.remove("in");
    });
});
</script>
