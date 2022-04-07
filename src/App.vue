<script setup lang="ts">
import { ref } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';
// import { useCounterStore } from '@/stores/counter';
import { useBankAccountStore } from '@/stores/bankAccount';

// const store = useCounterStore();
const store = useBankAccountStore();

store.$onAction(({ store, after }) => {
  after((result) => {
    if (result) {
      store.processTransaction(result);
    }
  });
});

const payAmount = ref(0);

const submitPayment = () => {
  if (payAmount.value) {
    store.pay(payAmount.value);
    payAmount.value = 0;
  }
};
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="Learn Pinia" />

      <!-- Counter Example -->
      <!--
      <button @click="store.increment()">
        {{ store.counter }} * 2 {{ store.doubleCount }}
      </button>
      <button @click="store.$reset()">RESET</button>
      -->

      <button @click="store.reconcile()">Reconcile</button>

      <h3>Balance: {{ store.runningBalance }}</h3>
      <h3>Pending Amount: {{ store.pendingAmount }}</h3>

      <button @click="store.charge(5)">Buy Coffee $5</button>

      <div>
        Payment Amount: <input type="number" v-model="payAmount" />
        <button @click="submitPayment">Pay</button>
      </div>

      <h3>Pending Transactions:</h3>
      <ul>
        <li v-for="item in store.pendingTransactions" :key="item.id">
          ${{ item.amount }}
        </li>
      </ul>

      <h3>Processed Transactions:</h3>
      <ul>
        <li v-for="item in store.processedTransactions" :key="item.id">
          ${{ item.amount }}
        </li>
      </ul>
    </div>
  </header>
</template>

<style>
@import '@/assets/base.css';

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
