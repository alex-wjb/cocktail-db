<template>
 
    <div
      class="login w-100 reset-container d-flex align-items-center justify-content-center"
      style="height: 70%"
    >
      <MDBCard text="center" bg="dark" class="rounded-0">
        <MDBCardHeader style="color: white">
          <h4>Reset Password</h4>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle v-if="error" class="mb-4 errorMsg">
            <img src="https://i.imgur.com/GnyDvKN.png" alt="Red x" />
            {{ error }}
          </MDBCardTitle>
          <MDBCardText>
            <form @submit.prevent="reset">
              <MDBInput
                class="resetInput"
                id="form2Email"
                v-model="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
              />
              <MDBBtn
                type="submit"
                class="rounded-0"
                color="dark"
                outline="light"
                style="border-color: grey"
              >
                Send reset email
              </MDBBtn>
            </form>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </div>

</template>

<script>

import usePassReset from "../composables/passReset";
import { ref } from "vue";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardText,
  MDBCardTitle,
  MDBInput,
} from "mdb-vue-ui-kit";
export default {
  name: "PassReset",
  components: {
    MDBInput,
    MDBBtn,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    
  },
  setup() {
    const email = ref("");
    const { error, passReset } = usePassReset();
    const reset = async () => {
      await passReset(email.value);
      if (!error.value) alert("Password reset email sent");
    };

    return { email, error, reset };
  },
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
.reset-container{
}

.resetInput {
  border-radius: 0px !important;
  color: white !important;
}
</style>
