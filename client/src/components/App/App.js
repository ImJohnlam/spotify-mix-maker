import React, { useEffect, useState } from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card} from 'react-bootstrap';
import {Route, Redirect, Switch } from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import './App.css';
import Navigator from '../Navigator/Navigator'
import { Home, Recommender, Details, Player }  from '../components'
import { PlayerContext, PlayerContextProvider } from '../contexts'
import queryString from 'query-string';
import Cookies from 'js-cookie'

function App(props) {
   console.log(`in App.js, process=env=${JSON.stringify(process.env)}`)
   // const [items, setItems] = useState([])
   // const [creds, setCreds] = useState({
   //    search: "",
   //    searchArtists: false,
   //    searchTracks: false,
   //    selectedTrack: ""
   // });

   // let handleChange = ev => {
   //    const newCreds = {...creds};

   //    switch(ev.target.type) {
   //       case 'checkbox':
   //          newCreds[ev.target.name] = ev.target.checked;
   //          break;
   //       default:
   //          newCreds[ev.target.name] = ev.target.value;
   //    }
   //    setCreds(newCreds);

   //    console.log(`changed ${ev.target.name} to 
   //     ${ev.target.type === '  ' ? ev.target.checked : ev.target.value}`)
   
   // }

   // let search = () => {
   //    let types = []
   //    if (creds.searchArtists)
   //       types.push('artist')
   //    if (creds.searchTracks)
   //       types.push('track')
   //    let query = queryString.stringify({
   //       q: creds.search,
   //       type: types.join(',')
   //    })

   //    fetch('http://localhost:3000/search?' + query)
   //    .then(res => res.json())
   //    .then(data => {
   //       console.log(JSON.stringify(data, null, 2))
   //       setItems(data.artists.items.map(artist => 
   //       (<div>
   //          <a href={artist.external_urls.spotify}>{artist.name}</a>
   //          <div>
   //             {artist.images.length && <img src={artist.images[2].url} width="200" height="200"/>}
   //          </div>
   //       </div>)
   //       ))
         
   //       data.artists.items.forEach(artist => console.log(artist.images.length && artist.images[0].url))
   //       console.log("called search")
   //    })
   // }

   return (
      <div>
         <Navigator/>
         <p>document.cookie={document.cookie}</p>
         <p>time remaining={(parseInt(Cookies.get('expiry_date')) - Date.now()) / 1000}</p>
         
         <PlayerContextProvider>
            <Switch>
               <Route exact path='/' 
               render={() => <Home/>}/>
               <Route path='/details'
               render={() => <Details/>}/>
               <Route path='/recommender'
               render={() => <Recommender/>}/>
            </Switch>
            <Player/>   
         </PlayerContextProvider>
         
         <h1>FOOTER HERE</h1>
         {/* <Button onClick={() => window.history.replaceState({}, document.title, '/test')}>test button</Button>
         <Button onClick={() => window.location.reload()}>refresh page</Button>
         <Navigator></Navigator>
         <Form>
            <FormGroup controlId="search">
               <FormControl placeholder="search spotify" name="search" onChange={handleChange}/>
            </FormGroup>
            <Form.Check name="searchArtists" label="artists" value={creds.searchArtists} onChange={handleChange}/>
            <Form.Check name="searchTracks" label="tracks" value={creds.searchTracks} onChange={handleChange}/>
         </Form>
         <Button onClick={search} disabled={!creds.searchArtists && !creds.searchTracks}>search</Button>
         <h2>search results {items.length ? `for: ${creds.search}` : ""}</h2>
         <div>{items}</div>
         <Recommender></Recommender>
         <Button onClick={getTop}>top playlists</Button> */}
      </div>
   );
}

export default App;
