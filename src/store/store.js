import { writable } from 'svelte/store';

export let gameState = writable({
  boardSize: 0,
  moves: [],
});
