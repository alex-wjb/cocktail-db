<template>
  <div
    class="w-100 login-container d-flex justify-content-center"
    style="height: 70%;"
  >
    <div class="rounded-0 card bg-dark text-white" style="width: 500px;">
      <div class="card-header text-center mt-3" style="color: white; border:none;">
        <h3>Login</h3>
      </div>
      <div class="card-body">
        
       <div style="height:50px;">
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
            <MDBRow class="mb-4">
              <MDBCol class="d-flex justify-content-center">
                <router-link class="loginLink" to="/reset"> Forgotten password? </router-link>
              </MDBCol>
            </MDBRow>
            <button
              id="loginBtn"
              class="btn btn-dark rounded-0"
              type="submit"
              color="dark"
              outline="light"
              style="border-color: grey; display: block; margin: auto;"
            >
              Login
            </button>
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
import { MDBCol, MDBRow } from "mdb-vue-ui-kit";
export default {
  name: "Login",
  components: {
    MDBCol,
    MDBRow,
  },
  setup() {
    const email = ref("");
    const errorMessage = ref();
    const password = ref("");
    const router = useRouter();

    const unfocusLogin = () => {
      const loginBtn = document.getElementById("loginBtn");
      loginBtn.blur();
      loginBtn.classList.remove("hasactive");
      loginBtn.classList.remove("active");
    };
    const login = async () => {
      errorMessage.value = null;
      try {
        unfocusLogin();
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


.loginLink{
  color: grey;
}
.loginLink:hover{
  color: white;
}
</style>
