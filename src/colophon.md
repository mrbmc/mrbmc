---
layout: layout.html
title: Brian McConnell | Design & Product Leadership
bodyclass: colophon
masthead: -1
cssfile: "css/pages/colophon.css"
---

# Colophon

## Site Info
This is a static website because static architecture aligns with my design principles:

* **Performance** Static websites load faster than web apps.
* **Durability** I don't have to maintain frameworks and libraries to make it work because it's based on standard web technology.
* **Flexibility** The simplicity of the build makes it very easy to make changes
* **Portability:** Just grab the files and go. 
* **Cost:** hosting a static site costs 12¢ a month.

## Key Apps

* [11ty](https://www.11ty.dev/) is my site generator.
* [Sublime Text](https://www.sublimetext.com/) is my code editor.
* [One Markdown](https://apps.apple.com/us/app/one-markdown/id1507139439) is my markdown editor for blog entries and portfolio case studies.
* [Awesome Screenshot](https://chrome.google.com/webstore/detail/alelhddbbhepgpmgidjdcjakblofbmce) is my favorite tool for grabbing screensots and recordings.
* [Amazon S3](https://aws.amazon.com/) & [Cloudfront](https://aws.amazon.com/) for hosting. I don't love Amazon but I do love paying pennies for hosting.

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

The primary typeface is [Univers by Linotype](https://www.myfonts.com/collections/univers-font-linotype) because it aligns with my design principles: modern, pragmatic, and versatile.

For extended prose we use a native serif: Hoefler on MacOS & iOS, Palatino on Android and Windows.

{% assign typefactor = 1.2 %}

# H1 Display ({{ 
	typefactor | 
	times: typefactor | 
	times: typefactor | 
	times: typefactor | 
	times: typefactor | 
	times: typefactor | 
	times: typefactor | 
	round: 3 }}rem)

## H2 Section ({{ 
	typefactor | 
	times: typefactor | 
	times: typefactor | 
	times: typefactor | 
	times: typefactor | 
	times: typefactor | 
	round: 3 }}rem)

### H3 Sub-Section ({{ 
	typefactor | 
	times: typefactor | 
	times: typefactor | 
	times: typefactor | 
	round: 3 }}rem)

#### H4 Component Heading ({{ 
	typefactor | 
	times: typefactor | 
	round: 3 }}rem)

##### H5 Component Sub-Heading ({{ 1 | 
	times: typefactor | 
	round: 3 }}rem)

Body:  (1rem)

Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.

Body.large-type:  ({{ 1 | times: typefactor | round: 3 }}rem)

Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.{.large-type}

Body.small-type:  ({{ 2 | minus: typefactor | round: 3 }}rem)

Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off - then, I account it high time to get to sea as soon as I can.{.small-type}

#### Prose:

This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me. {.serif}

### Color

Neutral-00{.chip .black}

Neutral-20{.chip .gray-dark}

Neutral-50{.chip .gray-mid}

Neutral-80{.chip .gray-light}

Neutral-100{.chip .white}

Primary {.chip .primary}

Primary80 {.chip .primary80}

Primary50 {.chip .primary50}

Primary20 {.chip .primary20}

&nbsp;{.chip .white}

Secondary {.chip .secondary}

Secondary80 {.chip .secondary80}

Secondary50 {.chip .secondary50}

Secondary20 {.chip .secondary20}

&nbsp;{.chip .white}

Tertiary {.chip .tertiary}

Tertiary80 {.chip .tertiary80}

Tertiary50 {.chip .tertiary50}

Tertiary20 {.chip .tertiary20}

&nbsp;{.chip .white}

Error{.chip .error}

Success{.chip .success}

&nbsp;{.chip .white}

&nbsp;{.chip .white}

&nbsp;{.chip .white}

