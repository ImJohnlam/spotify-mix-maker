# [Spotify Mix Maker](https://spotify-mix-maker.herokuapp.com/)
## Description:
Spotify Mix Maker is a web application that leverages the [Spotify Web API](https://developer.spotify.com/documentation/web-api/reference/) to provide music makers with tools that inspire that creation of music, mixes in particular.

## Motivation:
As a producer and DJ, some problems that I face are finding inspiration and needing to know certain song attributes.

One way for musicians to overcome writer’s block is to listen to music. Other musicians’ work may inspire new ideas and different points of view. I personally find that having reference tracks prevents me from getting stuck on my own ideas.

In order to create coherent mixes, it is important to know certain characteristics of the songs being mixed, e.g. tempo and key. [Beatmatching](https://en.wikipedia.org/wiki/Beatmatching) and [harmonic mixing](https://en.wikipedia.org/wiki/Harmonic_mixing) are two fundamental DJ techniques that are used to make smooth transitions; knowing your songs well is key.

## Features:
* Embedded Spotify player
* Look up detailed song attributes
  * BPM
  * Key
  * Energy
  * Danceability
  * ...more
* Get recommendations
  * Enter up to 5 tracks, artists, and genres to receive recommended tracks related to them
  * Filter by certain song characteristics e.g. minimum tempo = 75
* Interact with your own Spotify playlists by logging in
  * Create new playlists
  * Add recommendations directly from the web app to playlist
  * Remove tracks from playlists

## Notable Technologies Used:
**Spotify API:** All music data is fetched from the Spotify API. OAuth client credentials are used to get public data e.g. song information. OAuth authorization codes, which require users to log into Spotify, are used to directly access user resources e.g. playlists, playlist tracks.

**React.js:** The frontend is a single page application implemented using React Hooks and the Context API. It fetches data from the Node.js server

**Node.js and Express.js:** The Node.js server acts as an intermediate between the Spotify API and the client. It is responsible for OAuth access token transactions and directly makes requests to Spotify.

## Design Decisions:
The Node.js server, not the React.js client, accesses the Spotify API directly: all client ids and secrets, stored on server.

Login sessions are persisted through encrypted OAuth access tokens stored as cookies to prevent exposing access tokens to potential attacks.
