mapboxgl.accessToken = mapToken;
console.log(campground)
const cg = JSON.parse(campground);
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: cg.geometry.coordinates,
zoom: 9
});

new mapboxgl.Marker()
.setLngLat(cg.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${cg.title}</h3> <p>${cg.location}</p>`)
)
.addTo(map);
