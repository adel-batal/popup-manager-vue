<template>
  <div class="root">
    <router-link to="/appTest">Click here to test your popups!!</router-link>
    <div class="popup-manager">
      <div class="popup-manager_header">
        <PopupManagerHeader :title="title" :subtitle="subtitle" />
        <em
          class="fas fa-plus-circle fa-4x"
          @click="activeDisplay = 'PopupEditor'"
          v-if="activeDisplay === 'PopupList'"
        ></em>
        <em
          class="fas fa-times-circle fa-4x"
          @click="activeDisplay = 'PopupList'"
          v-if="
            activeDisplay === 'PopupEditor' || activeDisplay === 'EditPopup'
          "
        ></em>
      </div>
      <!-- Dynamic component introduces an issue when compenents need to get
      multiple different attributes which is having to pass the following
      props to every component, even the components that do not need these
      props. A straight forward solution could be removing the dynamic component
      and having each component on its own since there are only two components. -->
      <!--
        Dynamic component implementation
        <component
        :is="activeDisplay"
        :popups="popups"
        :popupToEdit="popupToEdit"
        @popup-edit="activatePopupEditor"
        :currentPopupToEdit="popupToEdit"
        :clearEditCurrentPopup="deactivatePopupEditor"
      /> -->
      <PopupList
        v-if="activeDisplay === 'PopupList'"
        :popups="popups"
        :popupToEdit="popupToEdit"
        @popup-edit="activatePopupEditor"
      >
      </PopupList>
      <PopupEditor
        v-else
        :currentPopupToEdit="popupToEdit"
        :clearEditCurrentPopup="deactivatePopupEditor"
      />
    </div>
    <div class="note">
      This mini project was made with &#9749; by Adel for
      <p class="learn-worlds">LearnWorlds</p>
      .
    </div>
  </div>
</template>

<script>
import PopupManagerHeader from './PopupManagerHeader';
import PopupList from './PopupList.vue';
import PopupEditor from './PopupEditor';

export default {
  name: 'PopupManager',
  data() {
    return {
      activeDisplay: 'PopupList',
      title: '',
      subtitle: '',
      popupToEdit: null,
    };
  },
  components: {
    PopupManagerHeader,
    PopupList,
    PopupEditor,
  },
  props: {
    popups: Array,
  },
  methods: {
    setTitleAndSubtitle() {
      // reusing the same form for editing and adding
      if (this.popupToEdit && this.activeDisplay === 'PopupEditor') {
        this.title = `Editing Popup: ${this.popupToEdit.title}`;
        this.subtitle = 'Please Edit your popup below';
      } else if (this.activeDisplay === 'PopupEditor') {
        this.title = 'Add a New Popup';
        this.subtitle = 'Please fill the fields below to add a new popup';
      } else {
        this.title = 'Popup Manager';
        this.subtitle = 'Manage and maintain your popups';
      }
    },
    setActiveDisplay(display) {
      this.activeDisplay = display;
    },
    activatePopupEditor(id) {
      const popupToEdit = this.popups.find((popup) => popup.id === id);
      this.popupToEdit = popupToEdit;
      this.setActiveDisplay('PopupEditor');
    },
    // clearing when the edit form is unmounted to avoid collisions
    // this method is passed down as a function to the edit popup form
    deactivatePopupEditor() {
      this.popupToEdit = null;
    },
  },
  watch: {
    activeDisplay() {
      this.setTitleAndSubtitle();
    },
  },
  provide() {
    return {
      setActiveDisplay: this.setActiveDisplay,
    };
  },
  mounted() {
    this.setTitleAndSubtitle();
  },
};
</script>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
}

.popup-manager {
  width: 800px;
  height: 500px;
  border-radius: 10px;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  box-shadow: 0px 0px 7px 0px rgba(50, 50, 50, 1);
}

.fas {
  transition: 0.3s;
}
.fa-plus-circle:hover,
.fa-times-circle:hover {
  cursor: pointer;
  color: #4cc9f0;
  border-radius: 50%;
  box-shadow: 0px 0px 7px 0px rgba(50, 50, 50, 1);
  transition: 0.3s;
  transform: scale(1.1);
}

.fa-times-circle:hover {
  color: red;
}

.popup-manager_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #7209b7;
  color: aliceblue;
  padding: 20px;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.note {
  padding-top: 10px;
}

.learn-worlds {
  display: inline;
  color: #7ae582;
  font-weight: 600;
}
</style>
