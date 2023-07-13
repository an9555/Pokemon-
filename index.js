import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { List, Avatar } from "antd";
import { createSlice, configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import axios from "axios";

import "antd/dist/antd.css";

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState: {
    loading: false,
    pokemonList: [],
  },
  reducers: {
    fetchPokemonListStart(state) {
      state.loading = true;
    },
    fetchPokemonListSuccess(state, action) {
      state.loading = false;
      state.pokemonList = action.payload;
    },
    fetchPokemonListFail(state) {
      state.loading = false;
    },
  },
});

const store = configureStore({
  reducer: pokemonSlice.reducer,
  middleware: [thunk],
});

const { fetchPokemonListStart, fetchPokemonListSuccess, fetchPokemonListFail } =
  pokemonSlice.actions;

function App() {
  const dispatch = useDispatch();
  const pokemonList = useSelector((state) => state.pokemon.pokemonList);

  useEffect(() => {
    dispatch(fetchPokemonList());
  }, []);

  const fetchPokemonList = () => async (dispatch) => {
    dispatch(fetchPokemonListStart());
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
      dispatch(fetchPokemonListSuccess(response.data.results));
    } catch (error) {
      dispatch(fetchPokemonListFail());
    }
  };

  return (
    <div className="App">
      <List
        loading={useSelector((state) => state.pokemon.loading)}
        itemLayout="horizontal"
        dataSource={pokemonList}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.split('/')[6]}.png`} />
              }
              title={item.name}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default App;
