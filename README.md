---
layout: product
lang: both
Type: product
---

# corn-player
Another jQuery HTML5 player with subtitle and track support.

## Features
CornPlayer provied some features
- subtitle(srt, ass, vtt) support
- shortcut key
- custom player support

## Requirement 
this plugin require atleast [jQuery v1.1](https://jquery.com/) library on your website

## Installation
- clone `dist` folder on your project
- copy this code and paste to inside your HTML `head` tag and under jQuery your script:

```html
<script type="text/javascript" src="dist/js/corn.player.jquery.js"></script>
```
- to initial corn player function to your video element, you have serveral method. For the quickest way, add attribute `data-role="corn-player"` to your HTML `video` tag. For example:

```html
<video src="video/bunny.mp4" data-role="corn-player">
	<track kind="" src="">
</video>
```

- you can also initial it later by call `.cornPlayer()` function to your jQuery element, for example:

```javascript
$('video').cornPlayer();
```
- after initialized, your video element ready to use cornPlayer function

## Usage
to initial or access corn player you can use serveral option.


### Method
you can access initialized corn player by calling specific method using cornPlayer function. Call the method by using `$([jQuery Object]).cornPlayer('methodName')`:

|Parameter									|Description					|
|-------------------------------------------|-------------------------------|
|`source`[, `URL(string)`]					|set or return video url		|
|`volume`[, `0-1(Float)`]					|set or return video volume		|
|`height`[, `0-1(Float)`]					|set or return video height		|
|`width`[, `0-1(Float)`]					|set or return video width		|
|`showController`[, `0-1(Float)`]			|disable or enable video controller|
|`controller`[, `Element(jQuery Object)`]	|set video custom controller	|
|`goFullscreen`								|set video to full screen		|
|`exitFullscreen`							|exit video from full screen	|
|`toggleFullscreen`							|set or exit video full screen	|