import React, { useContext } from 'react';
import { PlayerContext } from '../contexts';

export default function Player(props) {
   const [id] = useContext(PlayerContext);

   return (
      id 
       ? <iframe className='fixed-bottom'
                   src={`https://open.spotify.com/embed/track/${id}`} 
                   width="300" height="80" 
                   frameBorder="0" 
                   allowtransparency="true" 
                   allow="encrypted-media"></iframe>
       : ''
   );
}