import React, { useState, createContext } from 'react'

const RecommenderContext = createContext();
const RecommenderContextProvider = props => {
   const [recSettings, setRecSettings] = useState({
      filters: {
         limit: 20,
         seed_artists: [],
         seed_genres: [],
         seed_tracks: [],
         min_acousticness: '',
         max_acousticness: '',
         target_acousticness: '',
         min_danceability: '',
         max_danceability: '',
         target_danceability: '',
         min_duration_ms: '',
         max_duration_ms: '',
         target_duration_ms: '',
         min_energy: '',
         max_energy: '',
         target_energy: '',
         min_instrumentalness: '',
         max_instrumentalness: '',
         target_instrumentalness: '',
         min_key: '',
         max_key: '',
         target_key: '',
         min_liveness: '',
         max_liveness: '',
         target_liveness: '',
         min_loudness: '',
         max_loudness: '',
         target_loudness: '',
         min_mode: '',
         max_mode: '',
         target_mode: '',
         min_popularity: '',
         max_popularity: '',
         target_popularity: '',
         min_speechiness: '',
         max_speechiness: '',
         target_speechiness: '',
         min_tempo: '',
         max_tempo: '',
         target_tempo: '',
         min_valence: '',
         max_valence: '',
         target_valence: ''
      }
   })

   return (
      <RecommenderContext.Provider value={[recSettings, setRecSettings]}>
         {props.children}
      </RecommenderContext.Provider>
   )
}

export { RecommenderContext, RecommenderContextProvider }