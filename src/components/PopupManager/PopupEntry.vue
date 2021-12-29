<template>
  <div class="popup-entry">
    <span>{{ popup.title }}</span>
    <span>{{ popup.createdAt }}</span>
    <span>{{ popup.type + typeUnit }}</span>
    <span>{{ `${popup.frequency} days` }}</span>
    <span class="popup-entry_actions">
      <em
        class="fas fa-edit"
        @click="setActiveDisplay('PopupForm'), $emit('popup-edit')"
      ></em>
      <em class="fas fa-trash" @click="onDelete(popup.id)"></em>
    </span>
  </div>
</template>

<script>
export default {
  name: 'PopupEntry',
  props: {
    popup: Object,
  },
  computed: {
    typeUnit() {
      if (this.popup.type === 'timer')
        return `: ${this.popup.params.value} min.`;
      else if (this.popup.type === 'scroll')
        return `: ${this.popup.params.value}%`;
      return '';
    },
  },
  inject: ['setActiveDisplay', 'onDelete'],
  emits: ['popup-edit'],
};
</script>

<style scoped>
span {
  width: 100px;
  overflow: hidden;
}
.popup-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
  border-radius: 5px;
  transition: 0.3s;
}

.popup-entry:hover {
  box-shadow: inset 0px 0px 4px 0px rgba(50, 50, 50, 0.5);
  transition: 0.3s;
  padding: 10px;
}

.popup-entry_actions {
  display: flex;
  justify-content: space-evenly;
  cursor: pointer;
}
</style>
