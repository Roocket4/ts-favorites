import React from 'react';
import { Store } from './Store';
import { IAction, IEpisode } from './interfaces';
import { any } from 'prop-types';

export default function App():JSX.Element {
  const {state, dispatch} = React.useContext(Store)

  React.useEffect(() => {
    state.episodes.length === 0 && fetchDataAction()
  })

  const fetchDataAction = async () => {
    const URL = 'http://api.tvmaze.com/singlesearch/shows?q=rick-&-morty&embed=episodes'
    const data = await fetch(URL)
    const dataJSON = await data.json();
    return dispatch({
      type: 'FETCH_DATA',
      payload: dataJSON._embedded.episodes
    })
  }

  const toggleFavAction = (episode: IEpisode): IAction => {
   const episodeInFav = state.favourites.includes(episode);
   let dispatchObj = {
     type: 'ADD_FAV',
     payload: episode,
   }
   if(episodeInFav) {
     const favWithoutEpisode = state.favourites.filter((fav: IEpisode) => fav.id !== episode.id)
     dispatchObj = {
      type: 'REMOVE_FAV',
      payload: favWithoutEpisode,
   }
  }
  return dispatch(dispatchObj);
}

  return (
    <React.Fragment>
      <header className="header">
        <h1>Rick And Morty</h1>
        <p>Pick your favorite episodes!</p>
      </header>
      <section className="episode-layout">
        {state.episodes.map((episode: IEpisode) => {
          return(
            <section key={episode.id} className="episode-box">
               <img src={episode.image ? episode.image.medium : episode.name} />
              <div>{episode.name}</div>
              <section>
                <div>Season: {episode.season} Number: {episode.number}</div>
                <button type="button" onClick={() => toggleFavAction(episode)}>{state.favourites.find((fav: IEpisode) => fav.id === episode.id) ? "Unfavorite" : "Favorite"}</button>
              </section>
            </section>
          )
        })}
      </section>
    </React.Fragment>
  )
}

