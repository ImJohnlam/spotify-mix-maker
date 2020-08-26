import React, {useEffect, useState, useContext} from 'react';
import {Form, FormGroup, FormControl, Button, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getTrack, search } from '../../api'
import { PlayerContext } from '../contexts'
import queryString from 'query-string';
import { SimpleTrack }  from '../components'

const TrackDetails = (props) => {
   let [id, setId] = useContext(PlayerContext)
   console.log(`track=${JSON.stringify(props.track, null, 2)}`);

   const track = props.track

   return (
      <Card>
         <img src={track.album.images[0].url} width='200' height='200'/>
         <Card.Body>
            {track.name} by: {track.artists.map(artist => artist.name).join(', ')} id={track.id}
            <ul>
               <li>key = {track.classical}</li>
               <li>camelot = {track.camelot}</li>
               <li>duration = {track.duration_min}</li>
               <li>bpm = {track.bpm}</li>
            </ul>
            <Button onClick={() => setId(track.id)}>Play</Button>
            <Button onClick={() => window.open(track.external_urls.spotify)}>Spotify</Button>
         </Card.Body>
      </Card>
   )
}

export default function Details(props) {
   const [track , setTrack] = useState({})
   const [searchInput, setSearchInput] = useState('')
   const [searchRes, setSearchRes] = useState([])

   const path = 'details';
   let history = useHistory();

   useEffect(() => {
      const urlSplit = window.location.pathname.split('/')
      const id = urlSplit[urlSplit.length - 1];

      console.log(`details pathname: ${window.location.pathname} id=${id}`)
      if (id !== path) {
         getTrack(id, detailedTrack => {
            setTrack(<TrackDetails track={detailedTrack}></TrackDetails>)
         })
      }
   }, [window.location.pathname])

   let handleChange = ev => setSearchInput(ev.target.value)
   
   let submit = (ev) => {
      let query = queryString.stringify({
         q: searchInput,
         type: 'track'
      })

      ev.preventDefault()

      search(query, tracks => {
         setSearchRes(tracks.map((track, idx) => <SimpleTrack data={track} key={idx}/>))
      });
   }

   return (
      <section className='container'>
         <h1> DETAILS </h1>
         {Object.keys(track).length && track !== {} ? track : <p>NO TRACK</p>}
         <Button onClick={() => history.push(`/${path}/4Oun2ylbjFKMPTiaSbbCih`)}>TEST GO TO PATH</Button>
         <Form onSubmit={submit}>
            <FormGroup>
               <FormControl placeholder="search track" onChange={handleChange}/>
            </FormGroup>
            <Button onClick={submit}>Search</Button>
         </Form>
         {searchRes}
      </section>
   )
}