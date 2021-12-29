<template>
  <PopupManager :popups="popups" />
</template>

<script>
import PopupManager from '../components/PopupManager/index.vue';
export default {
  name: 'AppManager',
  data() {
    return {
      popups: [],
    };
  },
  components: {
    PopupManager,
  },
  methods: {
    async fetchPopups() {
      const res = await fetch('api/popups'); // See vue.config.js file in the root directory
      return res.json();
    },
    async addPopup(popup) {
      await fetch('api/popups', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(popup),
      });
      this.popups = [...this.popups, popup];
    },
    async updatePopup(popupToEdit) {
      await fetch(`api/popups/${popupToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(popupToEdit),
      });
      this.popups = this.popups.map((popup) => {
        return popup.id === popupToEdit.id ? popupToEdit : popup;
      });
    },
    async deletePopup(id) {
      if (confirm('Are you sure?')) {
        const res = await fetch(`api/popups/${id}`, {
          method: 'DELETE',
        });
        res.status === 200
          ? (this.popups = this.popups.filter((popup) => popup.id !== id))
          : alert('Error deleting popup');
      }
    },
  },
  provide() {
    return {
      onDelete: this.deletePopup,
      onAdd: this.addPopup,
      onEdit: this.updatePopup,
    };
  },
  async created() {
    this.popups = await this.fetchPopups();
  },
};
</script>
