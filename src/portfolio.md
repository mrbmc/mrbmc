---
layout: layout.html
bodyclass: portfolio list
title: "Portfolio"
cssfile: "css/pages/portfolio.css"
permalink: /portfolio/
eleventyImport:
  collections: ["work","talk","personal"]
---

{% include "_project-list.md", 
	collection: collections.work, 
	count:10,
	id: "work", 
	class: "full-grid",
	heading: "Impact Projects", 
	description: false %}

{% include "_project-list.md", 
	collection: collections.talk, 
	count:3, 
	id: "talk",
	class: "full-grid",
	heading: "Talks", 
	description: "A great way to learn is to share what you think you know." %}

{% include "_project-list.md", 
	collection: collections.personal, 
	count:4, 
	id: "personal",
	class: "full-grid",
	heading: "Play", 
	description: "As a Kinesthetic Learner, I need create new things to refine my thinking, and develop new skills."%}
