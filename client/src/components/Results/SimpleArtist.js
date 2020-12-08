import React from 'react';
import { Button, Card } from 'react-bootstrap';

export default props => {
   const data = props.data;
   const openInSpotify = () => window.open(data.external_urls.spotify);
   
   return (
      <div>
         <Card style={{display:'block', margin: '10px 10px 10px 10px'}}>
            <img 
             src={data.imgSrc}
             width='200' 
             height='200'
             style={{cursor: 'pointer'}}
             onClick={data.onCardClick ? () => data.onCardClick(data) : openInSpotify}/>
            <span style={{'fontSize':'large'}}>
               <b>{data.name}</b> {data.genres.length ? `genres: ${data.genres.join(', ')}` : ''}
            </span>
            <div>
               <Button className='fa fa-spotify res-button' onClick={openInSpotify}>Spotify</Button>
            </div>
         </Card>    
      </div>
   );
}