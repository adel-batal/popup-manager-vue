<template>
  <div class="popup-manager_popup-list">
    <div class="popup-entry_header">
      <span>Title</span>
      <span>Created At</span>
      <span>Trigger</span>
      <span>Frequency</span>
      <span>Actions</span>
    </div>
    <div class="wrap">
      <template v-for="popup in popups" :key="popup.id">
        <PopupEntry
          :popup="popup"
          @popup-edit="$emit('popup-edit', popup.id)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import PopupEntry from './PopupEntry.vue';

export default {
  name: 'PopupList',
  components: {
        PopupEntry,
  },
  /* Prop drilling due to the absence of a state management library like VUEX, 
  not a huge problemm on a small app like this one, however,
  a state management library is needed in case of scaling up. */
  props: {
    popups: Array,
  },
};
</script>

<style scoped>
.popup-manager_popup-list {
  overflow-y: scroll;
  height: 60%;
  padding: 20px;
}

.popup-entry_header {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-items: start;
  margin-bottom: 20px;
  gap: 60px;
}

span:last-child {
  justify-self: center;
}
</style>
