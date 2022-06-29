<template>
<!-- <div class="loginPage"> -->
<PageWrapper>

    <div class=" w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
      <MDBCard class="rounded-0" bg="dark" text="center">
        <MDBCardHeader style="color: white;">
          <h4>Login</h4>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle v-if="errorMessage" class='mb-4 errorMsg'>
            <img src="https://i.imgur.com/GnyDvKN.png" alt="red x"> {{ errorMessage }}
          </MDBCardTitle>
          <MDBCardText>
            <form @submit.prevent="login">
              <MDBInput
              class="loginInput"
                id="form2Email"
                v-model="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
                :maxlength="320"
              />

           
              <MDBInput
              class="loginInput"
                id="form2Password"
                v-model="password"
                type="password"
                label="Password"
                wrapper-class="mb-4"
                :maxlength="64"
              />
              <MDBRow class="mb-4">
                <MDBCol class="d-flex justify-content-center">
                  <router-link
                    to="/reset"
                  >
                    Forgotten password?
                  </router-link>
                </MDBCol>
              </MDBRow>
              <MDBBtn
              ref="loginBtn"
              class="rounded-0" type="submit" 
               color="dark"
          outline="light"
          style="border-color:grey;">
                Login
              </MDBBtn>
            </form>
          </MDBCardText>
        </MDBCardBody>
        <MDBCardFooter>
          <div>
            <p style="color:white;">
              Not Registered?
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
    
    </PageWrapper>
</template>

<script>
  import {signInWithEmailAndPassword,  } from 'firebase/auth';
  import PageWrapper from "../components/PageWrapper";

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
    PageWrapper
    },
    setup() {
      const email = ref('');
      const errorMessage = ref();
      const password = ref('');
      const router = useRouter();
      const loginBtn = ref(null);

         const unfocusLogin = () => {
      loginBtn.value.$el.blur();
    };
      const login = async () => {
      try {
        unfocusLogin();    
          await signInWithEmailAndPassword(auth, email.value, password.value);
              
         
            router.push('/');
          }
        catch (error) {

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
      return { login, email, errorMessage, password,loginBtn };
    }
  };
</script>
<style>


.errorMsg{
  border: 1px solid red;
  font-size: 15px;
  padding: 2%;
  max-width: 45vw;
  color: red;
  background-color: pink;
}

/* only works when not scoped */
.loginInput.form-control {
  border-radius: 0px !important;
  color: white !important;
}

.loginBtn {
  border-color: grey!important;
}

</style>

