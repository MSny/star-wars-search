import React from 'react';
import './App.css';
import axios from 'axios';
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Input,
  Button,
} from '@material-ui/core';

// import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 600,
    padding: theme.spacing.unit * 2,
  },
  starText:{
    fontFamily: 'STARWARS'
  }
});

class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      characters: [],
      error: null,
      selectedCharacter: '',
      movieInfo: {} 
    };
  }

  async componentDidMount() {
   
      const url = `data/character.json`;
      axios.get(url).then(response => this.setState({characters: response.data.characters}) );
  
    // const response = await fetch(`../data/character.json`);
    // const json = await response.json();
    // this.setState({ data: json });
  }

  


  handleChange = event => {
    this.getCharacterMovies(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
    console.log(this.state.selectedCharacter);
  };
  
  getCharacterMovies = (url) =>{
    axios.get(url).then(response => this.setState({movieInfo: response.data}) );
    console.log(this.state.movieInfo);
  }
  render() {
    console.log(this.state.characters);
    let data = this.state.characters;
    console.log("data ", data)
    let characterList;
    if (data.length > 1){
      characterList = (
        <Select
            value={this.state.selectedCharacter}
            onChange={this.handleChange}
            input={<Input name="selectedCharacter" id="character-helper" />}
          >
          <MenuItem value="">
              <em>Choose Character</em>
            </MenuItem>
            
          {data.map(character => (
             <MenuItem value={character.url}>{character.name}</MenuItem>
          ))}
         </Select>
      )
    }
    else {
      characterList = (
        <select></select>
      )
    }

    return (
      <Grid container
      direction="column"
      justify="center"
      alignItems="center">
      <Typography variant='h2' style={{fontFamily: "STARWARS"}}>STAR WARS SEARCH</Typography>
      <Grid item>
         <form autoComplete="off">
         <FormControl>
          <InputLabel htmlFor="character-helper">Character</InputLabel>
                  {characterList}

            </FormControl>
         </form>
         </Grid>
      </Grid>
    );
  }
}

export default App;
