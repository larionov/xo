<script>
  import { gameState } from "../store/store.js";
  import { Router, Link } from "svelte-routing";
	import { onMount } from 'svelte';
  import firebase from "firebase/app";
  const database = firebase.database();

  import X from './X.svelte';
  import O from './O.svelte';

  export let id;

  let boardSize = null;
  let isLoading = true;

  let wins;
  $: wins = generateWinConditions(boardSize);

  function arrayToObject(arr) {
      return JSON.stringify(arr);
  }

  function objectToArray(obj) {
      if (!obj) return [];
      return JSON.parse(obj);
  }

  function generateWinConditions(size) {
      if (!size) return;
      const wins = [];
      for (let i = 0; i < size; i++) {
          const row = [];
          for (let j = 0; j < size; j++) {
              row.push(i * size + j);
          }
          wins.push(row);
      }
      for (let i = 0; i < size; i++) {
          const col = [];
          for (let j = 0; j < size; j += 1) {
              col.push(i + j * size);
          }
          wins.push(col);
      }

      const diag = [], diag2 = [];
      for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j += 1) {
              if (i == j) diag.push(i + j * size);
              if (i == size - j - 1) diag2.push(i + j * size);
          }
      }
      wins.push(diag);
      wins.push(diag2);
      return wins;
  }

  function now() {
      return Date.now();
  }

  let game, field = [];

  function checkWinner() {
      if (!wins) return false;
      const moves = $gameState.moves;
      for (let i = 0; i < wins.length; i++) {
          let win = wins[i];
          let xs = 0; let os = 0;
          for (let j = 0; j < win.length; j++) {
              if (field[win[j]] === 'x') xs++;
              if (field[win[j]] === 'o') os++;
          }

          if (xs >= boardSize || os >= boardSize) return win;
      }
      return [];
  }

  let winner = checkWinner();
  const ref = firebase.database().ref('game/' + id);

  ref.on('value', function(snapshot) {
      let game = snapshot.val();
      game.moves = objectToArray(game.moves);

      isLoading = false;

      gameState.update(state => Object.assign(state, game));
      boardSize = $gameState.boardSize || 3;
      field = movesToField($gameState.moves)
      winner = checkWinner();
  });


  const movesToField = (moves) => {
      const res = Array(boardSize * boardSize).fill('', 0, boardSize * boardSize);

      moves.forEach((move, index) => {
          res[move] = index % 2 === 0 ? 'x' : 'o';
      })
      return res;

  };

  const onResetButton = async () => {
      isLoading = true

      await ref.set({
          moves: "[]",
          lastmove: now(),
          boardSize,
      });
  };

  const onClickMove = (move) => async () => {
      isLoading = true
      ref.set({
          moves: arrayToObject([...$gameState.moves, move]),
          lastmove: now(),
          boardSize,
      });
  };

  const cell = (x, y) => {
      return x * boardSize + y;
  };
</script>

<style type="text/postcss">
  svg {
    fill: currentColor;
    -o-object-fit: contain;
    object-fit: contain;
    width: 100%!important;
    height: 100%!important;
  }
</style>

<div class="relative overflow-hidden mb-8 m-auto w-auto text-5xl  text-center">
  {#if boardSize}
  <div class="grid grid-rows-{$gameState.boardSize} grid-flow-col gap-4 bg-white rounded-t-lg overflow-hidden border border-gray-400 p-4 p-0">
    {#each Array(boardSize) as _, x}
    <div class="min-w-0">
      {#each Array(boardSize) as _, y}
      <button
        on:click={onClickMove(cell(x,y))}
        class="h-16 w-16 m-1 rounded-lg border {field[cell(x,y)] ? 'cursor-not-allowed' : ''} border-gray-400 align-middle"
        disabled={!!field[cell(x,y)]}
        >
        {#if field[cell(x,y)] === 'x'}
        <X classList="{winner.includes(cell(x,y)) ? 'text-green-500' : 'text-blue-600'}"/>
        {:else if field[cell(x,y)] === 'o'}
        <O classList="{winner.includes(cell(x,y)) ? 'text-green-500' : 'text-pink-600'}"/>
        {/if}

      </button>
      {/each}
    </div>
    {/each}
  </div>

  <div class="w-full">
    <div class="border-r border-b border-l border-gray-400 bg-white rounded-b  p-4 flex flex-col justify-between leading-normal">
      <div class="flex items-center">
        <div class="text-sm flex-grow "></div>
        <div class="text-sm mr-4 ">
          <p class="text-gray-900 leading-none">Ходит:</p>
        </div>
        <div class="w-10 h-10 rounded-full flex-none">
          {#if $gameState.moves.length % 2 === 0}
          <X classList="{'text-blue-600'}" />
          {:else}
          <O classList="{'text-pink-600'}" />
          {/if}
        </div>
        <div class="text-sm flex-grow "></div>
      </div>
    </div>
  </div>
  {/if}



</div>

  <p>
    <button
      class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
      disabled={isLoading}
      on:click={onResetButton}
      >
      {isLoading ? "Подождите..." : "Заново"}
    </button>
  </p>
