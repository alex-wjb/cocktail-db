<template>
<div class="registerPage">
  <div
    class="w-100 p-4 d-flex align-items-center justify-content-center"
    style="height: 70%"
  >
    <MDBCard text="center">
      <MDBCardHeader class="mt-3">Registration </MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>
          <!--print any google auth errors-->
          <div v-if="signupError" class="mb-4 errorMsg">
            <img src="https://i.imgur.com/GnyDvKN.png" alt="red x" />
            {{ signupError }}
          </div>
        </MDBCardTitle>
        <MDBCardText>
          <form @submit.prevent="handleSubmit">
            <MDBRow>
              <MDBCol md="6">
                <MDBInput
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
              id="form2Email"
              v-model.trim="email"
              type="email"
              label="Email Address"
              wrapper-class="mb-4"
              :maxlength="320"
              required
            />
            <!-- Password input -->
            <MDBInput
              id="form2Password"
              v-model.trim="password"
              type="password"
              label="Password"
              wrapper-class="mb-4"
              :maxlength="64"
              required
            />
            <MDBInput
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

            <MDBBtn type="submit" color="primary" :disabled="!canRegister">
              Register
            </MDBBtn>
          </form>
        </MDBCardText>
      </MDBCardBody>
      <MDBCardFooter>
        <!-- Register buttons -->
        <div class="text-center">
          <p>
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
// import getUser from '../composables/getUser';
import useSignup from "../composables/useSignup";
import { auth } from "../firebase/config";
// import { doc, setDoc } from 'firebase/firestore';
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
    //in firebase firestore, create collection called users
    //change db rules to: write: if request.auth != null;
    //for this to work (if not in test mode)
    // const addUserInfo = async (userObj) => {
    //   //create new user doc in user collection
    //   const db = await store.database;
    //   await setDoc(doc(db, 'users', userObj.uid), userObj);
    // };
    //compare the 2 password inputs
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
    //submit registration data and create account
    const handleSubmit = async () => {
      // check all inputs are valid:
      validateInputs();
      if (!inputsValid.value) return;
      //create user acc
      await signup(email.value, password.value);
      if (signupError.value) return;
      //povides url to continue to after clicking on verif link
    
      //get currently signed in user
      // const { currentUser } = getUser();
      // await addUserInfo({
      //   uid: currentUser.value.uid,
      //   firstName: firstName.value,
      //   lastName: lastName.value,
      //   email: email.value,
      // });
      try {
        //set user display name
        await updateProfile(auth.currentUser, {
          displayName: firstName.value,
        });
      } catch (error) {
        console.error(error);
      }
      //sign user out
      try {
        // await signOut(auth);
        //redirect to login
        router.push("/");
      } catch (error) {
        console.error(error);
      }
    };
    watch(
      [
        email,
        firstName,
        lastName,
        passConfirm,
        password,
      ],
      () => {
        canRegister.value =
          email.value !== "" &&
          firstName.value !== "" &&
          lastName.value !== "" &&
          passConfirm.value !== "" &&
          password.value !== ""

      }
    );
    return {
      canRegister,
      email,
      firstName,
      handleSubmit,
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

.errorMsg{
  border: 1px solid;
  font-size: 15px;
  margin: 0 auto;
  padding: 2% 1% 2% 3%;
  background-repeat: no-repeat;
  background-position: 10px center;
  max-width: 40vw;
  color: #d8000c;
  background-color: #ffbaba;
}
</style>

