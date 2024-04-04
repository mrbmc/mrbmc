---
title: Usability Testing on TV Devices
date: 2018-01-01
tags:
  - design
  - usability
  - tv
---
This article will provide you a concise guide on how we run usability tests for our apps on Apple TV, Playstation, Roku and other devices connected to your TV. There’s a lot of resources out there for testing mobile apps, websites and desktop applications. There aren’t many resources that address the specific challenges of testing the 10-foot experience (or 3 meters for the metric inclined, so named for the distance from TV to user).

Let’s assume you have a basic understanding of usability testing best practices so we can focus on the unique aspects of testing for TV. The basic practice is the same but there are a few technical and procedural gotchas that are unique to the 10-foot experience.

## Context is everything

You really need to do this in person. There are currently no remote unmoderated services for testing TV apps. If you’re not currently in a cadence of in-person interviews then you’ll need that.

Make the test environment feel like the living room environment with participants siting on a couch or comfortable chair 10 feet away from a TV.

## Designing your test

### Test On A TV

So this may seem obvious but I’ve seen people get it wrong. *You must test TV apps on a TV.*

You can’t test a TV application on a computer screen any more than you can test a mobile app on a laptop. You just can’t. The color is different, the contrast is different, the size is different and the resolution is different. There is no substitute for viewing your designs on an actual TV.

It doesn’t have to be a good TV — in fact a old cheap model might be better — but it should reasonably mimic what you’d have in a living room.

### What Level of Fidelity Do You Need?

TV apps follow the same axiom as mobile or web apps: The higher the fidelity, the more detailed the feedback.

If you test a low-fidelity wireframe, you’ll get good data and save some time. I’ve seen great results using crude Keynote decks. Testing a complete build will yield more data that’s more accurate but it requires investing in building unvalidated designs.

I wouldn’t show anything less refined than an high fidelity, user-driven prototype but I can see the argument for both ends of the spectrum.

### In Control

At BAMTECH we find that using an actual controller for the device you’re testing is a tipping point in helping users to forget they’re looking at a prototype. We’ve developed a custom prototyping framework in HTML+JS that allows us to achieve high fidelity in a week and then control a high fidelity prototype on a laptop with a device controller. [There are similar modules for Framer](https://github.com/emilwidlund/framer-joystick)

## A video is worth your backlog

We live stream video of every test to everyone on the working team: executive stakeholders, QA, product, engineers and designers.

Something magical happens when the team watches real people use the product they built. Priorities mysteriously shift, blockers evaporate, and estimates whither in the face of enthusiasm from engineers and designers to fix embarrassing problems causing customers pain.

A picture is worth 1000 words but a video is worth your whole backlog.

You should still issue a full report after the fact with pull quotes, affinity graphs and recommendations; but most of the momentum will start from the broadcast. Sometimes we create super-cut videos of the pull-quotes.

We love [Zoom.us](http://zoom.us/) to stream and record the test. Of all the video conferencing tools out there, Zoom is one of them. Zoom allows us to easily broadcast the UI that the user is seeing, capture a camera on the user’s face, support many many simultaneous viewers, and record the whole thing. It’s cheap, stable, decent video quality, and easy to use.

## Gear and Software

### Testing a prototype or app build:

1. Picture. We use a webcam to capture the participant’s face and reactions as they use the app. We like the [Ipevo Point 2](https://www.ipevo.com/prods/Point-2-View-USB-Camera) for its versatility but any old camera will do.
2. Audio. It’s really important to get loud clear audio from the participant. A lavalier / clip-on microphone is the best option. There are tons of good [options on amazon](https://www.amazon.com/Lavalier-Microphone-Professional-Recording-Interview/dp/B075MT2WYY/ref=sr_1_2?s=musical-instruments&ie=UTF8&qid=1525815228&sr=1-2&keywords=lavalier+microphone&refinements=p_36%3A1000-3000) or your A/V shop of choice.
3. Video: to record the session and stream live to our team we use the [zoom.us](http://zoom.us/) video conferencing app with a pro subscription.

### Testing builds on device

If you’re testing a build on a TV app device you’ll need a couple more secret ingredients:

1. The [El Gato HD60](https://www.elgato.com/en/gaming/game-capture-hd60)! El Gato is a gaming device routes the signal from a connected device into the computer before sending it to the TV. This enables us to record the UI the user sees.
2. HDMI splitter. I’m not telling you that an HDMI splitter will strip out most DRM protection schemes allowing you to record the output of a CTV app. But I’m not *not* saying that*.*