import React, { useState, createContext } from 'react'

const PlayerContext = createContext();
const PlayerContextProvider = props => {
   const [id, setId] = useState('')

   return (
      <PlayerContext.Provider value={[id, setId]}>
         {props.children}
      </PlayerContext.Provider>
   )
}

export {PlayerContext, PlayerContextProvider}