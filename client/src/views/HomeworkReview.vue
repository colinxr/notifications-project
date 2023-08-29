<template>
  <div class="homework">
    <div>
      <h2>Reviewing Homework for</h2>
    </div>
    <div>
      <h3>patient id {{ this.$route.params.id }}</h3>
    </div>
  </div>
</template>

<style lang="scss">
  .homework {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 85px);
    text-align: center;
  }
</style>
