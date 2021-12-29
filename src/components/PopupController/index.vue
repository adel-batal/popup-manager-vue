<template>
  <!-- teleported to an element that lives in public/index.html -->
  <teleport to="#popup-root">
    <div>
      <transition-group name="fade">
        <div v-for="popupIndex in activePopups" :key="popupIndex">
          <slot
            :popup="popups[popupIndex]"
            :close="() => closePopup(popupIndex)"
          >
            <Popup />
          </slot>
        </div>
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
    getScrollPercent(e) {
      const scrollTop = e.target.scrollingElement.scrollTop;
      const docHeight = e.target.scrollingElement.scrollHeight;
      const winHeight = window.innerHeight;
      const nextValue = scrollTop / (docHeight - winHeight);
      return Math.round(nextValue * 100);
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
        const nextValue = this.getScrollPercent(e);
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
    onScroll(e) {
      const prevValue = this.scrollPercentage;
      const nextValue = this.getScrollPercent(e);
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
        }, this.popups[popupIndex].params.value * 60000); // minute to millisecond conversion
      });
    },
    onReload() {
      this.onReloadPopups.forEach((popupIndex) => {
        this.showPopup(popupIndex);
      });
    },
  },

  watch: {
    popups() {
      this.allocatePopups();
    },
  },
  created() {
    this.allocatePopups();
  },

  mounted() {
    window.addEventListener('load', this.onReload);
    window.addEventListener('load', this.onTimer);
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('scroll', this.onTouchScreenExitIntent);
    window.addEventListener('mouseout', this.onExitIntent);
  },
  beforeUnmount() {
    window.removeEventListener('load', this.onReload);
    window.removeEventListener('load', this.onTimer);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('scroll', this.onTouchScreenExitIntent);
    window.removeEventListener('mouseout', this.onExitIntent);
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
