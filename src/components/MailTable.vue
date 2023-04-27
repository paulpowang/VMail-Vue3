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
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
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
      this.openedEmail = email;

      if (email && !email?.read) {
        email.read = true;
        this.updateEmail(email);
      }
    },
    archiveEmail(email) {
      email.archived = true;
      this.updateEmail(email);
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    },
    changeEmail({ toggleRead, toggleArchive, save, closeModal, changeIndex }) {
      let email = this.openedEmail;
      if (toggleRead) {
        email.read = !email.read;
      }
      if (toggleArchive) {
        email.archived = !email.archived;
      }
      if (save) {
        this.updateEmail(email);
      }
      if (closeModal) {
        this.openedEmail = null;
      }
      if (changeIndex) {
        let emails = this.unarchivedEmails;
        let currentIndex = emails.indexOf(this.openedEmail);
        let newEmail = emails[currentIndex + changeIndex];
        this.openEmail(newEmail);
      }
    },
  },
};
</script>

<style></style>
