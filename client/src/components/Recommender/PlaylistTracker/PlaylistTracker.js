import React, {useEffect, useState, Component, useContext} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card} from 'react-bootstrap';
import { RecommenderContext } from '../../contexts'
import queryString from 'query-string';
import Cookies from 'js-cookie'
import { getMe, createPlaylist, getUserPlaylists, getPlaylistItems, deleteTrackFromPlaylist } from '../../../api'
import { SimpleTrack, SimplePlaylist }  from '../../components'


export default function PlaylistTrack(props) {
   const [seeds, setSeeds, calcNumSeeds, filters, setFilters, curPlaylistID,
    setCurPlaylistID, playlistUpdate, setPlaylistUpdate] = useContext(RecommenderContext)
   const [user, setUser] = useState("");
   const [newPlaylistName, setNewPlaylistName] = useState("");
   const [items, setItems] = useState([])
   const [curPlaylist, setCurPlaylist] = useState(null)

   // NOTE: might not need useState?
   const [prevPageQuery, setPrevPageQuery] = useState(null)
   const [nextPageQuery, setNextPageQuery] = useState(null)
   
   let handleCreatePlaylist = name => {
      createPlaylist({name: name}, playlist =>{
         playlist.onCardClick = reset;
         setCurPlaylistID(playlist.id)
         setCurPlaylist(<SimplePlaylist data={playlist}/>)
         setPrevPageQuery('')
         setNextPageQuery('')
      })
      
   }

   let handleGetPlaylists = query => {
      getUserPlaylists(query, pagingObj => {
         setPrevPageQuery(pagingObj.previous && pagingObj.previous.split('?')[1])
         setNextPageQuery(pagingObj.next && pagingObj.next.split('?')[1])

         console.log(JSON.stringify(pagingObj.items, null, 2))
         setItems(pagingObj.items.map((playlist, idx) => {
            playlist.onCardClick = selectPlaylist
            return <SimplePlaylist data={playlist} key={idx}/>
         }))
      })
   }

   let handleGetTracks = query => {
      getPlaylistItems(curPlaylistID, query, tracks => {
         setItems(tracks.map((track, idx) => {
            track.onCardClick = deleteTrack;
            return <SimpleTrack data={track} key={idx}/>
         }))
      })
   }

   useEffect(() => {
      if (!Cookies.get('expiry_date') || parseInt(Cookies.get('expiry_date')) < Date.now()) {
         console.log('not fetching playlists')
         return;
      }

      console.log('useEffect called')
      getMe(me => setUser(me.display_name))
      if (curPlaylistID) {
         console.log('fetch playlist tracks')

         handleGetTracks('')
      }
      else {
         console.log('fetch playlists')
         handleGetPlaylists('')
      }
   }, [curPlaylistID, playlistUpdate])
   // NOTE: playlistUpdate might be unnecessary?

   let prevPage = () => {
      // if (curPlaylistID)
      //    handleGetTracks(prevPageQuery)
      // else
         handleGetPlaylists(prevPageQuery)
   }

   let nextPage = () => {
      // if (curPlaylistID)
      //    handleGetTracks(nextPageQuery)
      // else
         handleGetPlaylists(nextPageQuery)
   }

   let reset = () => {
      setCurPlaylistID('')
      setCurPlaylist(null)
      setPrevPageQuery(null)
      setNextPageQuery(null)
   }


   let selectPlaylist = data => {
      console.log('selecting a playlist')
      setCurPlaylistID(data.id)
      data.onCardClick = reset;
      setCurPlaylist(<SimplePlaylist data={data}/>)
      setPrevPageQuery('')
      setNextPageQuery('')
   }

   let deleteTrack = data => {
      let body = {tracks: [{uri: data.uri}]}
      console.log(`deleteTrack body=${JSON.stringify(body, null, 2)}`)
      deleteTrackFromPlaylist(curPlaylistID, body, delRes => {
         console.log(`delRes=${JSON.stringify(delRes, null, 2)}`)
         setPlaylistUpdate(delRes)
      })
   }

   return (
      <div>
         <h1 onClick={() => console.log(`playlistID=${curPlaylistID}, items=${items}, curPlaylist=${JSON.stringify(curPlaylist)} prevPageQuery=${prevPageQuery}, nextPageQuery=${nextPageQuery}`)}>Playlist Editor</h1>
         <div>
            <Button disabled={!prevPageQuery} onClick={prevPage}>PREV PAGE</Button>
            <Button disabled={!nextPageQuery} onClick={nextPage}>NEXT PAGE</Button>
         </div>
      
         <Card className='border border-secondary'>
            {user ? <b>{user}'s Playlists:</b> : ""}
            <div>Selected playlist: {curPlaylist || 'none'}</div>   
            {curPlaylistID ?
            <div>
               Showing tracks for this playlist:
            </div>
            :
            <div>
               <FormControl placeholder="new playlist name" onChange={ev => setNewPlaylistName(ev.target.value)}/>                  
               <Button onClick={() => handleCreatePlaylist(newPlaylistName)}>create playlist</Button>
               <div>Showing {user}'s playlists:</div>
            </div>
            }
         </Card>
         
         {items.length
         ?
         <Card className='border border-secondary' style={{'marginTop':'10px'}}>
            {items}
         </Card>
         :
         ""
         }
         
      </div>
   )
}