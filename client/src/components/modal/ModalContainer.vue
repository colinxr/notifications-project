<script>
  export default {
    name: "ModalContainer",

    props: {
      showModal: Boolean,
    },

    methods: {
      handleClose() {
        console.log("inside Modal Container")
        this.$emit("handleClose")
      },
    },
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="modal-wrapper" @click.self="handleClose">
        <div class="modal-body">
          <header class="modal-body__header">
            <slot name="header"></slot>
            <div class="modal-body__close" @click="handleClose">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.29191 8.29191C8.68239 7.90143 9.31548 7.90143 9.70596 8.29191L15.9981 14.5841L22.2903 8.29191C22.6807 7.90143 23.3138 7.90143 23.7043 8.29191C24.0948 8.68239 24.0948 9.31548 23.7043 9.70596L17.4122 15.9981L23.7043 22.2903C24.0948 22.6807 24.0948 23.3138 23.7043 23.7043C23.3138 24.0948 22.6807 24.0948 22.2903 23.7043L15.9981 17.4122L9.70596 23.7043C9.31548 24.0948 8.68239 24.0948 8.29191 23.7043C7.90143 23.3138 7.90143 22.6807 8.29191 22.2903L14.5841 15.9981L8.29191 9.70596C7.90143 9.31548 7.90143 8.68239 8.29191 8.29191Z"
                  fill="#413C72"
                />
              </svg>
            </div>
          </header>
          <slot name="content"></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 90;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    display: grid;
    justify-content: center;
    align-items: center;
  }

  .modal-body {
    box-shadow:
      0px 8px 10px -5px rgba(0, 0, 0, 0.15),
      0px 6px 30px 5px rgba(0, 0, 0, 0.1),
      0px 16px 24px 2px rgba(0, 0, 0, 0.12);
    border-radius: 16px;
    height: 592px;
    overflow-y: scroll;
    width: 90vw;
    margin: 0 auto;
    max-width: 704px;
    background-color: var(--neutral-white);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 40px;
      border-bottom: 1px solid var(--neutral-grey);
      color: var(--primary);
    }

    &__close {
      cursor: pointer;
    }
  }

  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: 0.25s ease all;
  }
</style>
