<template>
  <button @click.prevent="$emit('btn-click')">
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: String,
  },
  emits: ['btn-click']
};
</script>

<style scoped>
button {
  max-width: 125px;
  max-height: 50px;
  cursor: pointer;
  padding: 10px 40px;
  border: none;
  background: #7ae582;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 4px;
}

button:hover {
  background: #48997a;
}
button:active {
  transform: scale(0.98);
}
</style>
