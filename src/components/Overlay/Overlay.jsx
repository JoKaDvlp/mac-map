import { useContext } from 'react';
import './Overlay.css';
import { SearchContext } from '../../context/SearchContext';

export default function(){

    const {restaurantSelected} = useContext(SearchContext)
    
    return (
        <div className='overlay'>
            <p className='overlay-title'>{restaurantSelected.display_name != null ? "Restaurant sélectionné" : "Aucun restaurant sélectionné"}</p>
            {restaurantSelected.display_name != null && (
                <div className='flex'>
                    {restaurantSelected.display_name}
                    <button className='btn-yellow'>Continuer</button>
                </div>
            )}
        </div>
    )
}