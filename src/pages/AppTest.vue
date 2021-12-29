<template>
  <div class="root">
    <PopupController :popups="popups" ref="controller">
      <template v-slot:default="popupProps">
        <!-- You can add your own custom popup here, if you do not add your
        own custom popup, the default one will appear. Right now, this CustomPopup
        component is identical to the default one -->
        <CustomPopup :popup="popupProps.popup" @close="popupProps.close" />
      </template>
    </PopupController>
    <h1>
      This is a testing page, scroll, try to exit, use your phone to exit
      quickly, wait for timed popups
    </h1>
    <br />
    <br />
    <br />
    <h3>
      NOTE: The following two popups (click and hover) are chosen by random
      (index 0 and 1 of all popups), <br />while all the other popups work
      according to your specifications in the popup manager
    </h3>
    <a @click="$refs.controller.showPopup(0)" href="#">Click Test</a>
    <br />
    <br />
    <br />
    <a @mouseover="$refs.controller.showPopup(1)" href="#">Hover Test</a>
    <br />
    <br />
    <br />
    <router-link to="/">Go back to popup manager</router-link>
    <br />
    <br />
    <br />
    <h2>
      If you want to see your popups again, remove localStorage entries :)
    </h2>
  </div>
</template>

<script>
import PopupController from '../components/PopupController/index.vue';
import CustomPopup from '../components/CustomPopup.vue';
export default {
  name: 'AppTest',
  data() {
    return {
      popups: [],
    };
  },
  components: {
    PopupController,
    CustomPopup,
  },
  methods: {
    async fetchPopups() {
      const res = await fetch('api/popups'); // See vue.config.js file in the root directory
      return res.json();
    },
  },

  async created() {
    this.popups = await this.fetchPopups();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;700&display=swap');
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.root {
  background: rgb(131, 58, 180, 0.3);
  background: linear-gradient(
    90deg,
    rgba(131, 58, 180, 0.2) 0%,
    rgba(0, 188, 203, 0.2) 50%,
    rgba(252, 90, 69, 0.2) 100%
  );
  height: 400vh;
}
body {
  font-family: 'Poppins', sans-serif;
  color: slategrey;
}

h1,
h2 {
  text-align: center;
  padding-top: 100px;
}
</style>
