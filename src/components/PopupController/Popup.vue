<template>
  <div class="popup-container">
    <div class="popup">
      <h2>{{ popup.title }}</h2>
      <p v-html="popup.content"/>
      <Button @click="$emit('close')" text="Close" />
    </div>
  </div>
</template>

<script>
import Button from '../Button';
export default {
  name: 'Popup',
  props: {
    popup: Object,
  },
  emits: ['close'],
  components: {
    Button,
  },

 
};
</script>
<style scoped>
.popup-container {
  position: fixed;
  top: 0;
  right: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup {
  background: #fff;
  border-radius: 10px;
  box-shadow: 12px 13px 30px -7px rgba(0, 0, 0, 0.75);
  width: 50%;
  height: 50%;
  padding: 50px;
  display: grid;
}

@media screen and (max-width: 1100px) {
  .popup {
    width: 70%;
  }
}
@media screen and (max-width: 700px) {
  .popup {
    width: 90%;
    height: 50%

  }
}
</style>
