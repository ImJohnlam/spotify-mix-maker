import React, { useState, createContext } from 'react'

const RecommenderContext = createContext();
const RecommenderContextProvider = props => {
   const [seeds, setSeeds] = useState({})
   const [filters, setFilters] = useState({})
   const [curPlaylistID, setCurPlaylistID] = useState('')
   const [playlistUpdate, setPlaylistUpdate] = useState('')

   const getRecState = type => {
      switch (type) {
         case 'SEEDS':
            return seeds;
         case 'NUM_SEEDS':
            return Object.keys(seeds).reduce((acc, field) => acc + (seeds[field] ? seeds[field].length : 0), 0);
         case 'FILTERS':
            return filters;
         case 'CUR_PLAYLIST_ID':
            return curPlaylistID;
         case 'PLAYLIST_UPDATE':
            return playlistUpdate;
         default:
            throw Error();
      }
   }

   const setRecState = (type, state) => {
      switch (type) {
         case 'SEEDS':
            setSeeds(state);
            break;
         case 'FILTERS':
            setFilters(state);
            break;
         case 'CUR_PLAYLIST_ID':
            setCurPlaylistID(state);
            break;
         case 'PLAYLIST_UPDATE':
            setPlaylistUpdate(state);
            break;
         default:
            throw Error();
      }
   }

   return (
      <RecommenderContext.Provider value={[getRecState, setRecState]}>
         {props.children}
      </RecommenderContext.Provider>
   )
}

export { RecommenderContext, RecommenderContextProvider }