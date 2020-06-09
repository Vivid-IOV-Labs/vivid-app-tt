<template>
  <div>
    <button id="go-button">Go</button>
  </div>
</template>

<style>
</style>

<script>
//import RequestStream from '@/components/RequestStream.vue'

//document.getElementByID('gobutton').addEventListener('click')

// window.document.getElementById("gobutton").addEventListener("click", myFunction);
// function myFunction() {
//   //document.getElementById("demo").innerHTML = "Hello World";
//   console.log('go button clicked')
// }

export default {
  name: "main_page",
  data() {
    return {};
  },
  methods: {
    pushToViewStreamPage() {
      console.log('go done')
      this.$emit("push-page");
    }
  }
};
</script>
