---
layout: layout-micro.html
bodyclass: links inverse
title: Links
header: false
---

![Portrait of Brian](/images/profile/mrbmc-20241121.jpeg){.portrait}

## {{site.title}}

{{site.moniker}}

* <a href="#" data-part1="b" data-part2="brianmcconnell" data-part3="me" data-part4="Website inquiry" class="button link-email">{% include "images/social-icons/email.svg" %} Email</a>
* <a href="https://www.linkedin.com/in/mrbmc" class="button link-linkedin">{% include "images/social-icons/linkedin.svg" %} LinkedIn</a>
* <a href="https://github.com/mrbmc" class="button link-github">{% include "images/social-icons/github.svg" %} Github</a>
* <a href="https://adplist.org/mentors/brian-mcconnell" class="button link-adplist">{% include "images/social-icons/adplist.svg" %} ADPList</a>
* <a href="https://bsky.app/profile/mrbmc.bsky.social" class="button link-bluesky">{% include "images/social-icons/bluesky.svg" %} BlueSky</a>
* <a href="https://www.strava.com/athletes/773650" class="button link-strava">{% include "images/social-icons/strava.svg" %} Strava</a>
{.links}

<style type="text/css">
	main p { text-align:center; }
	main>h1,main>h2,main>h3,main>h4 { text-align: center; }
	.portrait {
		width:38vw;
		height:38vw;
		max-width: 8rem;
		max-height: 8rem;
		border-radius:50%;
	}
	ul.links {
		list-style: none;
	}
	ul.links li {
		margin: 0 0 1rem 0;
	}
	.links a.button {
		display: block;
		background: var(--brand-color);
		color: var(--on-brand-color);
		text-align: center;
	}
	ul.links li svg {
		width: 1.2rem;
		height: 1.38rem;
		vertical-align: middle;
		margin-right: 0.5rem;
	}
</style>

<script type="text/javascript" language="javascript">
function initEmails(){
    Array.from(document.getElementsByClassName('link-email')).map(link => {
      var attrs = link.dataset;
      link.setAttribute(
        "href",
        `mailto:${attrs.part1}@${attrs.part2}.${attrs.part3}?subject=${attrs.part4}`
      );
  })
}
function initAnimations() {
    Array.from(document.getElementsByClassName('blur-in')).map(element => {
        element.classList.toggle('in',true);
    });
    Array.from(document.getElementsByClassName('fade-in')).map(element => {
        element.classList.add('in',true);
    });
};
window.addEventListener('load', function(e) {
    "use strict";
    initEmails();
    initAnimations();
},false);

</script>