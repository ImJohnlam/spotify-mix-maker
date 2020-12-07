import React, { useEffect, useState } from 'react';
import {Form, FormGroup, FormControl, Row, Col, Button, Card} from 'react-bootstrap';
import {Route, Redirect, Switch } from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import './App.css';
import Navigator from '../Navigator/Navigator'
import { Home, Recommender, Details, Player }  from '../components'
import { PlayerContext, PlayerContextProvider } from '../contexts'

export default function App(props) {
   return (
      <div>
         <Navigator/>
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
      </div>
   );
}
