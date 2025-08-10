declare module "@mapbox/mapbox-sdk/services/geocoding" {
  import mbxClient from "@mapbox/mapbox-sdk";
  function mbxGeocoding(options: { accessToken: string }): any;
  export default mbxGeocoding;
}
