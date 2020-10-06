import React, {useEffect, useState, Component} from 'react';
import {Navbar, Button, Nav, Form, FormControl} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import queryString from 'query-string';
import Cookies from 'js-cookie'
// import { baseURL, getMe } from '../../api'
import { getMe } from '../../api'
import './Navigator.css';
import { useHistory } from 'react-router-dom';

export default function Navigator(props) {
   const [user, setUser] = useState("");
   const [searchInput, setSearchInput] = useState("");

   const history = useHistory();

   // NOTE: temp hack, rm later
   const baseURL = process.env.NODE_ENV === 'production' ?
    process.env.REACT_APP_API_URL :
    "http://localhost:3000/";

   console.log(`in Navigator, process.env=${process.env}`)

   // TODO: fix refresh

   // priority show name, refresh, show login button
   useEffect(() => {
      // never logged in, give user login button
      if (!Cookies.get('expiry_date')) {
         console.log('user never logged')
      }
      else {
         console.log(`exp=${parseInt(Cookies.get('expiry_date'))} now=${Date.now()}`)
         console.log(`time remaining=${(parseInt(Cookies.get('expiry_date')) - Date.now()) / 1000}`)
         
         //expired access token, must refresh
         if (parseInt(Cookies.get('expiry_date')) < Date.now()) {
            console.log('refreshing bc expired token')
            window.location.assign(`${baseURL}refresh?${queryString.stringify({refresh_token: Cookies.get('refresh_token')})}`)
         }
         
         getMe(me => setUser(me.display_name))
      }
      console.log(`access_token=${Cookies.get('access_token')}`)

   }, [])

   // if can't log in, show login button

   let search = ev => {
      ev && ev.preventDefault();
      history.push(`/details?q=${searchInput}`);
      window.scrollTo(0, 0);
   }

   let login = () => {
      console.log(`logging in, assigning to ${baseURL}login`)
      window.location.assign(`${baseURL}login`)
   }

   // NOTE: don't use query param in refresh/login

   return (
      <Navbar>
         <Navbar.Brand href='/'>
            <span className="fa fa-music"/>
            {"     "}
            HOME
         </Navbar.Brand>
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
         <Form inline onSubmit={search}>
            <FormControl placeholder='search track' onChange={ev => setSearchInput(ev.target.value)}></FormControl>
            <Button onClick={search} id='search-button'>search</Button>
         </Form>
         {/* <Button onClick={() => window.location.assign(`${baseURL}refresh?${queryString.stringify({refresh_token: Cookies.get('refresh_token')})}`)}>refresh token</Button> */}
         
         {user ? 
         <p>logged in as {user}</p>
         :
         <Button onClick={login}>login to access playlists</Button>
         }
      </Navbar>
   )
}