import React, { useEffect, useState, useContext } from 'react';
import { FormControl, Button, Card } from 'react-bootstrap';
import { RecommenderContext } from '../../contexts'
import Cookies from 'js-cookie';
import { getMe, createPlaylist, getUserPlaylists, getPlaylistItems, deleteTrackFromPlaylist } from '../../../api';
import { SimpleTrack, SimplePlaylist }  from '../../components';


export default function PlaylistTrack(props) {
   const [user, setUser] = useState("");
   const [newPlaylistName, setNewPlaylistName] = useState("");
   const [items, setItems] = useState([]);
   const [curPlaylist, setCurPlaylist] = useState(null);

   const [prevPageQuery, setPrevPageQuery] = useState(null);
   const [nextPageQuery, setNextPageQuery] = useState(null);

   const [getRecState, setRecState] = useContext(RecommenderContext);

   const prevPage = () => {
      handleGetPlaylists(prevPageQuery);
   }

   const nextPage = () => {
      handleGetPlaylists(nextPageQuery)
   }
   
   const reset = () => {
      setRecState('CUR_PLAYLIST_ID', '');
      setCurPlaylist(null);
      setPrevPageQuery(null);
      setNextPageQuery(null);
   }

   const selectPlaylist = data => {
      setRecState('CUR_PLAYLIST_ID', data.id);
      data.onCardClick = reset;
      setCurPlaylist(<SimplePlaylist data={data}/>);
      setPrevPageQuery('');
      setNextPageQuery('');
   }

   const deleteTrack = data => {
      const curPlaylistID = getRecState('CUR_PLAYLIST_ID');
      let body = {tracks: [{uri: data.uri}]};

      deleteTrackFromPlaylist(curPlaylistID, body, delRes => {
         setRecState('PLAYLIST_UPDATE', delRes);
      });
   }

   const handleCreatePlaylist = name => {
      createPlaylist({name: name}, playlist =>{
         playlist.onCardClick = reset;
         setRecState('CUR_PLAYLIST_ID', playlist.id);
         setCurPlaylist(<SimplePlaylist data={playlist}/>);
         setPrevPageQuery('');
         setNextPageQuery('');
      });
   }

   const handleGetPlaylists = query => {
      getUserPlaylists(query, pagingObj => {
         setPrevPageQuery(pagingObj.previous && pagingObj.previous.split('?')[1]);
         setNextPageQuery(pagingObj.next && pagingObj.next.split('?')[1]);

         setItems(pagingObj.items.map((playlist, idx) => {
            playlist.onCardClick = selectPlaylist;
            return <SimplePlaylist data={playlist} key={idx}/>;
         }));
      });
   }

   const handleGetTracks = query => {
      const curPlaylistID = getRecState('CUR_PLAYLIST_ID');
      getPlaylistItems(curPlaylistID, query, tracks => {
         setItems(tracks.map((track, idx) => {
            track.onCardClick = deleteTrack;
            return <SimpleTrack data={track} key={idx}/>;
         }));
      });
   }

   useEffect(() => {
      const curPlaylistID = getRecState('CUR_PLAYLIST_ID');
      if (!Cookies.get('expiry_date') || parseInt(Cookies.get('expiry_date')) < Date.now())
         return;

      getMe(me => setUser(me.display_name));
      if (curPlaylistID)
         handleGetTracks('');
      else 
         handleGetPlaylists('');

   }, [getRecState('CUR_PLAYLIST_ID'), getRecState('PLAYLIST_UPDATE')]);

   return (
      <div>
         <h1>Playlist Editor</h1>
         <div>
            <Button disabled={!prevPageQuery} onClick={prevPage}>PREV PAGE</Button>
            <Button disabled={!nextPageQuery} onClick={nextPage}>NEXT PAGE</Button>
         </div>
         <Card className='border border-secondary'>
            {user ? <b>{user}'s Playlists:</b> : ""}
            <div>Selected playlist: {curPlaylist || 'none'}</div>   
            {getRecState('CUR_PLAYLIST_ID')
             ? <div>
                  Showing tracks for this playlist:
               </div>
             : <div>
                  <FormControl placeholder="new playlist name" onChange={ev => setNewPlaylistName(ev.target.value)}/>                  
                  <Button onClick={() => handleCreatePlaylist(newPlaylistName)}>create playlist</Button>
                  <div>Showing {user}'s playlists:</div>
               </div>
            }
         </Card>
         {items.length
          ? <Card className='border border-secondary' style={{'marginTop':'10px'}}>
               {items}
            </Card>
          : ""
         }
      </div>
   )
}