---
layout: layout.html
bodyclass: about
title: Design & Product Leadership
description: Brian McConnell is a design executive with a unique background as a designer, founder, product manager, and engineer. He builds sustainable businesses by designing products that meet real human needs.
permalink: /about/
cssfile: "css/pages/about.css"
---

{% section "intro","" %}

# Making products that are useful to people.

My unique career path has pivoted between design, product, and engineering thanks to an entrepreneurial instinct to run towards ~~problems~~ opportunities. The common thread has been using Design to deliver through ambiguity at any scale. 

Design has an incredible power to give form to ideas. The process of **listening, making, and collaborating** unlocks critical thinking for everyone. 

[CV & Resumé](/images/uploads/Brian_McConnell-Resume_2025.pdf)

{% endsection %}


1. [Design Principles](#principles) 
2. [Design Storytelling](#process)
3. [Design Leadership](#leadership) 

{.sticky-nav}

{% include "_principles.md" %}

{% include "_process.md" %}

{% include "_leadership.md" %}

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