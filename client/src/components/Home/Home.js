import React, {useEffect, useState } from 'react';
import { Button, Card, ListGroup, FormControl } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getPlaylistItems } from '../../api'
import { SimpleTrack }  from '../components'

export default function Home(props) {
   const [curPlaylistID, setCurPlaylistID] = useState('ustop50')
   const [tracks, setTracks] = useState([])
   let history = useHistory();

   const topChartsMap = {
      'ustop50': '37i9dQZEVXbLRQDuF5jeBp',
      'globaltop50': '37i9dQZEVXbMDoHDwVN2tF'
   }

   useEffect(() => { 
      getPlaylistItems(topChartsMap[curPlaylistID], '', topTracks => {
         // console.log(topTracks)
         setTracks(topTracks.map((track, idx) => <SimpleTrack data={track} key={idx}/>))
      })
   }, [curPlaylistID])

   let handleChange = ev => {
      setCurPlaylistID(ev.target.value)
   }

   return (
      <section className='container'>
         <h1>HOME PAGE WELCOME</h1>
         <h1>INFO HERE</h1>
         <Button onClick={() => history.push('/details')}>details</Button>
         <Button onClick={() => history.push('/recommender')}>recommender</Button>
         <h1>POPULAR TRACKS RN</h1>
         <FormControl as='select' onChange={handleChange} value={curPlaylistID}>
            <option value='ustop50'>US TOP 50</option>
            <option value='globaltop50'>GLOBAL TOP 50</option>
         </FormControl>
         {tracks.length ? 
         <div className='border border-primary'>
            {tracks}
         </div>
         :
         ""
         } 
         
      </section>
   )
}