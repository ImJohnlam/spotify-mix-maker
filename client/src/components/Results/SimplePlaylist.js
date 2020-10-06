import React, {useEffect, useContext } from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import {PlayerContext} from '../contexts'

export default props => {
   let [id, setId] = useContext(PlayerContext)
   let history = useHistory();
   let data = props.data;

   let openInSpotify = () => window.open(data.external_urls.spotify)

   // TODO: change buttons to <a> or img
   // TODO: rm onCardClick
   // NOTE: consider Nav/tabs for more track details
   return (
      <div>
         <Card style={{display:'block', margin:'10px 10px 10px 10px'}}>
            <img
             src={data.imgSrc} 
             width='200' 
             height='200'
             style={{cursor: 'pointer'}} 
             onClick={data.onCardClick ? () => data.onCardClick(data) : openInSpotify}/>
            <span style={{'fontSize':'large'}}>
               <b>{data.name}</b>
            </span>
            <div>
               <Button className='fa fa-spotify res-button' onClick={openInSpotify}>Spotify</Button>
            </div>
         </Card>
      </div>
   )
}