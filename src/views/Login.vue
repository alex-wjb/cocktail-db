<template>
  <div
    class="w-100 login-container d-flex justify-content-center"
    style="height: 70%;"
  >
    <div class="rounded-1 card bg-dark text-white loginCard" style="width: 500px;">
      <div class="card-header text-center mt-2" style="color: white; border:none;">
        <h3 class="mb-0">Login</h3>
      </div>
      <div class="card-body pt-0">
        
       <div style="height:60px;">
        <div v-if="errorMessage" class=" errorMsg card-title text-center">
          <i class="fa-solid fa-circle-xmark me-2" style="color:red; display:inline-block;"></i>{{ errorMessage }}
         
        </div>
      </div>
        <div class="card-text">
          <form @submit.prevent="login">
            <label for="loginEmail" class="form-label">Email Address:</label>
            <input
              class="loginInput form-control mb-4"
              id="loginEmail"
              v-model="email"
              type="email"
              :maxlength="320"
            />
            <label for="loginPass" class="form-label">Password:</label>
            <input
              class="loginInput form-control mb-4"
              id="loginPass"
              v-model="password"
              type="password"
              :maxlength="64"
            />
            <div class="mb-4 text-center">
                <router-link class="loginLink" to="/reset"> Forgotten password? </router-link>
            </div>
            <button
              id="loginBtn"
              class="btn btn-dark rounded-1"
              type="submit"
              style="border-color: grey; display: block; margin: auto; border-width: 2px;"
            >
              Login
            </button>
            <!-- <a role="button" tabindex="1" class="btn btn-dark rounded-1 formBtn" style="border-color: grey; display: block; margin: auto; border-width: 2px;">Test1</a> -->
          </form>
        </div>
      </div>
      <div class="card-footer text-center" style="border-width: 4px;">
        <div>
          <p style="color: white">
            Not Registered?
            <router-link class="loginLink" to="/register"> Create an account </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase/config";
export default {
  name: "Login",
  setup() {
    const email = ref("");
    const errorMessage = ref();
    const password = ref("");
    const router = useRouter();

    const blurBtn = () => {
      const loginBtn = document.getElementById("loginBtn");
      loginBtn.blur();
      // setTimeout(() => { loginBtn.blur() }, 200);
    };
    const login = async () => {
      errorMessage.value = null;
      try {
        blurBtn();
        await signInWithEmailAndPassword(auth, email.value, password.value);

        router.push("/");
      } catch (error) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage.value = "Invalid email";
            break;
          case "auth/user-not-found":
            errorMessage.value = "No account with that email was found";
            break;
          case "auth/wrong-password":
            errorMessage.value = "Incorrect password";
            break;
        }
      }
    };
    return { login, email, errorMessage, password };
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

.login-container {
}

/* only works when not scoped */
.loginInput.form-control {
  border-radius: 0px !important;
  /* color: white !important;  */
}

.loginCard{
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

.loginLink{
  color: grey;
}
.loginLink:hover{
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


</style>
