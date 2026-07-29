// import { memo, useMemo } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const DEFAULT_CENTER = [22.7196, 75.8577];
// const DEFAULT_ZOOM = 10;
// const MAP_STYLE = { height: "500px", width: "100%" };

// function OutletMap({ outlets }) {

//   const validOutlets = useMemo(
//     () =>
//       outlets
//         .map((outlet) => ({
//           ...outlet,
//           lat: Number(outlet.latitude),
//           lng: Number(outlet.longitude),
//         }))
//         .filter((outlet) => Number.isFinite(outlet.lat) && Number.isFinite(outlet.lng)),
//     [outlets]
//   );

//   return (
//     <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={MAP_STYLE}>
//       <TileLayer
//         url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="&copy; OpenStreetMap contributors"
//       />

//       {validOutlets.map((outlet) => (
//         <Marker key={outlet.id} position={[outlet.lat, outlet.lng]}>
//           <Popup>
//             <h3>{outlet.outletName}</h3>
//             <p>Owner: {outlet.ownerName}</p>
//             <p>Status: {outlet.status}</p>
            
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// }

// export default memo(OutletMap);


import { memo, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet marker icons in production (Netlify/Vercel)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [22.7196, 75.8577];
const DEFAULT_ZOOM = 10;

const MAP_STYLE = {
  height: "500px",
  width: "100%",
};

function OutletMap({ outlets }) {
  const validOutlets = useMemo(() => {
    return outlets
      .map((outlet) => ({
        ...outlet,
        lat: Number(outlet.latitude),
        lng: Number(outlet.longitude),
      }))
      .filter(
        (outlet) =>
          Number.isFinite(outlet.lat) &&
          Number.isFinite(outlet.lng)
      );
  }, [outlets]);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={MAP_STYLE}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {validOutlets.map((outlet) => (
        <Marker
          key={outlet.id}
          position={[outlet.lat, outlet.lng]}
        >
          <Popup>
            <h3>{outlet.outletName}</h3>
            <p>Owner: {outlet.ownerName}</p>
            <p>Status: {outlet.status}</p>
            <p>Latitude: {outlet.latitude}</p>
            <p>Longitude: {outlet.longitude}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default memo(OutletMap);