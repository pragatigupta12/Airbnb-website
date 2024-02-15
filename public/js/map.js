
  mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style:'mapbox://styles/mapbox/streets-v12',
center: listing.geometry.coordinates, // starting position [lng, lat]
zoom: 9// starting zoom
});


// console.log(coordinates)
const marker = new mapboxgl.Marker({ color: 'black' })
.setLngLat(listing.geometry.coordinates)
.setPopup( new mapboxgl.Popup({offset: 25})
.setHTML(`<h3>${listing.location}</h3><h5>exact location provided after booking</h5>`))
.addTo(map);