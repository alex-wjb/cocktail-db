<template>
  <div
    class="login w-100 reset-container d-flex align-items-center justify-content-center"
    style="height: 70%"
  >
    <div
      text="center"
      class="rounded-1 card bg-dark text-white resetCard"
      style="width: 500px"
    >
      <div class="card-header text-center mt-2" style="border: none">
        <h3 class="mb-0">Reset Password</h3>
      </div>
      <div class="card-body pt-0">
        <div style="height: 60px">
          <div v-if="error" class="errorMsg card-title text-center">
            <i
              class="fa-solid fa-circle-xmark me-2"
              style="color: red; display: inline-block"
            ></i
            >{{ error }}
          </div>
        </div>
        <div class="card-text">
          <form @submit.prevent="reset">
            <label for="loginEmail" class="form-label">Email Address:</label>
            <input
              class="resetInput form-control mb-4"
              id="loginEmail"
              v-model="email"
              type="email"
              label="Email address"
              wrapper-class="mb-4"
            />
            <button
              type="submit"
              class="rounded-0 btn btn-dark rounded-1 mb-3"
              style="
                border-color: grey;
                margin: auto;
                display: block;
                border-width: 2px;
              "
            >
              Send reset email
            </button>
          </form>
        </div>
      </div>
      <div class="card-footer" style="border-width: 4px">
        <p style="color: white; text-align: center">
          <router-link class="loginLink" to="/login"
            >Return to login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import usePassReset from "../composables/passReset";
import { ref, onUnmounted } from "vue";
export default {
  name: "PassReset",
  setup() {
    const email = ref("");
    const { error, passReset } = usePassReset();
    //clear errors on view change
    onUnmounted(() => {
      error.value = null;
    });
    const reset = async () => {
      if (!email.value) return;
      await passReset(email.value);
      if (!error.value) alert("Password reset email sent");
    };

    return { email, error, reset };
  },
};
</script>

<style scoped>
.errorMsg {
  border: 1px solid red;
  font-size: 15px;
  padding: 2%;
  color: red;
  background-color: pink;
  display: block;
  font-weight: bold;
}

.resetInput {
  border-radius: 0px !important;
}

.loginLink {
  color: grey;
}
.loginLink:hover {
  color: white;
}

button:active{
transform: scale(0.9);
}

/* no hover styling - bg same as no state */
button:hover{
  background-color: #212529;
}
/* Apply hover style on devices where hover behaves properly (hover style sticks on iphone safari) */
@media (hover: hover) {
    button:hover {
        background-color: #414551;
    }
}

.resetCard {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}
</style>
