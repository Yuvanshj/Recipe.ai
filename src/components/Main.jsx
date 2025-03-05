import React from "react";
import ClaudeRecipe from './ClaudeRecipe'
import IngredientsList from "./IngredientsList";
import { getRecipeFromMistral } from "../../Ai";

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [isBtnClicked, setIsBtnClicked] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [recipe, setRecipe] = React.useState();
    const recipeSection = React.useRef(null);

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient");
        setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    }

    async function apiCall() {
        setIsLoading(true); // Show loading animation
        try {
            const result = await getRecipeFromMistral(ingredients);
            setRecipe(result);
            console.log(result);
            setIsBtnClicked(true); // Show the recipe component
        } catch (error) {
            console.error("API call failed:", error);
        } finally {
            setIsLoading(false); // Hide loading animation
        }
    }

    React.useEffect(() => {
        
        if (recipe && recipeSection.current) {
            recipeSection.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [recipe]);

    return (


        <div>
            <div className="bg" style={{ display: isLoading ? "flex" : "none" }}>
                <div className="popup">
                    <div className="loading">

                    </div>
                </div>
            </div>
        
            <main>
                <form action={addIngredient} className="add-ingredient-form">
                    <input
                        type="text"
                        placeholder="e.g. oregano"
                        aria-label="Add ingredient"
                        name="ingredient"
                    />
                    <button>Add ingredient</button>
                </form>
    
                {ingredients.length > 0 && (
                    <IngredientsList
                        ref={recipeSection}
                        ingredients={ingredients}
                        onClick={apiCall}
                        check = {isLoading}
                    />
                )}
    
                {isBtnClicked && <ClaudeRecipe recipe={recipe} />}
            </main>
        </div>
    );
}