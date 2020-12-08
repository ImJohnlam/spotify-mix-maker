import React, { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { PlayerContext } from '../contexts';
import './SimpleTrack.css';

export default props => {
   const [id, setId] = useContext(PlayerContext)
   const history = useHistory();
   const data = props.data;

   const goToDetails = () => {
      history.push(`/details/${data.id}`);
      window.scrollTo(0, 0);
   }

   const openInSpotify = () => window.open(data.external_urls.spotify)

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
            <Button className='fa fa-play res-button' onClick={() => setId(data.id)}>Play</Button>
            <Button className='fa fa-info res-button' onClick={goToDetails}>Details</Button>
            <Button className='fa fa-spotify res-button' onClick={openInSpotify}>Spotify</Button>
         </div>
      </Card>
   );
}