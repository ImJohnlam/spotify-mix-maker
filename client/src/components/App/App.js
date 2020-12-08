import React from 'react';
import {Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import { Home, Recommender, Details, Player, Navigator }  from '../components'
import { PlayerContextProvider } from '../contexts'

export default function App(props) {
   return (
      <div>
         <Navigator/>
         <PlayerContextProvider>
            <Switch>
               <Route exact path='/' render={() => <Home/>}/>
               <Route path='/details'render={() => <Details/>}/>
               <Route path='/recommender' render={() => <Recommender/>}/>
            </Switch>
            <Player/>   
         </PlayerContextProvider>
      </div>
   );
}
