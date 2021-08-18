import {
  highlighteds,
  cryptos,
  gamings,
  others,
  earncompleted,
  earnlatests
} from "../../../../db/media";

const state = () => ({
  earncompleted,
  earnlatests,
  highlighteds,
  totalHighlighteds: highlighteds.length,
  cryptos,
  totalCryptos: cryptos.length,
  gamings,
  totalGamings: gamings.length,
  others,
  totalOthers: others.length,
  currentMedia: null
});

export default state;
