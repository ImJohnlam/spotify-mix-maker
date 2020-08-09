import React, {useEffect, useState, Component} from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button} from 'react-bootstrap';
import './App.css';
import LoginBar from './LoginBar'
import Recommender from './Recommender'
import queryString from 'query-string';
import Cookies from 'js-cookie'

function App(props) {
   const [items, setItems] = useState([])
   const [creds, setCreds] = useState({
      search: "",
      searchArtists: false,
      searchTracks: false,
      selectedTrack: ""
   });

   useEffect(() => {
      
   }, [])

   let handleChange = ev => {
      const newCreds = {...creds};

      switch(ev.target.type) {
         case 'checkbox':
            newCreds[ev.target.name] = ev.target.checked;
            break;
         default:
            newCreds[ev.target.name] = ev.target.value;
      }
      setCreds(newCreds);

      console.log(`changed ${ev.target.name} to 
       ${ev.target.type == '  ' ? ev.target.checked : ev.target.value}`)
   
   }

   let search = () => {
      let types = []
      if (creds.searchArtists)
         types.push('artist')
      if (creds.searchTracks)
         types.push('track')
      let query = queryString.stringify({
         q: creds.search,
         type: types.join(',')
      })

      fetch('http://localhost:3000/search?' + query)
      .then(res => res.json())
      .then(data => {
         console.log(JSON.stringify(data, null, 2))
         setItems(data.artists.items.map(artist => 
         (<div>
            <a href={artist.external_urls.spotify}>{artist.name}</a>
            <div>
               {artist.images.length && <img src={artist.images[2].url} width="200" height="200"/>}
            </div>
         </div>)
         ))
         
         data.artists.items.forEach(artist => console.log(artist.images.length && artist.images[0].url))
         console.log("called search")
      })
   }

   let getTop = () => {
      fetch('http://localhost:3000/top')
      .then(res => res.json())
      .then(data => {
         console.log('top')
      })
      .catch()
   }
   return (
      <div>
         <p>document.cookie={document.cookie}</p>
         <p>time remaining={(parseInt(Cookies.get('expiry_date')) - Date.now()) / 1000}</p>
         { creds.searchArtists ? <iframe src="https://open.spotify.com/embed/track/0MiZuvQDXtd9lGAxZa8Syi" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe> : "" }
         <p>player</p>
         <Button onClick={() => window.history.replaceState({}, document.title, '/test')}>test button</Button>
         <Button onClick={() => window.location.reload()}>refresh page</Button>
         <LoginBar></LoginBar>
         <div>p</div>
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
         <Button onClick={getTop}>top playlists</Button>

      </div>
   );
}

export default App;
