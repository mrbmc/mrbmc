---
layout: layout.html
bodyclass: portfolio list
title: "Portfolio"
---

{% include "_project-list.md", projectList: collections.work, label: "Work", count:12 %}

[CV & Resumé](/resume/) {.center}

{% include "_project-list.md", projectList: collections.personal, label: "Play", summary: "As a Kinesthetic Learner, I need create new things to refine my thinking, and develop new skills.", count:3 %}

{% include "_project-list.md", projectList: collections.talk, label: "Speak", summary: "A great way to learn is to share what you think you know.", count:3 %}

