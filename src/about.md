---
layout: layout.html
bodyclass: about
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
permalink: /about/
cssfile: "css/pages/about.css"
---

{% section "bio","" %}

# Hello there.

My family calls me **Brian**. My friends call me **BMC[\*](#killabmc){onclick="event.preventDefault();return false;"}**. I am a father 👧🏻 👦🏻, [husband 👩🏻](https://www.bettykang.com/), New Yorker 🗽, ️[cyclist 🚲](https://www.strava.com/athletes/773650), [divemaster 🤿](https://www.steelgills.com), short order cook 👨‍🍳, [world traveler 🌎](https://www.google.com/maps/d/u/0/edit?mid=1jAS6t-WP2zKeOYag3KsGKZtqxERvSfE), and **[digital product maker 👨‍💻](/portfolio/)**.{.large-type}

![Portrait of Brian](/images/profile/mrbmc-20241121.jpeg) {.portrait  .blur-in}

<span id="killabmc" class="tooltip">Short for "killaBMC", my genuine wu-tang-name betrothed by the GZA</span>

{% endsection %}


{% section "intro","well full-width" %}

### I love making stuff that is useful to people.

Design has an incredible power to give form to ideas. The process of **listening, making, and learning** unlocks critical thinking for everyone. 

My unique career path has pivoted between design, product, and engineering thanks to an entrepreneurial instinct to run towards ~~problems~~ opportunities. The common thread has been using design thinking to deliver through ambiguity at any scale. 

<br />

[CV & Resumé](/resume/){.button}

{% endsection %}

* [Recent Highlights](#highlights)
* [Design Leadership](#leadership) 
* [Design Principles](#principles) 
* [Design Process](#process)
{.stickynav}

### Recent Highlights{.center #highlights}

+ **2023** – Built & managed a program for [SAAS Tools at Disney](/portfolio/disney-enterprise/), yielding $100M/pa cost savings and 200% growth in AARPU.
+ **2022** – Co-authored the designer career framework, hiring playbook, and performance tools for Disney leading to a 30% reduction in attrition, and 3x decrease in hiring time.
+ **2021** – [Led product design for STAR+](https://medium.com/disney-streaming/star-from-the-ground-up-building-a-brand-new-streaming-service-for-latin-america-fbe9f5b9366a), Disney's general entertainment service in Latin America.
+ **2020** – Led the design of [Disney+ GroupWatch](/portfolio/disney-groupwatch/), a social viewing feature.
+ **2019** – Launched [Growth Design for Disney+](/portfolio/disney-growth/) & ESPN+ propelling them from **0-126M subscribers in two years**.
+ **2018** – Scaled a design team at MLB from 2 - 26 people including UX Research, Growth, Sports, and Enterprise SAAS.
+ **2016** – Led the design of streaming services for NHL, MLB, Eurosport, PGA, MLS, and more; growing MLB's streaming business toward a $4B exit.
+ **2015** – Led the team building a [patented](https://patents.google.com/patent/US20170195373A1/) podcast platform that paid creators a fair commission at [BlogTalkRadio](/portfolio/blogtalkradio/) leading to a $55M acquisition.
  
{.timeline .card}

{% include "_leadership.md" %}

{% include "_principles.md" %}

{% include "_process.md" %}

<script type="text/javascript">
window.addEventListener('load', function(e) {
    Array.from(document.getElementsByClassName('blur-in')).map(element => {
        element.classList.toggle('in',true);
    });
    Array.from(document.getElementsByClassName('fade-in')).map(element => {
        element.classList.add('in',true);
    });

    document.querySelector("a[href='#killabmc']").addEventListener('mouseover',function(event){
        const tip = document.getElementById('killabmc');
        var xposition = (event.clientX - this.offsetLeft);
        var yposition = (event.clientY - this.offsetTop);
        // tip.style.transform = "translate("+ xposition + "px," + yposition + "px)";
        // tip.style.left = "calc("+this.offsetLeft + "px - 5rem)";
        // tip.style.top = "calc("+this.offsetTop+"px - 4rem)";
        tip.style.left = (this.offsetLeft - (tip.offsetWidth / 2)) + "px";
        tip.style.top = (this.offsetTop - tip.offsetHeight) + "px";
        tip.classList.add("in");
        // console.log("debug", {
        //     "this":this,
        //     "offsetLeft":this.offsetLeft
        // });
    });
    document.querySelector("a[href='#killabmc']").addEventListener('mouseout',function(event){
        const tip = document.getElementById('killabmc');
        tip.classList.remove("in");
    });
});
</script>