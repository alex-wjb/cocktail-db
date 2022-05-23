<template>
  <div class="registerPage">
    <div
      class="w-100 p-4 d-flex align-items-center justify-content-center"
      style="height: 70%"
    >
      <MDBCard text="center" class="rounded-0" bg="dark">
        <MDBCardHeader style="color:white;" class="mt-3"><h4>Registration</h4> </MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle>
            <div v-if="signupError" class="mb-4 errorMsg">
              <img src="https://i.imgur.com/GnyDvKN.png" alt="red x" />
              {{ signupError }}
            </div>
          </MDBCardTitle>
          <MDBCardText>
            <form @submit.prevent="register">
              <MDBRow>
                <MDBCol md="6">
                  <MDBInput
                  class="registerInput"
                    id="form2FirstName"
                    v-model.trim="firstName"
                    type="text"
                    label="First Name"
                    wrapper-class="mb-4"
                    :maxlength="32"
                    required
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                  class="registerInput"
                    id="form2LastName"
                    v-model.trim="lastName"
                    type="text"
                    label="Last Name"
                    wrapper-class="mb-4"
                    :maxlength="32"
                    required
                  />
                </MDBCol>
              </MDBRow>
              <MDBInput
              class="registerInput"
                id="form2Email"
                v-model.trim="email"
                type="email"
                label="Email Address"
                wrapper-class="mb-4"
                :maxlength="320"
                required
              />
          
              <MDBInput
              class="registerInput"
                id="form2Password"
                v-model.trim="password"
                type="password"
                label="Password"
                wrapper-class="mb-4"
                :maxlength="64"
                required
              />
              <MDBInput
              class="registerInput"
                id="form2PasswordConfirm"
                v-model.trim="passConfirm"
                type="password"
                label="Confirm Password"
                wrapper-class="mb-4"
                :maxlength="64"
                required
              />
              <MDBRow>
                <div v-if="passMatchErr" class="mb-4 errorMsg">
                  {{ passMatchErr }}
                </div>
              </MDBRow>

              <MDBBtn type="submit"  class="rounded-0"  color="primary" :disabled="!canRegister">
                Register
              </MDBBtn>
            </form>
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
     
          <div class="text-center">
            <p style="color:white;">
              Already a member?
              <router-link :to="{ name: 'Login' }"> Login here </router-link>
            </p>
          </div>
        </MDBCardFooter>
      </MDBCard>
    </div>
  </div>
</template>

<script>
import useSignup from "../composables/useSignup";
import { auth, db } from "../firebase/config";

import { doc, setDoc } from "firebase/firestore";
import { ref, watch } from "vue";
import { updateProfile } from "firebase/auth";
import { useRouter } from "vue-router";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBInput,
  MDBRow,
} from "mdb-vue-ui-kit";
export default {
  name: "Register",
  components: {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardHeader,
    MDBCardText,
    MDBCardTitle,
    MDBCol,
    MDBInput,
    MDBRow,
  },
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
          favourites: []
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

<style>
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

.errorMsg{
  border: 1px solid red;
  font-size: 15px;
  padding: 2%;
  max-width: 45vw;
  color: red;
  background-color: pink;
}
.registerInput{
   border-radius: 0px !important;
  color: white !important;
}
</style>
