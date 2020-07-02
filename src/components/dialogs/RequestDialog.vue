<template>
    <v-ons-dialog 
    cancelable
    :visible="value"
    @update:visible="updateVisible"
  >
    Request Dialog POP Up
        <v-ons-page>
            <v-ons-toolbar>
                <div class="center">Make a live stream request</div>
            </v-ons-toolbar>
            <v-ons-list>
                <v-ons-list-item>
                    <div style="display:flex;flex-direction:column; padding:1rem">
                        <label for="">Request Title</label>
                          <textarea class="textarea textarea--transparent" placeholder="Text message"></textarea>
                        <small>[10 words max]</small>
                    </div>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div style="display:flex;flex-direction:column; padding:1rem">
                        <label for="">Add Hashtags</label>
                        <v-ons-list >
                            <div>
                                <v-ons-list-item>
                                    <v-ons-input placeholder="What do you want to watch?" float >
                                    </v-ons-input>
                                </v-ons-list-item>
                                <v-ons-list-item>
                                    <v-ons-input placeholder="What do you want to watch? ">
                                    </v-ons-input>
                                </v-ons-list-item>
                                <v-ons-list-item>
                                    <v-ons-input placeholder="What do you want to watch? ">
                                    </v-ons-input>
                                </v-ons-list-item>
                            </div>
  
                        </v-ons-list>
                    </div>
                </v-ons-list-item>
                <v-ons-list-item>
                    <div style="display:flex;flex-direction:column; padding:1rem">
                        <label for="">Add Location</label>
                        <v-ons-search-input placeholder="Search something" ></v-ons-search-input>
                    </div>
                </v-ons-list-item>
            </v-ons-list>
            <v-ons-button style="width: 90%;
            display: block;
            margin: 1rem auto;
            text-align: center;
            padding: 1rem;
            background: #16dbdb;
            color: #000;" @click="closeRequestDialog">
                    Close
            </v-ons-button>
        </v-ons-page>
    </v-ons-dialog>
</template>

<script>
  export default {
    name:"RequestDialog",
    props: {
      value: {
        type: Boolean,
        default:false 
      },
      onClose:{
        type: Function,
        default: () => Promise.resolve
      }
    },
    methods: {
      updateVisible(value) {
        this.$emit('input', value)
      },
      closeRequestDialog(){
       // this.onClose();
        this.$emit('input', false);
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>