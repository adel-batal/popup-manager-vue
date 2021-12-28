<template>
  <!-- teleported to an element that lives in public/index.html -->
  <teleport to="#popup-root">
    <div >
      <transition-group name="fade" v-for="popupIndex in activePopups" :key="popupIndex">
        <slot :popup="popups[popupIndex]" :close="() => closePopup(popupIndex)">
          <Popup :popup="popups[popupIndex]" @close="closePopup(popupIndex)" />
        </slot>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
import Popup from './Popup.vue';
export default {
  name: 'PopupController',
  data() {
    return {
      scrollPercentageBefore: 0,
      scrollPercentage: 0,
      activePopups: [],
      onScrollPopups: [],
      onExitPopups: [],
      onTouchScreenExitPopups: [],
      timedPopups: [],
      onReloadPopups: [],
      customPopups: [],
    };
  },
  components: {
    Popup,
  },
  props: {
    popups: Array,
  },
  methods: {
    showPopup(index) {
      if (this.allowShowPopup(index) && !this.activePopups.includes(index)) {
        this.activePopups.push(index);
      }
    },
    closePopup(index) {
      this.activePopups = this.activePopups.filter(
        (popupIndex) => popupIndex !== index
      );
    },
    allowShowPopup(index) {
      const popup = this.popups[index];
      const nowInMs = Date.now();
      const popupLastShownInMs =
        parseInt(localStorage.getItem(`__last-shown-popup-${popup.id}`)) || 0;
      const frequencyInMs = parseInt(popup.frequency) * 86400000; // converting days to milliseconds
      const timeDiff = nowInMs - popupLastShownInMs;
      if (timeDiff > frequencyInMs) {
        localStorage.setItem(`__last-shown-popup-${popup.id}`, nowInMs);
        return true;
      }
      return false;
    },

    allocatePopups() {
      this.popups.forEach((popup, index) => {
        switch (popup.type) {
          case 'scroll':
            return this.onScrollPopups.push(index);
          case 'exit-intent':
            return this.onExitPopups.push(index);
          case 'mobile-exit-intent':
            return this.onTouchScreenExitPopups.push(index);
          case 'timer':
            return this.timedPopups.push(index);
          case 'reload':
            return this.onReloadPopups.push(index);
          default:
            return this.customPopups.push(index);
        }
      });
    },

    onExitIntent(e) {
      if (!e.toElement) {
        this.onExitPopups.forEach((popupIndex) => {
          this.showPopup(popupIndex);
        });
      }
    },
    onTouchScreenExitIntent(e) {
      const isTouchScreen =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
      if (!isTouchScreen) return;
      else {
        const nextValue = this.getScrollValue(e);
        setTimeout(() => {
          this.scrollPercentageBefore = nextValue;
        }, 100);
        const currentSpeed = this.scrollPercentageBefore - nextValue;

        if (currentSpeed > 20) {
          this.onTouchScreenExitPopups.forEach((popupIndex) => {
            this.showPopup(popupIndex);
          });
        }
      }
    },
    getScrollValue(e) {
      const scrollTop = e.target.scrollingElement.scrollTop;
      const docHeight = e.target.scrollingElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const nextValue = Math.round(scrollPercent * 100);
      return nextValue;
    },
    onScroll(e) {
      const prevValue = this.scrollPercentage;
      const nextValue = this.getScrollValue(e);
      this.onScrollPopups.forEach((popupIndex) => {
        if (
          nextValue > prevValue &&
          nextValue === parseInt(this.popups[popupIndex].params.value)
        ) {
          this.showPopup(popupIndex);
        }
      });
      this.scrollPercentage = nextValue;
    },

    onTimer() {
      this.timedPopups.forEach((popupIndex) => {
        setTimeout(() => {
          this.showPopup(popupIndex);
        }, this.popups[popupIndex].params.value);
      });
    },
    onReload() {
      this.onReloadPopups.forEach((popupIndex) => {
        this.showPopup(popupIndex);
      });
    },
  },
  emits: ['last-shown-edit'],
  created() {
    this.allocatePopups();
  },

  watch: {
    popups() {
      this.allocatePopups();
    },
  },
  mounted() {
    this.onTimer();
    window.addEventListener('load', this.onReload);
    document.addEventListener('scroll', this.onScroll);
    document.addEventListener('scroll', this.onTouchScreenExitIntent);
    document.addEventListener('mouseout', this.onExitIntent);
  },

  beforeUnmount() {
    window.removeEventListener('load', this.onReload);
    document.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('scroll', this.onTouchScreenExitIntent);
    document.removeEventListener('mouseout', this.onExitIntent);
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
