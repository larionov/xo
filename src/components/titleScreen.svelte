<script>
	import Select from 'svelte-select';
  import { gameState } from "../store/store.js";
  import { navigate } from "svelte-routing";
  import firebase from "firebase/app";
  const database = firebase.database();

	const items = [
		{value: 3, label: '3x3'},
    {value: 4, label: '4x4'},
    {value: 5, label: '5x5'},
	];


  import generate from 'nanoid/generate';

  let isLoading = false;
  let boardSize = 3;
  let selectedValue = { value: 3, label: '3x3' };

  const onNewGameButton = async () => {
      isLoading = true;

      const id = generate('0123456789abcdefghijklmnopqrstuvwxyz', 6);
      const ref = firebase.database().ref('game/' + id);
      gameState.set({
          boardSize: 0,
          moves: [],
      });
      ref.set({
          id,
          boardSize,
          lastmove: Date.now(),
          moves: "[]",
      }, function done(error) {
          if (error) {
              console.log({error});
          } else {
              navigate(`/game/${id}`, { replace: true });
          }
      });

  };
  $: boardSize = selectedValue.value;
</script>

<div class="inline-flex">
  <Select
    containerClasses="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l m-1"
    {items}
    isClearable={false}
    bind:selectedValue
    ></Select>
  <button
    class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
    disabled={isLoading} on:click|once={onNewGameButton}>
    {isLoading ? "Создаем..." : `Новая игра ${boardSize}x${boardSize}`}
  </button>
</div>
