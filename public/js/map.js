
      mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 9 // starting zoom
        });
        console.log(listing.geometry.coordinates)

        const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset : 25}).setHTML(`<h1> ${listing.location}</h1> <p>Exact location provided after booking</p>`))
        .addTo(map)
        map.loadImage(
          'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
          (error, image) => {
              if (error) throw error;
              map.addImage('cat', image)
          });

        