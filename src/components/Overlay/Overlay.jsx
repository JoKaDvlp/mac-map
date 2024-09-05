/*

Composant Overlay

*/


import { useContext } from 'react';
import './Overlay.css';
import { SearchContext } from '../../context/SearchContext';

export default function(){

    const {restaurantSelected, geolocate} = useContext(SearchContext)
    
    return (
        <div className='overlay'>
            <div className='btn-geolocate'>
                <button className='btn-yellow' onClick={geolocate}>
                    <img className='img-responsive' src="/images/position.png" alt="Se géolocaliser" />
                </button>
            </div>
            <img src="" alt="" />
            <div className='overlay-content'>
                <p className='overlay-title'>{restaurantSelected.display_name != null ? "Restaurant sélectionné" : "Aucun restaurant sélectionné"}</p>
                {restaurantSelected.display_name != null && (
                    <div className='flex'>
                        {restaurantSelected.display_name}
                        <button className='btn-yellow'>Continuer</button>
                    </div>
                )}
            </div>
        </div>
    )
}