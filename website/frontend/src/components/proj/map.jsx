import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import 'lrm-graphhopper'
import L from 'leaflet'
import './map.css'

// --- ICON CONFIGURATION ---
L.Routing.Line.prototype.options.styles = [{ color: '#ff5700', weight: 9, opacity: 1 }];

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// --- HELPER COMPONENTS ---

// 1. Handle clicks on the map
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng)
    },
  })
  return null
}

// 2. Handle Map Center Updates
function ChangeMapView({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null
}

// 3. Capture the map instance for the parent component
function MapController({ setMapInstance }) {
  const map = useMap();
  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);
  return null;
}

// --- DATA & ICONS ---

const shops = [
  { id: 1, position: [22.426253124953316, 114.21146628585426], name: 'Science Park', color: 'red' },
  { id: 2, position: [22.421892653224667, 114.22674343554884], name: 'Chung On Shopping Centre', color: 'blue' },
  { id: 3, position: [22.408799131710907, 114.22191366905314], name: 'Kam Tai Court', color: 'green' },
]

const createCustomIcon = (shop = 0, color = 'red') => {
  if (!['blue', 'gold', 'red', 'green', 'orange', 'yellow', 'violet', 'grey', 'black'].includes(color)) {
    color = 'blue'
  }
  let url, size;
  if (shop === 1) {
    url = `https://cdn1.iconfinder.com/data/icons/aami-web-internet/64/aami7-44-512.png`
    size = [60, 60]
  } else {
    url = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`
    size = [25, 41]
  }
  return new L.Icon({
    iconUrl: url,
    className: 'custom-marker',
    iconSize: size,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

// --- SHOP MARKER COMPONENT ---
function ShopMarker({ shop, setCenter, drawRouteTo }) {
  const map = useMap();
  return (
    <Marker
      position={shop.position}
      icon={createCustomIcon(1, shop.color)}
      eventHandlers={{
        click: () => {
          map.setView(shop.position, 15);
          setCenter(shop.position);
        }
      }}
    >
      <Popup>
        <strong>{shop.name}</strong><br />
        Type: Shop<br />
        Lat: {shop.position[0].toFixed(4)}<br />
        Lng: {shop.position[1].toFixed(4)}
        <br />
        <button
          style={{ marginTop: '5px', cursor: 'pointer' }}
          onClick={() => drawRouteTo(shop.position)}
        >
          Go here
        </button>
      </Popup>
    </Marker>
  );
}

// --- MAIN MAP COMPONENT ---

const Map = () => {
  const [center, setCenter] = useState([22.41954687825948, 114.20506074423423]);
  const [status, setStatus] = useState(null);
  const [color, setColor] = useState('blue');
  const [myLocation, setMyLocation] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);

  // We use state for the map instance to ensure re-renders when map is ready
  const [mapInstance, setMapInstance] = useState(null);

  const [markers, setMarkers] = useState([
    {
      id: Date.now(),
      position: [22.41954687825948, 114.20506074423423],
      name: 'University Library',
      type: 'Marker',
      icon: createCustomIcon(0, 'blue')
    }
  ])

  const drawRouteTo = (dest) => {
    if (!mapInstance) {
      console.error("Map instance not found");
      return;
    }

    if (!myLocation) {
      alert('Click "My Location" first to establish a starting point!');
      return;
    }

    // Remove previous route
    if (routingControl) {
      try {
        mapInstance.removeControl(routingControl);
      } catch (e) {
        console.warn("Error removing control", e);
      }
      setRoutingControl(null);
    }

    const GH_KEY = import.meta.env.VITE_GRAPHHOPPER_API_KEY;
    if (!GH_KEY) {
      alert('Missing GraphHopper API key in .env file');
      return;
    }

    const control = L.Routing.control({
      waypoints: [
        L.latLng(myLocation[0], myLocation[1]),
        L.latLng(dest[0], dest[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false, // Hides the text instructions container
      createMarker: () => null, // Hides the default start/end markers (we have our own)
      lineOptions: {
        styles: [{ color: '#ff5700', weight: 6, opacity: 0.8 }],
        extendToWaypoints: false,
        missingRouteTolerance: 0
      },
      router: L.Routing.graphHopper(GH_KEY, {
        urlParameters: { vehicle: 'car' }
      })
    });

    control.on('routesfound', function (e) {
      const route = e.routes[0];
      const km = (route.summary.totalDistance / 1000).toFixed(1);
      const mins = Math.round(route.summary.totalTime / 60);
      alert(`Route found: ${km} km • ~${mins} min`);
    });

    control.on('routingerror', (e) => {
      console.error("Routing Error:", e);
      alert('Routing failed. Check console for details.');
    });

    // Add to map
    control.addTo(mapInstance);
    setRoutingControl(control);
  };

  const handleMapClick = (latlng) => {
    const newMarker = {
      id: Date.now(),
      position: [latlng.lat, latlng.lng],
      name: `Marker ${markers.length + 1}`,
      type: 'Marker',
      icon: createCustomIcon(0, color)
    }
    setMarkers([...markers, newMarker])
  }

  const addlocation = () => {
    if (!navigator.geolocation) return setStatus('Geolocation not supported');

    setStatus('Locating...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const posLatLng = [pos.coords.latitude, pos.coords.longitude];
        setMyLocation(posLatLng);
        setCenter(posLatLng);
        setStatus(null);

        const newMarker = {
          id: Date.now(),
          position: posLatLng,
          name: 'My Location',
          type: 'Marker',
          icon: createCustomIcon(0, 'red')
        };
        setMarkers(prev => [...prev, newMarker]);
      },
      () => setStatus('Failed to get location'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const clearMarkers = () => {
    setMarkers([])
    if (routingControl && mapInstance) {
      mapInstance.removeControl(routingControl);
      setRoutingControl(null);
    }
  }

  return (
    <div style={{ height: '95%', width: '100%', margin: '20px 0' }}>
      <div style={{ marginBottom: '10px' }}>
        <h2>Interactive Map - Click to Add Markers</h2>
        <button onClick={clearMarkers} style={{ padding: '5px 10px', marginBottom: '10px', marginRight: '10px' }}>
          Clear All Markers ({markers.length})
        </button>
        <button onClick={addlocation} style={{ padding: '5px 10px', marginBottom: '10px' }}>
          My Location {status ? `(${status})` : ''}
        </button>
      </div>
      <div style={{ marginBottom: '15px', display: 'inline-block' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Marker Color: </label>

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className='color-select'
        >
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="gold">Gold</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="violet">Violet</option>
          <option value="grey">Grey</option>
          <option value="black">Black</option>
        </select>
      </div>

      <div style={{ display: 'flex', height: '80%', gap: '20px' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '100%', width: '100%', flex: 3 }}
          preferCanvas={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController setMapInstance={setMapInstance} />

          <ChangeMapView center={center} />
          <MapClickHandler onMapClick={handleMapClick} />

          {markers.map(marker => (
            <Marker key={marker.id} position={marker.position} icon={marker.icon}>
              <Popup>
                <strong>{marker.name}</strong>
                <br />
                Type: {marker.type}
                <br />
                Latitude: {marker.position[0].toFixed(4)}
                <br />
                Longitude: {marker.position[1].toFixed(4)}
                <br />
                <button onClick={() => drawRouteTo(marker.position)}>Go here</button>
              </Popup>
            </Marker>
          ))
          }

          {shops.map(shop => (
            <ShopMarker
              key={shop.id}
              shop={shop}
              setCenter={setCenter}
              drawRouteTo={drawRouteTo}
            />
          ))}
        </MapContainer>

        <div className='MarkerList' style={{ flex: 1, overflowY: 'auto' }}>
          <h3>Markers List:</h3>
          <ul>
            {markers.map(marker => (
              <li key={marker.id} style={{ marginBottom: '10px', backgroundColor: '#f5f4f4ff', borderRadius: '10px'}}>
                {marker.name}<br />Lat: {marker.position[0].toFixed(4)}<br />Lng: {marker.position[1].toFixed(4)}
                <br />
                <button
                  style={{ marginTop: '5px', cursor: 'pointer', marginRight: '5px' }}
                  onClick={() => drawRouteTo(marker.position)}
                >
                  Go here
                </button>
                <button onClick={() => setMarkers(prev => prev.filter(m => m.id !== marker.id))}>Delete</button>
              </li>
            ))}
          </ul>
          <h3>Shops:</h3>
          <ul>
            {shops.map(shop => (
              <li
                key={shop.id}
                onClick={() => setCenter(shop.position)}
                style={{ cursor: 'pointer', padding: '5px 0', backgroundColor: '#f5f4f4ff', marginBottom: '5px', borderRadius: '10px' }}
              >
                {shop.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Map