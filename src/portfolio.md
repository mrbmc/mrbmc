---
layout: layout.html
bodyclass: portfolio list
title: "Portfolio"
cssfile: "css/pages/portfolio.css"
---

1. [Work](#work)
2. [Speak](#speak)
3. [Play](#play)

{.stickynav}

{% if collections.work.length > 0 %}
{% include "_project-list.md", projectList: collections.work, heading: "Work", count:12 %}
{% endif %}

[CV & Resumé](/resume/) {.center}

{% if collections.talk.length > 0 %}
{% include "_project-list.md", projectList: collections.talk, heading: "Speak", description: "A great way to learn is to share what you think you know.", count:3 %}
{% endif %}

{% if collections.personal.length > 0 %}
{% include "_project-list.md", projectList: collections.personal, heading: "Play", description: "As a Kinesthetic Learner, I need create new things to refine my thinking, and develop new skills.", count:4 %}
{% endif %}

<style type="text/css">
.stickynav {
    display: none;
}
</style>
