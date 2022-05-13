/<template>
  <div class="profilePage">
    <MDBCard text="center">
    <MDBCardHeader>Your Profile</MDBCardHeader>
    <MDBCardBody>
      <MDBCardTitle>{{displayName}}</MDBCardTitle>
      <MDBCardText>
        Profile Pic Here
      </MDBCardText>
      <MDBBtn tag="a" href="#!" color="primary">View Favourites</MDBBtn>
    </MDBCardBody>
  </MDBCard>
    </div>
</template>

<script>
import getUser from '../composables/getUser';
import{ref}  from 'vue';
 import { MDBCard, MDBCardBody, MDBCardHeader, MDBCardTitle, MDBCardText, MDBBtn } from "mdb-vue-ui-kit";
export default {
  components: {
      MDBCard,
      MDBCardBody,
      MDBCardHeader,
      MDBCardTitle,
      MDBCardText,
      MDBBtn
    },
    setup(){
      const {currentUser} = getUser();
      const displayName = ref('');
      displayName.value = currentUser.value.displayName;
       return{displayName}
    }
}
</script>

<style scoped>
  .profilePage {
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