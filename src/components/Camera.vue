<template>
  <div class="camera rounded-3 text-center">
    <div class="cameraWrapper rounded-3">
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
      <div v-if="isCameraOpen" class="controls rounded-3">
        <button
          class="cameraBtn m-1 btn btn-dark rounded-1"

          color="dark"
          outline="light"
          @click="takePhoto"
          v-show="!isPhotoTaken"
          style="border-width:2px;"
        >
          Take Photo
      </button>
        <button
          class="cameraBtn m-1 btn btn-dark rounded-1"
          color="dark"
          outline="light"
          @click="takePhoto"
          v-show="isPhotoTaken"
          style="border-width:2px;"
        >
          Retake
      </button>
        <button
          v-show="isPhotoTaken"
          class="cameraBtn m-1 btn btn-dark rounded-1"
          color="dark"
          style="border-width:2px;"
          outline="light"
          @click="
            uploadPhoto(), toggleCamera(), (this.$parent.showCamera = false)
          "
        >
          Upload</button
        >
        <button
          class="cameraBtn m-1 btn btn-dark rounded-1"
         
          style="border-width:2px;"
          outline="light"
          @click="toggleCamera(), (this.$parent.showCamera = false)"
        >
          Close</button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import getUser from "../composables/getUser";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
export default {
  emits: ["photoUploaded"],
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
 

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          camera.value.srcObject = stream;
        })
        .catch((error) => {
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
            toggleCamera();
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
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);

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

.cameraBtn{
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
  .takenPhoto {
    width: 270px;
    height: 270px;
  }
}
</style>
