"use client";

//Imports
import { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Autocomplete,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Snackbar,
  Alert,
  Box,
  Skeleton,
  SnackbarCloseReason,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import CachedIcon from '@mui/icons-material/Cached';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import styles from './page.module.css';
import { JokeResponse, Language } from "./types";

export default function Translator() {
  // Consolidating related states
  const [state, setState] = useState({
    allJoke: [] as string[],
    languages: [] as Language[],
    selectedLanguage: null as Language | null,
    translatedJoke: "",
    toastr: false,
    translateSkeleton: false,
    jokeSkeleton: false,
  });

  // Initial data load
  useEffect(() => {
    async function initializeData() {
      await Promise.all([fetchJoke(), fetchLanguages()]);
    }
    initializeData();
  }, []);

  // fetch and set available languages
  const fetchLanguages = useCallback(async () => {
    try {
      const response = await fetch('/api/getLanguages');
      const data: Language[] = await response.json();
      setState(prevState => ({
        ...prevState,
        languages: data.sort((a, b) => a.name.localeCompare(b.name)),
      }));
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  }, []);

  // Consolidated function to format both single and multiple jokes
  const formatJokes = (jokes: any | any[]) => {
    if (Array.isArray(jokes)) {
      return jokes.map(x => {
        if (x.type === 'twopart' && x.setup && x.delivery) {
          return `${x.setup}\n${x.delivery}\n\n`;
        } else if (x.joke) {
          return `${x.joke}\n\n`;
        }
        return "No joke found.";
      });
    } else {
      if (jokes.type === 'twopart' && jokes.setup && jokes.delivery) {
        return [`${jokes.setup}\n${jokes.delivery}\n\n`];
      } else if (jokes.joke) {
        return [`${jokes.joke}\n\n`];
      }
      return ["No joke found."];
    }
  };

  //Fetch and set joke(s)
  const fetchJoke = useCallback(async () => {
    setState(prevState => ({ ...prevState, jokeSkeleton: true }));
    try {
      const response = await fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,explicit&amount=2");
      const data: JokeResponse = await response.json();

      let jokes: string[] = [];
      if (data.amount && data.amount > 1) {
        jokes = formatJokes(data.jokes);
      } else {
        jokes = formatJokes(data);
      }

      setState(prevState => ({
        ...prevState,
        allJoke: jokes,
        translatedJoke: "",
        selectedLanguage: null,
        jokeSkeleton: false
      }));
    } catch (error) {
      console.error("Error fetching joke:", error);
      setState(prevState => ({
        ...prevState,
        joke: "Failed to fetch joke. Please try again.",
        jokeSkeleton: false
      }));
    }
  }, []);

  //Translate joke(s) to another language
  const translateJoke = useCallback(async () => {
    const { selectedLanguage, allJoke } = state;
    if (!selectedLanguage) {
      setState(prevState => ({ ...prevState, toastr: true }));
      return;
    }
    setState(prevState => ({ ...prevState, translateSkeleton: true }));
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: allJoke, targetLang: selectedLanguage.language }),
      });
      const data = await response.json();
      setState(prevState => ({
        ...prevState,
        translateSkeleton: false,
        translatedJoke: data.translatedText || "Translation failed",
      }));
    } catch (error) {
      console.error("Error translating joke:", error);
      setState(prevState => ({ ...prevState, translatedJoke: "Failed to translate. Please try again." }));
    }
  }, [state]);

  // Handle toastr close
  const handleClose = useCallback(
    (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason === 'clickaway') return;
      setState(prevState => ({ ...prevState, toastr: false }));
    },
    []
  );

  // UI Content
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={12} textAlign="center">
          <Box padding={4} className={styles.pageHeaderBox}>
            <Typography variant="h4" sx={{ marginBottom: '1rem', color: '#fff' }}>
              <TravelExploreIcon sx={{ fontSize: '2.5rem' }} /> Language Translator App
            </Typography>
            <Typography variant="h6" sx={{ color: '#fff', lineHeight: 1.1 }}>
              A web application using Next.js and TypeScript that integrates with a free public API to display content, then translate that content into a chosen language.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container padding={2} spacing={2} sx={{ marginTop: { xs: '1rem', md: '2rem' } }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ backgroundColor: '#f0f0f063', borderRadius: 0, color: '#000', boxShadow: 'none', border: '1px solid #f2f2f2' }}>
            <CardContent sx={{ height: { md: '56vh' }, overflow: 'auto' }}>
              <Typography variant="h6" sx={{ color: '#1976d2' }}>Fetched Content</Typography>
              {state.jokeSkeleton ? (
                <Skeleton height={118} />
              ) : (
                <Typography variant="h6" sx={{ lineHeight: 1.1, fontStyle: 'italic', marginTop: { md: '2rem' }, whiteSpace: 'pre-line' }}>
                  <ul>
                    {state.allJoke.map((x, index) => <li key={index}>{x}</li>)}
                  </ul>
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ padding: '1rem' }}>
              <Button size="small" variant="outlined" endIcon={<CachedIcon />} onClick={fetchJoke}>Regenerate</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ backgroundColor: '#f0f0f063', color: '#000', borderRadius: 0, boxShadow: 'none', border: '1px solid #f2f2f2' }}>
            <CardContent sx={{ height: { md: '56vh' }, overflow: 'auto' }}>
              <Box sx={{ display: { xs: 'block', md: 'flex' }, alignItems: { md: 'start' }, justifyContent: { md: 'space-between' } }}>
                <Typography variant="h6" sx={{ color: '#1976d2' }}>Translated Content</Typography>
                <Autocomplete
                  disablePortal
                  options={state.languages}
                  getOptionLabel={(option) => option.name}
                  value={state.selectedLanguage}
                  getOptionKey={(option) => option.language}
                  sx={{ width: 300, marginTop: { xs: '1rem', md: 0 } }}
                  onChange={(event, newValue) => {
                    setState(prevState => ({
                      ...prevState,
                      selectedLanguage: newValue,
                      translatedJoke: newValue ? prevState.translatedJoke : "",
                    }));
                  }}
                  renderInput={(params) => <TextField {...params} label="Select Language" size="small" />}
                />
              </Box>
              {state.translateSkeleton ? (
                <Skeleton height={118} />
              ) : (
                <Typography variant="h6" sx={{ lineHeight: 1.1, fontStyle: 'italic', marginTop: { md: '2rem', xs: '1rem' }, whiteSpace: 'pre-line' }}>
                  {state.translatedJoke}
                </Typography>
              )}
            </CardContent>
            <CardActions sx={{ padding: '1rem' }}>
              <Button size="small" variant="outlined" endIcon={<CompareArrowsIcon />} onClick={translateJoke}>Translate</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={state.toastr} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>Please select a language</Alert>
      </Snackbar>
    </Box>
  );
}

