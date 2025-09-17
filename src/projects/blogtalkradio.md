---
title: Dynamo Podcast Platform
thumbnail: /images/portfolio/btr/btr-hosttools-teaser-2x1.jpg
masthead-image: /images/portfolio/btr/btr-hosttools-teaser-2x1.jpg
date: 2014-01-01
tags:
  - work
masthead-title: BlogTalkRadio
summary: Paying podcast hosts their fair share.
description: Leading the product, design, and engineering teams through a business transformation that drove **~40% revenue growth** in subscriptions and advertising.
jobtitle: Senior Director, Product and Design
casestudy: true
timeline: 2013-2015
accomplishments:
- Drove 37% YoY ad revenue growth by architecting patented programmatic advertising platform (US20170195373A1) for targeted podcast monetization
- Increased subscription revenue 42% YoY through development of comprehensive creator tools including analytics, educational content, and audio processing
- Acquired by iHeartMedia for $50M.
---
## How might we reward podcast hosts with a fair income from their work?

BlogTalkRadio was one of the first platforms to support a **Creator Economy** by compensating hosts for generating engagement through their content. I helped BlogTalkRadio pivot from a SAAS business model to an advertising model with a revenue share for hosts, resulting in significant revenue growth and a successful acquisition exit for the founders. 

* [Product Strategy](#strategy)
* [Virtual Radio Studio](#studio)
* [Host UX](#hostux)
{.sticky-nav}

| Role                     | Responsibilities                                                                         | Team                                                | Timeline               | Impact                                                           |
| :----------------------- | :--------------------------------------------------------------------------------------- | :-------------------------------------------------- | :--------------------- | ---------------------------------------------------------------- |
| Director of Product & UX | <ul><li>KPI and OKR definition</li><li>Product requirements</li><li>Roadmap prioritization</li><li>UX research</li><li>Design strategy</li></ul> | 5 Engineers<br>2 UI Designers<br>1 Content Designer | June 2013 - April 2015 | Grew ad revenue by **37% YoY** <br>Grew subscription revenue **42% YoY** |

{#summary .rotate}
<style type="text/css">
table#summary tr {
    grid-template-rows: 1fr 3fr 2fr 1fr 1fr;
}
</style>
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

**UX challenges for new hosts:**

- Running a first test show
- Inviting your first guests
- Writing a short repeatable intro to keep guests engaged
- [Designing compelling cover art](#coverart) that scales across distribution channels
- Getting to your third episode

!['Journey Map'](/images/portfolio/btr/btr-customer-experience-map-hosts.png){.full-width}
Starting A Show{.caption #journeymap}

!['Journey Map'](/images/portfolio/btr/btr-episode-experience-map.png){.full-width}
Creating An Episode Map{.caption}

### Hypothesis: Flywheel of Growth{#hypothesis}

The success of the platform relied on interconnected incentives: 

{% include "images/portfolio/btr/btr-dynamo-illustration.svg" %}

- Educating hosts on podcast best practices elevated the quality of their shows →
- Boosted listener engagement 200% YoY →
- Increased advertising revenue 100%  →
- Tripled host activation (creating 3+ episodes) raised Pro Subscription revenue 20%


## Virtual Radio Studio{#studio}

The Studio is the heart of the BTR experience and it's the UI that hosts interact with during the highest stress moments of creating a podcast. Extensive user interviews and ride-alongs with our hosts revealed deep insights into user habits before, during, and after a live broadcast.

#### UX research insights:
- Producing a live interview for radio or podcast is a performance scenario that requires focus and preparation. It's stressful!
- Discoverability is key in a high-pressure operation. Hosts need omnipresent feedback about the show state.
- Hosts sometimes pre-record intros and outros. Use the audio clips to set up the show, not just effects.
- Hosts struggle with understanding which callers are listeners and which want to speak. Hosts asked for a way to screen guests.
- Promotion is a key part of pulling in a live audience. 

### Art Direction

The art direction was inspired by high-end Audio and video authoring applications. We wanted to convey a serious, professional-grade application for our hosts to work with.

+ !['Live'](/images/portfolio/btr/btr-studio-live.png) {.col-4 .row-1 .canzoom .contain}
+ !['Pre-Show'](/images/portfolio/btr/btr-studio-pre-show.png) {.col-4 .row-1}
+ !['Ad Break'](/images/portfolio/btr/btr-studio-ad-break.png) {.col-4 .row-1}
+ !['Macbook'](/images/portfolio/btr/btr-studio-imac.png) {.col-12 .contain}

{.grid .well .full-grid}

### Ad Breaks

Hosts wanted total control over when and how ads cut into their shows. We built an web-based audio editor that allowed hosts to splice in ads at the frame level.

!['Ad Editor'](/images/portfolio/btr/btr-ad-editor.png){.canzoom} 
 

----

## Host UX{#hostux}

### Relevant Analytics

By far the most common workflow we saw almost every host take in the dashboard was viewing the listen numbers for their content. Hosts wanted to see a quantifiable reward for their efforts. We surfaced these metrics and created new summary metrics in the dashboard to amplify the ROI for them.

+ ![Listens Overview](/images/portfolio/btr/btr-stats-home.png) {.col-6}
+ ![Listens Overview](/images/portfolio/btr/btr-stats-episode.png) {.col-6}
+ ![Podcast Host Dashboard](/images/portfolio/btr/btr-dashboard-laptop.png) {.col-12}

{.grid .well .full-grid}

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
{.grid .well .full-grid}

### Improved Show Artwork{#coverart}

For many of our hosts, their subject matter expertise is rarely graphic design. Creating usable, engaging, professional cover art for their show was an obstacle to content discovery, and a **pain point we repeatedly heard in user research**. 

I contracted several graphic designers to overhaul the cover art for our top 200 shows. I provided the creative direction, review, and production guidelines.

Improved the artwork delivered tangible business impact: 

1. **Improved RFE**{.success}: recency, frequency, and engagement from listeners.
2. **Grew LTV**{.success} with longer host lifespans and more episodes created
3. **Higher CPMs**{.success} thanks to a higher quality Media Book for advertisers.



![New Artwork](/images/portfolio/btr/btr-host-artwork.png){.col-12 .canzoom}

![New Artwork](/images/portfolio/btr/btr-homepage.jpg){.col-12 .canzoom}

---


<style>
#hypothesis ~ svg {
display: block;
max-height: 62vh;
margin: 0 auto;
}

</style>

