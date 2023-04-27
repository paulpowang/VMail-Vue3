<template>
  <table class="mail-table">
    <tr
      v-for="email in unarchivedEmails"
      :key="email.id"
      :class="['clickable', email.read ? 'read' : '']"
      @click="openEmail(email)"
    >
      <td><input type="checkbox" /></td>
      <td>{{ email.from }}</td>
      <td>
        <p>
          <strong>{{ email.subject }}</strong> - {{ email.body }}
        </p>
      </td>
      <td class="date">
        {{ format(new Date(email.sentAt), "MMM do yyyy") }}
      </td>
      <td><button @click="archiveEmail(email)">Archive</button></td>
    </tr>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" />
  </ModalView>
</template>

<script>
import { format } from "date-fns";
import MailView from "./MailView.vue";
import ModalView from "./ModalView.vue";
import { ref } from "vue";
import axios from "axios";

export default {
  name: "MailTable",
  components: { MailView, ModalView },
  async setup() {
    let response = await axios.get("http://localhost:3000/emails");

    let emails = ref(response.data);
    return {
      format,
      emails: emails,
      openedEmail: ref(null),
    };
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1;
      });
    },
    unarchivedEmails() {
      return this.sortedEmails.filter((e) => !e.archived);
    },
  },
  methods: {
    openEmail(email) {
      if (!email.read) {
        email.read = true;
        this.updateEmail(email);
      }

      this.openedEmail = email;
    },
    archiveEmail(email) {
      email.archived = true;
      this.updateEmail(email);
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    },
  },
};
</script>

<style></style>
