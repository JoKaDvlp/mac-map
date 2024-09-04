import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import SearchBar from "../SearchBar/SearchBar";
import { SearchProvider } from "../../context/SearchContext";
import { ListVisibilityProvider } from "../../context/ListVisibilityContext";
import Overlay from "../Overlay/Overlay";

export default function ReactLeaflet(){

    return (
        <div>
            <MapContainer
                center={[47, 2]} 
                zoom={5}
                scrollWheelZoom={true}
                style={{
                    height: "100vh",
                    width: "100vw",
                }}>
                
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                <ListVisibilityProvider>
                    <SearchProvider>
                        <SearchBar/>
                        <Overlay/>
                    </SearchProvider>
                </ListVisibilityProvider>

            </MapContainer>
        </div>
    );

}
