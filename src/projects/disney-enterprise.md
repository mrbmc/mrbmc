---
title: Disney Enterprise XD
date: 2020-09-01
thumbnail: /images/portfolio/disney-enterprise/optumus-mockup.jpg
eleventyExcludeFromCollections: false
tags:
  - work
summary: A suite of enterprise SAAS products behind Disney+, Hulu, and ESPN saved $80M/pa and grew MRR 25%.
timeline: 2019-2023
---

1. [The Strategy](#strategy)
2. [The Team](#team)
3. [The Products](#products)
   1. [Commerce](#commerce)
   2. [Content](#content-tools)
   4. [Business Intelligence](#analytics)
   3. [Developer Experience](#developer)

{.stickynav}

| Role & Responsibility                                                                                                                                          | Team                                   | Timeline            | Impact                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------- | -------------------------------------------------------------------------- |
| **Sr. Director, Product Design**<br><br>Team hiring, management, and organization design. Design strategy. Partner management. Budgeting. Culture development. | 12 FT Designers + 6 Design Contractors | Jan 2019 - Aug 2023 | saved **$80M** p/a in operating costs<br>supported a **25% growth in MRR** |

## The Strategy (of Streaming){#strategy}

>To create something truly novel you need novel tools.  
-Brian McConnell

Building a global streaming service that fully meets consumer needs requires a constellation of software components in commerce, content, support, data insights, and developer tools. Disney's scale often requires us to build novel solutions due to cost or privacy constraints. 

As the executive accountable for product design of these tools my mission was to invest design effort in the products that could make the biggest business impact through customer acquisition, cost optimization, increasing agility, or improving decision quality.

| Disney Product              | Purpose                                                                                     | Kpi                     | Commercial Analog(s)                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------- |
| [Genie](#genie)             | Billing and SKU management                                                                  | Net Subs, MRR           | [Orb](https://www.withorb.com/), [Metronome](https://metronome.com/)         |
| [Baymax](#baymax)           | Customer Support Portal                                                                     | OpEx, Gross Margin      | [Zendesk](https://www.zendesk.com/)                                          |
| [WeaponX](#weaponx)         | Experimentation & Feature Flagging                                                          | Net Subs, MRR, [RFE](#) | Optimizely, Launch Darkly                                                    |
| [Polaris](#content-tools)   | Content Curation                                                                            | RFE                     | [Contentful](https://www.contentful.com/)                                    |
| [Tesseract](#content-tools) | Content Review                                                                              | RFE, OpEx               | [ContentStudio](https://contentstudio.io/)                                   |
| [Optumus](#optumus)         | Streaming Quality Analysis                                                                  | OpEx                    | [Conviva](https://www.conviva.com/)                                          |
| Developer Platform          | Centralized resources for managing developer resources (services, APIs, documentation, etc) | OpEx                    | n/a                                                                          |
| [DATA Portal](#dataportal)  | A one-stop shop for all metrics and analytics of our streaming services.                    | n/a                     | [Tableau](https://www.tableau.com/), [Zoho](https://www.zoho.com/analytics/) |
| Ad Manager, Mission Control | Advertising curation, provisioning, and deployment.                                         | MRR                     | [Google AdSense](https://adsense.google.com/), Amazon Advertising            |
| Partner Portal              | Testing APIs, documentation, and issue tracking for developers building with Disney's SDK.  | Net Subs, MRR           | [GitLabs](https://about.gitlab.com/)                                         |
| [Galaxy](#galaxy)           | Platform for sending personalized targeted messages (Email, SMS, Push) to our users.        | Net Subs, MRR           | [salesforce](https://www.salesforce.com/) + [braze](https://www.braze.com/)  |
_The scale of this platform was comparable to an entire industry._  

To prioritize investment in each of these products, I used a Growth Framework, to compare the potential commercial impact for each. This helped in securing funding for staffing, contract, and roadmap priority.


![Enterprise ROI](/images/portfolio/disney-enterprise/exd-roi-framework.png)


## The Team{#team}

![linda](/images/portfolio/disney-enterprise/exd-team-linda.png)![caroline](/images/portfolio/disney-enterprise/exd-team-caroline.png)![dan](/images/portfolio/disney-enterprise/exd-team-dan.png)![alexaf](/images/portfolio/disney-enterprise/exd-team-alexaf.png)![daria](/images/portfolio/disney-enterprise/exd-team-daria.png)![takeem](/images/portfolio/disney-enterprise/exd-team-takeem.png)![alexac](/images/portfolio/disney-enterprise/exd-team-alexac.png)![jenny](/images/portfolio/disney-enterprise/exd-team-jenny.png)![willet](/images/portfolio/disney-enterprise/exd-team-willet.png)![sarah](/images/portfolio/disney-enterprise/exd-team-sarah.png)![kda](/images/portfolio/disney-enterprise/exd-team-kda.png)![cathy](/images/portfolio/disney-enterprise/exd-team-cathy.png)![carol](/images/portfolio/disney-enterprise/exd-team-carol.png)![jon](/images/portfolio/disney-enterprise/exd-team-jon.png)![agency](/images/portfolio/disney-enterprise/exd-team-agency.png)
{.team}

### Defining Culture

A team is greater than the sum of the individuals. It's a singular unit with a shared purpose. The secret ingredient that binds a group of people together is the culture. I'm proud to say the Enterprise XD team at Disney had a strong culture of **psychological safety**, **authenticity**, and **shared growth**.

![golden circle](/images/portfolio/disney-enterprise/EXD-Golden-Circle.png){style="box-shadow:0 1em 1.38em 0.38em rgba(0,0,0,0.13);"}

Culture can be designed with intentional reinforcement of the behaviors that align with our values. Other teams at Disney saw this and asked for an open-source toolkit for our [Team Charter Workshop](/portfolio/team-charter-workshop/).

<video src="/images/portfolio/culture-workshop/EXD-workshop-timelapse.mp4" autoplay muted loop ></video>

### Operating Model

To tackle such a large surface area, we organized the team into pods for each topical area. These subjects aligned with business outcomes as well.

![](/images/portfolio/disney-enterprise/exd-pods.png){.card}


## The Products {#products}

### Commerce Tools{#commerce}

#### Offer Management {#genie}

*codename "Genie"*

Putting the right offer in front of the right user at the right time is depetively complex. At global scale that means 1000+ combinations of content rights, currency, payment terms, and devices. Running our own commerce stack unlocked Disney+'s global expansion from 25M subscribers domestically to **105M net subscribers** globally.

Features for managine automated price changes grew **MRR by 25% YoY**.

- ![props 2](/images/portfolio/disney-enterprise/props-list.jpg)  {.col4}
- ![genie 2](/images/portfolio/disney-enterprise/genie-campaign.png) {.col8 .row2}
- ![genie 1](/images/portfolio/disney-enterprise/genie-offers.jpg) {.col4}
{.mosaic .fullwidth}

#### Support Agent Tools{#baymax}

*codename Baymax*

Disney provides its guests and exceptional level of care. Disney+ is no exception, but it can be a significant cost center as well. These custom built tools for our agents saved Disney **$20M/pa in operating expenses** 

We focused on shortening **case resolution time**, increasing **CSAT** scores, and giving agents upsell capability.

- ![Support Agent Portal](/images/portfolio/disney-enterprise/baymax-customer.jpg) {.col8 .row2}
- ![Support Agent Portal](/images/portfolio/disney-enterprise/baymax-search_results.png) {.col4}
- ![Support Agent Portal](/images/portfolio/disney-enterprise/baymax-cancel.png) {.col4}
{.mosaic .fullwidth}

#### Lifecycle Messaging{#galaxy}

*codename Galaxy*

A guiding UX principle across Disney+ is to **put the right offer in front of the right user at the right time**. Creating personalized messages with third-party tools was not possible without violating privacy laws, or prohibitively expensive brittle integrations of multiple apps.

"Galaxy" supported email and push notifications, translated into each language Disney+ supports, populated with unique recommendations for each account.

- ![Messag Localization](/images/portfolio/disney-enterprise/galaxy-localization-1.png) {.col6}
- ![Personalized Messaging](/images/portfolio/disney-enterprise/galaxy-v1.png){style="object-fit:contain;max-height:none;"} {.col6 .row2}
- ![Push Messaging](/images/portfolio/disney-enterprise/galaxy-push.png){style="object-fit:contain;"} {.col6}
{.mosaic .fullwidth}

### Content Platform{#content-tools}

*codenames Polaris & Tesseract*

A team of editors steeped in knowledge of the Disney catalog created hundreds of content collections around themes, brands, characters. We built a WYSIWYG editor that showed the custom artwork for each title so editors could organize collections in a visually harmonious way. We saw **engagement**{.success} and **CVR**{.success} lift from doing this.

- ![Visual Browsing](/images/portfolio/disney-enterprise/polaris-search.png) {.col4 .contain}
- ![Visual Browsing](/images/portfolio/disney-enterprise/polaris-visualbrowse.png) {.col4 .contain}
- ![Content Curation](/images/portfolio/disney-enterprise/polaris-set-pcs.png) {.col4}
{.mosaic .fullwidth}

#### An Audience of One

The content strategy for most streaming services, including Disney+, is to create an audience of one. Each user experiences a bespoke presentation of content.

![content strategy](/images/portfolio/disney-enterprise/disney-content-strategy.jpg)

 Our tactic to achieve this was an "Algotorial" presentation that leveraged the best attributes of human curation and machine learning. Editorial collections were ML optimized, and the display order was optimized with a few human overrides for ~~redacted tactic~~.


- ![Content Targeting](/images/portfolio/disney-enterprise/polaris-edit_cta.png) {.col3 .contain}
- ![Content Targeting](/images/portfolio/disney-enterprise/polaris-collection.png) {.col6 .contain}
- ![Content Targeting](/images/portfolio/disney-enterprise/polaris-browse.jpg) {.col3 .contain}
{.mosaic .fullwidth}

### Analytics{#analytics}

Improve the quality of decision making for everyone at Disney.

#### Data Portal{#dataportal}

![Data Portal](/images/portfolio/disney-enterprise/dataportal.png)

#### Streaming Analytics{#optumus}

*codename Optumus*

The internet is not built for persistent delivery of high bandwidth http packets. Making good on our promise of sterling quality video to consumers on any device in any region, required specialized tools that could pro-actively identify issues and notify engineers with actionable insights.

The team used participatory design methods that included the users - delivery engineers - into the design process to ensure the product was usable and useful to real world use cases.

Building this product internally saved Disney **$30M/pa** over comparable third party products.

- ![Streaming QoS Analysis](/images/portfolio/disney-enterprise/optumus-session.png) {.col8 .row2}
- ![Streaming QoS Analysis](/images/portfolio/disney-enterprise/optumus-dashboard.png) {.col4 .contain}
- ![Streaming QoS Analysis](/images/portfolio/disney-enterprise/optumus-spotlight.png) {.col4 .contain}
{.mosaic .fullwidth}

#### Experimentation, A/B Testing, Feature Flagging {#weaponx}

*codename WeaponX*

Make better decisions faster.

- ![Experimentation](/images/portfolio/disney-enterprise/weaponx-dashboard.jpg) {.col6}
- ![Experimentation](/images/portfolio/disney-enterprise/weaponx.png) {.col6}
{.mosaic .fullwidth}

### Developer Experience{#developer}

#### Enterprise Design System{#trek}

We partnered with a team of engineers who cared deeply about developer productivity to create a design system and a visual language that was unique to disney. This design system provides a high quality, rapid, and robust UI framework across all these products.

![Trek Overview](/images/portfolio/disney-enterprise/exd-design-system-overview.jpg){.card}

- ![Inputs](/images/portfolio/disney-enterprise/trek-inputs.jpg) {.col6 .row2}
- ![Color Tokens](/images/portfolio/disney-enterprise/trek-colors.jpg) {.col3}
- ![Type Tokens](/images/portfolio/disney-enterprise/trek-type.jpg) {.col3}
- ![Navigation](/images/portfolio/disney-enterprise/trek-navigation.jpg) {.col6 .row2}
- ![Buttons](/images/portfolio/disney-enterprise/trek-buttons.jpg) {.col3}
{.mosaic}


## Unified Platform Vision

Evangelizing design system adoption begins with a promise of a better future. We buy on emotion and rationalize with facts (stability and scalability for developers; operational savings and velocity for business owners; usability and brand trust for designers). We designed a vision-state for a platform of feature products with a shared visual language.

- ![Commerce Portal](/images/portfolio/disney-enterprise/new/commerce-offer-detail.jpg) {.col4}
- ![Support Agent Portal](/images/portfolio/disney-enterprise/new/sisu-customer-details.jpg) {.col4}
- ![Messaging Portal](/images/portfolio/disney-enterprise/new/messaging-new-email.jpg) {.col4}
- ![Content Management](/images/portfolio/disney-enterprise/new/cypher-dictionary.jpg) {.col4}
- ![Content Portal](/images/portfolio/disney-enterprise/new/content-portal-episode.jpg) {.col4}
- ![Metadata Portal](/images/portfolio/disney-enterprise/new/knowsmore.jpg) {.col4}
- ![Streaming Quality](/images/portfolio/disney-enterprise/new/qos-spotlight.jpg) {.col4}
- ![Experimentation](/images/portfolio/disney-enterprise/new/experiments-results.jpg) {.col4}
- ![Advertising](/images/portfolio/disney-enterprise/new/ads-mission-control-scheduling.jpg) {.col4}
- ![Developer Productivity](/images/portfolio/disney-enterprise/new/dev-portal.jpg) {.col4}
{.mosaic .fullwidth}


<style>
.team {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1rem;
  @media (max-width: 43rem) {
    grid-template-columns: repeat(3, 1fr);
  }
}
.team img {
  height: 100%;
  object-position: 50% 50%;
  object-fit: contain;
}
</style>
{% comment %}

<!--

All of the products we designed or consulted on:

Anti-Piracy Operations, Audience Segmentation, CDN Management Console, Commerce & Offer Operations, Commerce Config Tool, Content Catalog Browser, Content delivery Preview, Content Experience Management, Content Portal (hulu live, sVOD), CX Dashboard  , Data Activation Framework , DATA instrumentation library, Data Portal , Developer Portal, Dictionary & Translation, Disney Edge Controller (DEC), EXD Design System, Experimentation , Fraud Management Service, Hulu Ad Manager, Hulu Ad Mission Control, Hulu Ad Revenue Processing Service, Machine Learning Dashboard, Metadata Mapping & Visualization, Partner Portal, Player Config Service, Responder Files (DATA Feature Market), SRE Dashboard, Streaming QoS Insights, Support Agent Console, Unified Messaging Platform{.small .card}


### Legacy Of Tool Innovation

Why build custom software tools? 

Disney has a rich history of building new tools that unlock creative possibilities. One famous example was the Multi-plane camera which massively accelerated animation and enabled parallax motion techniques.

![Multiplane Camera](/images/portfolio/Walt_Disney_Multiplane_Camera_2.jpeg){.fullwidth style="height:62vh;object-position: 50% 38%;"}
-->


- ![Support Agent Portal](/images/portfolio/disney-enterprise/baymax-customer.jpg)
- ![Commerce Portal](/images/portfolio/disney-enterprise/genie-offers.jpg)
- ![Commerce Portal](/images/portfolio/disney-enterprise/genie-campaign.png)
- ![Content Management](/images/portfolio/disney-enterprise/polaris-browse.jpg)
- ![Content Management](/images/portfolio/disney-enterprise/polaris-set.jpg)
- ![Metadata Browsing](/images/portfolio/disney-enterprise/tesseract-browse.jpg)
- ![Metadata Detail](/images/portfolio/disney-enterprise/tesseract-detail.jpg)
- ![Experimentation](/images/portfolio/disney-enterprise/weaponx.png)
- ![Content Dictionary](/images/portfolio/disney-enterprise/cypher-dictionary.png)
- ![Content Analytics](/images/portfolio/disney-enterprise/arc-heatmap.jpg)
- ![Content Analytics](/images/portfolio/disney-enterprise/arc-content.jpg)
- ![Messaging Portal](/images/portfolio/disney-enterprise/new/messaging-new-email.jpg)
- ![Streaming Quality](/images/portfolio/disney-enterprise/optumus-session.png)
- ![Data Portal](/images/portfolio/disney-enterprise/dataportal.png)
- ![Advertising](/images/portfolio/disney-enterprise/new/ads-mission-control-scheduling.jpg)
- ![Developer Productivity](/images/portfolio/disney-enterprise/new/dev-portal.jpg)
- ![Content Management](/images/portfolio/disney-enterprise/maestro.png)
- ![Content Portal](/images/portfolio/disney-enterprise/new/content-portal-episode.jpg)


- ![Metadata Detail](/images/portfolio/disney-enterprise/tesseract-detail.jpg) {.col4 .contain}
- ![Metadata Portal](/images/portfolio/disney-enterprise/new/knowsmore.jpg) {.col4 .contain}
{.gallery}
{% endcomment %}
