<script>
  export default {
    name: "AppButton",
    props: {
      sr_text: String,
    },
  }
</script>

<template>
  <button type="button">
    <span v-if="this.sr_text" class="sr-only">{{ this.sr_text }}</span>
    <slot></slot>
  </button>
</template>

<style lang="scss">
  button {
    padding: 5px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: inherit;
    color: white;
    font-size: 1rem;

    &:hover {
      background-color: #fff;
    }
  }

  svg {
    font-size: 1rem;
    height: 1.5rem;
    width: 1.5rem;
    color: #eaeaea;
  }
</style>
