import { reactive } from "vue";
import axios from "axios";

const selectedEmails = reactive(new Set());
const useEmailSelection = () => {
  const toggle = (email) => {
    if (selectedEmails.has(email)) {
      selectedEmails.delete(email);
    } else {
      selectedEmails.add(email);
    }
  };
  const clear = () => {
    selectedEmails.clear();
  };
  const addMultiple = (newEmails) => {
    newEmails.forEach((email) => {
      selectedEmails.add(email);
    });
  };
  const forSelected = (fn) => {
    selectedEmails.forEach((email) => {
      fn(email);
      axios.put(`http://localhost:3000/emails/${email.id}`, email);
    });
  };
  const markRead = () => forSelected((email) => (email.read = true));
  const markUnread = () => forSelected((email) => (email.read = false));
  const markArchive = () => {
    forSelected((email) => (email.archived = true));
    clear();
  };
  return {
    emails: selectedEmails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    markArchive,
  };
};

export default useEmailSelection;
