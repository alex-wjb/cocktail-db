<template>
<div class="resetPage">
    <div class="login w-100 p-4 d-flex align-items-center justify-content-center" style="height: 70%">
      <MDBCard text="center">
        <MDBCardHeader>
          Reset Password
        </MDBCardHeader>
        <MDBCardBody>
          <MDBCardTitle v-if="error" class="mb-4 errorMsg">
            <img src="https://i.imgur.com/GnyDvKN.png" alt="Red x"> {{ error }}
          </MDBCardTitle>
          <MDBCardText>
            <form @submit.prevent="handleSubmit">
              <MDBInput
                id="form2Email"
                v-model="email"
                type="email"
                label="Email address"
                wrapper-class="mb-4"
              />
              <MDBBtn type="submit" color="primary">
                Send reset email
              </MDBBtn>
            </form>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </div>
    </div>
</template>

<script>
  import usePassReset from '../composables/passReset';
  import { ref } from 'vue';
  import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardHeader,
    MDBCardText,
    MDBCardTitle,
    MDBInput
  } from 'mdb-vue-ui-kit';
  export default {
    name: 'PassReset',
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
      const email = ref('');
      const { error, passReset } = usePassReset();
      const handleSubmit = async ()=> {
        //attempt to send reset email
        await passReset(email.value);
        

        
        if (!error.value ) alert('Password reset email sent');
      };







      return { email, error, handleSubmit };
    }
  };
</script>

<style>
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
.resetPage {
  background-color: lightgrey;
  min-height: 100vh;
  padding-top: 115px;
  width: 100%;
  overflow-x: hidden;
  padding-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
}

</style>