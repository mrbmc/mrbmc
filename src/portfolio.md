---
layout: layout.html
bodyclass: portfolio list
title: "Portfolio"
---

1. [Work](#work)
2. [Speak](#speak)
3. [Play](#play)

{.stickynav}

{% if collections.work.length > 0 %}
{% include "_project-list.md", projectList: collections.work, label: "Work", count:12 %}
{% endif %}

[CV & Resumé](/resume/) {.center}

{% if collections.talk.length > 0 %}
{% include "_project-list.md", projectList: collections.talk, label: "Speak", summary: "A great way to learn is to share what you think you know.", count:3 %}
{% endif %}

{% if collections.personal.length > 0 %}
{% include "_project-list.md", projectList: collections.personal, label: "Play", summary: "As a Kinesthetic Learner, I need create new things to refine my thinking, and develop new skills.", count:4 %}
{% endif %}

<style type="text/css">
	.stickynav {
		position: fixed;
		top: 50%;
		left: 1rem;
	    margin: -1.5em 0 0 0;
	    flex-direction: column;
	    border-radius: 0.25rem;
	    display: none;
	}
	.stickynav > li:first-of-type,
	.stickynav > li:last-of-type {
		border-radius: 0;
	}
	.stickynav>li a {
		padding: 0 .25rem;
	}
</style> 