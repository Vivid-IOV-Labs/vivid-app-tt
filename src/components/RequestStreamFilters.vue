<template>
  <v-ons-page id="requestStreamFiltersPage">
    <v-ons-toolbar>
      <div class="left">
        <v-ons-back-button></v-ons-back-button>
      </div>
      <div class="center">
        <span class="badge badge-default onsPageTitleStyle">Request Options</span>
      </div>
    </v-ons-toolbar>

    <v-ons-list>
      <v-ons-list-item
        id="tags_panel"
        expandable
        :expanded.sync="tagsPanelView"
        @click="togglePanel('tags_panel')"
      >
        <span id="expandable_section_title">tags</span>
        <div class="expandable-content">
          <v-ons-list-item v-for="(tagOption, $index) in tagOptions" :key="tagOption" tappable>
            <label class="left">
              <v-ons-checkbox
                :input-id="'checkbox-' + $index"
                :value="tagOption"
                v-model="tagOptionsChecked"
              ></v-ons-checkbox>
            </label>
            <label class="center" :for="'checkbox-' + $index">{{ tagOption }}</label>
          </v-ons-list-item>
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <v-ons-list>
      <v-ons-list-item
        id="willAccept_panel"
        expandable
        :expanded.sync="willAcceptPanelView"
        @click="togglePanel('willAccept_panel')"
      >
        <span id="expandable_section_title">will accept</span>
        <div class="expandable-content">
          <textarea
            class="textarea textarea--transparent"
            maxlength="140"
            rows="6"
            placeholder="Input message"
            v-model="willAcceptPanelText"
          ></textarea>
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <v-ons-list>
      <v-ons-list-item
        id="tipOffered_panel"
        expandable
        :expanded.sync="tipOfferedView"
        @click="togglePanel('tipOffered_panel')"
      >
        <span id="expandable_section_title">tip offered</span>
        <div class="expandable-content">
          <v-ons-input
            type="number"
            placeholder="Amount per minute"
            float
            v-model="tipOfferedAmount"
          ></v-ons-input>
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <v-ons-list>
      <v-ons-list-item
        id="currencyView_panel"
        expandable
        :expanded.sync="currencyView"
        @click="togglePanel('currencyView_panel')"
      >
        <span id="expandable_section_title">currency</span>
        <div class="expandable-content">
          <v-ons-list>
            <v-ons-list-item
              v-for="(currencyTicker, $index) in currencyTickers"
              :key="currencyTicker"
              tappable
            >
              <label class="left">
                <v-ons-radio
                  :input-id="'radio-' + $index"
                  :value="currencyTicker"
                  v-model=" currencyTickerSelected"
                ></v-ons-radio>
              </label>
              <label :for="'radio-' + $index" class="center">{{ currencyTicker }}</label>
            </v-ons-list-item>
          </v-ons-list>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<style scoped>
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
@import "../css/requestStreamFilters.css";
</style>

<script>
export default {
  name: "requestStreamFilters",
  data() {
    return {
      tagsPanelView: false,
      tagOptions: ["Street View", "Crowds", "Buildings"],
      tagOptionsChecked: ["Street View"],
      willAcceptPanelView: false,
      willAcceptPanelText: "Side view of santa parade",
      acceptanceDescription: "",
      tipOfferedView: false,
      tipOfferedAmount: 0.05,
      currencyView: false,
      currencyTickers: ["USD", "GBP", "NEAR"],
      currencyTickerSelected: "NEAR"
    };
  },
  methods: {
    togglePanel(_idName) {
      switch (true) {
        case _idName == "tags_panel":
          if (this.tipOfferedView)
            document.getElementById("tipOffered_panel").hideExpansion();
          this.tipOfferedView = false;
          if (this.currencyView)
            document.getElementById("currencyView_panel").hideExpansion();
          this.currencyView = false;
          if (this.willAcceptPanelView)
            document.getElementById("willAccept_panel").hideExpansion();
          this.willAcceptPanelView = false;

          break;
        case _idName == "willAccept_panel":
          if (this.tipOfferedView)
            document.getElementById("tipOffered_panel").hideExpansion();
          this.tipOfferedView = false;
          if (this.currencyView)
            document.getElementById("currencyView_panel").hideExpansion();
          this.currencyView = false;
          if (this.tagsPanelView)
            document.getElementById("tags_panel").hideExpansion();
          this.tagsPanelView = false;

          break;
        case _idName == "tipOffered_panel":
          if (this.willAcceptPanelView)
            document.getElementById("willAccept_panel").hideExpansion();
          this.willAcceptPanelView = false;
          if (this.currencyView)
            document.getElementById("currencyView_panel").hideExpansion();
          this.currencyView = false;
          if (this.tagsPanelView)
            document.getElementById("tags_panel").hideExpansion();
          this.tagsPanelView = false;

          break;
        case _idName == "currencyView_panel":
          if (this.willAcceptPanelView)
            document.getElementById("willAccept_panel").hideExpansion();
          this.willAcceptPanelView = false;
          if (this.tipOfferedView)
            document.getElementById("tipOffered_panel").hideExpansion();
          this.tipOfferedView = false;
          if (this.tagsPanelView)
            document.getElementById("tags_panel").hideExpansion();
          this.tagsPanelView = false;

          break;
        default:
          // code block
          console.log(arguments);
      }
    }
  }
};
</script>
