<template>
  <div
    class="w-100 register-container d-flex align-items-center justify-content-center"
    style="height: 70%"
  >
    <div text="center" class="rounded-1 card bg-dark registerCard text-white" >
      <div style="color: white" class="mt-2 card-header text-center border-0">
        <h3 class="mb-0">Registration</h3>
      </div>
      <div class="card-body pt-0">
        <div style="height:60px;">
        <div v-if="signupError" class="errorMsg card-title text-center">
            <i
              class="fa-solid fa-circle-xmark me-2"
              style="color: red; display: inline-block"
            ></i
            >{{ signupError }}
          </div>
        </div>
       
        <div class="card-text">
          <form @submit.prevent="register" autocomplete="off">
            <div class="row mb-4">
              <div class="col md-6">
                <label for="firstName" class="form-label">First Name:</label>
              
                <input
                  class="registerInput form-control"
                  id="firstName"
                  v-model.trim="firstName"
                  type="text"
                  :maxlength="32"
                  required
                />
              </div>

              <div class="col md-6" >
                <label for="lastName" class="form-label">Last Name:</label>
                <input
                  class="registerInput form-control"
                  id="lastName"
                  v-model.trim="lastName"
                  type="text"
                  :maxlength="32"
                  required
                />
              </div>
            </div>
            <label for="email" class="form-label">Email Address:</label>
            <input
              class="registerInput form-control mb-4"
              id="email"
              v-model.trim="email"
              type="email"          
              label="Email Address"
              :maxlength="320"
              required
            />
            <label for="password" class="form-label">Password:</label>
            <input
              class="registerInput form-control mb-4"
              id="password"
              v-model.trim="password"
              type="password"
              :maxlength="64"
              required
            />
            <label for="passConfirm" class="form-label">Confirm password:</label>
            <input
              class="registerInput form-control mb-4"
              id="passConfirm"
              v-model.trim="passConfirm"
              type="password"
              :maxlength="64"
              required
            />
            <div class="row">
              <div v-if="passMatchErr" class="mb-4 errorMsg">
                {{ passMatchErr }}
              </div>
            </div>

            <button
              type="submit"
              class="rounded-1 btn btn-dark d-block m-auto"
              style="border-color: grey; display: block; margin: auto; border-width: 2px;"
              color="primary"
             
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <div class="card-footer" style="border-width:4px">
        <div class="text-center">
          <p style="color: white">
            Already a member?
            <router-link :to="{ name: 'Login' }" class="loginLink"> Login here </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useSignup from "../composables/useSignup";
import { auth, db } from "../firebase/config";

import { doc, setDoc } from "firebase/firestore";
import { ref, watch, onUnmounted } from "vue";
import { updateProfile } from "firebase/auth";
import { useRouter } from "vue-router";
export default {
  name: "Register",
  setup() {
    let canRegister = ref(false);
    const email = ref("");
    const firstName = ref("");
    const lastName = ref("");
    const passConfirm = ref("");
    const passMatchErr = ref("");
    const password = ref("");
    const router = useRouter();
    const { signupError, signup } = useSignup();
    const inputsValid = ref(true);
    //clear errors on view change
    onUnmounted(() => {
      signupError.value = null;
    })
    const checkPasswordsMatch = () => {
      const passwordsMatch =
        password.value === passConfirm.value && password.value !== "";
      passMatchErr.value = !passwordsMatch
        ? "Your passwords do not match! Please try again"
        : null;
      return passwordsMatch;
    };
    const validateInputs = () => {
      checkPasswordsMatch();
      if (passMatchErr.value) {
        inputsValid.value = false;
      } else {
        inputsValid.value = true;
      }
    };

    const register = async () => {
      validateInputs();
      if (!inputsValid.value) return;

      await signup(email.value, password.value);
      if (signupError.value) return;

      try {
        //set display name
        await updateProfile(auth.currentUser, {
          displayName: firstName.value,
        });
        await createUserDoc(auth.currentUser);
      } catch (error) {
        console.error(error);
      }

      router.push("/");
    };
    const createUserDoc = async (userObj) => {
      try {
        await setDoc(doc(db, "users", userObj.uid), {
          favourites: [],
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };

    watch([email, firstName, lastName, passConfirm, password], () => {
      canRegister.value =
        email.value !== "" &&
        firstName.value !== "" &&
        lastName.value !== "" &&
        passConfirm.value !== "" &&
        password.value !== "";
    });
    return {
      canRegister,
      email,
      firstName,
      register,
      lastName,
      passConfirm,
      passMatchErr,
      password,
      signupError,
      validateInputs,
      inputsValid,
    };
  },
};
</script>

<style scoped>
.registerPage {
  background-color: lightgrey;
  min-height: 100vh;
  padding-top: 115px;
  width: 100%;
  overflow-x: hidden;
  padding-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
}

.register-container {
}

.errorMsg {
  border: 1px solid red;
  font-size: 15px;
  padding: 2%;
  color: red;
  background-color: pink;
  display: block;
  font-weight: bold;
}
.registerInput {
  border-radius: 0px !important;
}

.registerCard {
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);
}

.loginLink{
  color:grey;
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
