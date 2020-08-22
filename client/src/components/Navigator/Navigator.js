import React, {useEffect, useState, Component} from 'react';
import {Navbar, Button, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import queryString from 'query-string';
import Cookies from 'js-cookie'

export default function Navigator(props) {
   const [user, setUser] = useState("");


   // priority show name, refresh, show login button
   useEffect(() => {
      // never logged in, give user login button
      if (!Cookies.get('expiry_date')) {
         return;
      }
      else {
         console.log(`exp=${parseInt(Cookies.get('expiry_date'))} now=${Date.now()}`)
         console.log(`time remaining=${(parseInt(Cookies.get('expiry_date')) - Date.now()) / 1000}`)
         
         //expired access token, must refresh
         if (parseInt(Cookies.get('expiry_date')) < Date.now()) {
            console.log('refreshing bc expired token')
            window.location.assign('http://localhost:3000/refresh?' + queryString.stringify({refresh_token: Cookies.get('refresh_token')}))
         }
         // active access token, get user info
         let query = queryString.stringify({access_token: Cookies.get('access_token')})
         fetch('http://localhost:3000/me?' + query)
         .then(res => res.json())
         .then(data => {
            console.log(`accessing /me, result=${JSON.stringify(data, null, 2)}`)
            setUser(data.display_name)
         })
      }
      console.log(`access_token=${Cookies.get('access_token')}`)

   }, [])

   // if can't log in, show login button

   return (
      <Navbar>
         <Navbar.Brand href='/'>HOME</Navbar.Brand>
         <Navbar.Toggle/>
         <Navbar.Collapse>
            <Nav>
               <LinkContainer to='/details'>
                  <Nav.Link>DETAILS</Nav.Link>
               </LinkContainer>
               <LinkContainer to='/recommender'>
                  <Nav.Link>RECOMMENDER</Nav.Link>
               </LinkContainer>
            </Nav>
         </Navbar.Collapse>
         {/* <Button onClick={() => window.location.assign('http://localhost:3000/login')}>login to access playlists</Button>
         <Button onClick={() => window.location.assign('http://localhost:3000/refresh?' + queryString.stringify({refresh_token: Cookies.get('refresh_token')}))}>refresh token</Button> */}
         {/* <Button onClick={() => fetch('http://localhost:3000/login').then(res => console.log(`test button res=${res}`))}>test</Button> */}
         {user && <p>logged in as {user}</p>}
      </Navbar>
   )
}