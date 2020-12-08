import React, {useEffect, useState, useContext} from 'react';
import {Form, FormGroup, FormControl, Button, Card, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getTrack, search } from '../../api'
import { PlayerContext } from '../contexts'
import queryString from 'query-string';
import { SimpleTrack }  from '../components'

const TrackDetails = (props) => {
   const [id, setId] = useContext(PlayerContext)
   const data = props.data

   const openInSpotify = () => window.open(data.external_urls.spotify)

   return (
      <Card style={{display:'block', margin:'10px 10px 10px 10px'}}>
         <img src={data.imgSrc} width='200' height='200'/>
         <Card.Body>
            <span style={{'fontSize':'large'}}>
               <b>{data.name}</b>{` by: ${data.artists.map(artist => artist.name).join(', ')}`}
            </span>
            <Row>
               <Col>
                  <ul>
                     <li>Key = {data.classical}</li>
                     <li>Camelot = {data.camelot}</li>
                     <li>Duration = {data.duration_min}</li>
                     <li>BPM = {data.bpm}</li>
                  </ul>
               </Col>
               <Col>
                  <ul>
                     <li>Danceability = {data.danceability}</li>
                     <li>Energy = {data.energy}</li>
                     <li>Loudness = {data.loudness}</li>
                     <li>Speechiness = {data.speechiness}</li>
                     <li>Acousticness = {data.acousticness}</li>
                     <li>Instrumentalness = {data.instrumentalness}</li>
                     <li>Liveness = {data.liveness}</li>
                     <li>Happiness = {data.valence}</li>
                  </ul>
               </Col>
            </Row>
            
            <div>
               <Button className='fa fa-play res-button' onClick={() => setId(data.id)}>      Play</Button>
               <Button className='fa fa-spotify res-button' onClick={openInSpotify}>      Spotify</Button>
            </div>
         </Card.Body>
      </Card>
   )
}

export default function Details(props) {
   const [track , setTrack] = useState({});
   const [searchInput, setSearchInput] = useState('');
   const [searchRes, setSearchRes] = useState([]);

   const path = 'details';
   let history = useHistory();

   const submit = (ev) => {
      const path = window.location.pathname || ""
      ev.preventDefault()

      history.push(`${path}?q=${searchInput}`)
   }

   useEffect(() => {
      const urlSplit = window.location.pathname.split('/')
      const id = urlSplit[urlSplit.length - 1];

      console.log(`details pathname: ${window.location.pathname} id='${id}'`)
      if (id !== path) {
         getTrack(id, detailedTrack => {
            setTrack(<TrackDetails data={detailedTrack}></TrackDetails>)
         })
      }
   }, [window.location.pathname]);

   useEffect(() => {
      let query;
      if (window.location.search) {
         query = queryString.stringify({
            q: (queryString.parse(window.location.search)).q,
            type: 'track'
         });
         console.log(`searching for results, q=${query.q}`)
         console.log(queryString.parse(window.location.search))
         search(query, tracks => {
            setSearchRes(tracks.map((track, idx) => <SimpleTrack data={track} key={idx}/>))
         });
      }
   }, [window.location.search]);
   
   return (
      <section className='container'>
         <h1> Track Details </h1>
         <h2>Usage:</h2>
         <ol className='border border-secondary'>
            <li>Search for a track</li>
            <li>Click on image of the search result to view details</li>
         </ol>
         {Object.keys(track).length && track !== {} ? track : ""}
         {/* <Button onClick={() => history.push(`/${path}/4Oun2ylbjFKMPTiaSbbCih`)}>TEST GO TO PATH</Button> */}
         <Form onSubmit={submit}>
            <FormGroup>
               <FormControl placeholder="search track" onChange={ev => setSearchInput(ev.target.value)}/>
            </FormGroup>
            <Button onClick={submit}>SEARCH</Button>
         </Form>
         {searchRes}
      </section>
   );
}