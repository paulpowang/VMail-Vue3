<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input
        type="checkbox"
        :checked="allEmailsSelected"
        :class="[someEmailsSelected ? 'partial-check' : '']"
        @click="bulkSelect"
      />
    </span>
    <span class="buttons">
      <button
        @click="emailSelection.markRead()"
        :disabled="[...emailSelection.emails].every((email) => email.read)"
      >
        Mark Read
      </button>
      <button
        @click="emailSelection.markUnread()"
        :disabled="[...emailSelection.emails].every((email) => !email.read)"
      >
        Mark Unread
      </button>
      <button @click="emailSelection.markArchive()" :disabled="emailSelection.emails.size === 0">
        Mark Archive
      </button>
    </span>
  </div>
</template>

<script>
import useEmailSelection from "../composables/use-email-selection";
import { computed } from "vue";

export default {
  setup(props) {
    let emailSelection = useEmailSelection();
    let numberSelected = computed(() => emailSelection.emails.size);
    let numberEmails = props.emails.length;
    let allEmailsSelected = computed(() => numberSelected.value === numberEmails);
    let someEmailsSelected = computed(
      () => numberSelected.value > 0 && numberSelected.value < numberEmails
    );

    let bulkSelect = () => {
      if (allEmailsSelected.value) {
        emailSelection.clear();
      } else {
        emailSelection.addMultiple(props.emails);
      }
    };

    return {
      allEmailsSelected,
      someEmailsSelected,
      bulkSelect,
      emailSelection,
    };
  },
  props: {
    emails: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
