import React, {useEffect, useContext } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {PlayerContext} from '../contexts'
import './SimpleTrack.css'

export default props => {
   let [id, setId] = useContext(PlayerContext)
   let history = useHistory();
   let data = props.data;

   let goToDetails = () => {
      history.push(`/details/${data.id}`);
      window.scrollTo(0, 0)
   }

   let openInSpotify = () => window.open(data.external_urls.spotify)

   // TODO: change buttons to <a> or img
   // TODO: rm onCardClick
   // NOTE: consider Nav/tabs for more track details
   return (
      <Card style={{display:'block', margin:'10px 10px 10px 10px'}}>
         <img
            src={data.imgSrc}
            width='200' height='200'
            style={{cursor: 'pointer'}}
            onClick={data.onCardClick ? () => {console.log(`calling cardclick data=${JSON.stringify(data)}`); data.onCardClick(data);} : goToDetails}
            />
         <span style={{'fontSize':'large'}}>
            <b>{data.name}</b>{` by: ${data.artists.map(artist => artist.name).join(', ')}`}
         </span>
         <div>
            <Button className='fa fa-play res-button' onClick={() => setId(data.id)}>      Play</Button>
            <Button className='fa fa-info res-button' onClick={goToDetails}>      Details</Button>
            <Button className='fa fa-spotify res-button' onClick={openInSpotify}>      Spotify</Button>
         </div>
      </Card>
   )
}