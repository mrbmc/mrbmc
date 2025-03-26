---
layout: layout.html
bodyclass: work list
title: "Portfolio"
cssfile: "css/pages/portfolio.css"
permalink: /work/
---


{% assign count = 12 %}
{% section "work", "" %}
{% for project in collections.work reversed %}{% if forloop.index0 < count %}
<article>

<header>

#### {{ project.data.title }}

##### {{ project.data.jobtitle }}

{% if project.data.timeline %}#### {{project.data.timeline}}{.timeline}{% endif %}{.hide}

{% if project.data.description %}{{ project.data.description }}{.summary}{% endif %}

{% for product in project.data.accomplishments %}
- {{ product }}
{% endfor %}{.small-type}

{% if project.data.casestudy %}<a href="#" data-part1="b" data-part2="brianmcconnell" data-part3="me" data-part4="Case Study Request: {{project.data.title}}" class="link-email">Case study available</a>{% endif %}

</header>

<figure>
	<img src="{{ project.data.thumbnail }}" alt="{{ project.data.title }}" />
</figure>

</article>
{% endif %}
{% endfor %}

{% endsection %}

{%comment %}
Title
Company divsion
company logo?
<case study available> email link
<a href="#" data-part1="b" data-part2="brianmcconnell" data-part3="me" data-part4="Case Study Request: {{project.data.title}}" class="link-email">Case study available on request</a>

Summary of the work done

* Accomplishments
* Accomplishments
* Accomplishments

{%endcomment%}

<style>
	h3,h4,h5 {
		padding: 0 0 .5rem 0;
		margin: 0;
	}
	h5 {
		color: var(--text-secondary);
	}
	main header li {
		color: var(--text-secondary);
	}
	#work {
		display: flex;
		flex-direction: column;
		row-gap: var(--gutter-xl);
	}

	article {
		display: flex;
		flex-direction: row-reverse;
		gap: var(--gutter-xl);
		align-items: center;
	}
	article figure,
	article header {
		flex-basis: 50%;
	}
	article figure {
		border-radius: 1rem;
		overflow: hidden;
		margin: 0;
		height: 100%;
	}
	article figure img {
		display: block;
		height: 100%;
		width: 100%;
		object-fit: cover;
	}
</style>
[CV & Resumé](/resume/) {.center}
