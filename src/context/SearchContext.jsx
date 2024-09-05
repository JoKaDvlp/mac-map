import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { ListVisibilityContext } from "./ListVisibilityContext";

export const SearchContext = createContext(
    {
        locations: [],
        searchedLocation: "",
        viewBoundingbox: [],
        restaurants: [],
        searchLocation: () => { },
        lookupLocation: () => { },
        restaurantSelected: {}
    }
)

export function SearchProvider({ children }) {
    const [locations, setLocations] = useState([]);
    const [searchedLocation, setSearchedLocation] = useState("");
    const [viewBoundingbox, setViewBoundingbox] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantSelected, setRestaurantSelected] = useState({});
    const markersRef = useRef([]);

    const {undisplayList} = useContext(ListVisibilityContext)

    const map = useMap();

    useEffect(() => {
        if (searchedLocation) {
            fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchedLocation)}&addressdetails=1&format=json&limit=10&countrycodes=fr`)
                .then(res => res.json())
                .then(data => {
                    setLocations(data)
                })
        }
    }, [searchedLocation])

    useEffect(() => {
        if (viewBoundingbox && viewBoundingbox.length === 4) {
            let url = `https://nominatim.openstreetmap.org/search?q=McDonald's&addressdetails=1&format=json&countrycodes=fr&viewbox=${encodeURIComponent(parseFloat(viewBoundingbox[2]))},${encodeURIComponent(parseFloat(viewBoundingbox[0]))},${encodeURIComponent(parseFloat(viewBoundingbox[3]))},${encodeURIComponent(parseFloat(viewBoundingbox[1]))}&bounded=1`
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    map.fitBounds([
                        [parseFloat(viewBoundingbox[0]), parseFloat(viewBoundingbox[2])],
                        [parseFloat(viewBoundingbox[1]), parseFloat(viewBoundingbox[3])]
                    ])
                    setRestaurants(data);
                })
        }
    }, [viewBoundingbox])

    useEffect(() => {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        restaurants.forEach(restaurant => {
            const leafletMarker = L.marker([parseFloat(restaurant.lat), parseFloat(restaurant.lon)]).addTo(map);
            leafletMarker.bindPopup(`${restaurant.display_name}<br><button class="popup-btn btn-yellow">Choisir</button>`);
            markersRef.current.push(leafletMarker);

            leafletMarker.on('popupopen', (event) => {
                const button = event.popup._contentNode.querySelector('.btn-yellow');
                if (button) {
                    button.addEventListener('click', () => {
                        setRestaurantSelected(restaurant)
                    });
                }
            });
        });
    }, [restaurants, map]);

    function searchLocation(location) {
        setSearchedLocation(location);
    }

    function lookupLocation(location) {
        setViewBoundingbox(location.boundingbox);
        undisplayList();
        document.querySelector("input[name='search']").value = `${location.name}, ${location.address.county}, ${location.address.postcode} ${location.address.country}`
    }

    return (
        <SearchContext.Provider value={{ locations: locations, searchedLocation: searchedLocation, viewBoundingbox: viewBoundingbox, restaurants: restaurants, searchLocation: searchLocation, lookupLocation: lookupLocation, restaurantSelected : restaurantSelected }}>
            {children}
        </SearchContext.Provider>
    )
}