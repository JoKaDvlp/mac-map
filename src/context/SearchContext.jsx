/*

Contexte de recherche.
    Permet de gérer la recherche des restaurants par nom de ville ou géolocalisation

*/

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { ListVisibilityContext } from "./ListVisibilityContext";

export const SearchContext = createContext(
    {
        locations: [],
        searchedLocation: "",
        viewBoundingbox: [],
        restaurants: [],
        searchLocation: () => {},
        lookupLocation: () => {},
        restaurantSelected: {},
        geolocate : () => {},
    }
)

export function SearchProvider({ children }) {
    const [locations, setLocations] = useState([]);
    const [searchedLocation, setSearchedLocation] = useState("");
    const [viewBoundingbox, setViewBoundingbox] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantSelected, setRestaurantSelected] = useState({});

    const markersRef = useRef([]);

    const { undisplayList } = useContext(ListVisibilityContext)

    const map = useMap();

    // Récupérer la liste des villes correspondant à la recherche dans le cas d'une recherche manuell
    useEffect(() => {
        if (searchedLocation) {
            fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchedLocation)}&addressdetails=1&format=json&limit=10&countrycodes=fr`)
                .then(res => res.json())
                .then(data => {
                    setLocations(data)
                })
            }
    }, [searchedLocation,])

    // Recherche restaurants dans la zone choisie (ville)
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

    // Ajout des markers
    useEffect(() => {
        // On retire les markers présents
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        restaurants.forEach(restaurant => {
            // Pour chaque restaurants, ajout d'un marker avec popup
            const leafletMarker = L.marker([parseFloat(restaurant.lat), parseFloat(restaurant.lon)]).addTo(map);
            leafletMarker.bindPopup(`${restaurant.display_name}<br><button class="popup-btn btn-yellow">Choisir</button>`);
            // On stocke le marker pour pouvoir le retrouver et le supprimer à la prochaine recherche
            markersRef.current.push(leafletMarker);

            // Ajout écouteur d'évènements pour le boutons du popup ouvert
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

    // Récupère la position de l'utilisateur et récupère les informations de localistaions
    function geolocate(){
        // Vérifie si le navigateur supporte la géolocalisation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let userLatitude = position.coords.latitude
                    let userLongitude = position.coords.longitude
                    // Récupère les données lié à la géolocalisation
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${parseFloat(userLatitude)}&lon=${parseFloat(userLongitude)}&zoom=10`)
                    .then(res => res.json())
                    .then(data => {
                        setLocations(data)
                        setViewBoundingbox(data.boundingbox);
                    })
                },
            );
        }
    }


    function searchLocation(location) {
        setSearchedLocation(location);
    }

    function lookupLocation(location) {
        setViewBoundingbox(location.boundingbox);
        undisplayList();
        document.querySelector("input[name='search']").value = `${location.display_name}`
    }

    return (
        <SearchContext.Provider value={{ locations: locations, searchedLocation: searchedLocation, viewBoundingbox: viewBoundingbox, restaurants: restaurants, searchLocation: searchLocation, lookupLocation: lookupLocation, restaurantSelected: restaurantSelected, geolocate : geolocate }}>
            {children}
        </SearchContext.Provider>
    )
}