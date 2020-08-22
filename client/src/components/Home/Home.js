import React, {useEffect, useState } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getTop } from '../../api'
import { SimpleTrack }  from '../components'

export default function Home(props) {
   const [tracks, setTracks] = useState([])
   let history = useHistory();

   useEffect(() => { 
      getTop(topTracks => {
         setTracks(topTracks.map((track, idx) => <SimpleTrack track={track} key={idx}/>))
      })
   }, [])

   return (
      <section className='container'>
         <h1>HOME PAGE WELCOME</h1>
         <h1>INFO HERE</h1>
         <Button onClick={() => history.push('/details')}>details</Button>
         <Button onClick={() => history.push('/recommender')}>recommender</Button>
         <h1>POPULAR TRACKS RN (us top 50)</h1>
         {tracks}
      </section>
   )
}