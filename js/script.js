const calculateReturns = (stake, winAccumulator, placeAccumulator) => {
  let winReturn = stake * winAccumulator;
  let placeReturn = stake * placeAccumulator;
  let totalReturn = winReturn + placeReturn;
  let totalProfit = totalReturn - 2 * stake;

  return { winReturn, placeReturn, totalReturn, totalProfit };
};

const renderReturnSummary = (
  winReturn,
  placeReturn,
  totalReturn,
  totalProfit
) => {
  document.getElementById("result").innerHTML = `
          <p>Win Accumulator Return: £${winReturn.toFixed(2)}</p>
          <p>Place Accumulator Return: £${placeReturn.toFixed(2)}</p>
          <p>Total Return: £${totalReturn.toFixed(2)}</p>
          <p>Total Profit: £${totalProfit.toFixed(2)}</p>
      `;
};

const clearResults = () => (document.getElementById("result").innerHTML = "");

const calculateEachWayAccumulator = () => {
  // Get the stake and place fraction values
  let stake = parseFloat(document.getElementById("stake").value) || 0;
  let placeFractionInputs = document.querySelectorAll(".place-fraction");
  let oddsInputs = document.querySelectorAll(".odds");

  // Check if the stake and place fraction values are valid
  if (stake <= 0) {
    document.getElementById("result").innerHTML =
      "<p style='color:red;'>Please enter valid stake and place fraction.</p>";
    return;
  }

  //  We're planning to display the result in the result div,
  // so we'll need all of these variables to store the calculations
  let winAccumulator = 1;
  let placeAccumulator = 1;
  let validOddsCount = 0;

  oddsInputs.forEach(({ value }, index) => {
    let winOdds = parseFloat(value) || 0;
    let placeFraction = parseFloat(placeFractionInputs[index]?.value) || 0;

    const isValidOddsAndFraction =
      !isNaN(winOdds) && winOdds > 1 && placeFraction > 0 && placeFraction <= 1;

    if (isValidOddsAndFraction) {
      winAccumulator *= winOdds;
      let placeOdds = 1 + (winOdds - 1) * placeFraction;
      placeAccumulator *= placeOdds;
      validOddsCount++;
    }
  });

  if (validOddsCount === 0) {
    document.getElementById("result").innerHTML =
      "<p style='color:red;'>Enter at least one valid odds value and place fraction.</p>";
    return;
  }

  let { winReturn, placeReturn, totalReturn, totalProfit } = calculateReturns(
    stake,
    winAccumulator,
    placeAccumulator
  );

  renderReturnSummary(winReturn, placeReturn, totalReturn, totalProfit);
};

const createOddsInput = (index) => {
  const oddsInput = document.createElement("input");

  oddsInput.type = "number";
  oddsInput.classList.add("odds");
  oddsInput.placeholder = `Odds for selection ${index}`;
  oddsInput.value = Math.floor(Math.random() * 10) + 1; // Initial random value
  oddsInput.min = "1";

  return oddsInput;
};

const createPlaceFractionDropdown = () => {
  const placeFractionSelect = document.createElement("select");
  placeFractionSelect.classList.add("place-fraction");

  placeFractionSelect.innerHTML = `
    <option value="0.25">1/4</option>
    <option value="0.2">1/5</option>
    <option value="0.1666666667">1/6</option>
    <option value="0.1428571429">1/7</option>
    <option value="0.125">1/8</option>
  `;

  return placeFractionSelect;
};

const createRemoveButton = (selectionDiv) => {
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.textContent = "-";
  removeButton.onclick = () => removeSelection(selectionDiv);

  return removeButton;
};

const addSelection = () => {
  const oddsContainer = document.getElementById("odds-container");
  const selectionDiv = document.createElement("div");
  selectionDiv.classList.add("selection");

  const index = oddsContainer.children.length + 1;
  const oddsInput = createOddsInput(index);
  const placeFractionSelect = createPlaceFractionDropdown();
  const removeButton = createRemoveButton(selectionDiv);

  selectionDiv.appendChild(oddsInput);
  selectionDiv.appendChild(placeFractionSelect);
  selectionDiv.appendChild(removeButton);
  oddsContainer.appendChild(selectionDiv);

  clearResults();
  updateRemoveButtonsState();
};

const removeSelection = (selectionDiv) => {
  const oddsContainer = document.getElementById("odds-container");
  if (oddsContainer.children.length > 0) {
    selectionDiv.remove();
    reNumberSelections(); // Renumber after removal
    updateRemoveButtonsState(); // Update the state of remove buttons
    clearResults();
  }
};

const updateRemoveButtonsState = () => {
  const oddsContainer = document.getElementById("odds-container");
  const removeButtons = oddsContainer.querySelectorAll(".remove-button");

  removeButtons.forEach((button, index) => {
    button.disabled = removeButtons.length === 1; // Disable if only one selection remains
    button.style.opacity = removeButtons.length === 1 ? "0.5" : "1"; // Style for disabled state
    button.style.cursor =
      removeButtons.length === 1 ? "not-allowed" : "pointer";
  });
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
  updateRemoveButtonsState(); // Ensure the remove button is updated on load
});
