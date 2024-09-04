import { createContext, useState } from "react";

export const ListVisibilityContext = createContext(
    {
        visibility : "hidden",
        displayList : ()=>{},
        undisplayList : ()=>{},
    }
)

export function ListVisibilityProvider({children}){
    const [visibility, setVisibility] = useState("hidden")

    function displayList(){
        if(visibility == "hidden"){
            setVisibility("");
        }
    }
    function undisplayList(){
        if (visibility == "") {
            setVisibility("hidden")
        }
    }

    return (
        <ListVisibilityContext.Provider value={{visibility:visibility, displayList : displayList, undisplayList : undisplayList}}>
            {children}
        </ListVisibilityContext.Provider>
    )
}