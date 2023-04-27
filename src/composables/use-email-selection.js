import { reactive } from "vue";

let selectedEmails = reactive(new Set());
const useEmailSelection = () => {
  let emailSelection = {
    emails: selectedEmails,
    toggle(email) {
      if (selectedEmails.has(email)) {
        selectedEmails.delete(email);
      } else {
        selectedEmails.add(email);
      }
    },
    clear() {
      selectedEmails.clear();
    },
    addMultiple(newEmails) {
      newEmails.forEach((email) => {
        selectedEmails.add(email);
      });
    },
  };
  return emailSelection;
};

export default useEmailSelection;
