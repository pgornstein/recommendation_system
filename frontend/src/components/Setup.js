import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStateWithSessionStorage = (key) => {
  const [data, setData] = useState(sessionStorage.getItem(key) || "");
  return [data, setData]
}

export default function Setup() {

  useEffect(() => {
    async function redirect() {
      if (token !== "") {
        console.log(token)
        const data2 = {token: token};
        const configs2 = {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(data2),
          headers: {"Content-Type": "application/json"}
        };
        const response_package2 = await fetch("http://localhost:8000/api/is_setup/", configs2)
        const response2 = await response_package2.json()
        console.log(response2)
        if (response2.connected && response2.isSetup) history.push("/reel");
        else history.push("/setup");
      } 
    }
    redirect()
  }, [])

  const [action, setAction] = useState(false);
  const [adventure, setAdventure] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [childrens, setChildrens] = useState(false);
  const [comedy, setComedy] = useState(false);
  const [crime, setCrime] = useState(false);
  const [documentary, setDocumentary] = useState(false);
  const [drama, setDrama] = useState(false);
  const [fantasy, setFantasy] = useState(false);
  const [filmNoir, setFilmNoir] = useState(false);
  const [horror, setHorror] = useState(false);
  const [musical, setMusical] = useState(false);
  const [mystery, setMystery] = useState(false);
  const [romance, setRomance] = useState(false);
  const [sciFi, setSciFi] = useState(false);
  const [thriller, setThriller] = useState(false);
  const [war, setWar] = useState(false);
  const [western, setWestern] = useState(false);

  const [requestSuccess, setRequestSuccess] = useState(true);

  const [token, setToken] = useStateWithSessionStorage('token');
  const history = useHistory();

  const setGenres = async () => {
    console.log("This");

    let genres = [];

    if (action) genres.push("Action");
    if (adventure) genres.push("Adventure");
    if (animation) genres.push("Animation");
    if (childrens) genres.push("Children's");
    if (comedy) genres.push("Comedy");
    if (crime) genres.push("Crime");
    if (documentary) genres.push("Documentary");
    if (drama) genres.push("Drama");
    if (fantasy) genres.push("Fantasy");
    if (filmNoir) genres.push("Film-Noir");
    if (horror) genres.push("Horror");
    if (musical) genres.push("Musical");
    if (mystery) genres.push("Mystery");
    if (romance) genres.push("Romance");
    if (sciFi) genres.push("Sci-Fi");
    if (thriller) genres.push("Thriller");
    if (war) genres.push("War");
    if (western) genres.push("Western");

    const data = {
      genres: genres,
      token: token
    }
    const configs = { 
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    };
    const response_package = await fetch("http://localhost:8000/api/add_genres/", configs);
    const response = await response_package.json();
    setRequestSuccess(response.connected);
    if (requestSuccess) history.push("/reel");
  }

  return (
    <div style={{justifyContext: "center", alignItems: "center", textAlign: "center"}}>
      <h1 style={{textAlign: "center"}}>Select one or more genres for the system to make recommendations from</h1>
      <FormGroup row >
        <FormControlLabel
          control={<Checkbox checked={action} onChange={() => setAction(!action)} name="action" />}
          label="Action"
        />
        <FormControlLabel
          control={<Checkbox checked={adventure} onChange={() => setAdventure(!adventure)} name="adventure" />}
          label="Adventure"
        />
        <FormControlLabel
          control={<Checkbox checked={animation} onChange={() => setAnimation(!animation)} name="animation" />}
          label="Animation"
        />
        <FormControlLabel
          control={<Checkbox checked={childrens} onChange={() => setChildrens(!childrens)} name="childrens" />}
          label="Children's"
        />
        <FormControlLabel
          control={<Checkbox checked={comedy} onChange={() => setComedy(!comedy)} name="comedy" />}
          label="Comedy"
        />
        <FormControlLabel
          control={<Checkbox checked={crime} onChange={() => setCrime(!crime)} name="crime" />}
          label="Crime"
        />
        <FormControlLabel
          control={<Checkbox checked={documentary} onChange={() => setDocumentary(!documentary)} name="documentary" />}
          label="Documentary"
        />
        <FormControlLabel
          control={<Checkbox checked={drama} onChange={() => setDrama(!drama)} name="drama" />}
          label="Drama"
        />
        <FormControlLabel
          control={<Checkbox checked={fantasy} onChange={() => setFantasy(!fantasy)} name="fantasy" />}
          label="Fantasy"
        />
      </FormGroup>
      <FormGroup row>
      <FormControlLabel
        control={<Checkbox checked={filmNoir} onChange={() => setFilmNoir(!filmNoir)} name="filmNoir" />}
        label="Film-Noir"
      />
      <FormControlLabel
        control={<Checkbox checked={horror} onChange={() => setHorror(!horror)} name="horror" />}
        label="Horror"
      />
      <FormControlLabel
        control={<Checkbox checked={musical} onChange={() => setMusical(!musical)} name="musical" />}
        label="Musical"
      />
      <FormControlLabel
        control={<Checkbox checked={mystery} onChange={() => setMystery(!mystery)} name="mystery" />}
        label="Mystery"
      />
      <FormControlLabel
        control={<Checkbox checked={romance} onChange={() => setRomance(!romance)} name="romance" />}
        label="Romance"
      />
      <FormControlLabel
        control={<Checkbox checked={sciFi} onChange={() => setSciFi(!sciFi)} name="sciFi" />}
        label="Sci-Fi"
      />
      <FormControlLabel
        control={<Checkbox checked={thriller} onChange={() => setThriller(!thriller)} name="thriller" />}
        label="Thriller"
      />
      <FormControlLabel
        control={<Checkbox checked={war} onChange={() => setWar(!war)} name="war" />}
        label="War"
      />
      <FormControlLabel
        control={<Checkbox checked={western} onChange={() => setWestern(!western)} name="western" />}
        label="Western"
      />
    </FormGroup>
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      onClick={e => {
        e.preventDefault();
        setGenres();
      }}
    >
      Submit
    </Button>
  </div>
    
  )
}