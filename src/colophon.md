---
layout: layout.html
title: Brian McConnell | Design & Product Leadership
bodyclass: colophon
masthead: -1
---

# Colophon

## Site Info
This is a static website because reasons:
* **Performance** Static websites load faster than web apps.
* **Durability** I don't have to maintain frameworks and libraries to make it work because it's based on standard web technology.
* **Flexibility** The simplicity of the build makes it very easy to make changes
* **Portability:** Just grab the files and go. 
* **Cost:** hosting a static site is only 12¢ a month.

## Key Apps

* [11ty](https://www.11ty.dev/) is my preferred site generator.
* [Sublime Text](https://www.sublimetext.com/) is my code editor.
* [Obsidian](https://obsidian.md/) is my markdown editor for blog entries and portfolio case studies.
* [Awesome Screenshot](https://chrome.google.com/webstore/detail/alelhddbbhepgpmgidjdcjakblofbmce) is my favorite tool for grabbing screensots and recordings.
* [Amazon S3](https://aws.amazon.com/) & [Cloudfront](https://aws.amazon.com/) for hosting. I don't love Amazon but I do love paying 10¢ / month.

## Production Support

 <a href="https://www.drinktrade.com">Trade Coffee</a> supplies our Caffeine. I prefer light roast single origin beans brewed using an [AeroPress](https://aeropress.com/).

Transportation provided by custom-built bikes:  
**tarmac:** [2020 Dengfu R01](https://www.dengfubike.com/collections/carbon-bike-frame/products/r01-frame) + 105 + Winspace Lún + Conti tc5000  
**gravel:** [2017 Crust Romanceür](https://crustbikes.com/products/a-romantic-tale-the-romanceur) + GRX + Velocity Aileron + Gravel Kings

---

## Social Footprint

* [Strava](http://app.strava.com/athletes/773650)
* [Twitter](http://twitter.com/mrbmc)
* [Tumblr](http://mrbmc.tumblr.com)
* [LinkedIn](http://linkedin.com/in/mrbmc)
* [Quora](http://www.quora.com/Brian-McConnell)
* [Instagram](http://instagram.com/mrbmc)
* [Flickr](http://www.flickr.com/photos/mrbmc/)
* [GitHub](https://github.com/mrbmc)
* [CodePen](http://codepen.io/mrbmc)
* [Pinterest](http://pinterest.com/mrbmc/)
* [Vimeo](http://vimeo.com/mrbmc)
* [YouTube](http://www.youtube.com/user/imthebmc)
* [SteelGills](http://steelgills.com/mrbmc)
* [Last FM](http://www.last.fm/user/mrbmc)

---

## Style Guide

### Typography

The primary typeface is Helvetica Neue.

For extended prose we use a native serif: Hoefler on MacOS & iOS, Palatino on Android and Windows.

{% assign typefactor = 1.19 %}

# H1 Titular Heading ({{ typefactor | times: typefactor | times: typefactor | times: typefactor | times: typefactor | round: 3 }}rem)

## H2 Section Heading Title ({{ typefactor | times: typefactor | times: typefactor | round: 3 }}rem)

### H3 Sub-Section Heading Title ({{ typefactor | times: typefactor | round: 3 }}rem)

#### H4 Component Heading Title ({{ 1 | times: 1 | round: 3 }}rem)

##### H5 Component Sub-Heading Title ({{ 1 | times: typefactor | round: 3 }}rem)

Body:  (1rem)  
Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.

Body.Large:  ({{ 1 | times: typefactor | round: 3 }}rem)  
Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.{.largeType}

Body.Small:  ({{ 2 | minus: typefactor | round: 3 }}rem)  
Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.{.smallType}

Prose:  
Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to sea as soon as I can. {.serif}

### Color

Black{.chip .black}

Gray 100{.chip .gray100}

Gray 500{.chip .gray500}

Gray 900{.chip .gray900}

White{.chip .white}

Brand {.chip .brand}

Accent {.chip .accent}

Complement {.chip .complement}

Secondary {.chip .secondary}

&nbsp;{.chip .white}

Brand80 {.chip .brand80}

Accent80 {.chip .accent80}

Complement80 {.chip .complement80}

Secondary80 {.chip .secondary80}

&nbsp;{.chip .white}

Brand20 {.chip .brand20}

Accent20 {.chip .accent20}

Complement20 {.chip .complement20}

Secondary20 {.chip .secondary20}

