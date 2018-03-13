import React from 'react';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { goToPokemon } from './utils/helpers';
import { withRouter } from 'react-router'
import Pokemons from './utils/pokemons.json';

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      {...other}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input,
        },
        ...InputProps,
      }}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(inputValue) {
  let count = 0;

  return Pokemons.filter(suggestion => {
    const keep =
      (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
      count < 5;

    if (keep) {
      count += 1;
    }

    return keep;
  });
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 50,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 4}px`,
  },
});

function SearchPokemons(props) {
  const { classes } = props;

  return (
    <div
    onKeyPress={(e) => { 
        if (e.key === 'Enter') { 
            let pokemonName = document.getElementById('search-pokemons').value;
            goToPokemon(props, `/pokemon/${pokemonName.toLowerCase()}`); 
        } 
    }}        
    className={`${classes.root} search-pokemons`}
    spellCheck="false">
      <Downshift>
        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: 'Tražilica',
                id: 'search-pokemons',
              }),
            })}
            {isOpen ? (
              <Paper 
                onClick={(e) => { goToPokemon(props, `/pokemon/${e.target.textContent.toLowerCase()}`) }}
                className={classes.paper}  square>
                {getSuggestions(inputValue).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    </div>
  );
}

export default withRouter(withStyles(styles)(SearchPokemons));