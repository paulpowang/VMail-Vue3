<template>
  <div class="modal">
    <div class="overlay" @click="emit('closeModal')"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
</template>

<script>
import useKeydown from "../composables/use-keydown";
export default {
  name: "ModalView",
  setup(props, { emit }) {
    useKeydown([
      {
        key: "Escape",
        fn: () => {
          emit("closeModal");
        },
      },
      {
        key: "Enter",
        fn: () => {
          console.log("Enter key down");
        },
      },
    ]);

    return { emit };
  },
};
</script>

<style lang="scss" scoped></style>
