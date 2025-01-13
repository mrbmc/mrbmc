---
layout: layout.html
bodyclass: home
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
eleventyExcludeFromCollections: false
---

<section id="masthead" class="bio">

# UX <em>design</em>, product <em>discovery</em>, and cross-functional <em>leadership</em>.{.blur-in}

{% comment %}
* [linkedin](https://linkedin.com/in/mrbmc)
* [Figma](https://www.figma.com/@brianmcconnell) 
* [ADPList](https://adplist.org/mentors/brian-mcconnell) 
{.nav}
{% endcomment %}

<!-- <a href="#selected-work" class="scrollhint"><svg viewBox="0 0 53 20"><g><polygon points="26.5,17.688 9.114,3.779 10.303,2.312 26.5,15.269 42.697,2.313 43.886,3.779" fill="currentColor"></polygon></g></svg></a> -->

</section>

{% include "_project-list.md", projectList: collections.work, label: "Selected Work" count: 6 %}
{% include "_post-list.html", postList: collections.post, heading: "Recent Posts", count: 4 %}
