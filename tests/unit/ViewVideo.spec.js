import { mount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import ViewVideo from "@/pages/ViewVideo.vue";
import Vuex from "vuex";
import store from "@/store";
import router from "@/router";
import { htmlMediaMock } from "./htmlMediaMock";
import delay from "@/util/delay";
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
import Plyr from "plyr";

describe("ViewVideo", () => {
  htmlMediaMock();

  const wrapper = mount(ViewVideo, {
    store,
    router,
    localVue,
    stubs: {
      "base-video": {
        template: "<div><video id='video'></video></div>",
        data: function() {
          return {
            player: new Plyr("#video")
          };
        }
      },
      "v-ons-page": true,
      "v-ons-popover": true
    }
  });

  it("Attempt HLS", async () => {
    const attachHls = jest.spyOn(ViewVideo.methods, "attachHls");

    wrapper.vm.player.on("ready", () => {
      expect(attachHls).toHaveBeenCalled();
    });
  });
});
