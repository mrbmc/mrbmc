---
layout: layout.html 
bodyclass: blog
title: "Blog"
cssfile: "css/pages/blog.css"
---

{% include "_post-list.md", postList: collections.post, count: 50 %}

[Blog RSS](/blog/rss.xml){.small-type}
