<template>
  <div class="camera">
    <div class="cameraWrapper">
      <!-- Button to open/close video stream -->
      <div class="video-container">
        <!-- Video Stream -->
        <video
          v-show="!isPhotoTaken"
          class="videoStream"
          ref="camera"
          autoplay
          playsinline
        ></video>
        <!-- Canvas to display taken photo -->

        <canvas
          id="photoTaken"
          v-show="isPhotoTaken"
          class="takenPhoto"
          ref="canvas"
          :width="540"
          :height="540"
        ></canvas>
      </div>
      <div v-if="isCameraOpen" class="controls">
        <MDBBtn
          class="photoBtn rounded-0"
          color="dark"
          outline="light"
          @click="takePhoto"
          v-show="!isPhotoTaken"
        >
          Take Photo
        </MDBBtn>
        <MDBBtn
          class="photoBtn rounded-0"
          color="dark"
          outline="light"
          @click="takePhoto"
          v-show="isPhotoTaken"
        >
          Retake
        </MDBBtn>
        <MDBBtn
          v-show="isPhotoTaken"
          class="closeBtn rounded-0"
          color="dark"
          outline="light"
          @click="
            uploadPhoto(), toggleCamera(), (this.$parent.$parent.showCamera = false)
          "
        >
          Upload</MDBBtn
        >
        <MDBBtn
          class="closeBtn rounded-0"
          color="dark"
          outline="light"
          @click="toggleCamera(), (this.$parent.$parent.showCamera = false)"
        >
          Close</MDBBtn
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { MDBBtn } from "mdb-vue-ui-kit";
import getUser from "../composables/getUser";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
export default {
  emits: ["photoUploaded"],
  components: { MDBBtn },
  setup(props, ctx) {
    const isCameraOpen = ref(false);
    const isPhotoTaken = ref(false);
    const canvas = ref(null);
    const photoDl = ref(null);
    const camera = ref(null);
    const { currentUser } = getUser();

    const createCameraEle = () => {
      const constraints = (window.constraints = {
        audio: false,
        video: {
          width: 540,
          height: 540,
        },
      });
      console.log("HELLO1")

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          camera.value.srcObject = stream;
        })
        .catch((error) => {
          console.log("HELLO")
          console.log(error);
        });
    };
    const endCameraStream = () => {
      const tracks = camera.value.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    };
    const toggleCamera = () => {
      if (isCameraOpen.value) {
        isCameraOpen.value = false;
        isPhotoTaken.value = false;
        endCameraStream();
        console.log("camera closed")
      } else {
        isCameraOpen.value = true;
        createCameraEle();
      }
    };
    const takePhoto = () => {
      const context = canvas.value.getContext("2d");
      const photo = camera.value;
      isPhotoTaken.value = !isPhotoTaken.value;

      context.drawImage(
        photo,
        0,
        0,
        540,
        camera.value.videoHeight / (camera.value.videoWidth / 540)
      );
    };
    const downloadImage = () => {
      const download = photoDl.value;
      const canvas = canvas.value
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
      download.setAttribute("href", canvas);
    };

    const uploadPhoto = () => {
      let imageBlob = null;
      canvas.value.toBlob((blob) => {
        const user = currentUser.value.uid;
        const metadata = {
          contentType: "image/png",
        };
        const storage = getStorage();
        const storage_ref = storageRef(
          storage,
          user + "/images" + "/profile.png"
        );
        uploadBytes(storage_ref, blob, metadata)
          .then(() => {
            ctx.emit("photoUploaded");
          })
          .catch((error) => {
            switch (error.code) {
              case "storage/unauthorized":
                console.log(
                  "User doesn't have permission to access the object"
                );
                break;
              case "storage/canceled":
                console.log("User canceled the upload");
                break;
              case "storage/unknown":
                console.log(
                  "Unknown error occurred, inspect error.serverResponse"
                );
                break;
            }
          });

        imageBlob = blob;
      });
      return imageBlob;
    };

    toggleCamera();
    return {
      createCameraEle,
      toggleCamera,
      endCameraStream,
      takePhoto,
      downloadImage,
      camera,
      canvas,
      isCameraOpen,
      isPhotoTaken,
      photoDl,
      uploadPhoto,
    };
  },
};
</script>

<style scoped>
.camera {
  padding-top: 115px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* overflow: hidden; */
  background: rgba(0, 0, 0, 0.45);
}

.cameraWrapper {
  position: relative;
  width: 540px;
  height: 600px;
  margin: auto;
  background-color: #262626;
}

.controls {
  position: absolute;
  font-size: 25px;
  cursor: pointer;
  margin: auto;
  left: 0;
  bottom: 5px;
  right: 0;
}

.closeBtn {
  display: inline-block;
  margin: 3px;
  margin-bottom: 7px;
  border-color: grey;
}

.photoBtn {
  display: inline-block;
  margin: 3px;
  margin-bottom: 7px;
  border-color: grey;
}

.video-container {
  position: absolute;
  margin: auto;
  height: 540px;
  width: 540px;
  left: 0;
  right: 0;
}
.videoStream {
  width: 100%;
  height: 100%;
  object-fit: cover;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
.takenPhoto {
  width: 540px;
  height: 540px;
  object-fit: cover;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

@media (max-width: 600px) {
  .cameraWrapper {
    position: relative;
    width: 360px;
    height: 420px;
    margin: auto;
    background-color: #262626;
  }
  .video-container {
    position: absolute;
    margin: auto;
    height: 360px;
    width: 360px;
    left: 0;
    right: 0;
  }
  .takenPhoto {
    width: 360px;
    height: 360px;
  }
}

@media (max-height: 420px) {
  .cameraWrapper {
    position: relative;
    width: 270px;
    height: 310px;
    margin: auto;
    background-color: #262626;
  }
  .video-container {
    position: absolute;
    margin: auto;
    height: 270px;
    width: 270px;
    left: 0;
    right: 0;
  }
  .camera {
    padding-top: 70px;
  }
  .controls {
    font-size: 25px;
    cursor: pointer;
    margin: auto;
    left: 0;
    bottom: -1px;
    right: 0;
  }
  .closeBtn {
    margin: 3px;
  }

  .photoBtn {
    margin: 3px;
  }
  .takenPhoto {
    width: 270px;
    height: 270px;
  }
}
</style>
