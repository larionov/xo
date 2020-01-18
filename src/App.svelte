<script>
  import { gameState } from "./store/store.js";

  import { Router, Link, Route, navigate } from "svelte-routing";

  import TitleScreen from "./components/titleScreen.svelte";
  import GameScreen from "./components/gameScreen.svelte";
  import GameOverScreen from "./components/gameOverScreen.svelte";

  export let url = "";
</script>

<main  class='flex-1 mx-auto p-8'>
  <Router url="{url}">
    <h1 class="text-5xl"><Link to="/">XO</Link></h1>
    <div>
      <Route path="/" component="{TitleScreen}" />
      <Route path="game/:id" let:params>
        <GameScreen id="{params.id}" />
      </Route>
      <Route path="/gameOver" component="{GameOverScreen}" />
    </div>
  </Router>
</main>

<footer class='w-full text-center border-t border-grey p-4 pin-b'>
  <a href="https://gitlab.com/sergey-larionov/xo">sergey-larionov/xo</a>
</footer>
