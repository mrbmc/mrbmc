---
layout: layout.html
bodyclass: portfolio project
cssfile: "css/pages/project.css"
---

{% if masthead-video or masthead-image %}
{% include "_masthead.md" %}
{% else %}
# {{title}} { .blur-in}
{% if description %}{{ description }}{.summary .blur-in .large}{% endif %}
{% endif %}

{{content}}

{% assign nextPost = collections[tags[0]] | getPreviousCollectionItem: page %}
{% assign previousPost = collections[tags[0]] | getNextCollectionItem: page %}


<div id="lightbox" class=""></div>

<script type="module" src="/js/portfolio.bundle.js"></script>
