const calculateEachWayAccumulator = () => {
  // Get the stake and place fraction values
  let stake = parseFloat(document.getElementById("stake").value) || 0;
  let placeFraction =
    parseFloat(document.getElementById("eachWayFraction").value) || 0;
  let oddsInputs = document.querySelectorAll(".odds");

  // Check if the stake and place fraction values are valid
  if (stake <= 0 || placeFraction <= 0) {
    document.getElementById("result").innerHTML =
      "<p style='color:red;'>Please enter valid stake and place fraction.</p>";
    return;
  }

  //  We're planning to display the result in the result div,
  // so we'll need all of these variables to store the calculations
  let winAccumulator = 1;
  let placeAccumulator = 1;
  let validOddsCount = 0;

  oddsInputs.forEach(({ value }) => {
    let winOdds = parseFloat(value);

    // each additional odds value entered will be multiplied to the accumulator
    // and the place odds will be calculated and multiplied to the place accumulator
    if (!isNaN(winOdds) && winOdds > 1) {
      winAccumulator *= winOdds;
      let placeOdds = 1 + (winOdds - 1) * placeFraction;
      placeAccumulator *= placeOdds;
      validOddsCount++;
    }
  });

  if (validOddsCount === 0) {
    document.getElementById("result").innerHTML =
      "<p style='color:red;'>Enter at least one valid odds value.</p>";
    return;
  }

  let winReturn = stake * winAccumulator;
  let placeReturn = stake * placeAccumulator;
  let totalReturn = winReturn + placeReturn;
  let totalProfit = totalReturn - 2 * stake;

  document.getElementById("result").innerHTML = `
          <p>Win Accumulator Return: £${winReturn.toFixed(2)}</p>
          <p>Place Accumulator Return: £${placeReturn.toFixed(2)}</p>
          <p>Total Return: £${totalReturn.toFixed(2)}</p>
          <p>Total Profit: £${totalProfit.toFixed(2)}</p>
      `;
};

const addSelection = () => {
  const oddsContainer = document.getElementById("odds-container");
  const selectionDiv = document.createElement("div");
  selectionDiv.classList.add("selection");

  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("odds");
  input.placeholder = `Odds for selection ${oddsContainer.children.length + 1}`;
  input.value = "6"; // Default value
  input.min = "1";

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.textContent = "-";
  removeButton.onclick = () => removeSelection(selectionDiv);

  selectionDiv.appendChild(input);
  selectionDiv.appendChild(removeButton);
  oddsContainer.appendChild(selectionDiv);
};

const removeSelection = (selectionDiv) => {
  selectionDiv.remove();
  reNumberSelections(); // Renumber after removal
};

const reNumberSelections = () => {
  const oddsContainer = document.getElementById("odds-container");
  const selections = oddsContainer.querySelectorAll(".selection .odds"); // Get only the odds inputs
  selections.forEach((input, index) => {
    input.placeholder = `Odds for selection ${index + 1}`;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  addSelection(); // Add an initial selection on load
});
