<template>
  <div class="popup-manager_add-popup">
    <form>
      <template
        v-if="hasEditableValue(currentPopupToEdit) || !currentPopupToEdit"
      >
        <p class="popup-manager_add-popup--section-sub-title">
          Automatically Show
        </p>
        <!-- It is probably better to create a Select component
      to avoid repeating markup over and over again like this,
      however, because of the time constraint of this project,
      this method was prefered due to the fact that a component
      would need data and props and implementing it would take
      extra time. -->
        <div class="popup-manager_add-popup--triggers-grid">
          <div class="popup-manager_add-popup--triggers-grid_element">
            <input
              type="checkbox"
              name="timer"
              id="timer"
              v-model="isTimer"
              :disabled="type && type !== 'timer'"
            />
            <label class="element-label" for="timer">Show on a timer</label>
            <select
              class="element-select"
              name="timer"
              id="timer-select"
              :disabled="type && type !== 'timer'"
              v-model="formValues.params.value"
            >
              <option value="1">After 1 Minute</option>
              <option value="2">After 2 Minutes</option>
              <option value="3">After 3 Minutes</option>
              <option value="4">After 4 Minutes</option>
            </select>
          </div>
          <div class="popup-manager_add-popup--triggers-grid_element">
            <input
              type="checkbox"
              name="scroll"
              id="scroll"
              v-model="isScroll"
              :disabled="type && type !== 'scroll'"
            />
            <label class="element-label" for="scroll"
              >Show after scrolling</label
            >
            <select
              class="element-select"
              name="scroll"
              id="scroll-select"
              :disabled="type && type !== 'scroll'"
              v-model="formValues.params.value"
            >
              <option value="25">25% of page</option>
              <option value="50">50% of page</option>
              <option value="75">75% of page</option>
              <option value="100">100% of page</option>
            </select>
          </div>
          <div class="popup-manager_add-popup--triggers-grid_element">
            <input
              type="checkbox"
              name="exit-intent"
              id="exit-intent"
              v-model="isExitIntent"
              :disabled="type && type !== 'exit-intent'"
            />
            <label class="element-label" for="exit-intent"
              >Show on exit-intent</label
            >
          </div>
        </div>
        <hr />
      </template>
      <template v-else>
        This popup is of type
        {{ currentPopupToEdit && currentPopupToEdit.type }}, therefore it does
        not have trigger values.
      </template>
      <p class="popup-manager_add-popup--section-sub-title">
        Trigger Automatically At Most
      </p>
      <select
        class="element-select"
        name="frequency"
        id="frequency"
        v-model="formValues.frequency"
      >
        <option value="7">Every Week</option>
        <option value="14">Every 2 Weeks</option>
        <option value="21">Every 3 Weeks</option>
        <option value="28">Every 4 Weeks</option>
      </select>
      <br />
      <br />

      <hr />
      <!-- the popup content section here is just a way to show
      what can be done with this form, in real world apps, the options
      should be more diverse, like adding a button, a picture, a CTA...etc
      this can be done through vue slots -->
      <p class="popup-manager_add-popup--section-sub-title">Popup Content</p>
      <label class="popup-manager_add-popup--section-sub-title" for="title"
        >Title</label
      >
      <input
        class="popup-manager_add-popup--title-input"
        type="text"
        name="title"
        id="title"
        required
        v-model="formValues.title"
      />
      <label class="popup-manager_add-popup--section-sub-title" for="title"
        >Content</label
      >
      <textarea
        class="popup-manager_add-popup--content-input"
        name="content"
        id="content"
        v-model="formValues.content"
      ></textarea>

      <div class="add-button-container">
        <Button
          @click="
            isValidSubmit() && onEdit(currentPopupToEdit),
              setActiveDisplay('PopupList')
          "
          class="add-button"
          text="Edit"
          v-if="currentPopupToEdit"
        />
        <Button
          @click="
            isValidSubmit() && onAdd(formValues), setActiveDisplay('PopupList')
          "
          class="add-button"
          text="Add"
          v-else
        />
      </div>
    </form>
  </div>
</template>

<script>
import { getFormattedDate } from './utils';
import Button from '../Button.vue';
export default {
  name: 'PopupEditor',
  data() {
    return {
      isScroll: false,
      isTimer: false,
      isExitIntent: false,
      formValues: {
        title: null,
        content: null,
        createdAt: getFormattedDate(),
        type: null,
        params: {
          value: null,
        },
        frequency: null,
      },
    };
  },
  components: {
    Button,
  },
  props: {
    currentPopupToEdit: Object,
    clearEditCurrentPopup: Function,
  },
  methods: {
    hasEditableValue(popup) {
      if (popup && popup.params.value !== null) return true;
      return false;
    },
    isValidSubmit() {
      if (
        !this.formValues.type ||
        !this.formValues.title ||
        !this.formValues.content ||
        !this.formValues.frequency
      ) {
        alert('Please fill all fields.');
        return false;
      } else if (this.formValues.type && !this.formValues.params.value) {
        alert('Please specify the value of trigger.');
        return false;
      }
      return true;
    },
  },
  computed: {
    type() {
      switch (true) {
        case this.isScroll:
          return 'scroll';
        case this.isTimer:
          return 'timer';
        case this.isExitIntent:
          return 'exit-intent';
        default:
          return false;
      }
    },
  },
  watch: {
    isScroll(newValue) {
      newValue && (this.formValues.type = 'scroll');
      this.formValues = this.currentPopupToEdit || this.formValues;
    },
    isTimer(newValue) {
      newValue && (this.formValues.type = 'timer');
      this.formValues = this.currentPopupToEdit || this.formValues;
    },
    isExitIntent(newValue) {
      newValue && (this.formValues.type = 'exit-intent');
      this.formValues = this.currentPopupToEdit || this.formValues;
    },
  },
  inject: ['onAdd', 'onEdit', 'setActiveDisplay'],
  mounted() {
    if (this.currentPopupToEdit) {
      const { id, title, content, type, params, frequency } =
        this.currentPopupToEdit;
      this.formValues = {
        id,
        title,
        content,
        type,
        params,
        frequency,
      };
      switch (type) {
        case 'scroll':
          this.isScroll = true;
          break;
        case 'timer':
          this.isTimer = true;
          break;
        case 'exit-intent':
          this.isExitIntent = true;
          break;
        default:
          break;
      }
    }
  },
  unmounted() {
    this.clearEditCurrentPopup();
  },
};
</script>

<style scoped>
.popup-manager_add-popup {
  padding: 20px;
  height: 60%;
  overflow-y: scroll;
}

.popup-manager_add-popup--triggers-grid_element {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.popup-manager_add-popup--triggers-grid {
  margin-bottom: 20px;
}

.element-label {
  padding: 0 10px;
}

.element-select {
  background: #eaecee;
  border: 2px #ccd1d1 solid;
  border-bottom: 2px #abb2b9 solid;
  width: 200px;
  height: 35px;
  padding: 5px;
  font-family: inherit;
  color: inherit;
  /* source: https://stackoverflow.com/questions/14218307/select-arrow-style-change */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='slategrey' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y: 5px;
  /* end of source */
}

.element-select:focus {
  outline: none;
}
.popup-manager_add-popup--section-sub-title {
  display: block;
  padding: 10px 0;
  color: #7ae582;
  font-weight: 700;
}

.popup-manager_add-popup--section-sub-title:first-child {
  padding: 0;
}

.add-button-container {
  display: flex;
  justify-content: flex-end;
}

.popup-manager_add-popup--title-input {
  width: 200px;
  height: 35px;
}

.popup-manager_add-popup--content-input {
  width: 400px;
  height: 200px;
  resize: none;
}

.popup-manager_add-popup--title-input,
.popup-manager_add-popup--content-input {
  font-family: inherit;
  border: 1px solid slategray;
  border-radius: 5px;
  padding: 5px;
}

.popup-manager_add-popup--title-input:focus,
.popup-manager_add-popup--content-input:focus {
  outline: none;
}
</style>
