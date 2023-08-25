<script>
  export default {
    props: {
      options: Array,
    },
    data() {
      return {
        isOpen: false,
        selectedOption: this.options[0],
      }
    },
    methods: {
      toggleDropdown() {
        this.isOpen = !this.isOpen
      },

      selectOption(option) {
        this.selectedOption = option
        this.isOpen = false
        this.$router.replace({
          query: { ...this.$route.query, userId: option.id },
        })
      },
    },
  }
</script>

<template>
  <div class="dropdown">
    <button @click="toggleDropdown">Change Users</button>
    <ul v-show="isOpen" class="dropdown__menu">
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="selectOption(option)"
      >
        User {{ option.id }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .dropdown {
    position: relative;

    button {
      cursor: pointer;
      background: #f0f0f0;
      border: 1px solid #ccc;
      padding: 5px 10px;
      border-radius: 3px;
    }

    &__menu {
      display: block;
      position: absolute;
      list-style: none;
      background: #fff;
      border: 1px solid #ccc;
      padding: 0;
      margin: 0;
      top: 100%;
      left: 0;
      width: 100%;
      color: black;

      li {
        padding: 5px 10px;
        cursor: pointer;
        &:hover {
          background: #f0f0f0;
        }
      }
    }
  }
</style>
