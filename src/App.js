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
  Card,
  CardActions,
  CardContent,
  CardActionArea,
  Collapse,
  IconButton
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      characters: [],
      error: false,
      selectedCharacter: '',
      movieInfo: {},
      filmInfo: [], 
      showCard: false,
      expanded: false
    };
  }

  getMovieInfo(data){
    let movieArray = [];
    console.log("data", data);
    let films = data.films;
    console.log("films", films);
    films.forEach(movie => {
      axios.get(movie)
      .then(response => movieArray.push(response.data))
      .catch(error => {
        console.log(error.response)
    });
    });
    console.log("movieArray ",movieArray);
    this.setState({movieInfo: data, filmInfo: movieArray, error: false});
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  convertDate = (date) =>{
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date(date);
    return(days[now.getDay()] + ', ' + months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear());
  }

  async componentDidMount() {
   
      const url = `data/character.json`;
      axios.get(url).then(response => this.setState({characters: response.data.characters}) );
  }

  mediaCard(props) {
    const filmInfo = props.filmInfo;
    const error = props.error;
    if (error){
      return(
        <Card >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
            Error retrieving character information, please select a different character
            </Typography>
            </CardContent>
            </CardActionArea>
            </Card>
      )
    }
    else {
    return (
      <Card >
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
            {props.movieInfo.name}
            </Typography>
            <Typography component="p">
              Birth Year : {props.movieInfo.birth_year}
            </Typography>
            <Typography component="p">
              Height : {props.movieInfo.height}
            </Typography>
            <Typography component="p">
              Hair Color : {props.movieInfo.hair_color}
            </Typography>
            <Typography component="p">
              Eye Color : {props.movieInfo.eye_color}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
        
        <IconButton
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
            {this.state.expanded ? "Hide Movies" : "View Movies"}
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
        {filmInfo.map( film => (
          <CardContent>
          <Typography paragraph>Episode: {film.episode_id}, {film.title}</Typography>
          <Typography paragraph>
            <b>Summary</b>: {film.opening_crawl}
          </Typography>
          <Typography paragraph>
            <b>Released</b>: {this.convertDate(film.release_date)} | <b>Directed By</b>: {film.director}
          </Typography>
        </CardContent>
        ))}
          
        </Collapse>
      </Card>
    )
        }
  }


  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value, showCard: true });
    this.getCharacterMovies(event.target.value);

    console.log("state ",this.state);
  };
  
  getCharacterMovies(url){
    axios.get(url)
    .then(response => this.getMovieInfo(response.data))
    .catch(error => {
      this.setState({error: true})
      console.log(error.response)
    });;
    console.log(this.state.movieInfo);
  }

  
  render() {
    console.log(this.state.characters);
    let data = this.state.characters;
    const {showCard} = this.state;
    console.log("data ", data)
    let characterList;
    if (data.length > 1){
      characterList = (
        <Select
            value={this.state.selectedCharacter}
            onChange={this.handleChange}
            input={<Input name="selectedCharacter" id="character-helper" />}
            style={{minWidth: "100px"}}
          >
          <MenuItem value="" disabled={true} key="disabled">
              <em>Choose Character</em>
            </MenuItem>
            
          {data.map((character, index) => (
             <MenuItem key={index} value={character.url}>{character.name}</MenuItem>
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
      alignItems="center"
      style={{backgroundColor: "#FFFFFF"}}>
      <Typography variant='h2' style={{fontFamily: "STARWARS", margin: "1em"}}>STAR WARS SEARCH</Typography>
      <Typography component="p" style={{fontFamily: "STARWARS"}}>
        CHOOSE A CHARACTER FROM THE DROP DOWN MENU
      </Typography>
      <Grid item xs={6}>
         <form autoComplete="off">
         <FormControl>
          <InputLabel htmlFor="character-helper">Character</InputLabel>
                  {characterList}

            </FormControl>
         </form>
         </Grid>
         <br/>
         <Grid item xs={6}>
          {showCard ? this.mediaCard(this.state): null}
          </Grid>
      </Grid>
    );
  }
}

export default App;
