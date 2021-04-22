import emitter from "./emitter";

export default function(video) {
  const moclWrapper = document.createElement("div");
  moclWrapper.classList.add("plyr__video-wrapper");
  function mockWrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  }
  mockWrap(video, moclWrapper);
  const plyr_div = document.createElement("div");
  plyr_div.classList.add("plyr--video");
  mockWrap(moclWrapper, plyr_div);
  return {
    ...emitter,
    elements: { container: plyr_div, wrapper: moclWrapper },
    toggleControls: () => {}
  };
}
`    <div class="video__container">
<div tabindex="0" class="plyr plyr--full-ui plyr--video plyr--html5 plyr--fullscreen-enabled">
  <div class="plyr__video-wrapper"><video id="video" playsinline="" preload="auto"></video>
    <div class="plyr__poster" hidden=""></div>
  </div>
</div>
<div class="loading ">
  <base-icon-stub name="spinner" spin="true" fill="true"></base-icon-stub>
</div>
</div>`;
