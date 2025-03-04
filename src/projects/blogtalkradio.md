---
title: BTR Dynamo™
thumbnail: /images/portfolio/btr/btr-hosttools-teaser-2x1.jpg
masthead-image: /images/portfolio/btr/btr-hosttools-teaser-2x1.jpg
date: 2014-01-01
tags:
  - work
masthead-title: BlogTalkRadio
description: Dynamo was a creator-economy ecosystem. We built an advertising platform that paid podcast hosts a fair income for their work.
timeline: 2013-2015
---
## How might we reward podcast hosts with a fair income from their work?

BlogTalkRadio was one of the first platforms to support a **Creator Economy** by compensating hosts for generating engagement through their content. I helped BlogTalkRadio pivot from a SAAS business model to an advertising model with a revenue share for hosts, resulting in significant revenue growth and a successful acquisition exit for the founders. 

* [Product Strategy](#strategy)
* [Host UX](#hostux)
* [Virtual Radio Studio](#studio)
{.stickynav}

| Role                     | Responsibilities                                                                         | Team                                                | Timeline               | Impact                                                           |
| :----------------------- | :--------------------------------------------------------------------------------------- | :-------------------------------------------------- | :--------------------- | ---------------------------------------------------------------- |
| Director of Product & UX | KPI and OKR definition<br>roadmap prioritization<br>customer research<br>market research | 5 Engineers<br>2 UI Designers<br>1 Content Designer | June 2013 - April 2015 | Grew ad revenue by 37% YoY <br>Grew subscription revenue 42% YoY |

----

## Product Strategy{#strategy}

When I joined BTR, it was a profitable tool for creating and distributing live radio shows, but revenue growth had stalled. Popular hosts (10k+ listens per episode) were poached by larger platforms. Millions of listens spread across a roster of hosts with medium audiences (5k-10k listens per episode) could not be monetized to advertisers. 

**The Challenge: How might we sell advertising against our full inventory and offer a revenue share to retain talented hosts?**

### Opportunity 1: Expanding Ad Inventory

{% section %}

<figure class="pull-right" data-width="50">
{% include "images/portfolio/btr/btr-listens-decay-curve.svg" %}  
</figure>

**Constraint 1:** Podcast advertising campaigns have a shelf life of 4 weeks. Many of our episodes had a long tail of consumption with most listens occurring weeks, months, or years after recording. *How might we monetize old podcasts with new listens?*

{% endsection %}

**Solution:** Inserting ads at download time, instead of burn-in, meant the ads were fresh to listeners regardless of when the episode was produced. Real-time ad insertion for MP3s did not exist in 2013, but the potential upside was worth the effort.

The most profitable advertising rates ($30-$100 CPMs) required a minimum of 10k listens per campaign. Real-time ad insertion enabled us to bundle episodes, hosts, and categories into viable products for advertisers.

### Opportunity 2: Improving Content

Most of our hosts were subject matter experts (nutrition, parenting, personal finance) using podcasts to drive their primary business. How might we guide hosts through the emotional labor of creating a quality show? 

We interviewed hosts and mapped their Journey to identify opportunities for differentiation and growth. 
This also aligned our cross-functional teams between product, design, engineering, marketing, and community management. This helped us identify key leverage points in the UX for building habituation to prioritize:

Some of the biggest UX challenges for new hosts were:
- Getting to your third episode
- Running a first test show
- Inviting your first guests
- Writing a short repeatable intro to keep guests engaged
- Designing compelling cover art that scales across distribution channels

!['Journey Map'](/images/portfolio/btr/btr-customer-experience-map-hosts.jpg){.fullwidth}

### Flywheel of Growth

The success of the platform relied on interlocking incentives: 

{% include "images/portfolio/btr/btr-dynamo-illustration.svg" %}

- Educating hosts on podcast best practices elevated the quality of their shows →
- Boosted listener engagement 200% YoY →
- Increased advertising revenue 100%  →
- Tripled host activation (creating 3+ episodes) raised Pro Subscription revenue 20%


## Host UX{#hostux}

### Content Guidance

The metrics were a useful indicator for the podcast health but they didn't provide the qualitative guidance that hosts needed to improve those numbers. The competitive landscape of support for hosts focused mostly on technical guidance for sound quality and distribution. There was no guidance on how to write a compelling script, structure the show intro, or write compelling titles that inspire the audience to listen.

We knew from our own metrics that the first 30 seconds of a podcast episode were the most critical for engaging your audience and getting them hooked. How might we help hosts make the most of that opportunity?

We built features, like **Signal Strength**, and **Template Episodes** to help improve the podcast _content_ directly in the tools. We used some light gamification inspired by other apps and guided hosts toward creating complete and compelling podcast titles, descriptions, and introductions.

+ !['Podcast Writing Hints'](/images/portfolio/btr/btr-CRUD-edit-info.png) {.col-8 .row-2}
+ !['Podcast Writing Hints'](/images/portfolio/btr/btr-CRUD-create.png) {.col-4}
+ !['Podcast Writing Hints'](/images/portfolio/btr/btr-CRUD-edit-advanced.png) {.col-4}
+ !['Manage Episodes'](/images/portfolio/btr/btr-episodes-list.png) {.col-4 .hide}
+ !['Manage Episodes'](/images/portfolio/btr/btr-episodes-list-select.png) {.col-6}
+ !['Order Transcript'](/images/portfolio/btr/btr-episodes-list-transcript.png) {.col-6}
{.grid .well .fullwidth}



### Relevant Analytics

By far the most common workflow we saw almost every host take in the dashboard was viewing the listen numbers for their content. Hosts wanted to see a quantifiable reward for their efforts. We surfaced these metrics and created new summary metrics in the dashboard to amplify the ROI for them.

![Podcast Host Dashboard](/images/portfolio/btr/btr-hosttools-dashboard.png)

### Improved Show Artwork

For many of our hosts, their subject matter expertise is rarely graphic design. Creating usable, engaging, professional cover art for their show was an obstacle to content discovery, and a **pain point we repeatedly heard in user research**. 

I contracted several graphic designers to overhaul the cover art for our top 200 shows. I provided the creative direction, review, and production guidelines.

Improved the artwork delivered tangible business impact: 

1. Improved recency, frequency, and engagement from listeners. (`RFE`)
2. Longer show lifespan from hosts (`LTV`)
3. Higher CPMs thanks to a higher quality Media Book for advertisers.



+ ![New Artwork](/images/portfolio/btr/btr-host-artwork.png){ style="object-position:0% 0;"} {.col-3}
+ ![New Artwork](/images/portfolio/btr/btr-host-artwork.png){ style="object-position:100% 0;"} {.col-3}
+ ![New Artwork](/images/portfolio/btr/btr-homepage.jpg) {.col-6}
{.grid .well .fullwidth}
---

## Virtual Radio Studio{#studio}

The Studio is the heart of the BTR experience and it's the UI that hosts interact with during the highest stress moments of creating a podcast. Extensive user interviews and ride-alongs with our hosts revealed deep insights into user habits before, during, and after a live broadcast.

##### Key UX research insights:
- Producing a live interview for radio or podcast is a performance scenario that requires focus and preparation. It's stressful!
- Discoverability is key in a high-pressure operation
- Sound clips are used for pre-baked intro and outros.
- Multiple affordances for caller states help first-time hosts.
- Feedback about the show state.

<p>The art direction was inspired by high-end Audio and video authoring applications. We wanted to convey a serious, professional-grade application for our hosts to work with.</p>

+ !['Live'](/images/portfolio/btr/btr-studio-live.png) {.col-4 .row-1 .canzoom .contain}
+ !['Pre-Show'](/images/portfolio/btr/btr-studio-pre-show.png) {.col-4 .row-1}
+ !['Ad Break'](/images/portfolio/btr/btr-studio-ad-break.png) {.col-4 .row-1}
+ !['Studio In Context'](/images/portfolio/btr/btr-studio-teaser-2x1.jpg) {.col-12 .contain}

{.well .grid .fullwidth}

----

<style>
</style>

