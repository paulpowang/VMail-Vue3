<template>
  <table class="mail-table">
    <tr
      v-for="email in unarchivedEmails"
      :key="email.id"
      :class="['clickable', email.read ? 'read' : '']"
      @click="readEmail(email)"
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
</template>

<script>
import { format } from "date-fns";
import { ref } from "vue";
import axios from "axios";

export default {
  name: "MailTable",
  async setup() {
    let response = await axios.get("http://localhost:3000/emails");

    let emails = ref(response.data);
    return {
      format,
      emails: emails,
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
    readEmail(email) {
      email.read = true;
      this.updateEmail(email);
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
