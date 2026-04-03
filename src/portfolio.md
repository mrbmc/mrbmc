---
layout: layout.html
bodyclass: portfolio isotope
title: "Portfolio"
cssfile: "css/pages/portfolio.css"
permalink: /portfolio/

eleventyImport:
  collections: ["allProjects","post"]
---

<input type="radio" id="f-all" name="iso-filter" checked hidden>
<input type="radio" id="f-work" name="iso-filter" hidden>
<input type="radio" id="f-play" name="iso-filter" hidden>
<input type="radio" id="f-write" name="iso-filter" hidden>
<input type="radio" id="f-speak" name="iso-filter" hidden>

<nav class="isotope-filters" aria-label="Filter portfolio items">
<label for="f-all" class="filter-btn">All</label><label for="f-work" class="filter-btn">Work</label><label for="f-play" class="filter-btn">Play</label><label for="f-write" class="filter-btn">Write</label><label for="f-speak" class="filter-btn">Speak</label>
</nav>

<div class="isotope-grid full-width-grid" id="isotope-grid">
{% for entry in isotope %}
  {% if entry.type == "project" %}
    {% assign item = collections.allProjects | getBySlug: entry.slug %}
  {% else %}
    {% assign item = collections.post | getBySlug: entry.slug %}
  {% endif %}
  {% if item %}
<article class="isotope-item {{ entry.size }} {{ entry.filter }}" data-filter="{{ entry.filter }}">
<a href="{{ item.url }}" class="item-link">
{% if item.data.thumbnail %}<figure class="item-figure"><img src="{{ item.data.thumbnail }}" alt="{{ item.data.title }}"></figure>{% elsif item.data.masthead-image %}<figure class="item-figure"><img src="{{ item.data.masthead-image }}" alt="{{ item.data.title }}"></figure>{% else %}<figure class="item-figure item-figure--title" aria-hidden="true"><span class="item-figure-title">{{ item.data.title }}</span></figure>{% endif %}
<div class="item-body">
<span class="item-tag tag-{{ entry.filter }}">{{ entry.filter }}</span>
<h3 class="item-title">{{ item.data.title }}</h3>
{% if entry.size == "lg" and item.data.summary %}<p class="item-summary">{{ item.data.summary }}</p>{% endif %}
</div>
</a>
</article>
  {% endif %}
{% endfor %}
</div>
