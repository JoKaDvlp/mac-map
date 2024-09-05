/*

Composant Bar de recherche

*/


import { useContext, useRef } from 'react';
import './SearchBar.css';
import { SearchContext } from '../../context/SearchContext';
import { ListVisibilityContext } from '../../context/ListVisibilityContext';

export default function SearchBar(){
    const {searchLocation, locations, lookupLocation} = useContext(SearchContext);
    const {visibility, displayList} = useContext(ListVisibilityContext)
    const formRef = useRef(null);

    // Ecoute la soumission du formulaire
    function handleSubmit(e){
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const searchTerm = formData.get("search").toLowerCase()
        displayList();
        if (searchTerm) {
            searchLocation(searchTerm);
        } else {
            alert("Merci de renseigner Une ville");
        }
    }

    function handleClick(){
        document.querySelector("input[name='search']").value = ""
    }

    return (
        <div className='search-bar'>
            <form id='myform' ref={formRef} onSubmit={handleSubmit}>
                <p className='search-title'>Rechercher un restaurant</p>
                <div className='flex justify-between search-zone'>
                    <div className='flex align-center'>
                        <input type="text" name='search'/>
                        <div className='erase-btn' onClick={handleClick}>
                            <img className='img-responsive' src="/images/erase.png" alt="Supprimer la recherche" />
                        </div>
                    </div>
                    <button type='submit' className='flex align-center justify-center'>
                        <img src="/images/search.png" alt="Logo loupe pour la recherche" />
                    </button>
                </div>
                <div className={`${visibility} propositions-list`}>
                    {Array.isArray(locations) && locations.map((location, pos)=>{
                        if (location.addresstype !== "municipality" && location.addresstype !== "political") {
                            return (
                                <div className='propositions' key={pos} onClick={()=>{lookupLocation(location)}}>
                                    <p>{location.name}, {location.address.county}, {location.address.postcode} {location.address.country}</p>
                                </div>
                            )
                        }
                    })}
                </div>
            </form>
        </div>
    )
}