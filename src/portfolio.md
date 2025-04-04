---
layout: layout.html
bodyclass: work list
title: "Portfolio"
cssfile: "css/pages/portfolio.css"
permalink: /portfolio/
---

{% include "_project-list.md", projectList: collections.work, heading: "Impact Projects", description: false, count:6 %}

[CV & Resumé](/resume/) {.center}

{% if collections.talk.length > 0 %}
{% include "_project-list.md", projectList: collections.talk, heading: "Talks", description: "A great way to learn is to share what you think you know.", count:3 %}
{% endif %}

{% if collections.personal.length > 0 %}
{% include "_project-list.md", projectList: collections.personal, heading: "Play", description: "As a Kinesthetic Learner, I need create new things to refine my thinking, and develop new skills.", count:4 %}
{% endif %}
