import code_transforms from "@/util/location_code_string_prep.js";
import { OpenLocationCode } from "open-location-code";
const openLocationCode = new OpenLocationCode();

const createOpenLocationCode = ({ lon, lat }) => {
  const code = openLocationCode.encode(Number(lon), Number(lat), 11);
  const formatted = code_transforms.replace_plus_symbol(code);
  return formatted;
};

export default createOpenLocationCode;
