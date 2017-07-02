---
layout: product
lang: both
Type: product
---

# corn-player
Another jQuery HTML5 player with subtitle and track support.

## Features
CornPlayer provided some features
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
</video>
```

- you can also initial it later by call `.cornPlayer()` function to your jQuery element, for example:

```javascript
$('video').cornPlayer();
```
- after initialized, your video element ready to use cornPlayer function

## Usage
CornPlayer provided serveral usage and allow you to customize your player.

### Subtitle & Skipper
to add subtitle or skipper to you video player, add any HTML tag inside your video tag, and add serveral attribute to make it work

|Attribute|Accepted Value|Description|
|-|-|-|
|`kind`|`subtitle` or `skip`|initial and create subtitle or skipper to the video|
|`name`|`subtitle or skipper name`|set subtitle/skipper name|
|`src`|`PATH`|Path for subtitle(srt, ass, vtt)|
|`srclang`|`two-letter language code`|set subtitle language|
|`sec`|`time in second`|set skipper language|
|`label`|`skipper label text`|set skipper language|

<br>For example:

```html
<video src="video/bunny.mp4" data-role="corn-player">
	<span kind="subtitle" name="Malay" src="sub/sub.vtt" srclang="ms"></span>
	<span kind="subtitle" name="English" src="sub/sub.vtt" srclang="en"></span>
	<span kind="skip" name="start" label='Start' sec="2"></span>
	<span kind="skip" name="middle" label='Middle Video' sec="30"></span>
	<span kind="skip" name="english2" label='Tird last' sec="57"></span>
</video>
```

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


## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/fadhilnapis/corn-player. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

This plugin is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
