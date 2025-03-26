---
layout: layout.html
bodyclass: blog
eleventyComputed:
  title: "{{tag}}"
cssfile: "css/pages/blog.css"
permalink: "/tags/{{ tag | slugify }}/"
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - all
    - project
---

{% section "masthead" %}

<h1>{{ tag }}</h1>

{{description}}

{% endsection %}

{% assign _slug = tag | slugify %}
{% assign _url = "/tags/" | concat: _slug %}
{% assign _title = false %}
{% assign _collection = collections[tag] %}

{% include "_post-list.md", postList: _collection, count:50 %}
