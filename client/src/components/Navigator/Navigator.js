import React, { useEffect, useState } from 'react';
import { Navbar, Button, Nav, Form, FormControl } from 'react-bootstrap';
import { LinkContainer} from 'react-router-bootstrap';
import Cookies from 'js-cookie';
import { login, refreshToken, getMe } from '../../api';
import './Navigator.css';
import { useHistory } from 'react-router-dom';

export default function Navigator(props) {
   const [user, setUser] = useState("");
   const [searchInput, setSearchInput] = useState("");

   const history = useHistory();

   const search = ev => {
      ev && ev.preventDefault();
      history.push(`/details?q=${searchInput}`);
      window.scrollTo(0, 0);
   }

   useEffect(() => {
      if (Cookies.get('expiry_date') && Cookies.get('access_token') && Cookies.get('refresh_token')) {
         if (parseInt(Cookies.get('expiry_date')) < Date.now())
            refreshToken();
         
         getMe(me => setUser(me.display_name));
      }
   }, []);

   return (
      <Navbar>
         <Navbar.Brand href='/'>
            <span className="fa fa-music">HOME</span>
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
            <FormControl placeholder='search track' 
             onChange={ev => setSearchInput(ev.target.value)}/>
            <Button onClick={search} id='search-button'>SEARCH</Button>
         </Form>
         {user
          ? <b>Hello, {user}</b>
          : <Button onClick={login}>LOGIN</Button>
         }
      </Navbar>
   );
}