<template>
<div class="loginPage">
    <div class=" w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
      <MDBCard text="center">
        <MDBCardHeader>
          Login
        </MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle v-if="errorMessage" class='mb-4 errorMsg'>
            <img src="https://i.imgur.com/GnyDvKN.png" alt="red x"> {{ errorMessage }}
          </MDBCardTitle>
          <MDBCardText>
            <form @submit.prevent="login">
              <!-- Email input -->
              <MDBInput
                id="form2Email"
                v-model="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
                :maxlength="320"
              />

              <!-- Password input -->
              <MDBInput
                id="form2Password"
                v-model="password"
                type="password"
                label="Password"
                wrapper-class="mb-4"
                :maxlength="64"
              />
              <!-- 2 column grid layout for inline styling -->
              <MDBRow class="mb-4">
                <MDBCol class="d-flex justify-content-center">
                  <!-- Simple link -->
                  <router-link
                    to="/reset"
                  >
                    Forgotten password?
                  </router-link>
                </MDBCol>
              </MDBRow>
              <MDBBtn type="submit" color="primary">
                Login
              </MDBBtn>
            </form>
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
          <!-- Register buttons -->
          <div>
            <p>
              Not a member?
              <router-link
                to="/register"

              >
                Create an account
              </router-link>
            </p>
          </div>
        </MDBCardFooter>
      </MDBCard>
    </div>
    </div>
</template>

<script>
  import {signInWithEmailAndPassword,  } from 'firebase/auth';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { auth } from "../firebase/config";
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
    MDBRow
  } from 'mdb-vue-ui-kit';
  export default {
    name: 'Login',
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
      // const auth = getAuth();
      const email = ref('');
      const errorMessage = ref();
      const password = ref('');
      const router = useRouter();
      const login = async () => {
      try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
        
         
            router.push('/');
          }
        catch (error) {
          //custom error messages
          switch (error.code) {
          case 'auth/invalid-email':
            errorMessage.value = 'Invalid email.';
            break;
          case 'auth/user-not-found':
            errorMessage.value = 'No account with that email was found.';
            break;
          case 'auth/wrong-password':
            errorMessage.value = 'Incorrect password.';
            break;
          }
        }
      };
      return { login, email, errorMessage, password };
    }
  };
</script>
<style scoped>
.loginPage {
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
  margin: 1%;
  padding: 2% 1% 2% 3%;
  background-repeat: no-repeat;
  background-position: 10px center;
  max-width: 40vw;
  color: #d8000c;
  background-color: #ffbaba;
}
</style>

