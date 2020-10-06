import React, {useEffect, useContext } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {PlayerContext} from '../contexts'

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
      <div>
         <Card style={{cursor: 'pointer', display:'block'}} onClick={
          data.onCardClick ? () => {console.log(`calling cardclick data=${JSON.stringify(data)}`); data.onCardClick(data);} : goToDetails}>
            <img src={data.imgSrc} width='200' height='200'/>
            {/* <span style={{float:'right'}}> */}
            <span>
               <b>{data.name}</b> by: {data.artists.map(artist => artist.name).join(', ')} id={data.id}
            </span>
            <div>
               <Button className='fa fa-play' onClick={() => setId(data.id)}>      Play</Button>
               <Button className='fa fa-info' onClick={goToDetails}>      Details</Button>
               <Button className='fa fa-spotify' onClick={openInSpotify}>      Spotify</Button>
            </div>
         </Card>
         
      </div>
   )
}