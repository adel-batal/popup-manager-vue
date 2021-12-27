<template>
  <div>
    <h2 class="popup-manager--header_title">{{ title }}</h2>
    <h4 class="popup-manager--header_sub-title">
      {{ subtitle }}
    </h4>
  </div>
</template>

<script>
export default {
  name: 'PopupManagerHeader',
  props: {
    title: String,
    subtitle: String,
  },
};
</script>

<style scoped>
.popup-manager--header_sub-title {
  font-weight: 400;
}

.popup-manager--header_title,
.popup-manager--header_sub-title {
  margin: 10px 0;
}
</style>
